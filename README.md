TPM: Typescript Package Manager
===============================

TPM provides useful programatic access to finding typescript definitions. The TPM library can be used to create other tools, like [TSD][tsd]. It will also provide its own tools to install definition files, to demonstrate how the library can be used, and to allow access to features before other tools integrate them. 

I wouldn't mind if TPM was merged into another tool, so long as it provided similar functionality. 

Installation
------------

    npm install tpm

Finding Definition Files
------------------------

TPM has the ability to look up definition files (from [DefinitelyTyped][dt]) by name, or by NPM, bower, or other package name. This will allow tools to install the definition corresponding to any dependency automatically. 

This happens in two steps. First, download the index. This is constructed from the most recent data available online. Cache this and then use it to get definitions. 

    import tpm = require('tpm')
    var cachedIndex:IDefinitionIndex
    tpm.loadIndex().then(function(index) {
        cachedIndex = index
    })

Do not read the index directly. Instead use `findDefinitions` to read from a cached index. This is synchronous, as it just uses the cached index. 

    var angularVersions:IDefinitionVersion[] = tpm.findDefinitions(cachedIndex, "angular")
    var jqueryVersions:IDefinitionVersion[] = tpm.findDefinitions(cachedIndex, "jquery")

This would return an array of definitions, one per version if there are more. Usually it will just return 1. The URL is provided for convenience. Other tools can generate their own URL. 

    // IDefinitionVersion[]
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


Utilities
---------

These features may be duplicated in other tools, but are provided here to demonstrate how to use the library, and to allow it to function if not yet implemented in other tools. 

Get the contents of a definition
    
    definitionContents(definition:IDefinitionVersion):Q.IPromise<NodeBuffer>

Download a definition to a file path.

    downloadDefinition(definition:IDefinitionVersion, filepath:string):Q.IPromise<void>

Download a definition to a folder. If `folder` is "types/" then it will download to "types/jquery/jquery.d.ts"

    downloadDefinitionToFolder(definition, folder):Q.IPromise<void>

Create a single reference file pointing to other reference files. Your application only needs to reference this one file. Note that this can be used to reference your own definition files too!

    createReferenceFile(typeFilePaths:string[], indexFilePath:string):Q.IPromise<void>

    // example contents of indexFilePath if definitionFilePaths contained these three files
    /// <reference path="app/mytypes.ts" />
    /// <reference path="types/jquery/jquery.d.ts" />
    /// <reference path="types/jquery/jquery.d.ts" />

Find definitions given a file similar to `package.json`. This will work with `bower.json` and `package.json`. 

    // packageData should have a `dependencies` property
    //   name: version/folder/package, etc
    findPackageDefinitions(cachedIndex:IDefinitionIndex, packageData:any):IDefinitionVersion[]


Command-line Tool
-----------------

TPM has its own definition installer to demonstrate how to use the library, and to provide early access to features. 

Install dependencies by reading any `.json` file that is similar to `package.json`. This installs the dependencies to `types/:folder/:file.d.ts`. 

    tpm install package.json -o types/
    tpm install bower.json -o types/

    # defaults to package.json and -o types/
    tpm install

Create a single reference file pointing to all other reference files. Your application only needs to reference this single file to contain all definition files.

    tpm index types/**/*.d.ts -o types/all.d.ts

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