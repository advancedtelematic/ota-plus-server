# OTA Plus - Web Server

The OTA Plus Web Server Application consists of a Single-Page Application frontend (in Javascript) and a backend application (in Scala).

The backend application acts as an API gateway, routing API requests from the UI to the appropriate services. The APIs of the services are documented in their respective repositories.

The backend application uses the [Play Framework](https://www.playframework.com) for a scalable, stateless, fully asynchronous web architecture built on top of Akka.
The frontend UI is implemented with [ReactJs](https://reactjs.org), a declarative component-based Javascript library.

## Build

To build a docker image and push it to dockerhub:

```
  sbt release
```

To build an image locally without pushing it to dockerhub:

```
  sbt runWebpack
  sbt docker:publishLocal
```

### Webpack

The `sbt runWebpack` command runs `npm/webpack` (inside a docker container) to compile the Single-Page application (`assets/js/app.js`).

This step is necessary because there is currently no sbt plugin for webpack.

## Run

To run the application as a docker container:

```
  docker run -d -p 9000:9000 --env ENV_NAME=env-value --name ota-plus-web advancedtelematic/ota-plus-web:latest
```

To run the application from `sbt` without docker:

```
  sbt ota-plus-web/run
```

The application is now accessible at `localhost:9000`.

## Deployment

The application is configured by setting environment variables.

### Authentication

#### Quickstart without authentication

To quickly start the application without any login authentication, set the following environment variables:

Variable                    | Value
-------------------:        | :------------------
`OIDC_NS_PROVIDER`          | com.advancedtelematic.auth.oidc.ConfiguredNamespace
`OIDC_LOGIN_ACTION`         | com.advancedtelematic.auth.NoLoginAction
`OIDC_LOGOUT_ACTION`        | com.advancedtelematic.auth.NoLogoutAction
`OIDC_TOKEN_EXCHANGE`       | com.advancedtelematic.auth.NoExchange

#### OpenID Connect

To enable login with an OpenID Connect provider, set the following environment variables:

Variable                    | Value
-------------------:        | :------------------
`OIDC_NS_PROVIDER`          | com.advancedtelematic.auth.oidc.ConfiguredNamespace
`OIDC_LOGIN_ACTION`         | com.advancedtelematic.auth.oidc.LoginAction
`OIDC_TOKEN_EXCHANGE`       | com.advancedtelematic.auth.NoExchange

To configure the client application from the OpenID Connect provider (such as [Auth0](https://auth0.com)), set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTH0_DOMAIN`              | Domain
`AUTH0_CALLBACK_URL`        | Callback URL, allowed for the client
`AUTH0_CLIENT_ID`           | Client ID
`AUTH0_CLIENT_SECRET`       | Client Secret

#### OAuth2

To configure the Auth+ OAuth2 client application, set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTHPLUS_CLIENT_ID`        | Client ID in Auth+ with the proper scope
`AUTHPLUS_SECRET`           | Client Secret
`AUTHPLUS_TOKEN_VERIFY`     | Whether to verify tokens with Auth+

To configure the Auth0 client application, set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTH0_DOMAIN`              | Domain
`AUTH0_CALLBACK_URL`        | Callback URL, allowed for the client
`AUTH0_CLIENT_ID`           | Client ID
`AUTH0_CLIENT_SECRET`       | Client Secret
`AUTH0_AUTH_PLUS_CLIENT_ID` | Client ID of Auth+ client in Auth0
`AUTH0_DB_CONNECTION`       | User database connection in Auth0

### Services

To point the application to the OTA Services that provide the APIs, set the following environment Variables:

Variable                    | Description
-------------------:        | :------------------
`AUDITOR_HOST`              | Host of Auditor service
`AUDITOR_PORT`              | Port of Auditor service
`AUTH_PLUS_HOST`            | Host of Auth Plus service
`AUTH_PLUS_PORT`            | Port of Auth Plus service
`AUTH_PLUS_SCHEME`          | Scheme of Auth Plus service
`CAMPAIGNER_HOST`           | Host of Campaigner service
`CAMPAIGNER_PORT`           | Port of Campaigner service
`DEVICE_REGISTRY_HOST`      | Host of Device Registry service
`DEVICE_REGISTRY_PORT`      | Port of Device Registry service
`DIRECTOR_HOST`             | Host of Director service
`DIRECTOR_PORT`             | Port of Director service
`KAFKA_HOST`                | Kafka bootstrap servers
`TUF_KEYSERVER_HOST`        | Host of TUF Keyserver service
`TUF_KEYSERVER_PORT`        | Port of TUF Keyserver service
`TUF_REPOSERVER_HOST`       | Host of TUF Reposerver service
`TUF_REPOSERVER_PORT`       | Port of TUF Reposerver service
`TUF_REPOSERVER_HOST_PUB`   | Host of public TUF Reposerver service
`TUF_REPOSERVER_PORT_PUB`   | Port of public TUF Reposerver service
`TUF_REPOSERVER_SCHEME_PUB` | Scheme of public TUF Reposerver service
`USER_PROFILE_HOST`         | Host of User Profile service
`USER_PROFILE_PORT`         | Port of User Profile service
`WS_HOST`                   | Host of Websocket Events service
`WS_PORT`                   | Port of Websocket Events service
`WS_SCHEME`                 | Scheme of Websocket Events service

For a description of the services and their APIs, refer to their respective repositories:

Service                     | Repository
-------------------:        | :------------------
Auditor                     | https://github.com/advancedtelematic/auditor
Campaigner                  | https://github.com/advancedtelematic/campaigner
Device Registry             | https://github.com/advancedtelematic/ota-device-registry
Director                    | https://github.com/advancedtelematic/director
Treehub                     | https://github.com/advancedtelematic/treehub
TUF Keyserver               | https://github.com/advancedtelematic/ota-tuf
TUF Reposerver              | https://github.com/advancedtelematic/ota-tuf
Web Events                  | https://github.com/advancedtelematic/web-events

## Test

To run all tests:

```
  sbt test
```

To run only unit tests:

```
  sbt ota-plus-web/ut:test
```

To run a specific test:

```
  sbt "ota-plus-web/testOnly com.advancedtelematic.ota.ClientSdkControllerSpec"
```

## License

This code is licensed under the [Mozilla Public License 2.0](LICENSE), a copy of which can be found in this repository. All code is copyright [ATS Advanced Telematic Systems GmbH](https://www.advancedtelematic.com), 2016-2018.
