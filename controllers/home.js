const router = require('express').Router();
const Octokit = require('@octokit/rest');

const config = require('../config');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/:courseId', (req, resp, next) => {
  // Find NetID
  let netid;
  if (process.env.NODE_ENV === 'development') {
    // No shib locally
    // Default to "dev", override with NETID environment variable
    netid = process.env.NETID || 'dev';
  } else {
    netid = req.get('eppn');
  }
  if (!netid || netid.length < 1) {
    throw {
      text: 'We were unable to authenticate your NetID.  Please try again later.',
      call: "shib"
    };
  }

  // Lookup course info in config
  const { courseId } = req.params;
  const course = config.courses.find(c => c.id === courseId);
  if (!course) {
    throw {
      text: 'Unknown course ID!',
      call: "course config"
    }
  }

  // Let's check for a token for that course
  const tokenEnvVar = `GITHUB_TOKEN_${course.id.toUpperCase()}`
  const githubToken = process.env[tokenEnvVar]
  if (!githubToken) {
    throw {
      text: 'No course token found',
      call: 'course token'
    }
  }

  netid = netid.split("@")[0];
  console.log("NetID: " + netid);
  const studentRepoURL = `${config.host}/${course.org}/${netid}`;

  // Set up a new Octokit instance for this request
  const octokit = new Octokit({
    timeout: 5000,
    baseUrl: `${config.host}/api/v3`,
  });
  octokit.authenticate({
    type: 'token',
    token: githubToken,
  });

  // 1. Ensure/check if the user exists in GitHub
  octokit.users.getForUser({
    username: netid
  }, function (err, res) {
    if (err) {
      if (err.message == "Not Found") {
        // Response: User does not exist on GitHub -- have them log in
        resp.render('loginToGHE', {});
      } else {
        // Response: Unknown error and log it
        next({
          text: 'We recieved an unknown response from github.  Please try again later.',
          call: 'github.users.getForUser',
          err: err
        });
      }
      return;
    }

    // 2. Create the user
    octokit.repos.createForOrg({
      org: course.org,
      name: netid,
      private: true,
      has_issues: false,
      has_wiki: false,
      description: `${config.semester} repository for ${netid}`,
    }, function (err, res) {

      if (err) {
        if (err.code == 422) {
          // Response: Repo already exists
          resp.render('repoExists', {url: studentRepoURL});
        } else {
          // Response: Unknown error and log it
          next({
            text: 'We recieved an unknown response from github.  Please try again later.',
            call: 'github.repos.createForOrg',
            err: err
          });
        }
        return;
      }

      // 3. Give the user access
      octokit.repos.addCollaborator({
        owner: course.org,
        repo: netid,
        username: netid,
        permission: "push"
      }, function (err, res) {
        if (err) {
          // Response: Unknown error and log it
          next({
            text: 'We recieved an unknown response from github.  Please try again later.',
            call: 'github.repos.addCollaborator',
            err: err
          });
        } else {
          // Response: Success
          resp.render('repoCreated', {url: studentRepoURL});
        }
      });          
    });          
  });
});

module.exports = router;
