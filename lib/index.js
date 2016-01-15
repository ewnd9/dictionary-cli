import Yandex from './yandex';

const translateKey = 'trnsl.1.1.20131018T175412Z.6e9fa29e525b4697.3542f82ffa6916d1ccd64201d8a72c023892ae5e';
const dictionaryKey = 'dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a';

const yandex = new Yandex(
  process.env.YANDEX_TRANSLATE_KEY || translateKey,
  process.env.YANDEX_DICTIONARY_KEY || dictionaryKey
);

export const translate = (fromLang, toLang, text) => {
  const translateFn = (text) => yandex.translate(fromLang, toLang, text);
  const translateFallback = () => translateFn(text)
    .then(translate => {
      if (translate === text) {
        const result = yandex
          .spellCheck(fromLang, text)
          .then(onSpellResult);

        function onSpellResult(spellResult) {
          if (spellResult === text) {
            return { type: 'translate', result: translate };
          } else {
            return onSpellSuccess(spellResult);
          }
        };

        function onSpellSuccess(spellResult) {
          return translateFn(spellResult)
            .then(correctedTranslate => ({
              type: 'translate',
              result: correctedTranslate,
              corrected: translate !== correctedTranslate ? spellResult : undefined
            }));
        };

        return result;
      } else {
        return { type: 'translate', result: translate };
      }
    });

  const dictionary = () => yandex
    .dictionary(fromLang, toLang, text)
    .then(result => {
      if (result.length === 0) {
        return translateFallback();
      } else {
        return { type: 'dictionary', result: formatDictionary(result) }
      }
    });

  return dictionary().then(null, translateFallback);
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
