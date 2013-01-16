define([
  'backbone'
], function(Backbone) {
  var sessionModel = Backbone.Model.extend({
    sync: function(method, model, options){
      if (method == 'create' || method == 'update') {
        localStorage.setItem('username',)
        localStorage.setItem('password',)
    }
  });
  return sessionModel;
});

