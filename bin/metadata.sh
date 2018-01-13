#!/bin/sh
# test env uses `babel-preset-env` with `babel-plugin-dynamic-import-node`
export NODE_ENV=test
export DATABASE_URL=pgsql://localhost/ambassador
export PROTOCOL=http
export API_HOST=localhost
export API_PORT=8081
npx babel-node ./metadata.js
