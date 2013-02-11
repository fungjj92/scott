define([
  'jquery',
  'lodash',
  'bb',
  'leaflet',
  'collections/applications',
  'text!templates/dashboard/page.html'
], function($, _, Backbone, L, ApplicationsCollection, dashboardPageTemplate){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      $(this.el).html(dashboardPageTemplate)
      applicationsCollection = new ApplicationsCollection
      var page = this
      applicationsCollection.fetch({
        success: function(collection, response, options) {
          var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          var osmAttrib='Map data (C) OpenStreetMap contributors'
          var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib})
          var map = L.map('map').setView([28, -89.5], 6).addLayer(osm)
          var i
          for (i in collection.models) {
            application = collection.models[i]
            if (application.get('latitude')) {
              var coords = [
                application.get('latitude'),
                application.get('longitude')
              ]
              // Convert to square meters and then to radius
              var tau = 6.283185
              var radius = Math.pow( (application.get('acreage')  * 4046.86) / (0.5 * tau), 0.5 )
              var adjustment = 100
              var color = {
                impact: 'red',
                mitigation: 'brown',
                restoration: 'green'
              }[application.get('type')]
              if (!color) {
                  color = 'grey'
              }
              var circle = L.circle(coords, radius * adjustment, {
                  color: 'black',
                  opacity: 0,
                  fillColor: color,
                  fillOpacity: 0.5
              }).addTo(map)
            }
          }
        }
      })
    }
  })
  return DashboardPage
});
