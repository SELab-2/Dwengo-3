#!/bin/bash
set -uo pipefail -o noclobber -o allexport
source .env.test
set +o allexport

# check if the DATABASE_URL is set
if [[ -z "${DATABASE_URL}" ]]; then
  echo "DATABASE_URL is not set. Please set it in the .env.test file."
  exit 1
fi

cp -r ../db/node_modules/.prisma ../db/node_modules/@prisma ../test/node_modules/

ts-node cleanDatabase.ts

vitest --run --no-file-parallelism -c vitest.config.integration.ts

ts-node cleanDatabase.ts