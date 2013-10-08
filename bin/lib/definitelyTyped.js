/// <reference path="../def/request.d.ts" />
/// <reference path="../def/q.d.ts" />
/// <reference path="../def/underscore.d.ts" />
/// <reference path="../types.ts" />
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

*/
var request = require('request');
var Q = require('q');
var path = require('path');
var _ = require('underscore');

var DEFINITELY_TYPED_PATH = "borisyankov/DefinitelyTyped";
var REPO_URL = "https://github.com/borisyankov/DefinitelyTyped";

// var get:<T>(options:request.Options)=>Q.IPromise<T> = Q.denodeify(request.get)
// var get = Q.denodeify(request.get)
// var get:<T>(options:request.Options)=>Q.IPromise<T> = function
function get(options) {
    var d = Q.defer();
    request.get(options, function (err, rs, body) {
        if (err)
            return d.reject(err);
        if (rs.statusCode != 200)
            return d.reject(new Error(body.message));
        d.resolve(body);
    });
    return d.promise;
}

var github;
(function (github) {
    function directory(repoPath) {
        var url = "https://api.github.com" + path.join("/repos", repoPath, "contents");
        console.log("UMMM", url);
        return get({ url: url, json: true });
    }
    github.directory = directory;
    function rawUrl(repo, filepath) {
        return path.join("https://github.com/", repo, filepath, "raw/master");
    }
    github.rawUrl = rawUrl;
})(github || (github = {}));

function generateRepo() {
    return github.directory(DEFINITELY_TYPED_PATH).then(function (files) {
        console.log("FILES", files);
        var promises = files.map(function (file) {
            return pathVersions(file.path);
        });
        return Q.all(promises);
    }).then(function (nested) {
        return _.flatten(nested);
    });
}
exports.generateRepo = generateRepo;

function pathVersions(filepath) {
    console.log("PATH VERSIONS", filepath);
    var subdir = path.join(DEFINITELY_TYPED_PATH, filepath);
    return github.directory(subdir).then(map(repoVersion));
}

function repoVersion(file) {
    return {
        name: file.name,
        repo: REPO_URL,
        path: file.path,
        version: "*"
    };
}

function map(f) {
    return function (items) {
        return items.map(f);
    };
}

