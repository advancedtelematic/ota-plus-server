# OTA Plus - Web Server

The OTA Plus Web Server Application consists of a Single-Page Application frontend (in Javascript) and a backend application (in Scala).

The backend application acts as an API gateway, routing API requests from the UI to the appropriate services. The APIs of the services are documented in their separate repositories.

The frontend UI is implemented with https://reactjs.org/[ReactJs], a declarative, component-based Javascript library. The backend application uses the https://www.playframework.com/[Play Framework] for a scalable, stateless, fully asynchronous web architecture built on top of Akka.

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

## Test

To run the unit tests:

```
  sbt ota-plus-web/ut:test
```

To run a specific test:

```
  sbt "ota-plus-web/testOnly com.advancedtelematic.ota.ClientSdkControllerSpec"
```

## Deployment

### Authentication

#### Quickstart without authentication

The simple quickstart default is to run without authentication. Set the following environment variables:

Variable                    | Value
-------------------:        | :------------------
`OIDC_NS_PROVIDER`          | com.advancedtelematic.auth.oidc.ConfiguredNamespace
`OIDC_LOGIN_ACTION`         | com.advancedtelematic.auth.garage.NoLoginAction
`OIDC_LOGOUT_ACTION`        | com.advancedtelematic.auth.garage.NoLogoutAction
`OIDC_TOKEN_EXCHANGE`       | com.advancedtelematic.auth.NoExchange
`OIDC_TOKEN_VERIFICATION`   | com.advancedtelematic.auth.oidc.TokenValidityCheck

#### OpenID Connect

To enable login with an OpenID Connect provider, set the following environment variables:

Variable                    | Value
-------------------:        | :------------------
`OIDC_NS_PROVIDER`          | com.advancedtelematic.auth.oidc.ConfiguredNamespace
`OIDC_LOGIN_ACTION`         | com.advancedtelematic.auth.oidc.LoginAction
`OIDC_TOKEN_EXCHANGE`       | com.advancedtelematic.auth.NoExchange
`OIDC_TOKEN_VERIFICATION`   | com.advancedtelematic.auth.oidc.TokenValidityCheck

To configure the client application from the OpenID Connect provider (such as [Auth0](https://auth0.com)), set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTH0_DOMAIN`              | Domain
`AUTH0_CALLBACK_URL`        | Callback URL, allowed for the client
`AUTH0_CLIENT_ID`           | Client ID
`AUTH0_CLIENT_SECRET`       | Client Secret

#### OAuth2

To enable login with an Single-Sign On service such as Auth0, and perform JWT token exchange with an OAuth2 authorization server such as ATS Auth+, set the following environment variables:

Variable                    | Value
-------------------:        | :------------------
`OIDC_NS_PROVIDER`          | com.advancedtelematic.auth.oidc.ConfiguredNamespace
`OIDC_LOGIN_ACTION`         | com.advancedtelematic.auth.garage.LoginAction
`OIDC_LOGOUT_ACTION`        | com.advancedtelematic.auth.garage.LogoutAction
`OIDC_TOKEN_EXCHANGE`       | com.advancedtelematic.auth.garage.AuthPlusTokenExchange
`OIDC_TOKEN_VERIFICATION`   | com.advancedtelematic.auth.oidc.TokenIntrospection

To configure the Auth+ OAuth2 client application, set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTHPLUS_CLIENT_ID`        | Client ID in Auth+ with the proper scope
`AUTHPLUS_SECRET`           | Client Secret

To configure the Auth0 client application, set the following environment variables:

Variable                    | Description
-------------------:        | :------------------
`AUTH0_DOMAIN`              | Domain
`AUTH0_CALLBACK_URL`        | Callback URL, allowed for the client
`AUTH0_CLIENT_ID`           | Client ID
`AUTH0_CLIENT_SECRET`       | Client Secret
`AUTH0_AUTH_PLUS_CLIENT_ID` | Client ID of Auth+ client in Auth0
`AUTH0_DB_CONNECTION`       | User database connection in Auth0

## License

This code is licensed under the [Mozilla Public License 2.0](LICENSE), a copy of which can be found in this repository. All code is copyright [ATS Advanced Telematic Systems GmbH](https://www.advancedtelematic.com), 2016-2018.
