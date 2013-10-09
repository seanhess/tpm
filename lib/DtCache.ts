import path = require('path')
import dt = require('./definitelyTyped')
import fs = require('./q-fs')
import Q = require('q')
import tpm = require('./tpm')

class DtCache {
    public path:string;
    public definitions:IDefinition[];
    public map:IDefinitionMap;

    constructor(path:string) {
        this.path = path
        this.definitions = []
        this.map = {}
    }

    // should cache it as well, no?
    // load slowly if not cached? no, not really, just initialize with the cached verion
    loadFromDisk():Q.IPromise<void> {
        return fs.readFile(this.path)
        .then((data) => {
            this.setDefinitions(JSON.parse(data.toString()))
        })
    }

    loadAndCache():Q.IPromise<void> {
        return dt.generateRepo()
        .then((defs) => {
            this.setDefinitions(defs)
            return this.saveToDisk(defs)
        })
        .then(() => null)
    }

    saveToDisk(defs:IDefinition[]):Q.IPromise<void> {
        var data = JSON.stringify(defs)
        return fs.writeFile(this.path, data)
    }

    setDefinitions(defs:IDefinition[]) {
        this.definitions = defs
        this.map = tpm.definitionMap(defs)
    }
}

export = DtCache