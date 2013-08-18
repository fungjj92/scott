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
    .attr("width", '100%')
    .attr("height", 400)

  var parishes = svg.append("g")
    .attr("transform", function(d) { return "scale(8.5)"})
    .append('g')
      .attr("id", "parishes")
      .attr("transform", function(d) { return "translate(-527, -360)"})

  d3.json("/impacts.json", function(collection){
    collection.features.sort(function(a, b) { return b.properties.impacted_acres_prop_max - a.properties.impacted_acres_prop_max })
    data = collection;

    var permitApplications = collection.features.map(function(a){
      return a.properties.applications
    }).reduce(function(a, b){
      return a.concat(b)
    })
    permitApplications.sort(function(a, b) { return b.acreage - a.acreage })

    d3.select("#barplot").selectAll('div.bar')
      .data(permitApplications)
      .enter()
      .append("div")
      .attr("class", "bar")
      .attr("title", function(permitApplication) { return permitApplication.projectDescription })
      .style("width", (100 / permitApplications.length) + '%')
      .style("height", function(permitApplication) {
          var barHeight = Math.max(1, permitApplication.acreage / 10);
          return Math.round(barHeight) + "px";
      })
      .style("margin-top", function(permitApplication) {
          var barHeight = Math.max(1, permitApplication.acreage / 10);
          return (240 - Math.round(barHeight)) + "px";
      });

    parishes.selectAll("path")
      .data(collection.features)
      .enter().append("path")
      .attr("d", d3.geo.path().projection(xy))
      .attr("fill", colorPicker)

  });

}

//Figures out the color of the parish
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
