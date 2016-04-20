#!/bin/bash
set -e

export JOB_NAME="ota-plus-resolver"

if [[ ! -z $DEPLOY_ENV && $DEPLOY_ENV != "master" ]]; then
  export JOB_NAME="${JOB_NAME}-${DEPLOY_ENV}"
fi

export VAULT_ENDPOINT=$(echo $JOB_NAME | tr "-" "_")

export REGISTRY="advancedtelematic"
export BRANCH_TAG=$(echo ${TC_BRANCH_NAME} | sed 's/\//_/')
export DOCKER_TAG=${BUILD_NUMBER}-${BRANCH_TAG}-${BUILD_VCS_NUMBER}
export IMAGE_ARTIFACT=${REGISTRY}/${JOB_NAME}:${DOCKER_TAG}
export LATEST_ARTIFACT=${REGISTRY}/ota-plus-resolver:latest
export LATEST_SBT_IMAGE=$(docker images -q | head -n 1)
echo Tagging image as: ${IMAGE_ARTIFACT}

echo Tagging image as: ${IMAGE_ARTIFACT}
docker tag ${LATEST_SBT_IMAGE} ${IMAGE_ARTIFACT}
docker push ${IMAGE_ARTIFACT}

echo Tagging image as: ${LATEST_ARTIFACT}
docker tag ${LATEST_SBT_IMAGE} ${LATEST_ARTIFACT}
docker push ${LATEST_ARTIFACT}

export VDATA=$(curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" -X GET ${VAULT_ADDR}/v1/secret/${VAULT_ENDPOINT})
export RESOLVER_DB_URL="$(echo $VDATA | jq -r .data.resolver_db_url)"
export RESOLVER_DB_USER="$(echo $VDATA | jq -r .data.resolver_db_username)"
export RESOLVER_DB_PASSWORD="$(echo $VDATA | jq -r .data.resolver_db_password)"
export HOST="0.0.0.0"
export PORT="8081"
export PACKAGES_VERSION_FORMAT=".+"

REQ=$(envsubst < deploy/service.json)
curl --fail -X PUT \
  -H "Content-Type: application/json" \
  -d "$REQ" \
  http://marathon.prod01.internal.advancedtelematic.com:8080/v2/apps
