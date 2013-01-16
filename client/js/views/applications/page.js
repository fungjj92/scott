define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/applications/page.html',
  'collections/applications'
], function($, _, Backbone, applicationsPageTemplate, ApplicationsCollection){
  var ApplicationsPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$el.html(applicationsPageTemplate);

      var applicationsCollection = new ApplicationsCollection;
      applicationsCollection.fetch()
      console.log(applicationsCollection)
    }
  });

  return ApplicationsPage;
});
