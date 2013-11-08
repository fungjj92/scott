var _        = require('lodash'),
  , Backbone = require('backbone')

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

module.exports = applicationModel;
