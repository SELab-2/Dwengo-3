#!/bin/bash

set -uo pipefail -o noclobber
cd "$(dirname "$0")" || exit

sudo cp -r result/* /var/www/html/schemaspy
sudo systemctl restart caddy
