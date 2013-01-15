define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/applications/page.html'
], function($, _, Backbone, applicationsPageTemplate){
  var ApplicationsPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$el.html(applicationsPageTemplate);
    }
  });
  return ApplicationsPage;
});
