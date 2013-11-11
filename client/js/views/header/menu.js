var fs = require('fs')

var $ = require('jquery')
  , _ = require('lodash')
  , Backbone = require('backbone')
  , SessionView = require('./views/header/session')
  , headerMenuTemplate = fs.readFileSync('../templates/header/menu.html')

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

module.exports = HeaderMenuView;
