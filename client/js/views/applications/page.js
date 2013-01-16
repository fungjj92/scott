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
      var page = this;
      applicationsCollection.fetch({
        success: function (collection, response, options) {
          page.$el.html(_.template(applicationsPageTemplate, {
            applications: applicationsCollection.models,
            record_template: _.template(applicationsRecordTemplate)
          }))
        }
      })
    }
  });

  return ApplicationsPage;
});
