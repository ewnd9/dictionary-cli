var _ = require('lodash');

module.exports = function(requests, lang) {
  var result = [];
  _.each(requests, function(response) {
    if (response.type !== 'dictionary' || response.fromLang !== lang) {
      return;
    }

    response.result.forEach(function(entry) {
      entry.translations.forEach(function(translation) {
        translation.examples.forEach(function(example) {
          var origin = example.text;
          var translation = example.translations[0];

          result.push(translation + "\t" + origin);
        });
      });
    });
  });

  return result;
};
