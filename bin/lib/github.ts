
import request = require('request')
import Q = require('q')
import path = require('path')

export interface ITree {
    path:string;
    type:TreeType; // blob or tree
    sha:string;
    url:string;
}

export enum TreeType {
    blob = <any> 'blob',
    tree = <any> 'tree',
}


export interface IFile {
    name:string;
    path:string;
    sha:string;
    url:string;
    type:string; // dir
}


// var get:<T>(options:request.Options)=>Q.IPromise<T> = Q.denodeify(request.get)
// var get = Q.denodeify(request.get)

// var get:<T>(options:request.Options)=>Q.IPromise<T> = function
function get<T>(options:request.Options):Q.IPromise<T> {
    var d = Q.defer()
    request.get(options, function(err, rs, body) {
        if (err) return d.reject(err)
        if (rs.statusCode != 200) {
            return d.reject(body)
        }
        d.resolve(body)
    })
    return d.promise
}



export function trees(repoPath:string):Q.IPromise<ITree[]> {
    var url = "https://api.github.com" + path.join("/repos", repoPath, "git/trees/master?recursive=1")
    return get({url:url, json: true})
}

export function directory(repoPath:string):Q.IPromise<IFile[]> {
    var url = "https://api.github.com" + path.join("/repos", repoPath, "contents")
    return get({url:url, json: true})
}

export function rawUrl(repo:string, filepath:string):string {
    // https://github.com/borisyankov/DefinitelyTyped/raw/master/angularjs/angular.d.ts
    // https://raw.github.com/borisyankov/DefinitelyTyped/master/angularjs/angular.d.ts
    return path.join("https://raw.github.com/", repo, "master", filepath)
}