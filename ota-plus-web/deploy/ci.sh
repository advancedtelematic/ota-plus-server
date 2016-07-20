#!/bin/bash
set -e

export JOB_NAME="${JOB_NAME-ota-plus-web}"

export IMAGE_NAME="ota-plus-web"
export REGISTRY="advancedtelematic"
export DOCKER_TAG=`cat ../deploy/version.properties`
export IMAGE_ARTIFACT=${REGISTRY}/${IMAGE_NAME}:${DOCKER_TAG}

export VAULT_ENDPOINT=${VAULT_ENDPOINT-$(echo $JOB_NAME | tr "-" "_")}
export VDATA=$(curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET ${VAULT_ADDR}/v1/secret/${VAULT_ENDPOINT})
export PLAY_CRYPTO_SECRET="$(echo $VDATA | jq -r .data.play_crypto_secret)"
export CORE_API_URI="$(echo $VDATA | jq -r .data.core_api_uri)"
export RESOLVER_API_URI="$(echo $VDATA | jq -r .data.resolver_api_uri)"
export DEVICE_REGISTRY_API_URI="$(echo $VDATA | jq -r .data.device_registry_api_uri)"
export BUILDSERVICE_API_HOST="$(echo $VDATA | jq -r .data.buildservice_api_host)"
export AUTHPLUS_HOST="$(echo $VDATA | jq -r .data.authplus_host)"
export AUTHPLUS_CLIENT_ID="$(echo $VDATA | jq -r .data.authplus_client_id)"
export AUTHPLUS_SECRET="$(echo $VDATA | jq -r .data.authplus_secret)"
export CASSANDRA_CONTACT_POINT="$(echo $VDATA | jq -r .data.cassandra_contact_point)"
export CASSANDRA_JOURNAL_KEYSPACE="$(echo $VDATA | jq -r .data.cassandra_journal_keyspace)"
export AUTH0_CLIENT_ID="$(echo $VDATA | jq -r .data.auth0_client_id)"
export AUTH0_CLIENT_SECRET="$(echo $VDATA | jq -r .data.auth0_client_secret)"
export AUTH0_DOMAIN="$(echo $VDATA | jq -r .data.auth0_domain)"
export AUTH0_CALLBACK_URL="$(echo $VDATA | jq -r .data.auth0_callback_url)"
export AUTH0_USER_UPDATE_TOKEN="$(echo $VDATA | jq -r .data.auth0_user_update_token)"
export port PORT="9000"

REQ=$(envsubst < deploy/service.json)
curl --fail -X PUT \
  -H "Content-Type: application/json" \
  -d "$REQ" \
  http://marathon.prod01.internal.advancedtelematic.com:8080/v2/apps
