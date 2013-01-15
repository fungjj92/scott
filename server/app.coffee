restify = require 'restify'

server = restify.createServer()

server.listen 8080

# Convert this into a list of json dicts.
# SELECT * FROM application;

server.put '/applications/:permitApplicationNumber', (req, res, next) ->
  res.send 200
  return next()

server.get '/applications/:permitApplicationNumber', (req, res, next) ->
  res.send 200
  return next()

# Convert this into a json dict.
# SELECT * FROM application WHERE permitApplicationNumber = ?;

server.put '/applications', (req, res, next) ->
  res.send 200
  return next()

server.get '/applications', (req, res, next) ->
  res.send 200
  return next()
