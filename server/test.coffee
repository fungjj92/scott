APIeasy = require 'api-easy'
assert = require 'assert'

suite = APIeasy.describe '/applications'
suite.discuss('When I request the applications list,')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')

  # Slash versions
  .get('/applications/', { test: 'data' })
  .expect(200, { ok: true })

  .get('/applications/MVN-2012-00423-WII/', { test: 'data' })
  .expect(200, { ok: true })

  # Non-slash versions
  .get('/applications', { test: 'data' })
  .expect(200, { ok: true })
  .expect('should respond with a 226-record JSON list', (err, res, body) ->
    assert.equal (JSON.parse body).length, 226
  )

  .get('/applications/MVN-2012-00423-WII', { test: 'data' })
  .expect(200, { ok: true })
  .expect('should respond with the appropriate JSON dict', (err, res, body) ->
    assert.equal (JSON.parse body), {
      # Bookkeeping
      'permitApplicationNumber': "MVN-2012-1266-CU",
      'pdfParsed': 1,

      # Automatic
      'projectDescription': "Barge fleeting operation in Mississippi River, Mile176 in ASCENSION PARISH",
      'applicant': "Carline Management",
      'projectManagerName': "Doris Terrell",
      'projectManagerPhone': "504-862-1588",
      'projectManagerEmail': "Doris.Terrell@usace.army.mil",
      'publicNoticeDate': "2012-08-06",
      'expirationDate': "2012-09-05",
      'parish': "Ascension",

      # Manual
      'longitude': null,
      'latitude': null,
      'notes': '',
      'status': '',
      'flagged': 0,
      'acreage': null
    }
  )

  .put('/applications/MVN-2012-00423-WII',
    {projectManagerName: "Tom Levine", acreage: 0.4 },
    { test: 'data' })
  .expect(204, { ok: true })
  .get('/applications/MVN-2012-00423-WII', { test: 'data' })
  .expect(200, { ok: true })
  .expect('should respond with the appropriate JSON dict', (err, res, body) ->
    assert.equal (JSON.parse body), {
      # Bookkeeping
      'permitApplicationNumber': "MVN-2012-1266-CU",
      'pdfParsed': 1,

      # Automatic
      'projectDescription': "Barge fleeting operation in Mississippi River, Mile176 in ASCENSION PARISH",
      'applicant': "Carline Management",
      'projectManagerName': "Tom Levine",
      'projectManagerPhone': "504-862-1588",
      'projectManagerEmail': "Doris.Terrell@usace.army.mil",
      'publicNoticeDate': "2012-08-06",
      'expirationDate': "2012-09-05",
      'parish': "Ascension",

      # Manual
      'longitude': null,
      'latitude': null,
      'notes': '',
      'status': '',
      'flagged': 0,
      'acreage': 0.4
    }
  )

  .export module
