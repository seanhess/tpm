/// <reference path="../all.d.ts" />

var fs = require('fs')
var Q = require('q')

export function exists(path:string) {
    var d = Q.defer()
    fs.exists(path, function(exists) {
        d.resolve(exists)
    })
    return d.promise
}

export var readFile:(path:string)=>Q.IPromise<NodeBuffer> = Q.nfbind(fs.readFile);
export var writeFile:(path:string, data:any)=>Q.IPromise<void> = Q.nfbind(fs.writeFile);

