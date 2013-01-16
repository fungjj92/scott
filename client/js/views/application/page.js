define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'models/application',
  'views/application/parishes'
], function($, _, Backbone, Vm, applicationPageTemplate, ApplicationModel, parishes){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$model = new ApplicationModel({id: this.options.permitApplicationNumber})
      var page = this
      this.$model.fetch({
        success: function (collection, response, options) {
          page.$el.html(_.template(applicationPageTemplate, {
            application: page.$model,
            parishes: parishes
          }))
        }
      })
    },
    update: function (e) {
      this.$model.set(e.currentTarget.name, e.currentTarget.value)
      this.$model.save()
    },
    events: {
      "change input[type=text]": "update",
      "change textarea": "update",
      "change select": "update"
    }
  });
  return ApplicationPage;
});
