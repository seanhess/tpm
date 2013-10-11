/// <reference path="../all.d.ts" />


import path = require('path')
import Q = require('q')
import _ = require('underscore')
import dt = require('./definitelyTyped')
import request = require('./q-request')
import github = require('./github')
import fs = require('./q-fs')
import alias = require('../data/alias')

var API_URL = "http://tpm.orbit.al:3244"
var INDEX_URL = "http://seanhess.github.io/tpm/data/index.json"

export interface IDefinitionVersion {
    // core properties
    name: string;
    aliases: string[];
    path: string;

    // future or convenience properties
    version: string;    
    url: string;
    commit: string;
}



// the object that gets cached and downloaded
// might as well pre-process everything
export interface IDefinitionIndex {
    created:Date;
    definitions:IDefinitionVersion[];
}


export interface IPackageData {
    dependencies:{[key: string]: string};
}


// We can map names to definitely typed without having to do anything else manually
// later we could use a command-line or web interface and a database
var RENAMES = {
    "angularjs": "angular",
    "jquery-browserify": "jquery",
    "angular-browserify": "angular",
}



// returns DefinitelyTyped as a respository of type files

// PUBLIC API ///////////////////////////////

/**
 * Download the generated index from TPM's server, so it can be cached and used to find definitions with findDefinitions, below. 
 * @param index - A cached definition index 
 * @param name - the name of the package on npm, bower, etc
 * @return - a promise for the index
 */
export function loadIndex():Q.IPromise<IDefinitionIndex> {
    console.log("[GET] Index")
    return request.get({url: INDEX_URL, json: true})
}

/**
 * Once you have an index, read it to find the definitions matching the package name
 * @param index - A cached definition index 
 * @param name - the name of the package on npm, bower, etc
 * @return - an array of matching definitions, usually 1
 */
export function findDefinitions(index:IDefinitionIndex, name:string):IDefinitionVersion[] {
    name = name.toLowerCase()
    // Keep it simple for the first version
    return index.definitions.filter(function(def:IDefinitionVersion) {
        return def.name.toLowerCase() == name || _.contains(def.aliases, name)
    })
    .map(function(def:IDefinitionVersion) {
        def.commit = "master"
        def.url = github.rawUrl(dt.REPO_PATH, def.path, def.commit)  
        return def
    })
}



export function definitionContents(definition:IDefinitionVersion):Q.IPromise<NodeBuffer> {
    return request.get({url:definition.url, json:false})
}

export function downloadDefinition(definition:IDefinitionVersion, filepath:string):Q.IPromise<void> {
    console.log("[INSTALL]", definition.path)
    var directory = path.dirname(filepath)

    return fs.mkdirp(directory)
    .then( () => definitionContents(definition) )
    .then( (data) => fs.writeFile(filepath, data) )
}


export function downloadDefinitionToFolder(definition:IDefinitionVersion, folder:string):Q.IPromise<void> {
    var finalPath = path.join(folder, definition.path)
    return downloadDefinition(definition, finalPath)
}

export function downloadDefinitionsToFolder(definitions:IDefinitionVersion[], folder:string):Q.IPromise<void> {
    return Q.all(definitions.map(function(def) {
        return downloadDefinitionToFolder(def, folder)
    }))
    .then(() => null)
}


export function createReferenceFile(typeFilePaths:string[], indexFilePath:string):Q.IPromise<void> {
    var contents = typeFilePaths.map(function(path) {
        var relativePath = path.relative(path, indexFilePath)
        return "/// <reference path='"+relativePath+"' />"
    }).join("\n")

    return fs.writeFile(indexFilePath, contents)
}

export function findPackageDefinitions(cachedIndex:IDefinitionIndex, packageData:IPackageData):IDefinitionVersion[] {
    var definitions = _.map(packageData.dependencies, function(version, name) {
        return findDefinitions(cachedIndex, name)
    })
    // also return node, just for kicks
    definitions.push(findDefinitions(cachedIndex, "node"))
    return _.flatten(definitions)
}




















// PRIVATE API //////////////////////////////

function dtLoadFromGithub():Q.IPromise<dt.IDefinition[]> {
    return dt.generateRepo()
}

function loadAlias(filepath:string):Q.IPromise<alias.IAlias> {
    return fs.readFile(filepath)
    .then((data) => JSON.parse(data.toString()))
}

function generateFullIndex(definitions:dt.IDefinition[], aliases:alias.IAlias[]):IDefinitionIndex {
    
    var defaultDefinitions = definitions.map(function(def:dt.IDefinition) {
        var aliasNames = aliases
        .filter((alias) => alias.name == def.name) 
        .map((alias) => alias.alias)

        return {
            name: def.name,
            aliases: aliasNames,
            path: def.path,
            version: "latest",
            url: null,
            commit: "master",
        }
    })

    // TODO duplicate and add a new version if the version is specified and different

    return {
        created: new Date(),
        definitions: defaultDefinitions,
    }
}

// grunt should be able to handle the rest of this
export function loadDtAndBuildIndex():Q.IPromise<IDefinitionIndex> {
    return dtLoadFromGithub()
    .then((defs) => generateFullIndex(defs, alias.all))
}




