#!/bin/bash
# assumes data/index.json has been built
rm -rf ./pages
git clone . ./pages
rm -rf ./pages/*
rm -rf ./pages/*.gitignore
mv data/index.json pages/index.json
cd pages
git checkout --orphan gh-pages
git add index.json
git commit -m 'index.json'
git push origin gh-pages -f