define([
  'jquery',
  'lodash',
  'backbone',
  'models/applications'
], function($, _, Backbone, applicationsModel){
  var applicationsCollection = Backbone.Collection.extend({
    model: applicationsModel,
    url: '/applications',
    initialize: function(){

    }

  });

  return applicationsCollection;
});
