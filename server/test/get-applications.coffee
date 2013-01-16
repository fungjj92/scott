APIeasy = require 'api-easy'
assert = require 'assert'

# Move this to another file eventually.
sqlite3 = require 'sqlite3'
fs = require 'fs'

createRecord = () ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  db.run "DROP TABLE IF EXISTS application", ->
    db.run (fs.readFileSync 'schema.sql', 'utf8'), ->
      db.run (fs.readFileSync 'fixture.sql', 'utf8')

suite = APIeasy.describe '/applications'
suite.discuss('When I request the applications list,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .addBatch(createRecord)
  .next()
  .get('/applications')
  .expect('should respond with a 1-record JSON list', (err, res, body) ->
    assert.equal (JSON.parse body).length, 1
  )

  .export module
