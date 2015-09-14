# dictionary-cli

[![Build Status](https://travis-ci.org/ewnd9/dictionary-cli.svg?branch=master)](https://travis-ci.org/ewnd9/dictionary-cli)

Translations and words usage examples via [yandex translate api](https://tech.yandex.ru/translate/)
and
[yandex dictionary api](https://tech.yandex.ru/dictionary/)

Also history management with export to [memrise.com](http://www.memrise.com/) format

![Demonstration](/demo.gif?raw=true)

## API access

You need to obtain api keys to yandex services in order to use this package

## Install

```
$ npm install -g dictionary-cli
```

## Usage

```
  Usage
    dictionary <input>
    dictionary <input> --from="en" --to="ru"
    dictionary --export > history.txt
```

## Similar projects

- https://github.com/AnkurGel/dictionary-rb

## License

MIT © [ewnd9](http://ewnd9.com)
