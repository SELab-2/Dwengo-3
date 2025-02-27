#!/bin/bash

sudo cp -r result/* /var/www/html
sudo systemctl restart caddy
