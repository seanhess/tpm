#!/bin/bash
# assumes data/index.json has been built
# you can already assume they're on linux
git clone . /tmp/tpm-build
mkdir /tmp/tpm-build/data
mv -f data/index.json /tmp/tpm-build/data
cd /tmp/tpm-build
git remote add github git@github.com:seanhess/tpm.git 
git checkout gh-pages
git add data/index.json
git commit -m 'index.json'
git push github gh-pages -f