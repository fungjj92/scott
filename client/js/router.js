var $ = require('browserify-jquery')
  , _ = require('underscore')
  , Backbone = require('backbone')
  , Vm = require('vm')

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
    require(['views/dashboard/page'], function (DashboardPage) {
      var dashboardPage = Vm.create(appView, 'DashboardPage', DashboardPage)
      dashboardPage.render()
    })
  })
  router.on('route:applications', function () {
    require(['views/applications/page'], function (ApplicationsPage) {
      var applicationsPage = Vm.create(appView, 'ApplicationsPage', ApplicationsPage)
      applicationsPage.render()
    })
  })
  router.on('route:application', function (permitApplicationNumber) {
    require(['views/application/page'], function (ApplicationPage) {
      var applicationPage = Vm.create(appView, 'ApplicationPage', ApplicationPage, {permitApplicationNumber: permitApplicationNumber})
      applicationPage.$model.fetch({
        success: function(){
          applicationPage.render()
        }
      })
    })
  })
  Backbone.history.start()
}
module.exports = {
  initialize: initialize
}
