/// <reference path="def/node.d.ts" />
/// <reference path="def/Q.d.ts" />
/// <reference path="def/underscore.d.ts" />
/// <reference path="types.ts" />
/*
[x] read the dependencies and print them out
[ ] Build the definitelyTyped repo from the actual repository
[ ] Search for the dependency in definitely typed? (there's no version mapping there!!)

Can I make a useful tool?

1. update local copy of DefinitelyTyped (using git)
2. find the correct dependency and install

make it easier to contribute to the thing. You can edit it and submit the change? Easily?

*/
// there's some kind of module I could use, no?
// 1. DefinitelyTyped. Use whenever specified?
// 2. Also have a database and a website people can check out
// Fetch on demand!
// If they specify a name, GET that from them and go.
var path = require('path');
var fsn = require('fs');
var Q = require('q');
var _ = require('underscore');
var dt = require("./lib/definitelyTyped");

var fs;
(function (fs) {
    function exists(path) {
        var d = Q.defer();
        fsn.exists(path, function (exists) {
            d.resolve(exists);
        });
        return d.promise;
    }
    fs.exists = exists;

    // export var exists:(path:string)=>Q.IPromise<boolean> = Q.nfbind(fsn.exists);
    fs.readFile = Q.nfbind(fsn.readFile);
})(fs || (fs = {}));

var options = process.argv.slice(2);
var workingDir = process.cwd();

console.log(workingDir, options);

// check for package.json and bower.json
var bowerPath = path.join(workingDir, "bower.json");
var packagePath = path.join(workingDir, "package.json");

// readDependenciesIfExists(packagePath)
// .then(function(stuff) {
//     console.log("HELLO", stuff)
// })
function debug(stuff) {
    console.log("[DEBUG]", stuff);
}
function error(stuff) {
    console.log("[ERROR]", stuff);
}

dt.generateRepo().then(debug, error);

function readDependenciesIfExists(path) {
    // I need to return / exist early... how?
    return fs.exists(path).then(function (exists) {
        if (!exists)
            return exists;
        return fs.readFile(path).then(parseJSON).then(readDependenciesFromJSON);
    });
}

function readDependenciesFromJSON(data) {
    return _.map(data.dependencies, function (version, name) {
        return {
            name: name,
            version: version
        };
    });
}

// loads and caches it. With git? to preserve changes?
// well, wait, shoot.
// I need a respository of SOME kind
// MY REPO:
// a database: search, install, etc
// if you request a particular thing, it tells you where to find it
// I still need to BUILD the database from that though
// This is all coming from the SERVER.
// angularjs -> specific thing
// angular-resource -> goes to a subfile
// Loads this SLOWLY
// NOT designed to run on users computer
// function loadDefinitelyTyped():IRepository {
//     // how to do it? Best way would be to actually download the repo, etc
//     // ok.... so download a git repo fatty
//     // you could do it off the github API instead! yay!
// }
var parseJSON = function (data) {
    return JSON.parse(data.toString());
};

