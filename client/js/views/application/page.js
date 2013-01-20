define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'leaflet',
  'text!templates/application/page.html',
  'models/application',
  'models/session',
  'helpers/auth',
  'helpers/parishes'
], function($, _, Backbone, Vm, L, applicationPageTemplate, ApplicationModel, SessionModel, auth, parishes){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      this.$model = new ApplicationModel({id: this.options.permitApplicationNumber})
      var page = this
      this.$model.fetch({
        success: function (collection, response, options) {
          var sessionModel = new SessionModel()
          sessionModel.fetch()
          page.$el.html(_.template(applicationPageTemplate, {
            application: page.$model,
            parishes: parishes,
            loggedIn: sessionModel.loggedIn()
          }))
          page.drawMap()
        }
      })
    },
    update: function (e) {
      var attributes = {}
      if (e.currentTarget.type == 'checkbox') {
        attributes[e.currentTarget.name] = e.currentTarget.checked + 0
      } else {
        attributes[e.currentTarget.name] = e.currentTarget.value
      }
      this.$model.save(attributes, { beforeSend: auth })
    },
    updateFlag: function (e) {
      var flagged = this.$model.get('flagged') === '1' ? '0' : '1'
      this.$model.save({'flagged': flagged}, {
        beforeSend: auth,
        success: function() {
          var textClass = flagged === '1' ? 'text-error' : 'muted'
          $('#flagged').attr('class', textClass)
        }
      })
    },
    drawMap: function() {
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        var osmAttrib='Map data (C) OpenStreetMap contributors'
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib})

        var longitude = this.$model.get('longitude') || -91.8360
        var latitude =  this.$model.get('latitude')  ||  31.0413

        // Zoom in more if we've alraedy specified the coordinates
        var zoom = this.$model.get('latitude') ? 10 : 7

        // Draw
        var map = L.map('map').setView([latitude, longitude], zoom).addLayer(osm)

        // Update on click
        var page = this
        map.on('click', function(e) {
            alert(e.latlng.lng)
            page.$model.save({
                latitude:   e.latlng.lat,
                longtitude: e.latlng.lng
            }, { beforeSend: auth })
        })
    },
    events: {
      "change input": "update",
      "change textarea": "update",
      "change select": "update",
      "click #flagged": "updateFlag"
    }
  })
  return ApplicationPage
});
