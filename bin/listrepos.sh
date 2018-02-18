#!/bin/sh
export NODE_ENV=test
export DATABASE_URL=pgsql://localhost/ambassador
cat ../data/repos.list | npx babel-node ./listrepos.js > ../data/repos.json
