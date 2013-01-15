restify = require 'restify'
sqlite3 = require 'sqlite3'
# https://github.com/developmentseed/node-sqlite3/wiki/API

server = restify.createServer()


# Convert this into a json dict.
# SELECT * FROM application WHERE permitApplicationNumber = ?;

server.put '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
    statement =
    db.run "UPDATE application SET '%(key)s' = '%(value)s' WHERE permitApplicationNumber = ?", (err, row) ->
      console.log row
      res.send 200
      return next()

server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  db = new sqlite3.Database '/tmp/wetlands.db'
    db.each "SELECT * FROM application WHERE permitApplicationNumber = ? LIMIT 1", (err, row) ->
      console.log row
      res.send 200
      return next()

# Convert this into a list of json dicts.
# SELECT * FROM application;

server.put '/applications', (req, res, next) ->
  res.send 200
  return next()

server.get '/applications', (req, res, next) ->
  res.send 200
  return next()

server.listen 8080
