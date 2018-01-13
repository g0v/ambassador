# Data processing scripts

Here are some scripts to process logs and metadata.

## metadata

`metadata.js` fetches `g0v.json` from all g0v repos. If the result is found and well-formed, it will be saved to its own directory for later analysis.

It requires `DATABASE_URL` for the GitHub access token. You have to run the API server first so it can proxy `g0v.json` for you. So you also need to set `PROTOCOL`, `API_HOST`, `API_PORT` for it.

## keywords

`keywords.js` fetches all logs and uses `jieba` to segment Chinese words. Results will be saved to `data/logs/*.json`.

It requires `LOGBOT_URL` and `DDAY` to fetch chat logs.

## indices

`indicies.js` builds reverse indices from `data/logs/*.json` and save it to `data/logs/index.json`. 
