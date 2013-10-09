/// <reference path='../all.d.ts' />

var PORT = process.env.PORT || 3000
import express = require('express')
import http = require('http')
import tpm = require('../lib/tpm')
import DtCache = require('../lib/DtCache')
var connect = require('connect')
var path = require('path')
var expressPromise = require('express-promise')

var REPO_CACHE_PATH = path.join(__dirname, "dt.json")

// Don't necessarily load anything
// You can cache things to disk?
// no, cache them in memory

var dtcache = new DtCache(REPO_CACHE_PATH)
dtcache.loadFromDisk()

// LOAD THE CACHE!

export var app = express()

app.use(expressPromise());
app.use(connect.static(__dirname + '/../public'))
// app.use(connect.cookieParser())
// app.use(connect.multipart())
app.use(connect.bodyParser()) 
// app.use(connect.session({secret: 'funky monkey', key: 'blah', store:new connect.session.MemoryStore()}))

app.configure("production", () => {
  console.log("PRODUCTION")
})

app.configure("development", () => {
  console.log("DEVELOPMENT")
})

app.configure("test", () => {
  console.log("TEST")
}) 

/// EXAMPLE API CALL //////////////////////////////

app.get('/test', function(req, res) {
    res.json("hello")
})

app.get("/dt", function(req, res) {
    res.json(dtcache.definitions)
})

// TODO: make this trigger automatically, whenever expired, or whatever
app.post("/dt/reload", function(req, res) {
    dtcache.loadAndCache()
    .then(() => res.send(200))
})

/// APP ///////////////////////////////////////////

app.get('/info', function(req, res) {
    res.send("AngularJS Bootstrap")
})

// Send the Angular app for everything under /admin
// Be careful not to accidentally send it for 404 javascript files, or data routes
// app.get(/\/[\w\/\-]*$/, function(req, res) {
//   res.sendfile(path.join(__dirname, '..', 'public', 'index.html'))
// })

if (module == (<any>require).main) {
  var server = http.createServer(app)
  server.listen(PORT, () => {
    console.log("RUNNING " + PORT)
  })
}
