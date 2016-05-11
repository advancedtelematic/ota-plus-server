# OTA Plus

To quickly get a dev system up and running, use docker-compose:

```
cd docker
docker-compose -f common.yml -f precise.yml up
```

You can edit `precise.yml` with the particular image tags you want.
Wait until the migrations have finished running before you actually use the
server.

Once everything is loaded, the OTA Plus admin GUI will be available at
`{docker-host}:8000`.

## Tests

Step 1: start all containers using `docker/up.sh`
  - The above assumes `export DEFAULT_VERSION=latest`
  - To update all installed images at once run `docker-compose -f common.yml pull` in the `docker` folder
  - In case some container fails to start (eg, "`docker_core_1 exited with code 255`") fall back to known-good images:
```
  docker-compose -f common.yml -f precise.yml up
```

Step 2: stop web (each test suite will be handed a `FakeApplication` by `org.scalatestplus.play`)
```
  docker-compose -f common.yml stop web
  docker ps -a
  docker rm <id-for-web>
```
  - In case the dockerized web and the `FakeApplication` use different ports (currently 8000 and 9000 resp.) then both may run in parallel.
  - However running a single web app avoids any confusion.

Step 3: clean databases, create schemas
```
  cd rvi_sota_server
  sbt flywayClean flywayMigrate
```

Step 4:`cd ota-plus-server` and run tests, for example:

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

To run the web app with authentication support you will need a running
Auth+ Instance. Once Auth+ is running, a (client id, secret) pair can
be obtained using:

    bin/new_client.sh

These new variables can then be passed to ota-plus-web on startup. To
start ota web you could use:

    eval $(bin/new_client.sh) ; sbt ota-plus-web/run

A new (client_id, secret) pair needs to be created everytime Auth+ is
restarted.


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

    lazy val rviSotaCore = ProjectRef(file("/home/simao/ats/rvi_sota_server"), "core")
    
     lazy val otaPlusCore = otaPlusProject("ota-plus-core")
         .dependsOn(sotaCommon)
    // .settings(libraryDependencies ++= Seq("org.genivi" %% "core" % "0.2.1"))
