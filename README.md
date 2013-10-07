TPM: Typescript Package Manager
===============================

TPM makes `tpm install somepackage` "just work" for client-side dependencies by reducing the following to one step:

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

    # creates tpm.json with default values
    tpm init                    

    # installs all dependencies listed in tpm.json
    tpm install                 

    # uses the CDN to edit your index.html
    tpm install --prod          

    # installs jquery and saves to `tpm.json`
    tpm install jquery          

    # installs a dependency at a particular version 
    tpm install jquery@2.0.3    


Configuration
-------------

The dependencies and settings for a project or folder can be specified in `tpm.json`. The command `tpm init` will generate one with defaults for you to change. 

    {
        "name":"my project",
        "main":"index.html",
        "dependencies":{
            "jquery": "~2.0.3",
        },
    }

Adding a Dependency
-------------------

If a dependency is not found in the repository, please help us out by adding it! 




[typescript]: http://typescriptlang.org/
[definitelyTyped]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
