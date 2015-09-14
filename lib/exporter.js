module.exports = function(mode) {
  var config = require('./config');
  var _ = require('lodash');

  _.each(config.data.requests, (function(responses, date) {
    _.each(responses.result, function(entry) {
      _.each(entry.tr, function(translation) {
        _.each(translation.ex, function(example) {
          var text = example.text;
          var translation = example.tr[0].text;

          console.log(text + "\t" + translation);
        });
      });
    });
  }));
};
