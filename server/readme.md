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
application by passing a JSON dictionary or a web query. You must pass all
fields.

`PUT /applications/:permitApplicationNumber` Edit a particular permit
application by passing the full new document as a JSON dictionary. Only
the fields that you pass will be changed.

Everything else serves static files

## Running tests

Copy `test.db` to `/tmp/wetlands.db`, run the migrations, then run the tests.
(I tried loading the sql in th files, but it's not working. Hmm.

    rm -f /tmp/wetlands.db
    sqlite3 /tmp/wetlands.db < schema.sql
    sqlite3 /tmp/wetlands.db < fixture.sql
    vows test/*.coffee

## ACID properties of the server

The underlying SQLite database is ACID if you use it properly, but does the rest of the application maintain that?

This won't be important until we have lots of people editing at the same time.
And any errors should appear pretty quickly and be easy to fix, so it'll be
obvious when this needs to be fixed.

### Atomicity

API calls that modify the database are translated into exactly one command or
transaction. So consistency is preserved.

### Consistency

The server runs ordinary SQL on the database (rather than editing the binary
file directly or something), and the server can work with any valid SQL
database as long as it follows the appropriate schema. So consistency is
preserved.

### Isolation

An API call translates into an SQL statements that either reads or writes to
the database; no API call reads and writes. At the server, isolation is thus
preserved.

This is not really preserved in the client, however, because the entire document
is sent to the server when `Backbone.Model.save` is called. Upgrading to a
newer Backbone with `PATCH` requests and using those should solve this.

### Durability

If power is cut, the entire database can be restored from the bunyan HTTP log.
(Though might be worth considering what would happen if power was cut between
the database call and the log write.)
The associated listings, public notice and drawings files are not necessary
for the restoration of the database, but they can also be easily restored from
the respective git repositories, which are submodules of the project repository.
