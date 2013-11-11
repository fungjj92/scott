var $ = require('jquery-browserify')
  , _ = require('underscore')
  , Backbone = require('backbone')
  , Vm = require('./vm')
  , DashboardPage = require('./views/dashboard/page')
  , ApplicationsPage = require('./views/applications/page')
  , ApplicationPage = require('./views/application/page')

var AppRouter = Backbone.Router.extend({
  routes: {
    // List of applications
    'applications': 'applications',

    // Everything about one application
    'applications/:permitApplicationNumber': 'application',

    // Homepage/dashboard for everything else
    '*actions': 'defaultAction'
  }
})

var initialize = function(options){
  var appView = options.appView
  var router = new AppRouter(options)
  router.on('route:defaultAction', function (actions) {
    var dashboardPage = Vm.create(appView, 'DashboardPage', DashboardPage)
    dashboardPage.render()
  })
  router.on('route:applications', function () {
    var applicationsPage = Vm.create(appView, 'ApplicationsPage', ApplicationsPage)
    applicationsPage.render()
  })
  router.on('route:application', function (permitApplicationNumber) {
    var applicationPage = Vm.create(appView, 'ApplicationPage', ApplicationPage, {permitApplicationNumber: permitApplicationNumber})
    applicationPage.$model.fetch({
      success: function(){
        applicationPage.render()
      }
    })
  })
  Backbone.history.start()
}
module.exports = {
  initialize: initialize
}
