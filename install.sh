#!/bin/bash

set -uo pipefail -o noclobber

if (( $# > 1 )) && [[ "$1" == "production" ]]; then
  cd server && npm ci
  cd ../db && npm ci
else
  cd client && npm install
  cd ../server && npm install
  cd ../db && npm install
fi

