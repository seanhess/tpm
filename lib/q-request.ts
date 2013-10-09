/// <reference path="../all.d.ts" />
// simplified promises based request library

var request = require("request")
import Q = require("q")

// declare module "request" {
//     import http = require("http")
//     import stream = require("stream")

//     interface RequestCB {
//         // body can be a string or an object, depending on whether it is json
//         (err:Error, response:http.ClientResponse, body:any);
//     }

//     function get(url:string, cb:RequestCB):stream.ReadableStream;
//     function get(options:IOptions, cb:RequestCB):stream.ReadableStream;
// }


export interface IOptions {
    url: string;
    json: boolean;
}

// gets some data, yo

// var get:<T>(options:request.Options)=>Q.IPromise<T> = function
export function get<T>(options:IOptions):Q.IPromise<T> {
    var d = Q.defer()
    request.get(options, function(err, rs, body) {
        if (err) 
            return d.reject(err)
        if (rs.statusCode != 200)
            return d.reject(body)
        d.resolve(body)
    })
    return d.promise
}