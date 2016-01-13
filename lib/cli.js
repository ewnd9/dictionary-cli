const store = require('dot-file-config')('.dictionary-cli-npm', {
	cloudSync: false
});

store.data.requests = store.data.requests || {};

const meow = require('meow');
const cli = meow({
  pkg: './../package.json',
  help: [
    'Usage',
    '  dictionary <lang-from> <lang-to> <input>',
    '  dictionary <lang> --export',
    '  dictionary <lang> --export > history.txt',
    '',
    'Data',
    '  ' + store.path
  ]
});

const p = console.log.bind(console);

if (cli.flags.export && cli.input.length !== 1 || !cli.flags.export && cli.input.length < 3) {
  cli.showHelp();
} else if (cli.flags.export) {
  const result = require('./exporter').default(store.data.requests, cli.input[0]);
  require('lodash/collection/shuffle')(result).forEach(function(word) {
    p(word);
  });
} else {
  const fromLang = cli.input[0];
  const toLang = cli.input[1];
  const input = cli.input.slice(2).join(' ');

  const lib = require('./index');

  lib
    .translate(fromLang, toLang, input)
    .then(({ type, result }) => {
      if (type === 'dictionary') {
        result.forEach(r => {
          p(r.title);

          r.translations.forEach(r => {
            if (r.means) {
							p(' - ' + r.means);
						}

            p(' - ' + r.translation);

            r.examples.forEach(r => {
              p(' -- ' + r.title);
            });
          });
        });
      } else {
        p(result.join(' '));
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
