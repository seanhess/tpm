/// <reference path="../all.d.ts" />

import Q = require('q')
import fs = require('./q-fs')
import tpm = require('./tpm')
import path = require('path')

// tpm install package.json -o types/
var optimist = require('optimist')
var argv = optimist
    .usage("Usage: \n\ttpm install\n\ttpm install package.json -o types/\n\ttpm index types/**/*.d.ts -o types/all.d.ts")
    .demand([1])
    .check(function() {
        var command = optimist.argv._[0]
        if (command != "install" && command != "index") {
            throw new Error("Unknown Command: " + command)
        }
    })
    .argv



// function installDependencies(data:any):Q.IPromise<void> {

// }

function run() {
    var files = argv._
    var command = files.shift()
    var workingDir = process.cwd()

    var promise;

    if (command == "install") {
        var o = argv.o || "types/"
        var out = path.join(workingDir, o)
        if (!files.length) files = ["package.json"]
        promise = install(files[0], out)
    }

    else if (command == "index") {

    }

    else {
        throw new Error("Unknown Command: " + command)
    }

    if (promise) {
        promise.then(function() {
            console.log("[DONE]")
        }, error)
    }

}

function install(file:string, dir:string) {
    console.log("tpm install", file)
    return fs.readFile(file)
    .then((data) => JSON.parse(data.toString()))
    .then((packageData) => installPackages(packageData, dir))
}

function installPackages(packageData:tpm.IPackageData, dir:string) {
    return tpm.loadIndex()    
    .then((index) => tpm.findPackageDefinitions(index, packageData))
    // .then(debug)
    .then((defs) => tpm.downloadDefinitionsToFolder(defs, dir))
}

function index(files:string[], out:string) {

}

run()    





// // check for package.json and bower.json
// var bowerPath = path.join(workingDir, "bower.json")
// var packagePath = path.join(workingDir, "package.json")

// readDependenciesIfExists(packagePath)
// .then(function(stuff) {
//     console.log("HELLO", stuff)
// })



function debug(stuff) { console.log("[DEBUG]", stuff); return stuff}
function error(stuff) { console.log("[ERROR]", stuff)}
