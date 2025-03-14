#!/bin/bash

set -uo pipefail -o noclobber

cd db && dotenv -e ../.env -- npx prisma generate --no-hints

if (( $# > 1 )) && [[ "$1" == "migrate" ]]; then
    dotenv -e ../.env -- npx prisma migrate "$2"
fi

cp -r node_modules/@prisma ../server/node_modules/
if [ "$2" != "deploy" ]; then
  cp -r node_modules/.prisma ../server/node_modules/
fi
