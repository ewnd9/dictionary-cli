import test from 'ava';
import 'babel-core/register';

import path from 'path';
import concatStream from 'concat-stream';
import { spawn } from 'child_process';

import { translate } from './../src/index';
import format from './../src/exporter';

test('#translate dictionary', async t => {
  const { type, result } = await translate('en', 'ru', 'java');

  t.is(type, 'dictionary');
  t.is(result.length, 4);

  t.is(typeof result[0], 'object');
  t.is(result[0].title, 'noun (ˈʤɑːvə)');

  t.is(result[0].translations.length, 1);
  t.is(result[0].translations[0].examples.length, 1);
});

test('#translate translate', async t => {
  const { type, result } = await translate('ru', 'en', 'словарь может переводить только слова');
  t.is(type, 'translate');

  t.is(typeof result, 'string');
  t.is(result, 'dictionary can translate only words');
});

test('#format', async t => {
  const response = await translate('en', 'ru', 'test');
  const mock = {
    ...response,
    fromLang: 'en',
    toLang: 'ru'
  };

  const data = format([mock], 'en');
  t.truthy(data[0].length > 0);
});

const exec = (args, output) => {
  const concat = concatStream(output);

  const cp = spawn(path.resolve(__dirname, 'fixtures', 'cli.es6.js'), args);
  cp.stdout.setEncoding('utf8');
  cp.stdout.pipe(concat);
};

test.cb('cli stdin/stdout default en-ru', t => {
  exec(['en', 'ru', 'u'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});

test.cb('cli stdin/stdout spell correction en-ru', t => {
  exec(['en', 'ru', 'powir'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});

test.cb('cli stdin/stdout en detection en-ru', t => {
  exec(['--en=ru', 'u'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});

test.cb('cli stdin/stdout en detection ru-en', t => {
  exec(['--en=ru', 'привет'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});

test.cb('cli stdin/stdout ru detection en-ru', t => {
  exec(['--ru=en', 'u'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});

test.cb('cli stdin/stdout ru detection ru-en', t => {
  exec(['--ru=en', 'привет'], str => {
    t.truthy(str.length > 0);
    t.end();
  });
});
