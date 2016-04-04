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
