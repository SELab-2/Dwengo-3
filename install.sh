#!/bin/bash

set -uo pipefail -o noclobber

cd client || exit
npm install

cd ../server || exit
npm install

cd ../db || exit
npm install

cd ../server || exit
dotenv -e ../.env -- npx prisma generate --no-hints

if (( $# > 1 )) && [[ "$1" == "migrate" ]]; then
    cd ../db || exit
    dotenv -e ../.env -- npx prisma migrate "$2"
fi
