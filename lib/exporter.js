module.exports = function(fromLang, toLang, mode) {
  var config = require('./config');
  var _ = require('lodash');

  var result = [];

  _.each(config.data.requests, (function(response, date) {
    _.each(response.result, function(entry) {
      _.each(entry.tr, function(translation) {
        _.each(translation.ex, function(example) {
          var origin = example.text;
          var translation = example.tr[0].text;

          var isRuLang = origin.toLowerCase()[0] >= 'а' && origin.toLowerCase()[0] <= 'я';

          if (isRuLang) {
            result.push(translation + "\t" + origin);
          } else {
            result.push(origin + "\t" + translation);
          }
        });
      });
    });
  }));

  _.shuffle(result).forEach(function(word) {
    console.log(word);
  });
};
