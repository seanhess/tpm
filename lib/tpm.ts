/// <reference path="../all.d.ts" />


import path = require('path')
import Q = require('q')
import _ = require('underscore')
import dt = require('./definitelyTyped')
import request = require('./q-request')

var API_URL = "http://tpm.orbit.al:3244"


// We can map names to definitely typed without having to do anything else manually
// later we could use a command-line or web interface and a database
var RENAMES = {
    "angularjs": "angular",
    "jquery-browserify": "jquery",
    "angular-browserify": "angular",
}


function debug(stuff) { console.log("[DEBUG]", stuff)}
function error(stuff) { console.log("[ERROR]", stuff)}

// dt.generateRepo()
// .then(debug, error)


// returns DefinitelyTyped as a respository of type files
export function loadDefinitelyTyped():Q.IPromise<IDefinition[]> {
    return dt.generateRepo()
}

export function findDefinition(map:IDefinitionMap, name:string):IDefinition {
    if (RENAMES[name])
        name = RENAMES[name]
    return map[name]
}

export function definitionMap(definitions:IDefinition[]):IDefinitionMap {
    return definitions.reduce(mapAddDefinition, {})
}

function mapAddDefinition(map:IDefinitionMap, def:IDefinition) {
    map[def.name] = def
    return map
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



var parseJSON = (data:NodeBuffer) => JSON.parse(data.toString())


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
