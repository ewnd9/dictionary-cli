#!/usr/bin/env node

'use strict';

var credentialsPrompt = require('inquirer-credentials');

var translateCredential = {
  name: 'yandex-translate api key',
  type: 'input',
  hint: 'get it via https://tech.yandex.ru/translate/',
  env: 'YANDEX_TRANSLATE_KEY'
};

var dictionaryCredential = {
  name: 'yandex-dictionary api key',
  type: 'input',
  hint: 'get it via https://tech.yandex.ru/dictionary/',
  env: 'YANDEX_DICTIONARY_KEY'
};

var fromLangCredential = {
  name: 'default source language (2 symbols)',
  type: 'input',
  env: 'FROM_LANG'
};

var toLangCredential = {
  name: 'default translation language (2 symbols)',
  type: 'input',
  env: 'TO_LANG'
};

var interfaceCredential = {
  name: 'interface language (2 symbols)',
  type: 'input',
  env: 'INTERFACE_LANG'
};

var historyCredential = {
  name: 'save history (yes or no)',
  type: 'input',
  env: 'SAVE_HISTORY'
};

var credentials = [
  translateCredential,
  dictionaryCredential,
  fromLangCredential,
  toLangCredential,
  interfaceCredential,
  historyCredential
];

credentialsPrompt('.dictionary-cli-credentials-npm', credentials).then(function(result) {
  var translateKey = result[translateCredential.name];
  var dictionaryKey = result[dictionaryCredential.name];

  var fromLang = result[fromLangCredential.name];
  var toLang = result[toLangCredential.name];

  var uiLang = result[interfaceCredential.name];

  var saveHistory = result[historyCredential.name];

  var store = null;
  if (saveHistory === 'yes') {
    store = require('./config');
  }

  var meow = require('meow');
  var cli = meow({
    pkg: './../package.json',
    help: [
      'Usage',
      '  dictionary <input>',
      '  dictionary <input> --from="en" --to="ru"',
      '  dictionary --export > history.txt',
      '',
      'Data',
      '  ' + (store || {}).path
    ]
  });

  if (cli.flags.export) {
    if (store) {
      require('./exporter')();
    } else {
      console.log('history is disabled');
    }
    return;
  }

  var input = cli.input.join(' ').trim();

  if (cli.flags.from) {
    fromLang = cli.flags.from;
  }

  if (cli.flags.to) {
    toLang = cli.flags.to;
  }

  if (cli.flags.reverse) {
    var swap = fromLang;
    fromLang = toLang;
    toLang = swap;
  }

  if (input.length === 0) {
    cli.showHelp();
  } else {
    var lib = require('./index');

    var dictionary = function(fromLang, toLang) {
      return lib.getDictionary(dictionaryKey, input, fromLang, toLang, uiLang);
    };

    var translate = function(fromLang, toLang) {
      return lib.getTranslation(translateKey, input, fromLang, toLang);
    };

    var log = function(reverse, fromLang, toLang, result) {
      if (!store) {
        return;
      }

      store.data.requests[new Date().toString()] = {
        input: input,
        fromLang: fromLang,
        toLang: toLang,
        reverse: reverse,
        result: result
      };
      store.save();
    };

    var reverse = false;

    return dictionary(fromLang, toLang).then(null, function(err) {
      reverse = true;
      return dictionary(toLang, fromLang);
    }).then(function(result) {
      lib.printDictionary(result);
      log(reverse, fromLang, toLang, result);
    }, function(err) {
      return translate(fromLang, toLang).then(function(result) {
        reverse = false;
        return result;
      }, function(err) {
        reverse = true;
        return translate(toLang, fromLang);
      }).then(function(result) {
        log(reverse, fromLang, toLang, result);
        console.log(result.join('\n'));
      });
    }).catch(function(err) {
      if (err.message === 'no translation') {
        console.log('no translation');
      } else {
        throw err;
      }
    });
  }
});
