#!/usr/bin/bash

export $(grep -v '^#' .env.test | xargs)