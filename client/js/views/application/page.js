define([
  'jquery',
  'lodash',
  'backbone',
  'vm',
  'leaflet',
  'text!templates/application/page.html',
  'text!templates/application/left.html',
  'text!templates/application/bottom.html',
  'text!templates/application/status.html',
  'models/application',
  'models/session',
  'helpers/auth',
  'helpers/parishes'
], function($, _, Backbone, Vm, L, applicationPageTemplate, applicationPageLeftTemplate, applicationPageBottomTemplate, applicationStatusTemplate, ApplicationModel, SessionModel, auth, parishes){
  var ApplicationPage = Backbone.View.extend({
    el: '.page',
    initialize: function(options) {
      this.$model = new ApplicationModel({id: options.permitApplicationNumber})
      this.$sessionModel = new SessionModel()
    },
    render: function () {
      var page = this
      page.$sessionModel.fetch()
      var params = {
        application: page.$model,
        parishes: parishes,
        loggedIn: page.$sessionModel.loggedIn(),
        reminderDate: page.reminderDate(21)
      }
      if (!page.$model.get('renderedStaticComponents')) {
        page.$el.html(_.template(applicationPageTemplate, params))
        page.$model.set('renderedStaticComponents', true)
        page.drawMap()
      }
      $('#left').html(_.template(applicationPageLeftTemplate, params))
      $('#bottom').html(_.template(applicationPageBottomTemplate, params))
      $('#status').html(_.template(applicationStatusTemplate, params))
    },
    update: function (e) {
      var attributes = {}
      if (e.currentTarget.type == 'checkbox') {
        attributes[e.currentTarget.name] = e.currentTarget.checked + 0
      } else {
        attributes[e.currentTarget.name] = e.currentTarget.value
      }
      $('#saving').fadeIn()
      this.$model.save(attributes, {
        patch: true,
        beforeSend: auth,
        success: function() {
          $('#saving').fadeOut()
        }
      })
      this.render()
    },
    updateFlag: function (e) {
      var flagged = this.$model.get('flagged') === '1' ? '0' : '1'
      $('#saving').fadeIn()
      this.$model.save({'flagged': flagged}, {
        patch: true,
        beforeSend: auth,
        success: function() {
          var textClass = flagged === '1' ? 'text-error' : 'muted'
          $('#flagged').attr('class', textClass)
          $('#saving').hide()
        }
      })
    },
    reminderDate: function(delay) {
      if (this.$model.get('reminderDate')) { 
        // Return the manually set reminder date if it exists.
        return this.$model.get('reminderDate')
      } else {
        // Add two weeks to the expiration date.
        var d = new Date(this.$model.get('expirationDate'))
        d.setTime(d.getTime() + delay)
        var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        return '' + d.getFullYear() + '-' + months[d.getMonth()] + '-' + d.getDate()
      }
    },
    drawMap: function() {
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        var osmAttrib='Map data (C) OpenStreetMap contributors'
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib})

        // Zoom in more if we've alraedy specified the coordinates
        if (this.$model.get('latitude')) {
            var longitude = this.$model.get('longitude')
            var latitude =  this.$model.get('latitude')
            var zoom = 11
        } else if (this.$model.get('parish')) {
            var parish = this.$model.get('parish')
            var lnglat = parishes.map(function(p) {
                if (p[0] != parish) {
                    return []
                } else {
                    return [p[3], p[2]]
                }
            }).reduce(function(a,b) { return a.concat(b) })
            var longitude = lnglat[0]
            var latitude =  lnglat[1]
            var zoom = 9
        } else {
            var longitude = -91.8360
            var latitude =   31.0413
            var zoom = 6
        }

        var markerIcon = L.icon({
           iconUrl: '/img/marker.png',
           shadowUrl: '/img/marker.png',
           
           iconSize:     [39, 39], // size of the icon
           shadowSize:   [39, 39], // size of the shadow
           iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
           shadowAnchor: [20, 20],  // the same for the shadow
           popupAnchor:  [ 0,  0] // point from which the popup should open relative to the iconAnchor
        });

        // Plot a point
        var plot = function(map, model) {
            var coords = [model.get('latitude'), model.get('longitude')]
            return L.marker(coords, { icon: markerIcon }).addTo(map)
        }

        // Draw
        var map = L.map('map').setView([latitude, longitude], zoom).addLayer(osm)

        // Plot the point if we have it.
        if (this.$model.get('latitude')) {
            this.point = plot(map, this.$model)
        }
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
