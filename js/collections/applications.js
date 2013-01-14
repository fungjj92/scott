define([
  'jquery',
  'lodash',
  'backbone',
  'models/applications'
], function($, _, Backbone, applicationsModel){
  var applicationsCollection = Backbone.Collection.extend({
    model: applicationsModel,
    initialize: function(){

    }

  });

  return applicationsCollection;
});
