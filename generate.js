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

      // get all guides from the api.html file
      window.$("ul:first > li > a").each(function(_i, tut){
        tut = window.$(tut);

        var name = tut.html();
        var type = "Guide";

        console.log("Creating a " + type + " entry for " + name);

        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/api.html" + tut.attr('href') + "');");
      });

      // get all function/method definitions from api.html
      window.$("p > a[name]").each(function(_i, fun){
        fun = window.$(fun);
        var name = fun.next().children('code').html();

        // default type to function
        var type = "Function";

        // we mark all functions that construct streams or events as "Constructors"
        if(~name.indexOf("Bacon") || ~name.indexOf("$.")){
          type = "Constructor";
        }

        // methods that can be called on bus or event objects
        if(~name.indexOf("bus.") || ~name.indexOf("event.")){
          type = "Method";
        }

        // methods that can be called on bus or event objects
        if(~name.indexOf("Bacon.more") || ~name.indexOf("Bacon.noMore")){
          type = "Value";
        }

        console.log("Creating a " + type + " entry for " + name);

        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/api.html#" + fun.attr('name') + "');");
      });
    }
  );

  jsdom.env(
    "./baconjs.docset/Contents/Resources/Documents/baconjs.github.io/tutorials.html",
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {

      // get all tutorials from the tutorials.html file
      window.$("ul.toc > li > a").each(function(i, tut){
        tut = window.$(tut);
        var name = tut.html();
        var type = "Guide";

        console.log("Creating a " + type + " entry for " + name);

        db.run("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + name + "', '" + type + "', 'baconjs.github.io/tutorials.html" + tut.attr('href') + "');");
      });
    }
  );

});

