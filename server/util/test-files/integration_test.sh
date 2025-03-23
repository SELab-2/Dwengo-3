#!/bin/bash

cd ./util/test-files
source ./setenv.sh
docker compose up -d 
echo 'Waiting for database to be ready...'
./wait-for-it.sh "${DATABASE_URL}" -- echo 'Database is ready!'

cd ../../../db
npx prisma migrate dev

cd ../server
vitest --run --singleThread -c ./util/test-files/vitest.config.integration.ts

cd ./util/test-files
docker compose down