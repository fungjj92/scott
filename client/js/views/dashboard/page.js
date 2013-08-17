define([
  'jquery',
  'lodash',
  'backbone',
  'leaflet',
  'collections/applications',
  'text!templates/dashboard/page.html',
  'd3'
], function($, _, Backbone, L, ApplicationsCollection, dashboardPageTemplate, d3){

function createMap(){
  var xy = d3.geo.albersUsa();
  var svg = d3.select("#map").append("svg");
  svg.attr("id", "mainSVG")
    .attr("width", 460)
    .attr("height", 400)

  var perishes = svg.append("g")
    .attr("transform", function(d) { return "scale(5)"})
    .append('g')
      .attr("id", "perishes")
      .attr("transform", function(d) { return "translate(-532, -325)"})

  d3.json("/impacts.json", function(collection){
      data = collection;
      perishes.selectAll("path")
        .data(collection.features)
        .enter().append("path")
        .attr("d", d3.geo.path().projection(xy))
        .attr("fill", colorPicker)
  });

}

//Figures out the color of the perish
function colorPicker(parish){
  var prop = parish.properties.impacted_acres_prop_max
  var adj = 1.5
  return d3.rgb(((1 + prop) * 255)/adj, 255/adj, 255/adj)
}

  var DashboardPage = Backbone.View.extend({
    el: '.page',
    render: function () {
      $(this.el).html(dashboardPageTemplate)
      applicationsCollection = new ApplicationsCollection
      var page = this
      applicationsCollection.fetch({
        success: function(collection, response, options) {
          // OSM streets
          // var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          // var osmAttrib='Map data (C) OpenStreetMap contributors'
          // var tiles = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib})

          /*
          // MapQuest aerial
          var mapQuestUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png'
          var tiles = new L.TileLayer(mapQuestUrl, {minZoom: 5, maxZoom: 12, subdomains: '1234'})

          var map = L.map('map').setView([28, -89.5], 6).addLayer(tiles)
          */
          createMap()

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
