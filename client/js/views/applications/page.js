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
    render: function (params) {
      if (params == undefined) {
        params = {
          comparator: function(a) { return -new Date(a.get('expirationDate')) }
        }
      }

      var applicationsCollection = new ApplicationsCollection
      applicationsCollection.comparator = params.comparator
      var page = this

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
