#!/bin/bash
set -e

export JOB_NAME="ota-plus-device-registry"

if [[ ! -z $DEPLOY_ENV && $DEPLOY_ENV != "master" ]]; then
  export JOB_NAME="${JOB_NAME}-${DEPLOY_ENV}"
fi

export IMAGE_NAME="ota-plus-device-registry"
export REGISTRY="advancedtelematic"
export DOCKER_TAG=`cat ../deploy/version.properties`
export IMAGE_ARTIFACT=${REGISTRY}/${IMAGE_NAME}:${DOCKER_TAG}

export VAULT_ENDPOINT=$(echo $JOB_NAME | tr "-" "_")
export VDATA=$(curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET ${VAULT_ADDR}/v1/secret/$VAULT_ENDPOINT)

export DEVICE_REGISTRY_DB_USER="$(echo $VDATA | jq -r .data.device_registry_db_username)"
export DEVICE_REGISTRY_DB_PASSWORD="$(echo $VDATA | jq -r .data.device_registry_db_password)"
export DEVICE_REGISTRY_DB_URL="$(echo $VDATA | jq -r .data.device_registry_db_url)"

# export DEVICE_REGISTRY_AWS_ACCESS_KEY="$(echo $VDATA | jq -r .data.device_registry_aws_access_key)"
# export DEVICE_REGISTRY_AWS_SECRET_KEY="$(echo $VDATA | jq -r .data.device_registry_aws_secret_key)"
# export DEVICE_REGISTRY_AWS_BUCKET_ID="$(echo $VDATA | jq -r .data.device_registry_aws_bucket_id)"

export DEVICE_REGISTRY_DB_MIGRATE=true
export HOST="0.0.0.0"
export PORT="8083"

REQ=$(envsubst < deploy/service.json)
curl --fail -X PUT \
  -H "Content-Type: application/json" \
  -d "$REQ" \
  http://marathon.prod01.internal.advancedtelematic.com:8080/v2/apps
