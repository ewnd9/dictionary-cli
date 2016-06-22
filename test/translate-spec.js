import test from 'ava';
import 'babel-core/register';

import path from 'path';
import getStream from 'get-stream';
import { spawn } from 'child_process';

import { translate } from './../src/index';

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

const exec = args => {
  const cp = spawn(path.resolve(__dirname, 'fixtures', 'cli.es6.js'), args);
  cp.stdout.setEncoding('utf8');
  cp.stderr.setEncoding('utf8');

  return Promise
    .all([
      getStream(cp.stdout),
      getStream(cp.stderr)
        .then(res => {
          if (res.length > 0) {
            throw new Error(res);
          }
        })
    ])
    .then(([ stdout, stderr ]) => stdout);
};

test('cli stdin/stdout default en-ru', async t => {
  const str = await exec(['en', 'ru', 'u']);
  t.truthy(str.length > 0);
});

test('cli stdin/stdout spell correction en-ru', async t => {
  const str = await exec(['en', 'ru', 'powir']);
  t.truthy(str.length > 0);
});

test('cli stdin/stdout en detection en-ru', async t => {
  const str = await exec(['--en=ru', 'u']);
  t.truthy(str.length > 0);
});

test('cli stdin/stdout en detection ru-en', async t => {
  const str = await exec(['--en=ru', 'привет']);
  t.truthy(str.length > 0);
});

test('cli stdin/stdout ru detection en-ru', async t => {
  const str = await exec(['--ru=en', 'u']);
  t.truthy(str.length > 0);
});

test('cli stdin/stdout ru detection ru-en', async t => {
  const str = await exec(['--ru=en', 'привет']);
  t.truthy(str.length > 0);
});
