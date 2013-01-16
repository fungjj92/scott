sqlite3 = require 'sqlite3'
fs = require 'fs'

module.exports = {}
module.exports.createRecord = () ->
  db = new sqlite3.Database '/tmp/wetlands.db'
  db.run "DROP TABLE IF EXISTS application", ->
    db.run (fs.readFileSync 'schema.sql', 'utf8'), ->
      db.run (fs.readFileSync 'fixture.sql', 'utf8')

