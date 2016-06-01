#!/bin/bash

AUTH_PLUS_DOCKER_TAG=${AUTH_PLUS_TAG-latest}
echo 'Starting Auth Plus'
echo "tag ${AUTH_PLUS_DOCKER_TAG}"
docker run \
  -d \
  --name=auth-plus \
  --expose=9001 \
  -p 9001:9001 \
  advancedtelematic/auth-plus:$AUTH_PLUS_DOCKER_TAG

MARIADB_DOCKER_TAG=${MARIADB_TAG-stable}
echo 'Starting maria db'
echo "tag ${MARIADB_DOCKER_TAG}"
docker run \
  -d \
  --name=db \
  --expose=3306 \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD='sota_test' \
  -e MYSQL_USER='sota' \
  -e MYSQL_PASSWORD='s0ta' \
  -e MYSQL_DATABASES='sota_resolver sota_resolver_test sota_core sota_core_test sota_device_registry sota_device_registry_test' \
  advancedtelematic/mariadb:${MARIADB_DOCKER_TAG}

SLEEP=${DB_SLEEP-20}
echo sleeping for ${SLEEP}s
sleep $SLEEP

RESOLVER_DOCKER_TAG=${RESOLVER_TAG-latest}
echo 'Starting Resolver'
echo "tag ${RESOLVER_DOCKER_TAG}"
docker run \
  -d \
  --name=resolver \
  --expose=8081 \
  -p 8081:8081 \
  --link=db \
  -e HOST='0.0.0.0' \
  -e RESOLVER_DB_URL='jdbc:mariadb://db:3306/sota_resolver' \
  -e RESOLVER_DB_MIGRATE='true' \
  -e PACKAGES_VERSION_FORMAT='.+' \
  -e rootLevel='DEBUG' \
  advancedtelematic/ota-plus-resolver:$RESOLVER_DOCKER_TAG

CORE_DOCKER_TAG=${CORE_TAG-latest}
echo 'Starting Core'
echo "tag ${CORE_DOCKER_TAG}"
docker run \
  -d \
  --name=core \
  --expose=8080 \
  -p 8080:8080 \
  --link=db \
  --link=resolver \
  -e HOST='0.0.0.0' \
  -e CORE_DB_URL='jdbc:mariadb://db:3306/sota_core' \
  -e CORE_DB_MIGRATE='true' \
  -e RESOLVER_API_URI='http://resolver:8081' \
  -e DEVICE_REGISTRY_API_URI='http://device-registry:8083' \
  -e CORE_INTERACTION_PROTOCOL='none' \
  -e PACKAGES_VERSION_FORMAT='.+' \
  -e rootLevel='DEBUG' \
  advancedtelematic/ota-plus-core:$CORE_DOCKER_TAG

DEVICE_REGISTRY_DOCKER_TAG=${DEVICE_REGISTRY_TAG-latest}
echo 'Starting device registry'
echo "tag ${DEVICE_REGISTRY_DOCKER_TAG}"
docker run \
  -d \
  --name=device-registry \
  --expose=8083 \
  -p 8083:8083 \
  --link=db \
  -e HOST='0.0.0.0' \
  -e DEVICE_REGISTRY_DB_URL='jdbc:mariadb://db:3306/sota_device_registry' \
  -e DEVICE_REGISTRY_DB_MIGRATE='true' \
  advancedtelematic/ota-plus-device-registry:$DEVICE_REGISTRY_DOCKER_TAG

echo 'Creating user: demo@advancedtelematic.com password: demo'
curl -H "Content-Type: application/json" -X POST -d '{"email":"demo@advancedtelematic.com","password":"demo"}' http://localhost:9001/users

echo
echo 'Creating ota-plus-web credentials'

if ! auth=$(curl -s -H "Content-Type: application/json" -d '{ "client_name": "ABC", "grant_types": ["client_credentials","password"] }' "http://localhost:9001/clients");
then echo "Error: couldn't get token"
     exit 1
fi

echo $auth
export AUTHPLUS_CLIENT_ID=$(echo $auth | jq .client_id | tr -d '"')
export AUTHPLUS_SECRET=$(echo $auth | jq .client_secret | tr -d '"')


BUILDSRV_DOCKER_TAG=${BUILDSRV_TAG-latest}
echo 'Starting Buildsrv'
echo "tag ${BUILDSRV_DOCKER_TAG}"
docker run \
  -d \
  --name=buildsrv \
  --expose=9200 \
  -p 9200:9200 \
  --link=auth-plus \
  -e OTA_AUTH_URL='http://auth-plus:9001' \
  -e OTA_SERVER_URL='http://localhost:9000' \
  advancedtelematic/ota-build-srv:$BUILDSRV_DOCKER_TAG

WEB_DOCKER_TAG=${WEB_TAG-latest}
echo 'Starting Web'
echo "tag ${WEB_DOCKER_TAG}"
docker run \
  -d \
  --name=web \
  --expose=9000 \
  -p 9000:9000 \
  --link=core \
  --link=resolver \
  --link=device-registry \
  --link=auth-plus \
  --link=buildsrv \
  -e CORE_API_URI='http://core:8080' \
  -e RESOLVER_API_URI='http://resolver:8081' \
  -e DEVICE_REGISTRY_API_URI='http://device-registry:8083' \
  -e BUILDSERVICE_API_HOST='http://buildsrv:9200' \
  -e AUTHPLUS_HOST='http://auth-plus:9001' \
  -e PLAY_CRYPTO_SECRET='secret' \
  -e AUTHPLUS_CLIENT_ID=$AUTHPLUS_CLIENT_ID \
  -e AUTHPLUS_SECRET=$AUTHPLUS_SECRET \
  -e rootLevel='DEBUG' \
  advancedtelematic/ota-plus-web:$WEB_DOCKER_TAG
