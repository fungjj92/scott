// https://github.com/jrburke/requirejs/issues/407#issuecomment-7979217
define(function(require) {
  var $ = require('jquery')
  var  _ = require('underscore')
  var Backbone = require('backbone')
  
  // Modifies Backbone
  require('libs/backbone.fetch-cache.min')

  return Backbone
})
