#!/bin/bash

LATEST_TAG=`docker images | grep ota-plus-web | head -n 1 | awk '{print $(2)}'`
sed -i "s/BUILT_TAG/$LATEST_TAG/" teamcity.yml
