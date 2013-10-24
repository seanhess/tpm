TPM: Typescript Definition Package Manager
==========================================

TPM provides a library to find typescript definitions. The TPM library can be used to create other tools, like [TSD][tsd]. It also provides its own command-line tools and grunt tasks to install definition files, to demonstrate how the library can be used, and to make it usable before other tools integrate them. 

I wouldn't mind if TPM was merged into another tool, so long as it included all the features.

TPM is currently usable as a definition manager. Please also see [TSD][tsd] for another project with similar goals. We are working together to create a single unified tool. 

Command-line Tool
-----------------

TPM has its own definition installer to demonstrate how to use the library, and to provide early access to features. 

Install the `tpm` command globally:

    npm install -g typescript-tpm

Install dependencies by reading any `.json` file that is similar to `package.json`. This installs the dependencies to `types/:folder/:file.d.ts` by default.

    tpm install         # defaults to package.json and types/

    tpm install package.json -o types/
    tpm install bower.json -o types/

To read the devDependencies field as well, just add the `--dev` flag. Make sure to add it to the end.

    tpm install [something.json] --dev

Create a single reference file pointing to all other reference files. Your application only needs to reference this single file to contain all definition files. The output defaults to `types/all.d.ts`. The input files are required.

    tpm index types/**/*.d.ts -o types/all.d.ts

Grunt Tasks
-----------

All of the command-line options are available as grunt tasks. This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install typescript-tpm --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('typescript-tpm');
```

In your project's Gruntfile, add a section named `tpm-install` or `tpm-index` to the data object passed into `grunt.initConfig()`.

```js
// dest is optional on both of these, the default is shown here
grunt.initConfig({
    "tpm-install": {
      options: {dev: false},
      all: {src: "package.json", dest: "types/"}
    },

    "tpm-index": {
      all: {src: ["types/**/*.d.ts"], dest: "types/all.d.ts"}
    }
})
```

`tpm-install` installs the definitions for a given `package.json` or `bower.json`. You may pass in `dev:true` in the options to read the `devDependencies` as well.

`tpm-index` creates a reference file pointing to all the definition files specified, so you only have to include one.

If you prefer, you can create a task that combines both of these into one step:

    grunt.registerTask("tpm", ['tpm-install', 'tpm-index'])

Then, you can install definition files and build the index by typing

    grunt tpm

API: Finding Definition Files
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


API: Utilities
--------------

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

Find definitions given a hash of dependencies to versions, like what is found in the `dependencies` field of `package.json` or `bower.json`.

    // dependencies is a hash of "name: version", etc
    findPackageDefinitions(cachedIndex:IDefinitionIndex, dependencies:IDependenciesHash):IDefinitionVersion[]


History
-------

*0.1.7* Added support for `--dev` and `dev:true` to parse `devDependencies

Later
-----

Versioning: more information in alias files, matching up versions in `generateFullIndex`. Correct versions in `findPackageDefinitions`

Feedback
--------

Please file an issue in this repository

[typescript]: http://typescriptlang.org/
[dt]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
[npm]: https://npmjs.org/
[angular]: http://angularjs.org/
[tsd]: https://github.com/Diullei/tsd/