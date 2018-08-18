# GitHub Repo Creator

A microservice that allows students to create a GitHub repository in a course org.


## Getting started

* Make sure you have Node and npm installed
* Clone the repository
* Run `npm install` in the cloned repository

This service uses Shibboleth to identify students. When you're running the service on your own machine, you won't have Shibboleth in front of the app to provide the necessary headers. To provide your Net ID while developing the service, you can provide it via the `NETID` environment variable. Create a `.env` file in the root of the repository and add your own NetID:

```
NETID=mynetid1
```

The service will load any environment variables from the `.env` file when it's started up. To start the service, run `npm run dev`.

## Adding courses

Configuration is done with the `config.js` file in the root of the repository. To add a new course, simply add another entry to the `courses` array. You will need to provide a GitHub token in order for the service to make GitHub API calls on your behalf. To ensure tokens aren't accidentally stored in this repo, they're provided via environment variables. A course's token environment variable is based on the course's ID. For example, if my course ID is `cs225`, its token would be provided via the `GITHUB_TOKEN_CS225` environment variable.
