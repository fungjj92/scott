define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/application/map.html',
], function($, _, Backbone, mapTemplate){
  var Map = Backbone.View.extend({
    el: '.map',
    render: function () {
      $(this.el).html(mapTemplate);
    }
  });
  return Map;
});
