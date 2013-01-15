APIeasy = require 'api-easy'
assert = require 'assert'

suite = APIeasy.describe '/applications'
suite.discuss('When I request the applications list,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .put('/applications/MVN-2012-1266-CU', {projectManagerName: "Tom Levine", acreage: 0.4 })
  .expect(204)

  .export module
