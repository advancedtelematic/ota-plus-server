if env | grep -q ^DEFAULT_VERSION=
then
  echo Using DEFAULT_VERSION=$DEFAULT_VERSION
  docker-compose -f common.yml up -d db &
  sleep 120
  docker-compose -f common.yml up &
else
  echo Using precise.yml
  docker-compose -f common.yml -f precise.yml up -d db &
  sleep 120
  docker-compose -f common.yml -f precise.yml up &
fi
