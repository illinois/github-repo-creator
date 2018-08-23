# GitHub Repo Creator

A microservice that allows students to create a GitHub repository in a course org.


## Getting started

* Make sure you have Node and npm installed
* Clone the repository
* Run `npm install` in the cloned repository

This service uses Shibboleth to identify students. When you're running the
service on your own machine, you won't have Shibboleth in front of the app
to provide the necessary headers. To provide your Net ID while developing the
service, you can provide it via the `NETID` environment variable. Create a
`.env` file in the root of the repository and add your own NetID:

```
NETID=mynetid1
```

The service will load any environment variables from the `.env` file when it's
started up. To start the service, run `npm run dev`.

## Adding courses

Configuration is done with a `config.hjson` file in the root of the repository.
[Hjson](https://hjson.org) is an extension to JSON to make it more
user-friendly. Specifically, it supports comments, which makes it more suitable
for config files. It parses back into JSON for operation.

See the `config.sample.hjson` file in the root of this repository for an
example of a config file. You can copy this into a `config.hjson` as a starting
point for you own config. Note how courses are defined:

* `id`: short key for the course, used in the URL path
* `shortname`: the displayed name for the course
* `name`: descriptive name of the course
* `org`:  the GitHub organization in which to create the repos
* `token`: the GitHub API token call to use to create the repository.

Other global configs:
`host`: "https://github-enterprise.host.com" // where to send the API calls
`semester`: "Spring 2018" // displayed info about which semester

## Other configuration

This service might not be mounted at the root path of the server. If that's
the case, you can set the `BASE_URL` environment variable. For example, if
this service was being served from `/github`, you could use `BASE_URL=/github`.

## Deploying this service

The easiest way to deploy this service is with `docker-compose`. The included
`docker-compose.yml` will mount your `config.hjson` file into the container,
load any environment variables from your `.env` file, bind the host port from
the `PORT` environment variable to the appropriate port in the container,
and start the container. For example, to serve the app on port 12345, you
could run:

```sh
PORT=12345 docker-compose start
```
