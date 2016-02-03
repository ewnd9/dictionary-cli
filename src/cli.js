const store = require('dot-file-config')('.dictionary-cli-npm');
store.data.requests = store.data.requests || {};

const meow = require('meow');
const chalk = require('chalk');

const cli = meow({
  pkg: './../package.json',
  help: [
    'Usage',
    '  dictionary <lang-from> <lang-to> <input>',
    '',
    '  # if input match /[a-zA-Z]/ it will translate from english to <lang>, otherwise from <lang> to english',
    '  dictionary --en=<lang> <input>',
    '  # if input match /[а-яА-Я]/ it will translate from russian to <lang>, otherwise from <lang> to russian',
    '  dictionary --ru=<lang> <input>',
    '',
    '  dictionary <lang> --export',
    '  dictionary <lang> --export > history.txt',
    '',
    'Data',
    '  ' + store.path
  ]
});

const p = console.log.bind(console);

let fromLang;
let toLang;
let input;

const setupLangs = (lang, regEx) => {
  input = cli.input.join(' ');

  if (regEx.test(input)) {
    fromLang = lang;
    toLang = cli.flags[lang];
  } else {
    fromLang = cli.flags[lang];
    toLang = lang;
  }
};

if (cli.flags.en) {
  setupLangs('en', /[a-zA-Z]+/);
} else if (cli.flags.ru) {
  setupLangs('ru', /[а-яА-Я]+/);
} else {
  input = cli.input.slice(2).join(' ');
}

if (cli.flags.export && cli.input.length !== 1 || !cli.flags.export && input.length === 0) {
  cli.showHelp();
} else if (cli.flags.export) {
  const result = require('./exporter').default(store.data.requests, cli.input[0]);
  require('lodash/collection/shuffle')(result).forEach(function(word) {
    p(word);
  });
} else {
  fromLang = fromLang || cli.input[0];
  toLang = toLang || cli.input[1];

  const lib = require('./index');
  const space = require('lodash/string/repeat').bind(null, ' ');
  const u = chalk.underline;

  lib
    .translate(fromLang, toLang, input)
    .then(({ type, result, corrected }) => {
      if (corrected) {
        p(`\nnothing found by "${u(input)}", corrected to "${u(corrected)}"\n`)
      }

      if (type === 'dictionary') {
        result.forEach(r => {
          p(`${u(r.pos)} ${r.ts ? '(' + r.ts + ')' : ''}`);
          r.translations.forEach(printTranslations);
        });

        function printTranslations(r, i) {
          p(`${space(2)}- ${u(r.translation)} ${r.synonyms ? r.synonyms + ' ' : ''}${r.means}`);
          r.examples.forEach(r => p(`${space(4)}-- ${r.title}`));
        };
      } else {
        p(result);
      }

      store.data.requests[new Date().toString()] = {
        input,
        fromLang,
        toLang,
        result,
        type
      };

      store.save();
    })
    .catch(err => {
      if (err.message === 'no translation') {
        console.log('no translation');
      } else {
        throw err;
      }
    });
}
