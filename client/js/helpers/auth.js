// Set this as the beforeSend argument to $.ajax to do HTTP basic authentication.
define(['models/session'], function (SessionModel) {
  return function(xhr) {
    sessionModel = new SessionModel()
    sessionModel.fetch()
    var token = sessionModel.token()
    xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))))
  }
})
