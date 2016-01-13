#!/usr/bin/env node

var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({ pkg: pkg }).notify();

require('./lib/cli');
