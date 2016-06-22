# dictionary-cli

[![Build Status](https://travis-ci.org/ewnd9/dictionary-cli.svg?branch=master)](https://travis-ci.org/ewnd9/dictionary-cli)
[![Coverage Status](https://coveralls.io/repos/ewnd9/dictionary-cli/badge.svg?branch=master&service=github)](https://coveralls.io/github/ewnd9/dictionary-cli?branch=master)

Translations, usage examples and spell check via
- [yandex translate api](https://tech.yandex.ru/translate/)
([supported languages](https://tech.yandex.ru/translate/doc/dg/concepts/langs-docpage/))
- [yandex dictionary api](https://tech.yandex.ru/dictionary/)
([supported languages](https://dictionary.yandex.net/api/v1/dicservice/getLangs?key=dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a))

Export history to [memrise.com](http://www.memrise.com/) format

![Demonstration](/demo.gif?raw=true)

## Install

```sh
$ npm install -g dictionary-cli
```

## Usage

```sh
$ dictionary <lang-from> <lang-to> <input>

# if input matches /[a-zA-Z]/ it will translate from english to <lang>, otherwise from <lang> to english
$ dictionary --en=<lang> <input>
# if input matches /[а-яА-Я]/ it will translate from russian to <lang>, otherwise from <lang> to russian
$ dictionary --ru=<lang> <input>

$ dictionary <lang> --export
$ dictionary <lang> --export > history.txt
```

:shipit: Feel free to send PR for auto detection of other languages

## Tips

Add aliases for language pairs in your `.bashrc` / `.zshrc`

```sh
alias d="dictionary --en=ru" # use as "d <english or russian word or sentence>"
# or
alias d="dictionary en ru" # use as "d <english word or sentence>"
alias x="dictionary ru en" # use as "x <russian word or sentence>"
```

## Related

- [dictionary-rb](https://github.com/AnkurGel/dictionary-rb) - Provides meanings, similar words and usage examples for a word from Urban Dictionary and Dictionary Reference with CLI support

- [traktor](https://github.com/d4rkr00t/traktor) - CLI for Yandex.Translator API + Yandex.Dictionary API

## Notices

Yandex demands
([1](https://tech.yandex.ru/translate/doc/dg/concepts/design-requirements-docpage/),
[2](https://tech.yandex.ru/dictionary/doc/dg/concepts/design-requirements-docpage/))
to put this in order to use their api

- «Реализовано с помощью сервиса «Яндекс.Словарь» https://tech.yandex.ru/dictionary/
- «Переведено «Яндекс.Переводчиком» http://translate.yandex.ru/

## License

MIT © [ewnd9](http://ewnd9.com)
