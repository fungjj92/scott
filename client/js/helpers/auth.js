// Set this as the beforeSend argument to $.ajax to do HTTP basic authentication.
var SessionModel = require('./models/session.js')

module.exports = function(xhr) {
  sessionModel = new SessionModel()
  sessionModel.fetch()
  var token = sessionModel.token()
  xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))))
}
