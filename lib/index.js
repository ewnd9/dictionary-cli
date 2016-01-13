var Promise = require('bluebird');

var translateKey = 'trnsl.1.1.20131018T175412Z.6e9fa29e525b4697.3542f82ffa6916d1ccd64201d8a72c023892ae5e';
var dictionaryKey = 'dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a';

module.exports.translate = function(fromLang, toLang, input) {
  return getDictionary(dictionaryKey, input, fromLang, toLang, 'en')
    .then(
      res => ({
        type: 'dictionary',
        result: formatDictionary(res)
      }),
      err => module.exports.getTranslation(translateKey, input, fromLang, toLang)
        .then(res => ({
            type: 'translate',
            result: res
          })
        )
    )
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

var joiner = function(array, delimiter) {
  return array.length > 0 ? '(' + array.join(' | ') + ')' : '';
};

var formatDictionaryTranslations = function(translation) {
  var synonyms = (translation.syn || []).map((syn) => syn.text);
  var means = (translation.mean || []).map((means) => means.text);

  return {
    translation: translation.text + ' ' + joiner(synonyms),
    means: means.join(' | '),
    examples: (translation.ex || []).map(function(ex) {
      var translations = ex.tr.map(_ => _.text);

      return {
        title: ex.text + ' ' + joiner(translations),
        text: ex.text,
        translations
      };
    })
  };
};

var formatDictionary = function(result) {
  return result.map(function(word) {
    return {
      title: word.text + ' [' + word.ts + '] (' + word.pos + ')',
      translations: word.tr.map(formatDictionaryTranslations)
    };
  });
};
