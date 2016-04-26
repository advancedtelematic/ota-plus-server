#!/bin/bash
set -e

export JOB_NAME="ota-plus-web"

if [[ ! -z $DEPLOY_ENV && $DEPLOY_ENV != "master" ]]; then
  export JOB_NAME="${JOB_NAME}-${DEPLOY_ENV}"
fi

export REGISTRY="advancedtelematic"
export DOCKER_TAG=`cat ../deploy/version.properties`
export IMAGE_ARTIFACT=${REGISTRY}/${JOB_NAME}:${DOCKER_TAG}

export VAULT_ENDPOINT=$(echo $JOB_NAME | tr "-" "_")
export VDATA=$(curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET ${VAULT_ADDR}/v1/secret/${VAULT_ENDPOINT})
export PLAY_CRYPTO_SECRET="$(echo $VDATA | jq -r .data.play_crypto_secret)"
export CORE_API_URI="$(echo $VDATA | jq -r .data.core_api_uri)"
export RESOLVER_API_URI="$(echo $VDATA | jq -r .data.resolver_api_uri)"
export BUILDSERVICE_API_HOST="$(echo $VDATA | jq -r .data.buildservice_api_host)"
export AUTHPLUS_HOST="$(echo $VDATA | jq -r .data.authplus_host)"
export CASSANDRA_CONTACT_POINT="$(echo $VDATA | jq -r .data.cassandra_contact_point)"
export CASSANDRA_JOURNAL_KEYSPACE="$(echo $VDATA | jq -r .data.cassandra_journal_keyspace)"
export port PORT="9000"

REQ=$(envsubst < deploy/service.json)
curl --fail -X PUT \
  -H "Content-Type: application/json" \
  -d "$REQ" \
  http://marathon.prod01.internal.advancedtelematic.com:8080/v2/apps
