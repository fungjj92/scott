define([
  'lodash',
  'backbone'
], function(_, Backbone) {
  var applicationsModel = Backbone.Model.extend({
    defaults: {
      score: 10
    },
    initialize: function(){
    }

  });
  return applicationsModel;

});
