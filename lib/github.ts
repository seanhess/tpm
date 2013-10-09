/// <reference path="../all.d.ts" />

import request = require('./q-request')
import Q = require('q')
import path = require('path')

export interface ITreeItem {
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

export interface ITreeResponse {
    url: string;
    sha: string;
    tree: ITreeItem[];
}



export function trees(repoPath:string):Q.IPromise<ITreeResponse> {
    var url = "https://api.github.com" + path.join("/repos", repoPath, "git/trees/master?recursive=1")
    return request.get({url:url, json: true})
}

export function directory(repoPath:string):Q.IPromise<IFile[]> {
    var url = "https://api.github.com" + path.join("/repos", repoPath, "contents")
    return request.get({url:url, json: true})
}

export function rawUrl(repo:string, filepath:string):string {
    // https://github.com/borisyankov/DefinitelyTyped/raw/master/angularjs/angular.d.ts
    // https://raw.github.com/borisyankov/DefinitelyTyped/master/angularjs/angular.d.ts
    return path.join("https://raw.github.com/", repo, "master", filepath)
}