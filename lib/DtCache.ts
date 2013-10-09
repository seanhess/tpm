import path = require('path')
import dt = require('./definitelyTyped')
import fs = require('./q-fs')
import Q = require('q')

class DtCache {
    public path:string;
    public definitions:IDefinition[];

    constructor(path:string) {
        this.path = path
        this.definitions = []
    }

    // should cache it as well, no?
    // load slowly if not cached? no, not really, just initialize with the cached verion
    loadFromDisk():Q.IPromise<IDefinition[]> {
        return fs.readFile(this.path)
        .then((data) => {
            this.definitions = JSON.parse(data.toString())
            return this.definitions
        })
    }

    loadAndCache():Q.IPromise<void> {
        return dt.generateRepo()
        .then((defs) => {
            this.definitions = defs
            return this.save(defs)
        })
        .then(() => null)
    }

    save(defs:IDefinition[]):Q.IPromise<void> {
        var data = JSON.stringify(defs)
        return fs.writeFile(this.path, data)
    }
}

export = DtCache