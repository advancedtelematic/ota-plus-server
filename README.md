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

- start all containers
```
  cd docker
  docker-compose -f common.yml up
```

- The above starts the latest container images, assuming `export DEFAULT_VERSION=latest`

- In case some container fails to start (eg, "`docker_core_1 exited with code 255`") fall back to known-good images:
```
  docker-compose -f common.yml -f precise.yml up
```

- stop web (each test suite will be handed a `FakeApplication` by `org.scalatestplus.play`)
```
  docker-compose -f common.yml stop web
```

- clean databases, create schemas
```
  cd rvi_sota_server/
  sbt flywayClean flywayMigrate
```

- run tests, for example:
```
  sbt "core/testOnly org.genivi.sota.core.UpdateServiceSpec"
  sbt "ota-plus-web/testOnly com.advancedtelematic.ota.ClientSdkControllerSpec"

  // browser tests
  sbt "ota-plus-web/testOnly ApplicationFunTests"

  // integration tests
  sbt "ota-plus-web/it:testOnly APIFunTests"
  sbt "ota-plus-web/it:test"
```
