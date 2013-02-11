define([
  'jquery',
  'lodash',
  'bb',
  'models/application'
], function($, _, Backbone, applicationsModel){
  var applicationsCollection = Backbone.Collection.extend({
    model: applicationsModel,
    url: '/applications',
    initialize: function(){

    }

  });

  return applicationsCollection;
});
