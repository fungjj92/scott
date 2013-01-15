APIeasy = require 'api-easy'
assert = require 'assert'

suite = APIeasy.describe '/applications'
suite.discuss('When I request the applications list,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')

  .get('/applications', { test: 'data' })
  .expect('should respond with a 1-record JSON list', (err, res, body) ->
    assert.equal (JSON.parse body).length, 1
  )

  .export module
