require.config(
  paths:
    jquery: 'libs/jquery/jquery-min'
    underscore: 'libs/underscore/underscore-min'
    lodash: 'libs/lodash/lodash-min'
    backbone: 'libs/backbone/backbone-min'
    localstorage: 'libs/backbone.localStorage/backbone.localStorage-min'
    leaflet: 'libs/leaflet/leaflet'

    text: 'libs/require/text'
    jade: 'libs/jade/jade'

    templates: '../templates'

  shim:
    leaflet:
      exports: 'L'
    backbone:
      require: ['lodash']
      exports: 'Backbone'
)

require [
  'jquery',
  'lodash',
  'backbone',
  'text!templates/layout.html',
], ($, _, Backbone, layoutTemplate) ->
  AppView = Backbone.View.extend(
    el: '.container'
    initialize: (options) ->
      @.views = {}

    renderFirst: (firstPage, options) ->

      # Page layout
      @.session = new SessionModel

      ($ @.el).html(layoutTemplate)

      require ['views/header/menu'], (HeaderMenuView) ->
        @.views.headerMenuView = new HeaderMenuView
        @.session.fetch
          success: @.views.headerMenuView.render @.session

      require ['views/footer/footer'], (FooterMenuView) ->
        @.views.footerMenuView = new FooterMenuView
        @.views.footerMenuView.render()

    anticipate: (callback) ->
      # Different pages
      require [
        'cs!collections/permits'
      ], (PermitsCollection) ->
        if !@.permits
          @.permits = new PermitsCollection

        if !@.permits.recent()
          @.permits.fetch(
            success: callback
          )

  AppRouter = Backbone.Router.extend(
    routes:
      # List of applications
      'permits': 'permits',

      # Everything about one permit
      'permits/:permitApplicationNumber': 'permit',

      # Homepage/dashboard for everything else
      '*actions': 'defaultAction'
  )

  app = new AppView
  router = new AppRouter

  router.on 'route:defaultAction', (actions) ->
    require ['views/dashboard/page'] (DashboardPage) ->
      new DashboardPage
      dashboardPage.render app

  router.on 'route:permits', () ->
    require ['views/permits/page'], (PermitsPage) ->
      permitsPage = new PermitsPage
      permitsPage.render app

  router.on 'route:permit', (permitApplicationNumber) ->
    require ['views/permit/page'], (permitPage) ->
      permitPage = new PermitPage, {permitApplicationNumber: permitApplicationNumber}
      permitPage.$model.fetch(
        success: () ->
          applicationPage.render app # Select the particular model
      )

  Backbone.history.start()
