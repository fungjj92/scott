restify = require 'restify'
sqlite3 = require 'sqlite3'
# https://github.com/developmentseed/node-sqlite3/wiki/API

server = restify.createServer()

# Parse the query string to req.query
server.use (restify.queryParser { mapParams: false })

# ORM alternative
KEYS = [
  ["applicant", /./],
  ["projectDescription", /./],
  ["projectManagerPhone", /./],
  ["projectManagerEmail", /./],
  ["projectManagerName", /./],
  ["acreage", /./],
  ["CUP", /./],
  ["WQC", /./],
  ["parish", /./],
  ["expirationDate", /./],
  ["longitude", /./],
  ["latitude", /./]
]

server.put '/applications/:permitApplicationNumber', (req, res, next) ->
  # Validation

  for key in KEYS
    # The second thing is always a regular expression.
    if req.query[key[0]] && req.query[key[0]].match key[1]
      console.log req.query[key[0]]

  res.send 200
  return next()

# db = new sqlite3.Database '/tmp/wetlands.db'
#   db.run "UPDATE application SET '%(key)s' = '%(value)s' WHERE permitApplicationNumber = ?", (err, row) ->
#     console.log row
#     res.send 200
#     return next()

server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  sql = "SELECT * FROM application WHERE permitApplicationNumber = ? LIMIT 1;"
  db.get sql, req.params.permitApplicationNumber, (err, row) ->
    if row
      console.log row
    else
      console.log 'no permit with this number'
    res.send 200
    return next()

server.put '/applications', (req, res, next) ->
  res.send 200
  return next()

server.get '/applications', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  sql = "SELECT * FROM application;"
  db.all sql, (err, rows) ->
    console.log rows
    res.send 200
    return next()

server.listen 8080
