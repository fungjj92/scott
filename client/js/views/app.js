define([
  'jquery',
  'lodash',
  'bb',
  'vm',
  'events',
  'text!templates/layout.html'
], function($, _, Backbone, Vm, Events, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    initialize: function () {
    },
    render: function () {
      var appView = this;

      $(this.el).html(layoutTemplate);
      require(['views/header/menu'], function (HeaderMenuView) {
        var headerMenuView = Vm.create(appView, 'HeaderMenuView', HeaderMenuView);
        headerMenuView.render()
      });
      require(['views/footer/footer'], function (FooterView) {
        // Pass the appView down into the footer so we can render the visualisation
        var footerView = Vm.create(appView, 'FooterView', FooterView, {appView: appView});
        footerView.render();
      });
    
    }
  });
  return AppView;
});
