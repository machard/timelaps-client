"use strict";

var superstatic = require("superstatic");
var connect = require("connect");

var app = connect()
  .use(superstatic({
    config: {
      root : "./src"
    },
    env : ".env.json",
    cwd: process.cwd()
  }))
  .use(function(req, res) {
    res.writeHead(301, {"Location": "http://localhost:5003" + req.url});
    res.end();
  });

app.listen(5004, function () {
  console.log("Superstatic now serving on port 5004 ...");
});