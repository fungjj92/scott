APIeasy = require 'api-easy'
assert = require 'assert'

suite = APIeasy.describe '/application/:id'
suite.discuss('When I alter a permit application,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')

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
