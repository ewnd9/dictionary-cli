var Promise = require('bluebird');
var _ = require('lodash');

var joiner = function(prefix, array, delimiter, postfix) {
  return array.length > 0 ? prefix + array.join(delimiter) + postfix : '';
};

module.exports.getTranslation = function(translateKey, input, fromLang, toLang) {
  var translateLib = require('yandex-translate')(translateKey);
  var translate = Promise.promisify(translateLib.translate);

  return translate(input, { to: toLang }).then(function(res) {
    if (res.text.length === 1 && res.text[0] === input) {
      throw new Error('no translation');
    } else {
      return res.text;
    }
  });
};

var getDictionary = module.exports.getDictionary = function(dictionaryKey, input, fromLang, toLang, uiLang) {
  var yandexDictionary = require('yandex-dictionary')(dictionaryKey);
  var lookup = Promise.promisify(yandexDictionary.lookup);

  return lookup(input, fromLang + '-' + toLang, { ui: uiLang, flags: 1 }).then(function(res) {
    if (res.def.length === 0) {
      throw new Error('empty-result');
    } else {
      return res.def;
    }
  });
};

var printDictionary = module.exports.printDictionary = function(result) {
  _.each(result, function(word) {
    console.log(word.text + ' [' + word.ts + '] (' + word.pos + ')');

    _.each(word.tr, function(translation) {
      var synonyms = _.map(translation.syn, function(syn) {
        return syn.text;
      });
      var means = _.map(translation.mean, function(means) {
        return means.text;
      })

      var output = ' - ' + translation.text;
      output += joiner(' (', synonyms, ' | ', ')');
      output += joiner(' (', means, ' | ', ')');

      var exs = _.map(translation.ex, function(ex) {
        var translations = _.map(ex.tr, function(translation) {
          return translation.text;
        });

        return ' -- ' + ex.text + ' ' + joiner(' (', translations, ', ', ')');
      });

      // console.log(JSON.stringify(translation, null, 4));
      console.log(output);
      _.each(exs, function(ex) {
        console.log(ex)
      });

      console.log();
    });
  });
};
