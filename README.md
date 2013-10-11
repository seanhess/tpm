TPM: Typescript Package Manager
===============================

TPM provides useful programatic access to finding typescript definitions. The TPM library can be used to create other tools, like [TSD][tsd]. It will also provide its own tools to install definition files, to demonstrate how the library can be used, and to allow access to features before other tools integrate them. 

Installation
------------

    npm install tpm

Finding Definition Files
------------------------

TPM has the ability to look up definition files (from [DefinitelyTyped][dt]) by name, or by NPM, bower, or other package name. This will allow tools to install the definition corresponding to any dependency automatically. 

This happens in two steps. First, download the index. This is constructed from the most recent data available online. Cache this and then use it to get definitions. 

    import tpm = require('tpm')
    var cachedIndex
    tpm.loadIndex().then(function(index) {
        cachedIndex = index
    })  

Do not read the index directly. Instead use `findDefinitions` to read from a cached index. This is synchronous, as it just uses the cached index. 

    var angularDefinitions = tpm.findDefinitions(cachedIndex, "angular")
    var jqueryDefinitions = tpm.findDefinitions(cachedIndex, "jquery")

This would return an array of definitions, one per version if there are more. Usually it will just return 1. The URL is provided for convenience. Other tools can generate their own URL. 

    [
        {
            "name": "angular",
            "aliases": ["angularjs", "angular-browserify"],
            "path": "angularjs/angular.d.ts",
            "url": "https://raw.github.com/borisyankov/DefinitelyTyped/master/angularjs/angular.d.ts"
            "commit": "master",
            "version": "latest",
        }
    ]

`name` - the name of the package on [DefinitelyTyped][dt].

`aliases` - other names that map to this definition

`path` - the path to the definition within [DefinitelyTyped][dt]

`version` - this will contain version information if multiple versions exist. Otherwise it will be "latest"

`commit` - almost always equal to "master". If the definition no longer exists on [DefinitelyTyped][dt], but did at some previous commit or in another branch, `commit` will refer to a commit or branch where the definition exists

`url` - for convenience, a download URL is provided for the definition file. Other tools can generate their own url from the data. 

### Default Definition Names

The [DefinitelyTyped][dt] repository is read dynamically. This repository hosts corrections and aliases to it in the `data` directory. We do not need an alias for every package. We only need them if they differ from the name of the file on [DefinitelyTyped][dt]. 

The name of the definition file is used as the default name. For example, on [DefinitelyTyped][dt], the name of the [AngularJS][angular] definition is `angular`, because its file is `/angularjs/angular.d.ts`. Angular Resource is named `angular-resource` and the file is `/angularjs/angular-resource.d.ts`. 

### Aliases

This repository hosts the mapping of other names to the default names. 

For example: `angular-browserify` should map to the `angular` definition. To specify an alias, edit `data/alias.ts` then send us a pull request.


    export var all:IAlias[] = [
        ...
        {name: "angular", alias: "angular-browserify"},
        ...
    ]


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
[tsd]: https://github.com/Diullei/tsd/