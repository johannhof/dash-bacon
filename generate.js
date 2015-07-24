#!/usr/bin/env node

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('baconjs.docset/Contents/Resources/docSet.dsidx');
var jsdom = require("jsdom");

db.serialize(function() {
  db.run("DROP TABLE searchIndex");
  db.run("CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);");
  db.run("CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);");

  jsdom.env(
    "./baconjs.docset/Contents/Resources/Documents/baconjs.github.io/api.html",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      window.$("ul:first > li > a").each(function(i, tut){
        tut = window.$(tut);
        var name = tut.html();
        var type = "Guide";
        console.log("creating an entry for " + name);
        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/api.html" + tut.attr('href') + "');");
      });

      window.$("p > a[name]").each(function(i, fun){
        fun = window.$(fun);
        var name = fun.next().children('code').html();
        var type = "Function";
        if(~name.indexOf("Bacon") || ~name.indexOf("$.")){
          type = "Constructor";
        }
        if(~name.indexOf("bus.") || ~name.indexOf("event.")){
          type = "Method";
        }
        console.log("creating an entry for " + name);
        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/api.html#" + fun.attr('name') + "');");
      });
    }
  );

  jsdom.env(
    "./baconjs.docset/Contents/Resources/Documents/baconjs.github.io/tutorials.html",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      window.$("ul.toc > li > a").each(function(i, tut){
        tut = window.$(tut);
        var name = tut.html();
        var type = "Guide";
        console.log("creating an entry for " + name);
        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/tutorials.html" + tut.attr('href') + "');");
      });
    }
  );

});

