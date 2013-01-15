I'm writing the server in 
[restify](http://mcavage.github.com/node-restify/).
The paths are explained in some drawing.


## Running tests

Copy `test.db` to `/tmp/wetlands.db`, run the migrations, then run the tests.

    cp test.db /tmp/wetlands.db
    sqlite3 /tmp/wetlands.db < migrate.sql
    vows test.coffee
