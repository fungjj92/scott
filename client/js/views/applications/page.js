define([
  'jquery',
  'lodash',
  'backbone',
  'collections/applications',
  'text!templates/applications/page.html',
  'text!templates/applications/record.html'
], function($, _, Backbone, ApplicationsCollection, applicationsPageTemplate, applicationsRecordTemplate){
  var ApplicationsPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      var applicationsCollection = new ApplicationsCollection;
      applicationsCollection.fetch()

      this.$el.html(_.template(applicationsPageTemplate, {
        applications: applicationsCollection,
        record: applicationsRecordTemplate
      }))

      console.log(applicationsCollection)
    }
  });

  return ApplicationsPage;
});
