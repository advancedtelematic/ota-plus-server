#!/bin/bash

AUTHPLUS_URL="${AUTHPLUS_URL:-http://localhost:9001}"

set -e
set -u

which jq > /dev/null

auth_plus_out=$(curl --silent --connect-timeout 3 -H "Content-Type: application/json" \
                     -X POST \
                     -d '{  "client_name": "ABC", "grant_types": ["client_credentials", "password"]  }' \
                     "$AUTHPLUS_URL/clients")

client_id=$(echo $auth_plus_out | jq '.client_id ')
client_secret=$(echo $auth_plus_out | jq '.client_secret ')

echo "export AUTHPLUS_HOST=\"$AUTHPLUS_URL\""
echo "export CORE_INTERACTION_PROTOCOL=http"
echo "export AUTHPLUS_CLIENT_ID=$client_id"
echo "export AUTHPLUS_SECRET=$client_secret"
