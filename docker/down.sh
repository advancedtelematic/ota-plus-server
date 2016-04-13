if env | grep -q ^DEFAULT_VERSION=
then
  echo Tearing down using DEFAULT_VERSION=$DEFAULT_VERSION
  docker-compose -f common.yml down &
else
  echo Tearing down using precise.yml
  docker-compose -f common.yml -f precise.yml down &
fi
