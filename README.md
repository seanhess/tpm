TPM: Typescript Package Manager
===============================

**Note:** This is only a proposal. I am seeking feedback before building it.

TPM makes using dependencies on a Typescript project as easy as `tpm install somepackage`. It reduces the following to one step:

1. Install the Javascript code using [Bower][bower]
2. Install the [Typescript definition files from DefinitelyTyped][definitelyTyped]
3. Load the Javascript code at runtime
4. Reference all Typescript definition files from your app

TPM makes this simple by establishing a few conventions, and by generating code whenever you `tpm install`.

Using TPM on your project
-------------------------

Install the `tpm` command-line tools
    
    npm install -g tpm

Create a configuration and dependencies file, `tpm.json`. See "Coniguration" below for options

    tpm init

Install a dependency

    tpm install jquery

If you specify an `"index"` in the configuration, TPM will automatically add and remove dependencies at the bottom of your html file, making them available at runtime. 

        ...

        <!-- TPM start -->
        <script src="/components/jquery/jquery.min.js"></script>
        <!-- TPM end -->

        <script src="main.js"></script>

    </body>
    
TPM generates a file, `tpm.d.ts` which references all your dependencies. To reference them from your code, simply add a tag like this with a relative path to the root project file

    /// <reference path="../tpm.d.ts" />

    $("body").fadeOut()

When you want to deploy to production
    


All Commands
------------

    # creates tpm.json with default values
    tpm init                    

    # installs all dependencies listed in tpm.json
    tpm install                 

    # uses the CDN to edit your index.html. 
    # dependencies without a CDN will be compiled into a single file
    tpm install --prod          

    # installs jquery and saves to `tpm.json`
    tpm install jquery          

    # installs a dependency at a particular version 
    tpm install jquery#2.0.3    


Configuration
-------------

The dependencies and settings for a project or folder can be specified in `tpm.json`. The command `tpm init` will generate one with defaults for you to change. 

    {
        "name":"someProject",
        "description":"",

        // Where the dependencies are installed. 
        "directory":"public/components/",

        // optionally specify an html file to add dependencies too
        "index":"public/index.html",


        "dependencies":{
            "jquery": "~2.0.3",
        },
    }

Adding a Dependency
-------------------

If a dependency is not found in the repository, please help us out by adding it! 


Open Questions
--------------

Is managing the html file useful? If not, how do you source all those dependencies? One of the major problems with client-side development is the huge burden it is to import small dependencies (performance-wise, annoyance, potential for error).

Should we bother adding a production setting that links to the CDN versions of things, and concatenates all other dependencies? People tend to have very different opinions about deployment, but it would be nice to have a workable default. 

How to manage the repository? It would be better if people could add entries without having to go through a gatekeeper, and to let the community edit them somehow (like, if there is a better source for a definition file somewhere).

TODO
----

Install a package from git. From git/subfolder? Or it just references 

Easily add a new package. 

Support node/servers as well (a simpler problem).

[typescript]: http://typescriptlang.org/
[definitelyTyped]: https://github.com/borisyankov/DefinitelyTyped
[bower]: http://bower.io/
[npm]: https://npmjs.org/
