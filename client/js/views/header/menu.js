define([
  'jquery',
  'lodash',
  'bb',
  'views/header/session',
  'text!templates/header/menu.html'
], function($, _, Backbone, SessionView, headerMenuTemplate){
  var HeaderMenuView = Backbone.View.extend({
    el: '.main-menu-container',
    initialize: function () {
    },
    render: function () {
      $(this.el).html(headerMenuTemplate)
      $('a[href="' + window.location.hash + '"]').addClass('active');

      var sessionView = new SessionView()
      sessionView.render()
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
