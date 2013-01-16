define([
  'jquery',
  'lodash',
  'backbone',
  'models/session',
  'text!templates/header/session.html'
], function($, _, Backbone, SessionModel, sessionTemplate){
  var SessionView = Backbone.View.extend({
    el: '#session',
    sessionModel: new SessionModel(),
    render: function () {
      this.sessionModel.fetch()
      $(this.el).html(_.template(sessionTemplate, {session: this.sessionModel}))
    },
    login: function(e) {
      window.e = e
      var username = $(e.currentTarget).children('input[name=username]')
      var password = $(e.currentTarget).children('input[name=password]')
      this.sessionModel.logIn(username, password)
      this.render()
      return false;
    },
    logout: function(e) {
      this.sessionModel.logOut()
      this.render()
      return false;
    },
    events: {
      'submit form': 'login',
      'click #logout': 'logout'
    }
  })

  return SessionView;
});

