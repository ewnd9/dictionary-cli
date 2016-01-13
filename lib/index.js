import Promise from 'bluebird';

const translateKey = 'trnsl.1.1.20131018T175412Z.6e9fa29e525b4697.3542f82ffa6916d1ccd64201d8a72c023892ae5e';
const dictionaryKey = 'dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a';

export const translate = (fromLang, toLang, input) => {
  return getDictionary(dictionaryKey, input, fromLang, toLang, 'en')
    .then(
      res => ({
        type: 'dictionary',
        result: formatDictionary(res)
      }),
      err => getTranslation(translateKey, input, fromLang, toLang)
        .then(res => ({
            type: 'translate',
            result: res
          })
        )
    )
};

export const getTranslation = (translateKey, input, fromLang, toLang) => {
  const translateLib = require('yandex-translate')(translateKey);
  const translate = Promise.promisify(translateLib.translate);

  return translate(input, { to: toLang })
    .then(function(res) {
      if (res.text.length === 1 && res.text[0] === input) {
        throw new Error('no translation');
      } else {
        return res.text;
      }
    });
};

export const getDictionary = (dictionaryKey, input, fromLang, toLang, uiLang) => {
  const yandexDictionary = require('yandex-dictionary')(dictionaryKey);
  const lookup = Promise.promisify(yandexDictionary.lookup);

  return lookup(input, fromLang + '-' + toLang, { ui: uiLang, flags: 1 })
    .then(function(res) {
      if (res.def.length === 0) {
        throw new Error('empty-result');
      } else {
        return res.def;
      }
    });
};

const joiner = (array, delimiter) => {
  return array.length > 0 ? '(' + array.join(' | ') + ')' : '';
};

const formatDictionaryTranslations = (translation) => {
  const synonyms = (translation.syn || []).map((syn) => syn.text);
  const means = (translation.mean || []).map((means) => means.text);

  return {
    translation: translation.text + ' ' + joiner(synonyms),
    means: means.join(' | '),
    examples: (translation.ex || []).map(function(ex) {
      const translations = ex.tr.map(_ => _.text);

      return {
        title: ex.text + ' ' + joiner(translations),
        text: ex.text,
        translations
      };
    })
  };
};

const formatDictionary = (result) => {
  return result.map(word => ({
    title: word.text + ' [' + word.ts + '] (' + word.pos + ')',
    translations: word.tr.map(formatDictionaryTranslations)
  }));
};
