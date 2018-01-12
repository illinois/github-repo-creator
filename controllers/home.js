

/** Course setup */
var host = "github-dev.cs.illinois.edu";
var org = "cs225sp18";
var course = "CS 225";
var courseTerm = "Spring 2018";


/** GHE API setup */
var GitHubApi = require('github')

var github = new GitHubApi({
  timeout: 5000,
  host: host,
  pathPrefix: '/api/v3',
  protocol: 'https',
});

github.authenticate({
  type: 'oauth',
  token: process.env.GHE_TOKEN
});


var unexpectedError = function(error, err) {

}

/** GET / */
exports.index = function(req, res) {
  // Find NetID
  var netid = req.get('eppn');
  var studentRepoURL = "https://" + host + "/" + org + "/" + netid;

  if (!netid || netid.length < 1) {
    throw {
      text: 'We were unable to authenticate your NetID.  Please try again later.',
      call: "shib"
    };
  }

  // 1. Ensure/check if the user exists in gitlab
  github.users.getForUser({
    username: netid
  }, function (err, res) {
    if (err) {
      if (err.message == "Not Found") {
        // Response: User does not exist on gitlab -- have them log in
        res.render('loginToGHE', {});
      } else {
        // Response: Unknown error and log it
        throw {
          text: 'We recieved an unknown response from github.  Please try again later.',
          call: 'github.users.getForUser',
          err: err
        };
      }
      return;
    }

    // 2. Create the user
    github.repos.createForOrg({
      org: org,
      name: netid,
      private: true,
      has_issues: false,
      has_wiki: false,
      description: courseTerm + " repository for " + netid,
    }, function (err, res) {

      if (err) {
        if (err.code == 422) {
          // Response: Repo already exists
          res.render('repoExists', {url: studentRepoURL});
        } else {
          // Response: Unknown error and log it
          throw {
            text: 'We recieved an unknown response from github.  Please try again later.',
            call: 'github.repos.createForOrg',
            err: err
          };
        }
        return;
      }

      // 3. Give the user access
      github.repos.addCollaborator({
        owner: org,
        repo: netid,
        username: netid,
        permission: "push"
      }, function (err, res) {
        console.log();
        if (err) {
          // Response: Unknown error and log it
          throw {
            text: 'We recieved an unknown response from github.  Please try again later.',
            call: 'github.repos.addCollaborator',
            err: err
          };
        } else {
          // Response: Success
          res.render('repoCreated', {url: studentRepoURL});
        }
      });          
    });          
  });
};
