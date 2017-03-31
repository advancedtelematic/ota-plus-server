#!/bin/bash

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

NATS_DOCKER_TAG=${NATS_DOCKER_TAG-0.8.1}
echo 'Starting nats'
echo "tag ${NATS_DOCKER_TAG}"
docker run \
  -d \
  --name=nats \
  --expose=4222 \
  -p 4222:4222 \
  nats:${NATS_DOCKER_TAG}

SLEEP=${DB_SLEEP-20}
echo sleeping for ${SLEEP}s
sleep $SLEEP

DEVICE_REGISTRY_DOCKER_TAG=${DEVICE_REGISTRY_TAG-latest}
echo 'Starting device registry'
echo "tag ${DEVICE_REGISTRY_DOCKER_TAG}"
docker run \
  -d \
  --name=device-registry \
  --expose=8083 \
  -p 8083:8083 \
  --link=db \
  --link=nats \
  -e HOST='0.0.0.0' \
  -e DEVICE_REGISTRY_DB_URL='jdbc:mariadb://db:3306/sota_device_registry' \
  -e DB_MIGRATE='true' \
  -e NATS_HOST='nats' \
  -e NATS_PORT=4222 \
  -e AUTH_PROTOCOL=${AUTH_PROTOCOL-'none'} \
  advancedtelematic/sota-device_registry:$DEVICE_REGISTRY_DOCKER_TAG

RESOLVER_DOCKER_TAG=${RESOLVER_TAG-latest}
echo 'Starting Resolver'
echo "tag ${RESOLVER_DOCKER_TAG}"
docker run \
  -d \
  --name=resolver \
  --expose=8081 \
  -p 8081:8081 \
  --link=db \
  --link=device-registry \
  -e HOST='0.0.0.0' \
  -e DEVICE_REGISTRY_HOST='device-registry' \
  -e DEVICE_REGISTRY_PORT='8083' \
  -e RESOLVER_DB_URL='jdbc:mariadb://db:3306/sota_resolver' \
  -e DB_MIGRATE='true' \
  -e PACKAGES_VERSION_FORMAT='.+' \
  -e rootLevel='DEBUG' \
  -e AUTH_PROTOCOL=${AUTH_PROTOCOL-'none'} \
  advancedtelematic/sota-resolver:$RESOLVER_DOCKER_TAG

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
  --link=nats \
  --link=device-registry \
  -e HOST='0.0.0.0' \
  -e CORE_DB_URL='jdbc:mariadb://db:3306/sota_core' \
  -e DB_MIGRATE='true' \
  -e DEVICE_REGISTRY_HOST='device-registry' \
  -e DEVICE_REGISTRY_PORT='8083' \
  -e SOTA_RESOLVER_HOST='resolver' \
  -e SOTA_RESOLVER_PORT='8081' \
  -e NATS_HOST='nats' \
  -e NATS_PORT=4222 \
  -e CORE_INTERACTION_PROTOCOL='none' \
  -e PACKAGES_VERSION_FORMAT='.+' \
  -e rootLevel='DEBUG' \
  -e AUTH_PROTOCOL=${AUTH_PROTOCOL-'none'} \
  -e AUTH_VERIFICATION=${AUTH_VERIFICATION-'none'} \
  advancedtelematic/sota-core:$CORE_DOCKER_TAG

$(dirname "$0")/start-ota-plus-web.sh

