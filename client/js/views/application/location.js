define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/application/location.html',
], function($, _, Backbone, locationTemplate){
  var Location = Backbone.View.extend({
    el: '.location',
    render: function () {
      $(this.el).html(locationTemplate);
    }
  });
  return Location;
});
