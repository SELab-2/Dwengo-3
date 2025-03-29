#!/bin/bash

set -uo pipefail -o noclobber

if (( $# > 1 )) && [[ "$1" == "production" ]]; then
  npm ci
  cd client && npm ci
  cd ../server && npm ci
  cd ../db && npm ci
else
  npm install
  cd client && npm install
  cd ../server && npm install
  cd ../db && npm install
fi

