import { each, uniq } from 'lodash';

export default (requests, lang) => {
  const result = [];

  each(requests, response => {
    if (response.type !== 'dictionary' || response.fromLang !== lang) {
      return;
    }

    response.result.forEach(entry => {
      entry.translations.forEach(translation => {
        translation.examples.forEach(example => {
          const origin = example.text;
          const translation = example.translations[0];

          result.push(translation + "\t" + origin);
        });
      });
    });

  });

  return uniq(result);
};
