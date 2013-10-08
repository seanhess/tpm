/// <reference path="node.d.ts" />

declare module "request" {
  import http = require("http")
  import stream = require("stream")

  interface RequestCB {
    // body can be a string or an object, depending on whether it is json
    (err:Error, response:http.ClientResponse, body:any);
  }

  interface Options {
    url: string;
    json: boolean;
  }

  function get(url:string, cb:RequestCB):stream.ReadableStream;
  function get(options:Options, cb:RequestCB):stream.ReadableStream;
}
