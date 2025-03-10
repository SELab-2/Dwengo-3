#!/bin/bash

cd ./util/test-files
docker compose up -d 

cd ../../../db
dotenv -e ../server/util/test-files/.env.test -- npx prisma migrate dev

cd ../server
vitest run -c ./util/test-files/vitest.config.integration.ts

cd ./util/test-files
docker compose down