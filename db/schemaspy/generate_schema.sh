#!/bin/bash

set -uo pipefail -o noclobber
cd "$(dirname "$0")" || exit

sudo docker pull schemaspy/schemaspy
sudo docker run --rm -v "./result:/output" -v "./schemaspy.properties:/schemaspy.properties" schemaspy/schemaspy
