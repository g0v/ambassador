#!/bin/sh
# test env uses `babel-preset-env` with `babel-plugin-dynamic-import-node`
export NODE_ENV=test
npx babel-node ./metadata.js
