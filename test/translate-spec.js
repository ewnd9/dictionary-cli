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
	t.is(result.length, 2);

	t.is(typeof result[0], 'object');
	t.is(result[0].title, 'Java [ˈʤɑːvə] (noun)');

	t.is(result[0].translations.length, 2);
	t.is(result[0].translations[0].examples.length, 0);
});

test('#translate translate', async t => {
	const { type, result } = await translate('ru', 'en', 'освободившаяся');

	t.is(type, 'translate');
	t.is(result.length, 1);

	t.is(typeof result[0], 'string');
	t.is(result[0], 'released');
});

test('#format', async t => {
	const response = await translate('en', 'ru', 'test');
	const mock = {
		...response,
		fromLang: 'en',
		toLang: 'ru'
	};

	const data = format([mock], 'en');
	t.is(data[0], 'суровое испытание\tseverest test');
});

test.cb('cli stdin/stdout', t => {
	const concat = concatStream(str => {
		t.ok(/ед/.test(str));
		t.end();
	});

	const cp = spawn(path.resolve(__dirname, '..', 'cli.js'), ['en', 'ru', 'u']);
	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concat);
});
