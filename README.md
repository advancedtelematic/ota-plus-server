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

## Webpack

Build a docker container to run npm/webpack to compile `assets/js/app.js`.

```
  docker run --rm \
    --volume $PWD/ota-plus-web/app:/app \
    advancedtelematic/webpack \
    bash -c 'cd reactapp && npm install && webpack'
```

This step is necessary until there is an sbt plugin for webpack.

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

```
  sbt "ota-plus-web/testOnly com.advancedtelematic.ota.ClientSdkControllerSpec"
```


## Ota Plus Web

To run the web app with authentication support you will need a configure an
application and a database on [Auth0](https://auth0.com) and set environment
variables:

Variable                    | Description
-------------------:        | :------------------
`AUTH0_CALLBACK_URL`        | Callback url, eg. `http://localhost/callback`
`AUTH0_CLIENT_ID`           | Client ID of Auth0 client
`AUTH0_CLIENT_SECRET`       | Client Secret of Auth0 client
`AUTH0_DB_CONNECTION`       | Name of database connectino in Auth0
`AUTH0_AUTH_PLUS_CLIENT_ID` | Client ID of Auth+ client in Auth0
`AUTH0_DOMAIN`              | Host of auth0 endpoints, eg: `ats-dev.eu.auth0.com`
`AUTHPLUS_CLIENT_ID`        | Client ID of ota-plus in Auth+
`AUTHPLUS_SECRET`           | Client secret of ota-plus in Auth+

The `AUTH0_CALLBACK_URL` should be in the list of `Allowed Callback URLs` of
the Auth0 application.

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

## Documentation for event endpoints

Since there is no formal docs yet for OTA+, some initial documentation is here for the event
endpoints. This should be moved to the official OTA+ docs once they are created.

The event endpoints use the iframe forever technique for compatibility. To subscribe to events, an
iframe must be created with a src attribute pointing towards the API endpoint for the event of
interest. For example, subscribing to the deviceSeen event endpoint can be done like so:

```html
<iframe src="/api/v1/events/devices/7dfaf672-59a4-4290-94d3-448aa3ea5c76">
</iframe>
```

This endpoint will send back javascript blocks inside `<script>` tags. Here is an example of the response
received by the browser from the deviceSeen endpoint(formatted nicely, the actual script data returned
will be stripped of whitespace):

```html
<script type="text/javascript">
    parent.deviceSeen({
      "deviceId":"7dfaf672-59a4-4290-94d3-448aa3ea5c76",
      "lastSeen":"2016-07-01T08:26:01.472Z"
    });
</script>
```

Note that in the block above, the name of the callback function which is invoked, 'deviceSeen', is
hardcoded into the message. The callback function for each event type must be exactly as specified for a
given event endpoint. An example for the eventSeen endpoint is below:

```html
<script type="text/javascript">
     var deviceSeen = function(deviceSeenMsg) {
         //handle message here
     }
</script>
```

### Event endpoints

#### Device Seen

This endpoint returns events each time a given device contacts Core to look for updates. The json
returned has the following structure:

```json
{
  "deviceId": UUID
  "lastSeen": Instant
}
```

`Instant` is the given instant when the device contacted core, specified in UTC time using the
ISO-8601 standard format.

The callback function name for this endpoint is `deviceSeen`.

The endpoint for this event is `/api/v1/events/devices/{uuid}`, where {uuid} is a valid device which
exists in the OTA+ system.

## License

This code is licensed under the [Mozilla Public License 2.0](LICENSE), a copy of which can be found in this repository. All code is copyright [ATS Advanced Telematic Systems GmbH](https://www.advancedtelematic.com), 2016-2018.
