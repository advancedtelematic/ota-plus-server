# OTA Plus

To quickly get a dev system up and running, install the following requirements:

```
apt-get install jq docker-engine
```

then run the following:

```
./docker/start-up.sh
```

This will start up the applications with the `latest` docker tag. If you want a particular docker tag, you can pass any of the following env variables:

- `WEB_TAG`
- `RESOLVER_TAG`
- `CORE_TAG`
- `AUTH_PLUS_TAG`
- `BUILDSRV_TAG`

Once everything is loaded, the OTA Plus admin GUI will be available at
`http://localhost:9000`.

This also creates the user `demo@advancedtelematic.com` with the password `demo`

## Tests

Step 1: `docker/start-up.sh`

Step 2: Stop web container
```
  docker stop web
  docker rm web
```
  - Why? Each test suite will be handed a `FakeApplication` by `org.scalatestplus.play`.
  - In case the web container and the `FakeApplication` would use different ports then both might run in parallel.
  - However currently both bind port 9000.

Step 3:`cd ota-plus-server` and run tests, for example:

- Browser tests
```
  sbt "ota-plus-web/testOnly ApplicationFunTests"
```
- Integration tests
```
  sbt "ota-plus-web/it:testOnly APIFunTests"
  sbt "ota-plus-web/it:test"
```
- Other tests
```
  sbt "ota-plus-web/testOnly com.advancedtelematic.ota.ClientSdkControllerSpec"
```


## Ota Plus Web

To run the web app with authentication support you will need a configure an application
on [Auth0](https://auth0.com) and set `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_DOMAIN`
and `AUTH0_CALLBACK_URL` environment variables. 

The `AUTH0_CALLBACK_URL` should be in the list of `Allowed Callback URLs` of the Auth0 application.   


## Ota Plus Core

The `ota-plus` includes a module named `ota-plus-core`. This module
runs a webserver running the api that the `ota-plus-web` module will
use to server client requests.

The `ota-plus-core` module depends on the rvi sota core module, which
is a `jar` dependency hosted on the advanced telematic internal nexus
repository. This means you will need a vpn connection to compile this
project so sbt can download the required libraries.

To run `ota-plus-core` you can use `sbt ota-plus-core/run`. This
requires a running mysql database. This database can be started using
docker:

    docker run -p 3306:3306 --name sota-mariadb -e MYSQL_ROOT_PASSWORD=somepass -d mariadb:latest

This database needs some initialization:

    mysql -u root -h 127.0.0.1 -psomepass
    CREATE DATABASE sota_core;
    CREATE USER 'sota'@'localhost' IDENTIFIED BY 's0ta';
    GRANT ALL PRIVILEGES ON sota_core.* TO 'sota'@'%';
    GRANT ALL PRIVILEGES ON sota_core_test.* TO 'sota'@'%';
    FLUSH PRIVILEGES;

    sbt flywayMigrate

## Developing the core api

Having sota-core as a dependency means that if you need to change or
add features to core, you will need to update `ota-plus-core` with the
latest sota-core version and deploy it.

Every time a commit is pushed to master in `sota-core`, it's version is
incremented and a new jar is uploaded to nexus. You will need to
change `build.sbt` in `ota-plus-server` to depend on this new version.

To test and develop locally, it's useful to setup rvi sota core as a
local dependency in `ota-plus-server`. This can be done by removing
the dependency to the nexus jar artifact and adding a new local
project:

In `ota-plus-server/build.sbt`

    lazy val sotaCore = ProjectRef(file("/home/simao/ats/rvi_sota_server"), "core")
    
    lazy val otaPlusCore = otaPlusProject("ota-plus-core")
        .dependsOn(otaPlusCommon)
        .dependsOn(sotaCore)

You then also need to comment out in `project/Dependencies.scala`:

    // val GeniviSota = "0.1.53"
    // val SotaCore = "org.genivi" %% "sota-core" % Version.GeniviSota
    
And in `ota-plus-core/build.sbt`:

    // Dependencies.SotaCore,

## Release process

To publish the opt-plus-server projects run the following:

```
./sbt "release with-defaults"
```

This will
- create an auto-incremented git tag (eg, 0.0.25)
- push it github
- create docker images with that tag
- push it to dockerhub
- update the "latest" docker tag

To stop the git tag being created, set the following env var:

```
SKIP_TAG=true ./sbt "release with-defaults"
```

To publish with a different version, run the following:

```
SKIP_TAG=true ./sbt "release with-defaults release-version 1-dev-version"
```

Be sure to set the `SKIP_TAG=true` unless you want that tag to go to dockerhub. Also note: this will update the `latest` tag on dockerhub.
