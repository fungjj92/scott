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

suite = APIeasy.describe '/application/:id'
suite.discuss('When I alter a permit application,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .addBatch(createRecord())
  .discuss('adjusting the project manager name and the acreage')
  .put('/applications/MVN-2012-1266-CU', {projectManagerName: "Tom Levine", acreage: 0.4 })
  .expect(204)
  .next()
  .get('/applications/MVN-2012-1266-CU')
  .expect('the project manager name should change', (err, res, body) ->
    doc = JSON.parse body
    assert.equal doc.projectManagerName, 'Tom Levine'
    assert.equal doc.acreage, 0.4
  )

  .export module
