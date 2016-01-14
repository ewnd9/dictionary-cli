# dictionary-cli

[![Build Status](https://travis-ci.org/ewnd9/dictionary-cli.svg?branch=master)](https://travis-ci.org/ewnd9/dictionary-cli)

> :warning: requires node >= 4.0

Translations and words usage examples via
[yandex translate api](https://tech.yandex.ru/translate/)
([supported languages](https://tech.yandex.ru/translate/doc/dg/concepts/langs-docpage/))
and
[yandex dictionary api](https://tech.yandex.ru/dictionary/)
([supported languages](https://dictionary.yandex.net/api/v1/dicservice/getLangs?key=dict.1.1.20140616T070444Z.ecfe60ba07dd3ebc.9ce897a05d9daa488b050e5ec030f625d666530a))

Export history to [memrise.com](http://www.memrise.com/) format

![Demonstration](/demo.gif?raw=true)

## Install

```
$ npm install -g dictionary-cli
```

## Usage

```
$ dictionary <lang-from> <lang-to> <input>

# if input matches /[a-zA-Z]/ it will translate from english to <lang>, otherwise from <lang> to english
dictionary --en=<lang> <input>
# if input matches /[а-яА-Я]/ it will translate from russian to <lang>, otherwise from <lang> to russian
dictionary --ru=<lang> <input>

$ dictionary <lang> --export
$ dictionary <lang> --export > history.txt
```

:shipit: Feel free to send PR for auto detection of other languages

## Tips

Add aliases for language pairs in your `.bashrc` / `.zshrc`

```
alias d="dictionary --en=ru" # use as "d <english or russian word or sentence>"
# or
alias d="dictionary en ru" # use as "d <english word or sentence>"
alias x="dictionary ru en" # use as "x <russian word or sentence>"
```

## Related

- https://github.com/AnkurGel/dictionary-rb

## Notices

Yandex demands
([1](https://tech.yandex.ru/translate/doc/dg/concepts/design-requirements-docpage/),
[2](https://tech.yandex.ru/dictionary/doc/dg/concepts/design-requirements-docpage/))
to put this in order to use their api

- «Реализовано с помощью сервиса «Яндекс.Словарь» https://tech.yandex.ru/dictionary/
- «Переведено «Яндекс.Переводчиком» http://translate.yandex.ru/

## License

MIT © [ewnd9](http://ewnd9.com)
