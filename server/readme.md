I'm writing the server in 
[restify](http://mcavage.github.com/node-restify/).
The paths are explained in some drawing.


## Running tests

Copy `test.db` to `/tmp/wetlands.db`, run the migrations, then run the tests.
(I tried loading the sql in th files, but it's not working. Hmm.

    rm -f /tmp/wetlands.db
    sqlite3 /tmp/wetlands.db < schema.sql
    sqlite3 /tmp/wetlands.db < fixture.sql
    vows test/*.coffee
