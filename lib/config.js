store = require('dot-file-config')('.dictionary-cli-npm');
store.data.requests = store.data.requests || {};

module.exports = store;
