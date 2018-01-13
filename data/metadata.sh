#!/bin/sh
DATABASE_URL=pgsql://localhost/ambassador PROTOCOL=http API_HOST=localhost API_PORT=8081 node ./metadata.js
