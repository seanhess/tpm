export interface IAlias {
    alias: string;
    name: string;
    version?: string;
}

// Put these in alphabetical order to reduce merge conflicts and keep them organized
// Can break into multiple lines as needed
export var all:IAlias[] = [
    {name: "angular", alias: "angular-browserify"},
    {name: "angular", alias: "angularjs"},
    {name: "jquery", alias: "jquery-browserify"},
]
