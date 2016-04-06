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

Step 1: start all containers
```
  cd docker
  docker-compose -f common.yml up
```
  - The above assumes `export DEFAULT_VERSION=latest`
  - To update all installed images at once: `docker images | awk '{print $1}' | xargs -L1 docker pull`
  - In case some container fails to start (eg, "`docker_core_1 exited with code 255`") fall back to known-good images:
```
  docker-compose -f common.yml -f precise.yml up
```

Step 2: stop web (each test suite will be handed a `FakeApplication` by `org.scalatestplus.play`)
```
  docker-compose -f common.yml stop web
```
  - In case the dockerized web and the `FakeApplication` use different ports (currently 8000 and 9000 resp.) then both may run in parallel.
  - However running a single web app avoids any confusion.

Step 3:clean databases, create schemas
```
  cd rvi_sota_server/
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

## Ota Plus Core

The `ota-plus` includes a module named `ota-plus-core`. This module
runs a webserver running the api that the `ota-plus-web` module will
use to server client requests.

The `ota-plus-core` module depends on the rvi sota core module, which
is a `jar` dependency hosted on the advanced telematic internal nexus
repository. This means you will need a vpn connection to compile this
project so sbt can download the required libraries.

To run `ota-plus-core` you can use `sbt ota-plus-core/run`. This
requires a running myusql database. This database can be started using
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
