var tp = require('tedious-promises');
var dbConfig = require('./config.json');
var TYPES = require('tedious').TYPES;
tp.setConnectionConfig(dbConfig); // global scope

module.exports = tp 