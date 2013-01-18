define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'models/application',
  'models/session',
  'helpers/parishes'
], function($, _, Backbone, Vm, applicationPageTemplate, ApplicationModel, SessionModel, parishes){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$model = new ApplicationModel({id: this.options.permitApplicationNumber})
      var page = this
      this.$model.fetch({
        success: function (collection, response, options) {
          var sessionModel = new SessionModel
          sessionModel.fetch()
          page.$el.html(_.template(applicationPageTemplate, {
            application: page.$model,
            parishes: parishes,
            loggedIn: sessionModel.loggedIn()
          }))
        }
      })
    },
    update: function (e) {
      // this.$model.set(e.currentTarget.name, e.currentTarget.value)

      var attributes = {}
      attributes[e.currentTarget.name] = e.currentTarget.value

      var beforeSend = function(xhr) {
        sessionModel = new SessionModel()
        sessionModel.fetch()
        var token = sessionModel.token()
        xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))))
      }

      this.$model.save(attributes, { beforeSend: beforeSend })
    },
    events: {
      "change input": "update",
      "change textarea": "update",
      "change select": "update"
    }
  });
  return ApplicationPage;
});
