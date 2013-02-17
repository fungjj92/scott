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

      this.applicationsCollection = new ApplicationsCollection
      this.applicationsCollection.comparator = params.comparator
      var page = this

      this.applicationsCollection.fetch({
        success: function (collection, response, options) {
          page.$el.html(_.template(applicationsPageTemplate, {
            applications: page.applicationsCollection.models,
            record_template: _.template(applicationsRecordTemplate)
          }))
        }
      })
    },
    reSort: function(e) {
      var comparator = {
        type: function(a) { return a.get('type') ? a.get('type') : 'z' },
        date: function(a) { return -new Date(a.get('expirationDate')) },
        acreage: function(a) { return -a.get('acreage') }
      }[e.currentTarget.href.split('#')[1]]
      this.render({comparator: comparator})
      return false
    },
    events: {
      'click .sort': 'reSort'
    }
  });

  return ApplicationsPage;
});
