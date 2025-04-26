#!/bin/bash

source ./setenv.sh
docker compose up -d 
echo 'Waiting for database to be ready...'
./wait-for-it.sh "${DATABASE_URL}" -- echo 'Database is ready!'

cd ../db
npx prisma migrate dev

cd ../test
vitest --no-file-parallelism -c vitest.config.integration.ts
docker compose down