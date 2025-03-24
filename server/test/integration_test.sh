#!/bin/bash

cd ./test
source ./setenv.sh
docker compose up -d 
echo 'Waiting for database to be ready...'
./wait-for-it.sh "${DATABASE_URL}" -- echo 'Database is ready!'

cd ../../db
npx prisma migrate dev

cd ../server
vitest -c ./test/vitest.config.integration.ts

cd ./test
docker compose down