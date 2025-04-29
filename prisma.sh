#!/bin/bash

set -o pipefail -o noclobber

#if env is not set, set default to .env
if [[ -z "${ENV_FILE}" ]]; then
  ENV_FILE='.env'
fi

cd db && dotenv -e "../$ENV_FILE" -- npx prisma generate --no-hints

if (( $# > 1 )) && [[ "$1" == "migrate" ]]; then
    dotenv -e "../$ENV_FILE" -- npx prisma migrate "$2" "$3" --no-hints
fi

cp -r node_modules/@prisma ../server/node_modules/

if (( $# <= 1 )) || [[ "$2" != "deploy" ]]; then
  cp -r node_modules/.prisma ../server/node_modules/
fi
