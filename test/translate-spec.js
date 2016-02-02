import test from 'ava';
import 'babel-core/register';

import path from 'path';
import concatStream from 'concat-stream';
import { spawn } from 'child_process';

import { translate } from './../lib/index';
import format from './../lib/exporter';

test('#translate dictionary', async t => {
	const { type, result } = await translate('en', 'ru', 'java');

	t.is(type, 'dictionary');
	t.is(result.length, 4);

	t.is(typeof result[0], 'object');
	t.is(result[0].title, 'noun (ˈʤɑːvə)');

	t.is(result[0].translations.length, 1);
	t.is(result[0].translations[0].examples.length, 0);
});

test('#translate translate', async t => {
	const { type, result } = await translate('ru', 'en', 'словарь может переводить только слова');
	t.is(type, 'translate');

	t.is(typeof result, 'string');
	t.is(result, 'the dictionary can only translate the words');
});

test('#format', async t => {
	const response = await translate('en', 'ru', 'test');
	const mock = {
		...response,
		fromLang: 'en',
		toLang: 'ru'
	};

	const data = format([mock], 'en');
	t.is(data[0], 'клиническое испытание\tclinical test');
});

const exec = (args, output) => {
	const concat = concatStream(output);

	const cp = spawn(path.resolve(__dirname, '..', 'cli.es6.js'), args);
	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concat);
};

test.cb('cli stdin/stdout default en-ru', t => {
	exec(['en', 'ru', 'u'], str => {
		t.ok(/ед/.test(str));
		t.end();
	});
});

test.cb('cli stdin/stdout spell correction en-ru', t => {
	exec(['en', 'ru', 'powir'], str => {
		t.ok(/nothing found.+power/g.test(str));
		t.end();
	});
});

test.cb('cli stdin/stdout en detection en-ru', t => {
	exec(['--en=ru', 'u'], str => {
		t.ok(/ед/.test(str));
		t.end();
	});
});

test.cb('cli stdin/stdout en detection ru-en', t => {
	exec(['--en=ru', 'привет'], str => {
		t.ok(/приветствие/g.test(str));
		t.end();
	});
});

test.cb('cli stdin/stdout ru detection en-ru', t => {
	exec(['--ru=en', 'u'], str => {
		t.ok(/ед/.test(str));
		t.end();
	});
});

test.cb('cli stdin/stdout ru detection ru-en', t => {
	exec(['--ru=en', 'привет'], str => {
		t.ok(/приветствие/g.test(str));
		t.end();
	});
});
