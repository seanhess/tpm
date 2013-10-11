/// <reference path="../all.d.ts" />

var fs = require('fs')
var Q = require('q')
var mkdirplib = Q.nfbind(require('mkdirp'));

export function exists(path:string) {
    var d = Q.defer()
    fs.exists(path, function(exists) {
        d.resolve(exists)
    })
    return d.promise
}

export var readFile:(path:string)=>Q.IPromise<NodeBuffer> = Q.nfbind(fs.readFile);
export var writeFile:(path:string, data:any)=>Q.IPromise<void> = Q.nfbind(fs.writeFile);
export var mkdir:(path:string)=>Q.IPromise<void> = Q.nfbind(fs.mkdir)
export var mkdirp:(path:string)=>Q.IPromise<void> = Q.nfbind(mkdirplib)

