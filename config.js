const Hjson = require('hjson');
const fs = require('fs');
const _ = require('lodash');

var config = module.exports;

config.loadConfig = function(file) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        var fileConfig = Hjson.parse(data);
        _.assign(config, fileConfig);
        config.validateConfig();
    });
};

config.validateConfig = function() {

    var req_items = ['id', 'shortname', 'name', 'token', 'org'];
    _.each(config.courses, function(course) {

        _.each(req_items, function(item) {
            if (!course[item]) {
                throw Error(`course missing ${item}`);
            }
        });
    });
};
