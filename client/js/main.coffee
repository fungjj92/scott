require.config(
  paths:
    jquery: 'libs/jquery/jquery-min'
    underscore: 'libs/underscore/underscore-min'
    lodash: 'libs/lodash/lodash-min'
    backbone: 'libs/backbone/backbone-min'
    localstorage: 'libs/backbone.localStorage/backbone.localStorage-min'
    leaflet: 'libs/leaflet/leaflet'

    text: 'libs/require/text'

    templates: '../templates'

  shim:
    leaflet:
      exports: 'L'
    backbone:
      require: ['lodash']
      exports: 'Backbone'
)

###
require([
  'views/app'
  'router'
  'vm'
], function(AppView, Router, Vm){
  var appView = Vm.create({}, 'AppView', AppView)
  appView.render()
  Router.initialize({appView: appView})  // The router now has a copy of all main appview
})
###

require [
  'jquery',
  'lodash',
  'backbone',
  'text!templates/layout.html',
], ($, _, Backbone, layoutTemplate) ->
  ($ '.container').html layoutTemplate

  sessionModel = new SessionModel

  require ['views/header/menu'], (HeaderMenuView) ->
    headerMenuView = new HeaderMenuView
    headerMenuView.render()

  require ['views/footer/footer'], (FooterMenuView) ->
    footerMenuView = new FooterMenuView
    footerMenuView.render()
