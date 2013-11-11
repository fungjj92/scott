var $ = require('jquery')
  , _ = require('lodash')
  , Backbone = require('backbone')
  , ApplicationsCollection = require('collections/applications')
  , applicationsPageTemplate = fs.readFileSync('../templates/applications/page.html')
  , applicationsRecordTemplate = fs.readFileSync('../templates/applications/record.html')

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
      'status': function(a) { return a.get('status') },
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

module.exports = ApplicationsPage;
