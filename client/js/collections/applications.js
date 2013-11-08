var $ = require('jquery'),
  , _ = require('lodash'),
  , Backbone = require('backbone'),
  , applicationsModel = require('./models/application')

var applicationsCollection = Backbone.Collection.extend({
  model: applicationsModel,
  url: '/applications',
  initialize: function(){

  }

});

return applicationsCollection;
