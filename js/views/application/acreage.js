define([
  'jquery',
  'lodash',
  'backbone',
  'text!templates/application/acreage.html',
], function($, _, Backbone, acreageTemplate){
  var Acreage = Backbone.View.extend({
    el: '.acreage',
    render: function () {
      $(this.el).html(acreageTemplate);
    }
  });
  return Acreage;
});
