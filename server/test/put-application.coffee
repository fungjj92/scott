APIeasy = require 'api-easy'
assert = require 'assert'
sqlite3 = require 'sqlite3'

checkdb = (check) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  sql = "SELECT projectManagerName, acreage FROM application WHERE permitApplicationNumber = 'MVN-2012-1266-CU';"
  db.get sql, check

suite = APIeasy.describe '/application/:id'
suite.discuss('When I alter a permit application,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')

  .discuss('adjusting the project manager name and the acreage')
  .put('/applications/MVN-2012-1266-CU', {projectManagerName: "Tom Levine", acreage: 0.4 })
  .expect(204)
  .expect('the project manager name should change', (err, res, body) ->
    checkdb (err, row) ->
      assert.equal row.projectManagerName, 'Tom Levine'
  )
  .expect('the acreage should change', (err, res, body) ->
    checkdb (err, row) ->
      assert.equal row.acreage, 0.4
  )

  .export module
