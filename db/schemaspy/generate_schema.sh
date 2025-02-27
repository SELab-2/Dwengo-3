#!/bin/bash

sudo docker pull schemaspy/schemaspy
sudo docker run --rm -v "$PWD/result:/output" -v "./schemaspy.properties:/schemaspy.properties" schemaspy/schemaspy
