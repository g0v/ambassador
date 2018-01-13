#!/bin/sh
# test env uses `babel-preset-env` with `babel-plugin-dynamic-import-node`
export NODE_ENV=test
export LOGBOT_URL=https://logbot.g0v.tw
export DDAY=2013-07-26
npx babel-node ./keywords.js
