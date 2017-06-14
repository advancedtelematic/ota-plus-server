# ATS web-events

A service for publishing events in a namespace via websockets.

## Running tests

You'll need a mariadb instance running with the users configured in
`application.conf`. If you want it quick you can use
`deploy/ci_setup.sh`. This will create a new docker container running
a database with the proper permissions.

To run tests simply run `sbt test`.


## Teamcity jobs

In the `deploy` directory there are some scripts you can use to setup
the jobs in Teamcity.
