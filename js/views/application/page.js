define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'text!templates/application/page.html',
  'views/application/sidemenu',
  'views/application/section'
], function($, _, Backbone, Vm, applicationPageTemplate, SidemenuView, SectionView){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$el.html(applicationPageTemplate);
      
      var sidemenuView = Vm.create(this, 'ApplicationSideMenuView', SidemenuView);
      sidemenuView.render();
      
      var sectionView = Vm.create(this, 'ApplicationSectionView', SectionView, {permitApplicationNumber: this.options.permitApplicationNumber});
      sectionView.render();
    }
  });
  return ApplicationPage;
});
