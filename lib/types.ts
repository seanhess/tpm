interface IDefinition {
    name: string;       // angularjs
    repo: string;       // https://github.com/borisyankov/DefinitelyTyped
    path: string;       // angularjs/angular.d.ts
    url: string;        // https://github.com/borisyankov/DefinitelyTyped/angularjs/angular.d.ts/raw/master
}

interface IDefinitionMap {
    [key: string]: IDefinition;
}