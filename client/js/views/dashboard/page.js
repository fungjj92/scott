define([
  'jquery',
  'lodash',
  'backbone',
  'leaflet',
  'collections/applications',
  'text!templates/dashboard/page.html'
], function($, _, Backbone, L, ApplicationsCollection, dashboardPageTemplate){
  var DashboardPage = Backbone.View.extend({
    el: '.page',
    collection: new ApplicationsCollection(),
    render: function () {
      $(this.el).html(dashboardPageTemplate)
      this.collection.fetch()
      this.drawMap()
    },
    drawMap: function() {
      var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      var osmAttrib='Map data (C) OpenStreetMap contributors'
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib})
      var map = L.map('map').setView([28, -89.5], 6).addLayer(osm)
      window.c = this.collection
      var i
      for (i in this.collection.models) {
        application = this.collection.models[i]
        console.log(application)
        if (application.get('latitude')) {
          var coords = [model.get('latitude'), model.get('longitude')]
          var radius = application.get('acreage')
     //   var color = {
     //     impact: 'red',
     //     mitigation: 'brown',
     //     restoration: 'green'
     //   }[application.get('type')]
     //   if (!color) {
     //       color = 'grey'
     //   }
          var circle = L.circle(coords, radius, {
     //       'color': color,
              color: 'black',
              opacity: 0,
              fillColor: 'black',
              fillOpacity: 0.5
          }).addTo(map)
        }
      })
    }
  });
  return DashboardPage;
});
