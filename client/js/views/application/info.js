define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/application/info.html',
], function($, _, Backbone, infoTemplate){
  var Info = Backbone.View.extend({
    el: '.info',
    render: function () {
      $(this.el).html(infoTemplate);
    }
  });
  return Info;
});

