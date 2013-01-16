define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'views/application/location',
  'views/application/acreage',
  'models/application'
], function($, _, Backbone, Vm, applicationPageTemplate, LocationView, AcreageView, ApplicationModel){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      var applicationModel = new ApplicationModel({id: this.options.permitApplicationNumber});
      var page = this
      applicationModel.fetch({
        success: function (collection, response, options) {
          page.$el.html(_.template(applicationPageTemplate, { application: applicationModel }))
        }
      })

      var locationView = Vm.create(this, 'ApplicationLocationView', LocationView);
      locationView.render();
      
      var acreageView = Vm.create(this, 'ApplicationAcreageView', AcreageView, {permitApplicationNumber: this.options.permitApplicationNumber});
      acreageView.render();
    }
  });
  return ApplicationPage;
});
