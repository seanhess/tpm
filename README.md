Package to Typescript Definition Mapping
========================================

This tool provides a mapping of NPM, bower, and/or generic packages to the corresponding Typescript definition file (from [DefinitelyTyped][dt]). This will allow tools to install the definition corresponding to any dependency automatically. 

Installation
------------

    npm install tpm

API
---

Load and return the entire map. This is constructed from the most recent data available online. 

    var tpm = require('tpm')
    var cachedMap
    tpm.loadMap().then(function(map) {
        cachedMap = map
    })  

Return a single mapping from a map

    var definition = tpm.findDefinition(cachedMap, packageName, [version])
    console.log(definition)

Definitions are returned in the following format

    {
        "names": "angular",
        "aliases": ["angularjs", "angular-browserify"],
        "repo": "borisyankov/DefinitelyTyped",
        "path": "angularjs/angular.d.ts",
        "sha": "master",
        "url": "https://github.com/borisyankov/DefinitelyTyped/angularjs/angular.d.ts/raw/master",
        "version": "*",
    }

Please do not try to download the map and parse it directly, but instead use this library to get definitions. 

Default Definition Names
------------------------

The [DefinitelyTyped][dt] repository is read dynamically. This repository hosts corrections and aliases to it in the `data` directory. We do not need an alias for every package. We only need them if they differ from the name of the file on [DefinitelyTyped][dt]. 

The name of the definition file is used as the default name. For example, on [DefinitelyTyped][dt], the name of the [AngularJS][angular] definition is `angular`, because its file is `/angularjs/angular.d.ts`. Angular Resource is named `angular-resource` and the file is `/angularjs/angular-resource.d.ts`. 

Aliases
-------

For example: `angular-browserify` should map to the `angular` definition. To specify an alias, create the file `data/angular-browserify.json` with the following contents, then send us a pull request.

    // data/angular-browserify.json
    {
        "alias": "angular-browserify",
        "name": "angular",  // the default DT name
        "sha": "master",    // optional
        "version": "",      // optional
    }

Open Questions
--------------

Is it possible that an npm/bower/component package might need more than one definition file? I don't want to do any dependency resolution, but do they ever split definitions into multiple files in DT?


Feedback
--------

Please provide feedback in one of these threads, or in an issue in this repository. 

- https://github.com/borisyankov/DefinitelyTyped/issues/428
- https://typescript.codeplex.com/discussions/461449#post1104904


[typescript]: http://typescriptlang.org/
[dt]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
[npm]: https://npmjs.org/
[angular]: http://angularjs.org/