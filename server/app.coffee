fs = require 'fs'

restify = require 'restify'
# http://mcavage.github.com/node-restify/

sqlite3 = require 'sqlite3'
# https://github.com/developmentseed/node-sqlite3/wiki/API

node_static = require 'node-static'
# https://github.com/cloudhead/node-static

bunyan = require 'bunyan'
# https://github.com/trentm/node-bunyan

SETTINGS =
  cache: 0
  port: 8080
  log: false

server = restify.createServer()

server.use (restify.bodyParser { mapParams: false })
# server.use restify.gzipResponse()

server.use (restify.authorizationParser())

if SETTINGS.log
  server.on 'after', restify.auditLogger
    log: bunyan.createLogger
      name: 'audit'
      stream: process.stdout

# ORM alternative
KEYS = [
  ["applicant", /^.*$/],
  ["projectDescription", /^.*$/],
  ["projectManagerPhone", /^.*$/],
  ["projectManagerEmail", /^.*$/],
  ["projectManagerName", /^.*$/],
  ["acreage", /^[0-9.]*$/],
  ["CUP", /^.*$/],
  ["WQC", /^.*$/],
  ["parish", /^(list|of|parishes)$/],
  ["expirationDate", /^.*$/],
  ["longitude", /^[0-9.]*$/],
  ["latitude", /^[0-9.]*$/]
]

# Check whether the password is correct
server.post '/login', (req, res, next) ->
  if req.body && req.body.username != '' && req.body.password == 'chainsaw'
    # http://stackoverflow.com/questions/5240876/difference-between-success-and-complete#answer-5240889
    res.send 200, req.body
    return next()
  else
    return next(new restify.NotAuthorizedError('Incorrect username or password'))

server.put '/applications/:permitApplicationNumber', (req, res, next) ->

  # Must be authenticatied
  if !req.authorization.basic || req.body.username == '' || req.authorization.basic.password != 'chainsaw'
    return next(new restify.NotAuthorizedError('Incorrect username or password'))

  for key in KEYS

    # All keys must exist
    if not req.body[key[0]]
      res.send 400, "You need to pass the #{key[0]}."
      return next()

    # Validation (key[1] is always a regular expression.)
    if not ('' + req.body[key[0]]).match key[1]
      res.send 400, "#{key[0]} must match #{key[1]}"
      return next()

  console.log 2
  # Lines of SQL
  sqlLines = KEYS.map (key) ->
    "UPDATE application SET #{key[0]} = ? WHERE permitApplicationNumber = ?;"

  # Text for a transaction
  sql = 'BEGIN TRANSACTION;' + (sqlLines.join '') + 'COMMIT;'

  console.log 3
  # Escaped values for the SQL
  questionMarks = (KEYS.map(key) -> [req.body[key[0]], req.params.permitApplicationNumber])
  .reduce((a, b) -> a.concat b)

  # Run the query
  db = new sqlite3.Database '/tmp/wetlands.db'
  db.run sql, questionMarks, () ->
    # To do: Catch the error.
    res.send 204
    return next()

server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  sql = "SELECT * FROM application WHERE permitApplicationNumber = ? LIMIT 1;"
  db.get sql, req.params.permitApplicationNumber, (err, row) ->
    if row
      res.send row
      return next()
    else
      return next(new restify.ResourceNotFoundError 'There is no permit with this number.')

server.get '/applications', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  sql = "SELECT * FROM application;"
  db.all sql, (err, rows) ->
    res.send rows
    return next()

# Serve the client
file = new node_static.Server '../client', { cache: SETTINGS.cache }
server.get /^.*$/, (a, b, c) ->
  file.serve a, b, c
server.listen SETTINGS.port
