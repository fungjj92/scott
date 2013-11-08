var $        = require('jquery'),
  , Backbone = require('backbone')

var SessionModel = Backbone.Model.extend({
  sync: function(method, model, options){
    if (method == 'create' || method == 'update') {
      localStorage.setItem('username', model.attributes.username)
      localStorage.setItem('password', model.attributes.password)
      model.attributes.username = localStorage.getItem('username')
      model.attributes.password = localStorage.getItem('password')
    } else if (method == 'read') {
      model.attributes.username = localStorage.getItem('username')
      model.attributes.password = localStorage.getItem('password')
    } else if (method == 'delete') {
      localStorage.removeItem('username', '')
      localStorage.removeItem('password', '')
    }
  },
  token: function() {
    // The authentication token
    return this.get('username') + ':' + this.get('password') 
  },
  logIn: function(username, password, callback) {
    sessionModel = this
    $.ajax({
      type: "POST",
      url: '/login',
      data: {
        username: username,
        password: password
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', ("Basic " + btoa(username + ':' + password)))
      },
      dataType: 'text',
      success: function() {
        sessionModel.save({'username': username, 'password': password})
        callback()
      },
      error: function(jqXhr, textStatus, errorThrown) {
        alert('Incorrect username or password')
      }
    })
  },
  logOut: function(username, password) {
    this.sync('delete')
  },
  loggedIn: function() {
    return localStorage.propertyIsEnumerable('username') && localStorage.propertyIsEnumerable('password')
  }
})
module.exports = SessionModel
