#!/bin/bash

if command -v docker-compose >/dev/null 2>&1 && docker-compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    DOCKER_COMPOSE="docker compose"
fi

source ./setenv.sh
$DOCKER_COMPOSE up -d
echo 'Waiting for database to be ready...'
./wait-for-it.sh "${DATABASE_URL}" -- echo 'Database is ready!'

cd ../db
npx prisma migrate dev

cd ../test
vitest --run --no-file-parallelism -c vitest.config.integration.ts
docker compose down