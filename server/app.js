var restify = require('restify')

var server = restify.createServer()

server.listen(8080)

server.put('/applications/:permitApplicationNumber', function (req, res, next) {
    res.send(200)
    return next()
})
server.get('/applications/:permitApplicationNumber', function (req, res, next) {
    res.send(200)
    return next()
})

// Convert this into a json dict.
// SELECT * FROM application;
server.put('/applications', function (req, res, next) {
    res.send(200)
    return next()
})
server.get('/applications', function (req, res, next) {
    res.send(200)
    return next()
})
