APIeasy = require 'api-easy'
assert = require 'assert'
helpers = require './helpers'

suite = APIeasy.describe '/applications'
suite.discuss('When I request the applications list,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .addBatch(helpers.createRecord())
  .get('/applications/MVN-2012-1266-CU')
  .expect('should respond with the appropriate JSON dict', (err, res, body) ->
    expectation =
      # Bookkeeping
      'permitApplicationNumber': "MVN-2012-1266-CU"
      'pdfParsed': 1

      # Automatic
      'projectDescription': "Barge fleeting operation in Mississippi River, Mile176 in ASCENSION PARISH"
      'applicant': "Carline Management"
      'projectManagerName': "Doris Terrell"
      'projectManagerPhone': "504-862-1588"
      'projectManagerEmail': "Doris.Terrell@usace.army.mil"
      'publicNoticeDate': "2012-08-06"
      'expirationDate': "2012-09-05"
      'parish': "Ascension"
      'CUP': ''
      'WQC': ''

      # Manual
      'longitude': null
      'latitude': null
      'notes': ''
      'status': ''
      'flagged': 0
      'acreage': null

    keys = (key for key of expectation)
    equalities = keys.map (key) -> (JSON.parse body)[key] is expectation[key]
    allEqual = equalities.reduce (a, b) -> a and b
    assert.equal allEqual, true
  )

  .export module
