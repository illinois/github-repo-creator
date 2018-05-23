# GHE-createRepo

This is a micro service that allows students to create a GitHub repository in a course org. To use:

1. Make sure you have npm & node installed.
2. `npm install` in the cloned repo
3. Create a .env file with the following:
`GHE_TOKEN`: a GitHub Enterprise token
`GH_ORG`: the GitHub organization to create the student repo in
`COURSE_TERM`: the current semester (used in the description for the repo, ex: 'Spring 2018')