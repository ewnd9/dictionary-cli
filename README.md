# dictionary-cli

[![Build Status](https://travis-ci.org/ewnd9/dictionary-cli.svg?branch=master)](https://travis-ci.org/ewnd9/dictionary-cli)

Translations and words usage examples via [yandex translate api](https://tech.yandex.ru/translate/)
and
[yandex dictionary api](https://tech.yandex.ru/dictionary/)

Export history to [memrise.com](http://www.memrise.com/) format

![Demonstration](/demo.gif?raw=true)

## Install

```
$ npm install -g dictionary-cli
```

## Usage

```
$ dictionary <lang-from> <lang-to> <input>
$ dictionary <lang> --export
$ dictionary <lang> --export > history.txt
```

## Tips

Add aliases for language pairs in your `.bashrc` / `.zshrc`. Example:

```
alias d="dictionary en ru" # use as "d word"
alias в="dictionary ru en" # use as "в слово"
```

## Related

- https://github.com/AnkurGel/dictionary-rb

## License

MIT © [ewnd9](http://ewnd9.com)
