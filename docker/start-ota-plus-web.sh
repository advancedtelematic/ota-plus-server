#!/bin/bash

AUTH_PLUS_DOCKER_TAG=${AUTH_PLUS_TAG-latest}
echo 'Starting Auth Plus'
echo "tag ${AUTH_PLUS_DOCKER_TAG}"
docker run \
  -d \
  --name=auth-plus \
  --expose=9001 \
  -p 9001:9001 \
  -e JWKS_URI=${JWKS_URI} \
  -e JWT_ASSERTION_AUD=${JWT_ASSERTION_AUD} \
  -e JWT_ASSERTION_ISSUER=${JWT_ASSERTION_ISSUER} \
  -e PERSISTENCE_JOURNAL="inmemory-journal" \
  -e SNAPSHOT_STORE="inmemory-snapshot-store" \
  advancedtelematic/auth-plus:latest

sleep 20

echo 'Creating user: demo@advancedtelematic.com password: demo'
curl -H "Content-Type: application/json" -X POST -d '{"email":"demo@advancedtelematic.com","password":"demo"}' http://localhost:9001/users

echo
echo 'Creating ota-plus-web credentials'

if ! auth=$(curl -s -H "Content-Type: application/json" -d '{ "client_name": "ABC", "grant_types": ["client_credentials","password", "urn:ietf:params:oauth:grant-type:jwt-bearer"] }' "http://localhost:9001/clients");
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
  advancedtelematic/ota-plus-buildsrv:$BUILDSRV_DOCKER_TAG

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
  --link=nats \
  --link=buildsrv \
  --link=nats \
  -e AUTH_PLUS_HOST='auth-plus' \
  -e AUTH_PLUS_PORT='9001' \
  -e BUILDER_HOST='buildsrv' \
  -e BUILDER_PORT='9200' \
  -e DEVICE_REGISTRY_HOST='device-registry' \
  -e DEVICE_REGISTRY_PORT='8083' \
  -e SOTA_CORE_HOST='core' \
  -e SOTA_CORE_PORT='8080' \
  -e SOTA_RESOLVER_HOST='resolver' \
  -e SOTA_RESOLVER_PORT='8081' \
  -e NATS_HOST='nats' \
  -e NATS_PORT='4222' \
  -e PLAY_CRYPTO_SECRET='secret' \
  -e AUTHPLUS_CLIENT_ID=$AUTHPLUS_CLIENT_ID \
  -e AUTHPLUS_SECRET=$AUTHPLUS_SECRET \
  -e AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID \
  -e AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET \
  -e AUTH0_DOMAIN=$AUTH0_DOMAIN \
  -e AUTH0_CALLBACK_URL=$AUTH0_CALLBACK_URL \
  -e AUTH0_USER_UPDATE_TOKEN=$AUTH0_USER_UPDATE_TOKEN \
  -e AUTH0_AUTH_PLUS_CLIENT_ID=${AUTH0_AUTH_PLUS_CLIENT_ID} \
  -e rootLevel='DEBUG' \
  advancedtelematic/ota-plus-web:$WEB_DOCKER_TAG
