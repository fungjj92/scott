var fs = require('fs')

var $ = require('jquery-browserify')
  , _ = require('lodash')
  , Backbone = require('backbone')
  , Events = require('events')
  , footerTemplate = fs.readFileSync('templates/footer/footer.html')

var FooterView = Backbone.View.extend({
  el: '.footer',
  intialize: function () {
  },
  render: function () {
    $(this.el).html(footerTemplate);
  },
});

module.exports = FooterView;
