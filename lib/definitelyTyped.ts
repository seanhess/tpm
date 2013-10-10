/// <reference path="../all.d.ts" />


// information about a definition on DefinitelyTyped
export interface IDefinition {
    name: string;       // angularjs
    // repo: string;       // borisyankov/DefinitelyTyped
    path: string;       // angularjs/angular.d.ts
    // commit: string;
    // url: string;        // https://github.com/borisyankov/DefinitelyTyped/angularjs/angular.d.ts/raw/master
}

export interface IDefinitionMap {
    [key: string]: IDefinition;
}

import path = require('path')
import _ = require('underscore')
import github = require('./github')
import fs = require('./q-fs')
import Q = require('q')

export var REPO_PATH = "borisyankov/DefinitelyTyped"
export var REPO_URL = "https://github.com/" + REPO_PATH

export function generateRepo():Q.IPromise<IDefinition[]> {
    return github.trees(REPO_PATH)
    .then(function(response) {
        return response.tree
        .filter(isDefinitionFile)
        .map(repoVersion)
    })
}

function isDefinitionFile(file:github.ITreeItem):boolean {
    return !!file.path.match(".d.ts")
}

function repoVersion(file:github.ITreeItem):IDefinition {
    var url = github.rawUrl(REPO_PATH, file.path)
    return {
        name: path.basename(file.path, ".d.ts"),
        repo: REPO_PATH,
        path: file.path,
        url: url
    }
}

// export function map(definitions:IDefinition[]):IDefinitionMap {
//     return definitions.reduce(mapAddDefinition, {})
// }

// function mapAddDefinition(map:IDefinitionMap, def:IDefinition) {
//     map[def.name] = def
//     return map
// }




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


  {
    "name": "angular.d.ts",
    "path": "angularjs/angular.d.ts",
    "sha": "1a93d41f706448e32ed97a41764c9096cc20dff9",
    "size": 30252,
    "url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/contents/angularjs/angular.d.ts?ref=master",
    "html_url": "https://github.com/borisyankov/DefinitelyTyped/blob/master/angularjs/angular.d.ts",
    "git_url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/blobs/1a93d41f706448e32ed97a41764c9096cc20dff9",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/borisyankov/DefinitelyTyped/contents/angularjs/angular.d.ts?ref=master",
      "git": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/blobs/1a93d41f706448e32ed97a41764c9096cc20dff9",
      "html": "https://github.com/borisyankov/DefinitelyTyped/blob/master/angularjs/angular.d.ts"
    }
  }



  curl https://api.github.com/repos/borisyankov/DefinitelyTyped/git/trees/master?recursive=1

    {
      "mode": "040000",
      "type": "tree",
      "sha": "253789163b4b245642fdf20cc5201105291ef10f",
      "path": "zeroclipboard",
      "url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/trees/253789163b4b245642fdf20cc5201105291ef10f"
    },

    {
      "mode": "100644",
      "type": "blob",
      "sha": "f9504870040d1ebd79d85c882f1bc7ac9a66b492",
      "path": "zeroclipboard/zeroclipboard.d.ts",
      "size": 1515,
      "url": "https://api.github.com/repos/borisyankov/DefinitelyTyped/git/blobs/f9504870040d1ebd79d85c882f1bc7ac9a66b492"
    }




*/

