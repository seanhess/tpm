#!/bin/bash

# POST-sync installation

domain=$1

echo "DEPLOY"

npm install
make build

# set up nginx
sudo cp server/config/nginx.conf /etc/nginx/conf.d/tpm.conf
sudo service nginx stop
sudo service nginx start

# set up node server
sudo cp server/config/upstart.conf /etc/init/tpm.conf
sudo stop tpm
sudo start tpm
