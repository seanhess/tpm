/// <reference path="all.d.ts" />

interface IDefinition {
    name: string;       // angularjs
    repo: string;       // https://github.com/borisyankov/DefinitelyTyped
    path: string;       // angularjs/angular.d.ts
    url: string;        // https://github.com/borisyankov/DefinitelyTyped/angularjs/angular.d.ts/raw/master
}

// the names of these don't always even match up!
// could maintain a list of names to match them ... packages that will work automatically?
// or... shoot, maybe this ISN'T a good idea. 

// Something to maintain a list of supported dependencies, magic style. Browser made easy. Nobody cares about this crap. 
// it's hard to set things up, but everyone does it differently anyway
// Which hypothetical tiny, one-thing-only modules would make the task at hand trivial. 

// Task at hand: for a given open-source library, what is the correct npm package and url to the definition file?
// how would I even DO that? 
// maintain a list. 
// search BOTH npm AND Definitely Typed for it and cache the result
// If inputted by hand, use the stored version. 

// Hmm... it's like a... curated something. But there's so much stuff that isn't supported. 
// And people have such different ways of adding things. 

// Maybe I should just use TSD. Does it work already? 

// Ok, what do I REALLY need? 
// 1. I need an easy way to install definitions. (grunt task?)
// 2. I need an easy way to bundle them together. 

interface INPMDependency {
    name: string;       // 
    version: string;    // we are ignoring the names for now
}

import path = require('path')
import Q = require('q')
import _ = require('underscore')
import dt = require('lib/definitelyTyped')


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

function debug(stuff) { console.log("[DEBUG]", stuff)}
function error(stuff) { console.log("[ERROR]", stuff)}

// dt.generateRepo()
// .then(debug, error)


// returns DefinitelyTyped as a respository of type files
export function loadDefinitelyTyped():Q.IPromise<IDefinition[]> {

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