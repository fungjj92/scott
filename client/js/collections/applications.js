var $ = require('jquery-browserify')
  , _ = require('lodash')
  , Backbone = require('backbone')
  , applicationsModel = require('../../models/application.js')

var applicationsCollection = Backbone.Collection.extend({
  model: applicationsModel,
  url: '/applications',
  initialize: function(){

  }

});

module.exports = applicationsCollection;
