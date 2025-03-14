#!/bin/bash

set -uo pipefail -o noclobber

if [ $(curl -o /dev/null localhost:3001/docs/ -s -w "%{http_code}\n") != "200" ]; then
    exit 1
fi
