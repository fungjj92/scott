fs = require 'fs'

restify = require 'restify'
# http://mcavage.github.com/node-restify/

sqlite3 = require 'sqlite3'
# https://github.com/developmentseed/node-sqlite3/wiki/API

node_static = require 'node-static'
# https://github.com/cloudhead/node-static

bunyan = require 'bunyan'
# https://github.com/trentm/node-bunyan

csv = require 'csv'
# http://www.adaltas.com/projects/node-csv/to.html

PRODUCTION_SETTINGS =
  cache: 0
  port: 8080
  log: true
  dbfile: '/home/tlevine/wetlands.db'
  logfile: '/home/tlevine/scott.log'

DEVELOPMENT_SETTINGS =
  cache: 0
  port: 8080
  log: true
  dbfile: '/tmp/wetlands.db'
  logfile: '/tmp/scott.log'

SETTINGS = PRODUCTION_SETTINGS

server = restify.createServer()

server.use (restify.bodyParser { mapParams: false })
# server.use restify.gzipResponse()

server.use (restify.authorizationParser())

if SETTINGS.log
  server.on 'after', restify.auditLogger
    log: bunyan.createLogger
      name: 'scott'
      streams: [{
        level: 'trace',
        path: SETTINGS.logfile
      }]

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
  ["publicNoticeUrl", /^pdf\/.*$/ ], # On the Army Corps site
  ["drawingsUrl", /^pdf\/.*$/ ],     # On the Army Corps site
  ["parish", /^(|acadia|allen|ascension|assumption|avoyelles|beauregard|bienville|bossier|caddo|calcasieu|caldwell|cameron|catahoula|claiborne|concordia|de soto|east baton rouge|east carroll|east feliciana|evangeline|franklin|grant|iberia|iberville|jackson|jefferson|jefferson davis|lafayette|lafourche|la salle|lincoln|livingston|madison|morehouse|natchitoches|orleans|ouachita|plaquemines|pointe coupee|rapides|red river|richland|sabine|saint bernard|saint charles|saint helena|saint james|saint john the baptist|saint landry|saint martin|saint mary|saint tammany|tangipahoa|tensas|terrebonne|union|vermilion|vernon|washington|webster|west baton rouge|west carroll|west feliciana|winn)$/]

  # Automatically taken from the public notice
  ["CUP", /^.*$/],
  ["WQC", /^.*$/],
  ["locationOfWork", /^.*$/],
  ["characterOfWork", /^.*$/],

  # Manually taken from the public notice
  ["longitude", /^-?[0-9.]*$/],
  ["latitude", /^-?[0-9.]*$/]
  ["acreage", /^[0-9.]*$/],

  # Notes
  ["type", /^(|impact|mitigation|restoration|other)$/],
  ["notes", /^.*$/],
  ["status", /^([1-5])$/],
  ["flagged", /^[01]?$/]
  ["reminderDate", /^(|[0-9]{4}-[01][0-9]-[0-3][0-9])$/],
]

ACCOUNTS =
  tom: 'chainsaw'
  scott: 'chainsaw'
  bot: 'h%r9hr23(uo'

# Check whether a username and password combination corresponds to an account.
isUser = (username, password) ->
  username != undefined and password != undefined and password == ACCOUNTS[username]

# Check that an edit is allowed
isAuthorized = (req, res) ->
  # Must be authenticatied
  return req.authorization.basic and (isUser req.authorization.basic.username, req.authorization.basic.password)

notValid = (req, res) ->
  for key in KEYS

    # Validation (key[1] is always a regular expression.)
    if req.body[key[0]] != undefined and not ('' + req.body[key[0]]).match key[1]
      return "#{key[0]} must match #{key[1]}"

  return false

# Check whether the password is correct
server.post '/login', (req, res, next) ->

  if req.body and isUser req.body.username, req.body.password
    # http://stackoverflow.com/questions/5240876/difference-between-success-and-complete#answer-5240889
    res.send 200, req.body
    next()

  else
    next(new restify.NotAuthorizedError 'Incorrect username or password')

# Create an application
server.post '/applications/:permitApplicationNumber', (req, res, next) ->

  if not (isAuthorized req, res)
    return next(new restify.NotAuthorizedError 'Incorrect username or password')

  notValidMsg = notValid req, res
  if notValidMsg
    return next(new restify.InvalidContentError notValidMsg)

  # All keys must exist
  for key in KEYS
    if req.body[key[0]] == undefined
      return next(new restify.MissingParameterError "You need to pass the #{key[0]}.")

  keys = 'permitApplicationNumber,' + (KEYS.map (key)-> key[0]).join ','
  questionMarks = '?,' + (KEYS.map (key) -> '?').join ','
  sql = "INSERT INTO application (#{keys}) VALUES (#{questionMarks});"
  values = [req.body.permitApplicationNumber].concat (KEYS.map (key)-> req.body[key[0]])

  # Run the query
  db = new sqlite3.Database SETTINGS.dbfile
  db.get "SELECT count(*) AS 'c' FROM application WHERE permitApplicationNumber = ?", req.body.permitApplicationNumber, (err, row) ->
    if row.c == 1
      next(new restify.BadMethodError "There is already a permit application with number #{req.body.permitApplicationNumber}")

    db.run sql, values, (status) ->
      if status
        next(new restify.InvalidContentError status)
      else
        res.send 200
        next()

# Edit an application
server.put '/applications/:permitApplicationNumber', (req, res, next) ->

  if not isAuthorized req, res
    return next(new restify.NotAuthorizedError 'Incorrect username or password')

  notValidMsg = notValid req, res
  if notValidMsg
    return next(new restify.MissingParameterError notValidMsg)

  # Lines of SQL
  sqlExprs = ("#{key[0]} = ?" for key in KEYS when req.body[key[0]] != undefined)


  # Text for a transaction
  sql = "UPDATE application SET #{sqlExprs.join ','} WHERE permitApplicationNumber = ?;"

  # Escaped values for the SQL
  values = (KEYS.map ((key) ->
    if req.body[key[0]] == undefined
      []
    else
      [req.body[key[0]]]
  )).reduce((a, b) -> a.concat b).concat([req.params.permitApplicationNumber])

  # Run the query
  db = new sqlite3.Database SETTINGS.dbfile
  db.run sql, values, (err) ->
    if err
      next(new restify.InvalidContentError err)
    else
      res.send 204
      next()

# View an application
server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database SETTINGS.dbfile
  sql = "SELECT * FROM application WHERE permitApplicationNumber = ? LIMIT 1;"
  db.get sql, req.params.permitApplicationNumber, (err, row) ->
    if row
      res.send row
      next()
    else
      next(new restify.ResourceNotFoundError 'There is no permit with this number.')

# List the applications
server.get /^\/applications(\.json)?$/, (req, res, next) ->
  db = new sqlite3.Database SETTINGS.dbfile
  sql = "SELECT * FROM application;"
  db.all sql, (err, rows) ->
    res.send rows
    next()

CSV_COLUMNS = [
  'permitApplicationNumber',
  'projectDescription',
  'applicant',
  'projectManagerName',
  'projectManagerPhone',
  'projectManagerEmail',
  'publicNoticeDate',
  'expirationDate',
  'publicNoticeUrl',
  'drawingsUrl',
  'parish',
  'CUP',
  'WQC',
  'locationOfWork',
  'characterOfWork',
  'longitude',
  'latitude',
  'acreage',
  'type',
  'notes',
  'status',
  'flagged',
  'reminderDate'
]
# List the applications as csv
server.get '/applications.csv', (req, res, next) ->
  db = new sqlite3.Database SETTINGS.dbfile
  sql = "SELECT * FROM application;"
  db.all sql, (err, rows) ->
    listRows = rows.map (row) ->
      CSV_COLUMNS.reduce (a, b) ->
        if a == 'permitApplicationNumber'
          [row[a], row[b]]
        else
          a.concat [row[b]]
    csv().from(listRows).to (csvString) ->
      res.setHeader 'content-type', 'text/csv'
      res.send CSV_COLUMNS.join(',') + '\n' + csvString
      next()

server.get '/applications.db', (req, res, next) ->
  fs.readFile SETTINGS.dbfile, (err, data) ->
    res.setHeader 'content-type', 'application/x-sqlite3'
    res.send data
    next()

# Serve the client
file = new node_static.Server '../client', { cache: SETTINGS.cache }
server.get /^.*$/, (a, b, c) ->
  file.serve a, b, c
server.listen SETTINGS.port

# Make it a module.
module.exports = server
