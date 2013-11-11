/*
var jquery       = require('jquery')
  , underscore   = require('underscore')
  , lodash       = require('lodash')
  , backbone     = require('backbone')
  , localstorage = require('backbone.localstorage')
  , leaflet      = require('leaflet')
  , d3           = require('d3')
*/

var AppView = require('./views/app.js')
  , router  = require('./router.js')
  , vm      = require('./vm.js')

var appView = Vm.create({}, 'AppView', AppView)
appView.render()
Router.initialize({appView: appView})  // The router now has a copy of all main appview
