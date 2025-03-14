#!/bin/bash

set -uo pipefail -o noclobber

if [ "$1" == "production" ]; then
  cd server && npm ci --omit=dev
  cd ../db && npm ci --omit=dev
else
  cd client && npm install
  cd ../server && npm install
  cd ../db && npm install
fi

