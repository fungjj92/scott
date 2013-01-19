define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'models/application',
  'models/session',
  'helpers/auth',
  'helpers/parishes'
], function($, _, Backbone, Vm, applicationPageTemplate, ApplicationModel, SessionModel, auth, parishes){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$model = new ApplicationModel({id: this.options.permitApplicationNumber})
      var page = this
      this.$model.fetch({
        success: function (collection, response, options) {
          var sessionModel = new SessionModel()
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
      var attributes = {}
      if (e.currentTarget.type == 'checkbox') {
        attributes[e.currentTarget.name] = e.currentTarget.checked + 0
      } else {
        attributes[e.currentTarget.name] = e.currentTarget.value
      }
      this.$model.save(attributes, { beforeSend: auth })
    },
    update_flag: function (e) {
      var flagged = this.$model.get('flagged') === '1' ? '0' : '1'
      this.$model.save({'flagged': flagged}, {
        beforeSend: auth,
        success: function() {
          var textClass = flagged === '1' ? 'text-error' : 'muted'
          $('#flagged').attr('class', textClass)
        }
      })
    },
    events: {
      "change input": "update",
      "change textarea": "update",
      "change select": "update",
      "click #flagged": "update_flag"
    }
  });
  return ApplicationPage;
});
