#!/usr/bin/env node

'use strict';

var credentialsPrompt = require('inquirer-credentials');

var translateCredential = {
  name: 'yandex-translate api key',
  type: 'input',
  hint: 'get it via https://tech.yandex.ru/translate/'
};

var dictionaryCredential = {
  name: 'yandex-dictionary api key',
  type: 'input',
  hint: 'get it via https://tech.yandex.ru/dictionary/'
};

var fromLangCredential = {
  name: 'default source language (2 symbols)',
  type: 'input'
};

var toLangCredential = {
  name: 'default translation language (2 symbols)',
  type: 'input'
};

var credentials = [
  translateCredential,
  dictionaryCredential,
  fromLangCredential,
  toLangCredential
];

credentialsPrompt('.yandex-translate-cli-npm', credentials).then(function(result) {
  var translateKey = result[translateCredential.name];
  var dictionaryKey = result[dictionaryCredential.name];

  var fromLang = result[fromLangCredential.name];
  var toLang = result[toLangCredential.name];

  var meow = require('meow');
  var cli = meow({
    help: [
      'Usage',
      '  yandex-translate <input>',
      '  yandex-translate <input> --from="en" --to="ru"',
      '',
      '  # translate from default destination language to default origin language',
      '  yandex-translate <input> --reverse',
    ]
  });

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

    lib.getDictionary(dictionaryKey, input, fromLang, toLang).then(function(result) {
      if (result.length === 0) {
        var translate = require('yandex-translate')(translateKey);

        translate.translate(input, { to: toLang }, function(err, res) {
          var _ = require('lodash');

          _.each(res.text, function(translation) {
            console.log(translation);
          });
        });
      } else {
        lib.printDictionary(result);
      }
    });

  }
});
