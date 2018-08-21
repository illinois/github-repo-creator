const Hjson = require('hjson');
const fs = require('fs');
const _ = require('lodash');

var config = module.exports;

config.loadConfig = function(file) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) throw err;
        var fileConfig = Hjson.parse(data);
        _.assign(config, fileConfig);
        console.log(config);
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

/*
module.exports = {
  semester: 'Fall 2018',
  host: 'https://github-dev.cs.illinois.edu',
  courses: [
    {
      id: 'cs225',
      shortname: 'CS 225',
      name: 'Data Structures',
      org: 'cs225fa18',
    },
    {
      id: 'cs241',
      shortname: 'CS 241',
      name: 'System Programming',
      org: 'cs241fa18',
    }, {
      id: 'test',
      shortname: 'Test',
      name: 'Test Repo Creation',
      org: 'github-provisioner-test',
    },
  ],
}
*/
