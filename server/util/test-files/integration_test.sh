#!/bin/bash

cd ./util/test-files
source .env.test
docker compose up -d 

cd ../../../db
npx prisma migrate dev

cd ../server
vitest run -c ./util/test-files/vitest.config.integration.ts

cd ./util/test-files
docker compose down