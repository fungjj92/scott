define([
  'backbone'
], function(Backbone) {
  var SessionModel = Backbone.Model.extend({
    sync: function(method, model, options){
      if (method == 'create' || method == 'update') {
        localStorage.setItem('username', model.attributes.username)
        localStorage.setItem('password', model.attributes.password)
      } else if (method == 'read') {
        model.attributes.username = localStorage.getItem('username')
        model.attributes.password = localStorage.getItem('password')
      } else if (method == 'delete') {
        localStorage.setItem('username', '')
        localStorage.setItem('password', '')
      }
    },
    loggedIn: function() {
      return this.get('username') != '' && this.get('password') != ''
    }
  })
  return SessionModel
});

