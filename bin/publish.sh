#!/bin/bash
# assumes data/index.json has been built
set -e
git stash
git checkout gh-pages
git add data/index.json
git commit -m 'index.json'
git push origin gh-pages -f
git checkout master
git stash pop