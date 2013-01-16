define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'views/application/location',
  'models/application'
], function($, _, Backbone, Vm, applicationPageTemplate, LocationView, ApplicationModel){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$model = new ApplicationModel({id: this.options.permitApplicationNumber})
      var page = this
      this.$model.fetch({
        success: function (collection, response, options) {
          page.$el.html(_.template(applicationPageTemplate, { application: page.$model }))

          var locationView = Vm.create(this, 'ApplicationLocationView', LocationView, {permitApplicationNumber: page.options.permitApplicationNumber})
          locationView.render()
        }
      })
    },
    update: function (e) {
      this.$model.set(e.currentTarget.name, e.currentTarget.value)
      this.$model.save()
    },
    events: {
      "change input[type=text]": "update"
    }
  });
  return ApplicationPage;
});
