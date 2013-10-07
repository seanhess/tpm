TPM: Typescript Package Manager
===============================

The goal: to make `tpm install somepackage` "just work" for client-side dependencies. It strives to reduce the following process to one step:

1. Install the Javascript code using [Bower][bower]
2. Install the [Typescript definition files from DefinitelyTyped][definitelyTyped]
3. Load the Javascript code at runtime
4. Reference all Typescript definition files from your app

TPM makes this simple by providing a few conventions, and by generating code whenever you `tpm install`.

Using TPM on your project
-------------------------

Install the `tpm` command-line tools
    
    npm install -g tpm

Create a configuration and dependencies file, `tpm.json`. See "Coniguration" below for options

    tpm init

Install a dependency

    tpm install jquery

TPM will automatically add all the dependencies to the bottom of your `index.html` file, making them available at runtime. 

        ...

        <!-- TPM start -->
        <script src="/components/jquery/jquery.min.js"></script>
        <!-- TPM end -->

        <script src="main.js"></script>

    </body>
    
TPM generates a file, `tpm.d.ts` which references all your dependencies. To reference them from your code, simply add a tag like this with a relative path to the root project file

    /// <reference path="../tpm.d.ts" />

    $("body").fadeOut()
    


All Commands
------------

    tpm init                # creates tpm.json with default values

    tpm install             # installs all dependencies listed in tpm.json
    tpm install --prod      # uses the CDN to edit your index.html


Configuration
-------------

The dependencies and settings for a project or folder can be specified in `tpm.json`. The command `tpm init` will generate one with defaults for you to change. 

    {
        "name":"my project",
        "main":"index.html",
        "dependencies":{
            "angularjs": "~1.0.8",
        },
    }

Adding a Dependency
-------------------

If a dependency is not found in the repository, please help us out by adding it! 




[typescript]: http://typescriptlang.org/
[definitelyTyped]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
