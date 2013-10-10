Package to Typescript Definition Mapping
========================================

This tool provides a mapping of NPM, bower, and/or generic packages to the corresponding Typescript definition file (from [DefinitelyTyped][dt]). This will allow tools to install the definition corresponding to any dependency automatically. 

Installation
------------

    npm install tpm

API
---

First, download the index. This is constructed from the most recent data available online. Save this and then use it to get definitions. 

    import tpm = require('tpm')
    var cachedIndex
    tpm.loadIndex().then(function(index) {
        cachedIndex = index
    })  

Do not read the index directly. Instead use `findDefinitions` to read from a cached index. This is synchronous, as it just uses the cached index. 

    var definitions:IDefinition[] = tpm.findDefinitions(cachedIndex, packageName)
    console.log(definitions)

This would return an array of definitions, one per version if there are more. Usually it will just return 1. If the 

    [
        {
            "name": "angular",
            "aliases": ["angularjs", "angular-browserify"],
            "path": "angularjs/angular.d.ts",
        }
    ]

Get the url of the definition file for downloading

    var url = tpm.definitionUrl(definition)



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
    }


Later
-----

Versioning: more information in alias files, matching up versions in `generateFullIndex`

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