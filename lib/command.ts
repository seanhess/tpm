/// <reference path="../all.d.ts" />

import Q = require('q')
import fs = require('./q-fs')
import tpm = require('./tpm')
import path = require('path')

// tpm install package.json -o types/
var optimist = require('optimist')
optimist
    .usage("Usage: \n\ttpm install package.json -o types/\n\ttpm install bower.json -o types/\n\ttpm index types/**/*.d.ts -o types/all.d.ts")
    .demand(['o', 2])
    .check(function() {
        var command = optimist.argv._[0]
        if (command != "install" && command != "index") {
            throw new Error("Unknown Command: " + command)
        }
    })
var argv = optimist.argv


// function installDependencies(data:any):Q.IPromise<void> {

// }

function run() {
    var files = argv._
    var command = files.shift()
    var workingDir = process.cwd()
    var out = path.join(workingDir, argv.o)

    console.log("TPM", command, files, out)

    var promise;

    if (command == "install") {
        promise = install(files[0], out)
    }

    else if (command == "index") {

    }

    else {
        throw new Error("Unknown Command: " + command)
    }

    promise.then(function() {
        console.log("[DONE]")
    }, error)

}

function install(file:string, dir:string) {
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
