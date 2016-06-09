#!/bin/bash

export DEFAULT_VERSION=latest

docker rm --force mysql-sota || true

# using up here instead of create start because:
# https://github.com/docker/compose/issues/2908
docker-compose -f common.yml down
docker-compose -f common.yml rm
docker-compose -f common.yml up -d db &
echo sleeping
sleep 30
echo waking
docker-compose -f common.yml create
docker-compose -f common.yml start
