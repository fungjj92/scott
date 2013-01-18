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
  dbfile: '/tmp/wetlands.db'

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
  # Automatically taken from the listings page
  ["projectDescription", /^.*$/],
  ["applicant", /^.*$/],
  ["projectManagerPhone", /^.*$/],
  ["projectManagerEmail", /^.*$/],
  ["projectManagerName", /^.*$/],
  ["publicNoticeDate", /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/],
  ["expirationDate", /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/],
  ["publicNoticeUrl", /^http.*$/ ], # On the Army Corps site
  ["drawingsUrl", /^http.*$/ ],     # On the Army Corps site
  ["parish", /^(Acadia|Allen|Ascension|Assumption|Avoyelles|Beauregard|Bienville|Bossier|Caddo|Calcasieu|Caldwell|Cameron|Catahoula|Claiborne|Concordia|De Soto|East Baton Rouge|East Carroll|East Feliciana|Evangeline|Franklin|Grant|Iberia|Iberville|Jackson|Jefferson|Jefferson Davis|Lafayette|Lafourche|La Salle|Lincoln|Livingston|Madison|Morehouse|Natchitoches|Orleans|Ouachita|Plaquemines|Pointe Coupee|Rapides|Red River|Richland|Sabine|Saint Bernard|Saint Charles|Saint Helena|Saint James|Saint John the Baptist|Saint Landry|Saint Martin|Saint Mary|Saint Tammany|Tangipahoa|Tensas|Terrebonne|Union|Vermilion|Vernon|Washington|Webster|West Baton Rouge|West Carroll|West Feliciana|Winn)$/]

  # Automatically taken from the public notice
  ["CUP", /^.*$/],
  ["WQC", /^.*$/],

  # Manually taken from the public notice
  ["longitude", /^[0-9.]*$/],
  ["latitude", /^[0-9.]*$/]
  ["acreage", /^[0-9.]*$/],

  # Notes
  ["type", /^(|impact|mitigation|restoration|other)$/],
  ["notes", /^.*$/],
  ["status", /^(toRead|toComment|waiting|toFOI|done)$/],
  ["flagged", /^[01]$/]
]

ACCOUNTS =
  tom: 'chainsaw'
  scott: 'chainsaw'
  bot: 'h%r9hr23(uo'

# Check whether a username and password combination corresponds to an account.
isUser = (username, password) ->
  username != undefined and password != undefined and password == ACCOUNTS[username]

# Check that an edit is allowed
validateDocumentEdit = (req, res, next, callback) ->
  # Must be authenticatied
  if !req.authorization.basic or not (isUser req.authorization.basic.username, req.authorization.basic.password)
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

  callback req, res, next

# Check whether the password is correct
server.post '/login', (req, res, next) ->
  if req.body and isUser req.body.username, req.body.password
    # http://stackoverflow.com/questions/5240876/difference-between-success-and-complete#answer-5240889
    res.send 200, req.body
    next()
  else
    next(new restify.NotAuthorizedError('Incorrect username or password'))

# Create an application
server.post '/applications/:permitApplicationNumber', (req, res, next) ->
  validateDocumentEdit req, res, next, (req, res, next) ->

    # Must be authenticatied
    if !req.authorization.basic or not (isUser req.authorization.basic.username, req.authorization.basic.password)
      return next(new restify.NotAuthorizedError('Incorrect username or password'))

    keys = (KEYS.map (key)-> key[0]).join ','
    questionMarks = (KEYS.map (key) -> '?').join ','
    sql = "INSERT INTO application (#{keys}) VALUES (#{questionMarks})"
    values = KEYS.map (key)-> req.body[key[0]]

    # Run the query
    db = new sqlite3.Database dbfile
    db.run sql, values, () ->
      # To do: Catch the error.
      res.send 204
      next()

# Edit an application
server.put '/applications/:permitApplicationNumber', (req, res, next) ->
  validateDocumentEdit req, res, next, (req, res, next) ->
    # Lines of SQL
    sqlLines = KEYS.map (key) ->
      "UPDATE application SET #{key[0]} = ? WHERE permitApplicationNumber = ?;"

    # Text for a transaction
    sql = 'BEGIN TRANSACTION;' + (sqlLines.join '') + 'COMMIT;'

    # Escaped values for the SQL
    values = (KEYS.map(key) -> [req.body[key[0]], req.params.permitApplicationNumber])
    .reduce((a, b) -> a.concat b)

    # Run the query
    db = new sqlite3.Database dbfile
    db.run sql, values, () ->
      # To do: Catch the error.
      res.send 204
      next()

# View an application
server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database dbfile
  sql = "SELECT * FROM application WHERE permitApplicationNumber = ? LIMIT 1;"
  db.get sql, req.params.permitApplicationNumber, (err, row) ->
    if row
      res.send row
      next()
    else
      next(new restify.ResourceNotFoundError 'There is no permit with this number.')

# List the applications
server.get '/applications', (req, res, next) ->
  db = new sqlite3.Database dbfile
  sql = "SELECT * FROM application;"
  db.all sql, (err, rows) ->
    res.send rows
    next()

# Serve the client
file = new node_static.Server '../client', { cache: SETTINGS.cache }
server.get /^.*$/, (a, b, c) ->
  file.serve a, b, c
server.listen SETTINGS.port
