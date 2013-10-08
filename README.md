TPM: Typescript Package Manager
===============================

**Note:** This is only a proposal. I am seeking feedback before building it.

It is currently difficult to use 3rd party dependencies on a client-side Typescript project. Using bower, you can include Javascript dependencies, but then you must also import definition files from somewhere (usually [DefinitelyTyped][definitelytyped]). 

TPM simplifies using dependencies on a Typescript project. By running `tpm install` it will read the dependencies listed in `bower.json` or `package.json`, download the definition files, and create a file that references all of them for easy including. 

Using TPM on your project
-------------------------

Install the `tpm` command-line tools
    
    npm install -g tpm

Install bower dependencies

    bower install jquery --save

Install definitions to `bower_components/dt/...`

    tpm install

Include a dependency in your project

    /// <reference path="../bower_components/dt/jquery/jquery.d.ts" />

    $("body").fadeOut()

TPM generates a file, `bower_components/dt/index.d.ts` which references all your dependencies. To reference them from your code, simply add a reference to it in your root project file

    /// <reference path="../bower_components/dt/index.d.ts" />

    $("body").fadeOut()


Specifying Definitions
----------------------

Definitions are specified per bower package and version range, and consist of the following:

- A github repository
- A path to a file within the repository
- A commit, tag, or branch name to target


[typescript]: http://typescriptlang.org/
[definitelyTyped]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
[npm]: https://npmjs.org/
