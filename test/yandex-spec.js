import test from 'ava';
import 'babel-core/register';

import Yandex from './../src/yandex';

const translateKey = 'trnsl.1.1.20131018T175412Z.6e9fa29e525b4697.3542f82ffa6916d1ccd64201d8a72c023892ae5e';
const dictionaryKey = 'dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a';

const yandex = new Yandex(translateKey, dictionaryKey);

test('#translate', async t => {
  const result = await yandex.translate('en', 'ru', 'java');
  t.same(result, 'ява');
});

test('#dictionary', async t => {
  const result = await yandex.dictionary('en', 'ru', 'java');
  t.is(result[0].text, 'java');
});

test('#spellCheck', async t => {
  const result = await yandex.spellCheck('en', 'continious powir');
  t.is(result, 'continuous power');
});
