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
      this.$el.html(applicationPageTemplate);

      var applicationModel = new ApplicationModel({id: this.options.permitApplicationNumber});
      applicationModel.initialize()
      alert(applicationModel.url())
      
      var locationView = Vm.create(this, 'ApplicationLocationView', LocationView);
      locationView.render();
      
      var acreageView = Vm.create(this, 'ApplicationAcreageView', AcreageView, {permitApplicationNumber: this.options.permitApplicationNumber});
      acreageView.render();
    }
  });
  return ApplicationPage;
});
