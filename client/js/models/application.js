define([
  'lodash',
  'bb'
], function(_, Backbone) {
  var applicationModel = Backbone.Model.extend({
    urlRoot: '/applications',
    validate: function( attributes ){
      if( attributes.acreage < 0 ){
        return "The acreage must be positive.";
      }
    },
    initialize: function(){
    }

  });
  return applicationModel;
});
