define([
  'jquery',
  'lodash',
  'backbone',
  'models/session',
  'text!templates/header/menu.html'
], function($, _, Backbone, SessionModel, headerMenuTemplate){
  var HeaderMenuView = Backbone.View.extend({
    el: '.main-menu-container',
    initialize: function () {
    },
    render: function () {
      $(this.el).html(_.template(headerMenuTemplate, {session: true}))
      $('a[href="' + window.location.hash + '"]').addClass('active');
    },
    events: {
      'click a': 'highlightMenuItem'
    },
    highlightMenuItem: function (ev) {
      $('.active').removeClass('active');
      $(ev.currentTarget).addClass('active');
    }
  })

  return HeaderMenuView;
});
