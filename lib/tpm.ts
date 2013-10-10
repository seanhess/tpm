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
var INDEX_URL = ""

export interface IDefinitionVersion {
    name: string;
    aliases: string[];
    path: string;
    version: string;    
    // commit: string;
}



// the object that gets cached and downloaded
// might as well pre-process everything
export interface IDefinitionIndex {
    created:Date;
    definitions:IDefinitionVersion[];
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
    return request.get({url: INDEX_URL, json: true})
}

/**
 * Once you have an index, read it to find the definitions matching the package name
 * @param index - A cached definition index 
 * @param name - the name of the package on npm, bower, etc
 * @return - an array of matching definitions, usually 1
 */
export function findDefinitions(index:IDefinitionIndex, name:string):IDefinitionVersion[] {
    // Keep it simple for the first version
    return index.definitions.filter(function(def:IDefinitionVersion) {
        return def.name == name || _.contains(def.aliases, name)
    })
}

/**
 * Returns the raw data URL for a given definition
 * @param {IDefinitionVersion} definition - A definition returned by findDefinitions
 */
export function definitionUrl(definition:IDefinitionVersion):string {
    return github.rawUrl(dt.REPO_PATH, definition.path)
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
            version: "*",
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



// function readDependenciesIfExists(path:string):Q.IPromise<IDependency[]> {
//     // I need to return / exist early... how?
//     return fs.exists(path)
//     .then(function(exists) {
//         if (!exists) return exists
//         return fs.readFile(path)
//         .then(parseJSON)
//         .then(readDependenciesFromJSON)
//     })
// }


// function readDependenciesFromJSON(data:any):IDependency[] {
//     return _.map(data.dependencies, function(version, name:string) {
//         return {
//             name: name,
//             version: version,    
//         }
//     })
// }



// var parseJSON = (data:NodeBuffer) => JSON.parse(data.toString())


// Command-line tool: will read bower.json and package.json
// Will check dependencies, and create a references file for each one

// How does it do the version matching? I don't know :)  It has known version compatibilities? There 

// 1. Needs an online database of the compatibilities








/*



curl https://api.github.com/repos/borisyankov/DefinitelyTyped/contents/
[
  {
    "name": "angularjs",
    "path": "angularjs",
    "sha": "f8298bf0834ca2b0411f0ffbda7b87382ae4eb47",
    "size": null,
    "url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/contents/angularjs?ref=master",
    "html_url": "https://github.com/borisyankov/DefinitelyTyped/tree/master/angularjs",
    "git_url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/trees/f8298bf0834ca2b0411f0ffbda7b87382ae4eb47",
    "type": "dir",
    "_links": {
      "self": "https://api.github.com/repos/borisyankov/DefinitelyTyped/contents/angularjs?ref=master",
      "git": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/trees/f8298bf0834ca2b0411f0ffbda7b87382ae4eb47",
      "html": "https://github.com/borisyankov/DefinitelyTyped/tree/master/angularjs"
    }
  },
]






*/

// var options = process.argv.slice(2)
// var workingDir = process.cwd()

// console.log(workingDir, options)

// // check for package.json and bower.json
// var bowerPath = path.join(workingDir, "bower.json")
// var packagePath = path.join(workingDir, "package.json")

// readDependenciesIfExists(packagePath)
// .then(function(stuff) {
//     console.log("HELLO", stuff)
// })



// function debug(stuff) { console.log("[DEBUG]", stuff)}
// function error(stuff) { console.log("[ERROR]", stuff)}
