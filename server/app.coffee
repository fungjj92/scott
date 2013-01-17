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

server = restify.createServer()

server.use (restify.bodyParser { mapParams: false })
# server.use restify.gzipResponse()

server.use (restify.authorizationParser())

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

  console.log '---------'
  console.log req.body
  console.log '---------'

  if req.body && req.body.password == 'chainsaw'
    # http://stackoverflow.com/questions/5240876/difference-between-success-and-complete#answer-5240889
    res.send 200, req.body
    return next()
  else
    return next(new restify.NotAuthorizedError('Incorrect username or password'))

server.put '/applications/:permitApplicationNumber', (req, res, next) ->
  if !req.authorization.basic || req.authorization.basic.password != 'chainsaw'
    return next(new restify.NotAuthorizedError('Incorrect username or password'))

  db = new sqlite3.Database '/tmp/wetlands.db'

  # Maybe this should be a reduce that passes the db along.
  for key in KEYS
    # Validation
    # The second thing is always a regular expression.
    if req.body[key[0]] && ('' + req.body[key[0]]).match key[1]
      sql = "UPDATE application SET #{key[0]} = ? WHERE permitApplicationNumber = ?;"
      db.run sql, req.body[key[0]], req.params.permitApplicationNumber

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
