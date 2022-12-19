#!/bin/bash

: ${SLEEP_LENGTH:=2}

wait_for() {
  echo Waiting for $1 to listen on $2...
  while ! nc -z $1 $2; do echo sleeping; sleep $SLEEP_LENGTH; done
}

for var in "$@"
do
  host=${var%:*}
  port=${var#*:}
  wait_for $host $port
done

if [ "$SKIP_MIGRATE" = "true" ]
then
  echo "skipping migrate"
else
  # update my sql
  echo "create-if-not-exist database"
  node node_modules/db-migrate/bin/db-migrate db:create hackerium_account --config ./database/database.json -e default_for_create_database
  echo "finished create-if-not-exist database"

  echo "update database"
  node node_modules/db-migrate/bin/db-migrate up --config ./database/database.json -e default -m ./database/migrations/database
  echo "finished update database"

  # update kvs
  echo "create-if-not-exist kvs"
  node node_modules/db-migrate/bin/db-migrate db:create account_kvs --config ./database/database.json -e default_for_key_value_store
  echo "finished create-if-not-exist kvs"

  echo "update kvs"
  node node_modules/db-migrate/bin/db-migrate up --config ./database/database.json -e update_key_value_store -m ./database/migrations/key-value-store
  echo "finished update kvs"

  # update eventstore
  echo "create-if-not-exist eventstore"
  node node_modules/db-migrate/bin/db-migrate db:create account_eventstore --config ./database/database.json -e default_for_event_store
  echo "finished create-if-not-exist eventstore"

  echo "update eventstore"
  node node_modules/db-migrate/bin/db-migrate up --config ./database/database.json -e update_event_store -m ./database/migrations/event-store
  echo "finished update eventstore"

  # update write
  echo "create-if-not-exist write"
  node node_modules/db-migrate/bin/db-migrate db:create account_write --config ./database/database.json -e default_for_write
  echo "finished create-if-not-exist write"

  echo "update write"
  node node_modules/db-migrate/bin/db-migrate up --config ./database/database.json -e update_write_repository -m ./database/migrations/write-repo
  echo "finished update write"
fi

if [ "$SKIP_START" = "true" ]
then
  echo "skipping start"
else
  # echo "starting node app"
  # node ./bin/www

  echo "starting node app with nodemon"
  node_modules/.bin/nodemon -e js,yaml --inspect=0.0.0.0:5858 --ignore 'spec/*/*.spec.js' ./bin/www
fi
