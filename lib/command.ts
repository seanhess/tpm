/// <reference path="../all.d.ts" />

import Q = require('q')
import fs = require('./q-fs')
import tpm = require('./tpm')
import path = require('path')

// tpm install package.json -o types/
var optimist = require('optimist')




// function installDependencies(data:any):Q.IPromise<void> {

// }

export function run() {
    var argv = optimist
        .usage("Usage: \n  tpm install\n  tpm install package.json -o types/\n  tpm index types/**/*.d.ts -o types/all.d.ts")
        .demand([1])
        .check(function() {
            var command = optimist.argv._[0]
            if (command != "install" && command != "index") {
                throw new Error("Unknown Command: " + command)
            }
        })
        .argv

    var files = argv._
    var command = files.shift()
    var workingDir = process.cwd()
    files = files.map((f) => path.join(workingDir, f))

    var promise;

    if (command == "install") {
        var o = argv.o || "types/"
        var out = path.join(workingDir, o)
        var useDev = !!argv.dev
        if (!files.length) files = [path.join(workingDir, "package.json")]
        promise = install(files[0], out, useDev)
    }

    else if (command == "index") {
        var o = argv.o || "types/all.d.ts"
        var out = path.join(workingDir, o)
        if (!files.length) throw new Error("You must specify files to index")
        promise = index(files, out)
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

export function install(file:string, dir:string, useDev:boolean) {
    console.log("tpm install", file, "to", dir)
    return fs.readFile(file)
    .then((data) => JSON.parse(data.toString()))
    .then((packageData) => installPackages(packageData, dir, useDev))
}

export function installPackages(packageData:tpm.IPackageData, dir:string, useDev:boolean) {
    return tpm.loadIndex()    
    .then(function(index) {
        var defs = tpm.findPackageDefinitions(index, packageData.dependencies)
        if (useDev)
            defs = defs.concat(tpm.findPackageDefinitions(index, packageData.devDependencies))

        // also return node, just for kicks
        defs = defs.concat(tpm.findDefinitions(index, "node"))

        return defs
    })
    .then((defs) => tpm.downloadDefinitionsToFolder(defs, dir))
}

export function index(files:string[], out:string) {
    return tpm.createReferenceFile(files, out)
}



function debug(stuff) { console.log("[DEBUG]", stuff); return stuff}
function error(stuff) { console.log("[ERROR]", stuff)}
