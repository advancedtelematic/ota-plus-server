#!/bin/bash
set -e

export JOB_NAME="${JOB_NAME-ota-plus-web}"
export VAULT_ENDPOINT=${VAULT_ENDPOINT-$(echo $JOB_NAME | tr "-" "_")}
export IMAGE_NAME="ota-plus-web"
export REGISTRY="advancedtelematic"
export DOCKER_TAG=`cat ../deploy/version.properties`
export IMAGE_ARTIFACT=${REGISTRY}/${IMAGE_NAME}:${DOCKER_TAG}
export KAFKA_TOPIC_SUFFIX=${DEPLOY_ENV-production}
export MESSAGING_MODE=kafka

# Merge service environment variables with secrets from this vault endpoint.
export CATALOG_ADDR="http://catalog.gw.prod01.internal.advancedtelematic.com"

REQ=$(envsubst < deploy/service.json)
curl -Ssf                               \
     -H "X-Vault-Token: ${VAULT_TOKEN}" \
     -X POST                            \
     -d"$REQ"                           \
     ${CATALOG_ADDR}/service/${VAULT_ENDPOINT}
