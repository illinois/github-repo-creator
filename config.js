const Hjson = require('hjson');
const fs = require('fs');
const _ = require('lodash');

const REQUIRED_KEYS = ['id', 'shortname', 'name', 'token', 'org'];

// The first time this module is loaded, we'll load the config
// The path to a config file can be set with the CONFIG_PATH environment
// variable; if that's not set, it defaults to looking for ./config.hjson

const configPath = process.env.CONFIG_PATH || './config.hjson';
const configData = fs.readFileSync(configPath, 'utf8');
const config = Hjson.parse(configData);

// Simple validation of the config
_.each(config.courses, (course) => {
    _.each(REQUIRED_KEYS, (key) => {
        if (!course[key]) {
            throw Error(`course missing ${key}`);
        }
    });
});

module.exports = config;
