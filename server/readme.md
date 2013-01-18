I'm writing the server in 
[restify](http://mcavage.github.com/node-restify/).
The paths are explained in some drawing.

## API endpoints

`GET /login` Check that account credentials are correct by passing the
username and password.

`GET /applications` Read all of the permit applications as a JSON list of
dictionaries.

`GET /applications/:permitApplicationNumber` Read a particular permit
application as a JSON dictionary.

`POST /applications/:permitApplicationNumber` Create a record for a permit
application by passing a JSON dictionary or a web query.

`PUT /applications/:permitApplicationNumber` Edit a particular permit
application by passing the full new document as a JSON dictionary.

Everything else serves static files

## Running tests

Copy `test.db` to `/tmp/wetlands.db`, run the migrations, then run the tests.
(I tried loading the sql in th files, but it's not working. Hmm.

    rm -f /tmp/wetlands.db
    sqlite3 /tmp/wetlands.db < schema.sql
    sqlite3 /tmp/wetlands.db < fixture.sql
    vows test/*.coffee
