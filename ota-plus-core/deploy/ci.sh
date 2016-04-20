#!/bin/bash
set -e

export JOB_NAME="ota-plus-core"

if [[ ! -z $DEPLOY_ENV && $DEPLOY_ENV != "master" ]]; then
  export JOB_NAME="${JOB_NAME}-${DEPLOY_ENV}"
fi

export VAULT_ENDPOINT=$(echo $JOB_NAME | tr "-" "_")

export REGISTRY="advancedtelematic"
export BRANCH_TAG=$(echo ${TC_BRANCH_NAME} | sed 's/\//_/')
export DOCKER_TAG=${BUILD_NUMBER}-${BRANCH_TAG}-${BUILD_VCS_NUMBER}
export IMAGE_ARTIFACT=${REGISTRY}/${JOB_NAME}:${DOCKER_TAG}
export LATEST_ARTIFACT=${REGISTRY}/ota-plus-core:latest
export LATEST_SBT_IMAGE=$(docker images -q | head -n 1)

echo Tagging image as: ${IMAGE_ARTIFACT}
docker tag ${LATEST_SBT_IMAGE} ${IMAGE_ARTIFACT}
docker push ${IMAGE_ARTIFACT}

echo Tagging image as: ${LATEST_ARTIFACT}
docker tag ${LATEST_SBT_IMAGE} ${LATEST_ARTIFACT}
docker push ${LATEST_ARTIFACT}

export VDATA=$(curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET ${VAULT_ADDR}/v1/secret/$VAULT_ENDPOINT)

export CORE_DB_USER="$(echo $VDATA | jq -r .data.core_db_username)"
export CORE_DB_PASSWORD="$(echo $VDATA | jq -r .data.core_db_password)"
export CORE_DB_URL="$(echo $VDATA | jq -r .data.core_db_url)"
export RESOLVER_API_URI="$(echo $VDATA | jq -r .data.resolver_api_uri)"

export CORE_AWS_ACCESS_KEY="$(echo $VDATA | jq -r .data.core_aws_access_key)"
export CORE_AWS_SECRET_KEY="$(echo $VDATA | jq -r .data.core_aws_secret_key)"
export CORE_AWS_BUCKET_ID="$(echo $VDATA | jq -r .data.core_aws_bucket_id)"

export CORE_DB_MIGRATE=false
export CORE_INTERACTION_PROTOCOL="none"
export PACKAGES_VERSION_FORMAT=".+"
export HOST="0.0.0.0"
export PORT="8080"

REQ=$(envsubst < deploy/service.json)
curl --fail -X PUT \
  -H "Content-Type: application/json" \
  -d "$REQ" \
  http://marathon.prod01.internal.advancedtelematic.com:8080/v2/apps
