define([
  'lodash',
  'backbone'
], function(_, Backbone) {
  var applicationModel = Backbone.Model.extend({
    defaults: {
      score: 10
    },
    initialize: function(){
    }

  });
  return applicationModel;
});
