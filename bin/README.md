# Data processing scripts

Here are some scripts to process logs and metadata.

## listrepos

`listrepos.js` create a repo list from the `repos.list` file. If one gives `(user or organization)/*` instead of a specific repo name, it will fetch all repos from GitHub using the access token from `DATABASE_URL`.

## metadata

`metadata.js` fetches `g0v.json` from generated repo list. If the result is found and well-formed, it will be saved to its own directory(`/data/v1/*`) for later analysis.

## group

`group.js` validate v1 and patched(v2) `g0v.json` files which are fetched by `metadata.js` and group them a better entry point.

## keywords

`keywords.js` fetches all logs and uses `jieba` to segment Chinese words. Results will be saved to `data/logs/*.json`.

It requires `LOGBOT_URL` and `DDAY` to fetch chat logs.

## indices

`indicies.js` builds reverse indices from `data/logs/*.json` and save it to `data/logs/index.json`. 
