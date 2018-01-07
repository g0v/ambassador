# Ambassador - yet another g0v project hub

機器大使 Ambassador 是公民科技創新獎助金 - 2017 秋季的[提案之一][YA0H]，目的是作為 g0v
大使手腳的延伸，協助大使與參與者更有效地追蹤各專案的動態。取名機器大使正是希望像饅頭一樣，機器饅頭比手工饅頭更有效率。

雖然計畫的目的是一個給 g0v 大使追蹤專案的 dashboard ，但在它成形前，重用其他
project hub 相關成果所需的程式也會放在此專案中。

[YA0H]: https://grants.g0v.tw/projects/5969ed35d60a0d001ed1f7f6

## 開發

先以 `npm install` 或 `yarn` 安裝套件。

### web server 參數

#### GH_BASIC_CLIENT_ID & GH_BASIC_SECRET

The GitHub OAuth client ID and secret. The application backend(`/server/index.js`) uses it to handle OAuth logins.

```sh
GH_BASIC_CLIENT_ID=2222f1ffb522f6bb4480 GH_BASIC_CLIENT_SECRET=9eee00006da733b22cb1234339301cc67d943eff
```

#### ADMIN_EMAIL

The administrator email address. The application backend uses it to set the GitHub access token. It defaults to `admin@example.com`.

```
ADMIN_EMAIL=admin@example.com
```

#### DATABASE_URL

The PostgreSQL DB URL.

```sh
DATABASE_URL=pgsql://localhost/ambassador
```

#### LOGBOT_URL

The location of [Logbot][Logbot]. The application backend uses it to fetch information from Logbot.

```sh
LOGBOT_URL=https://logbot.g0v.tw
```

#### HTTPS

The protocol of the application backend. It defaults to nothing.

```sh
HTTPS=true
```

#### API_HOST: the web server hostname

The hostname of the application backend. It defaults to `localhost`.

```sh
API_HOST=localhost
```

#### API_PORT: the web server port

The port number of the application backend. It defaults to `80`.

```sh
API_PORT=8081
```

### web client 參數

#### LOGBOT_URL

The location of [Logbot][Logbot]. The application frontend uses it to embed the page.

```sh
LOGBOT_URL=https://logbot.g0v.tw
```

#### HTTPS

The procotol of the application frontend. It defaults to nothing.

```sh
HTTPS=true
```

#### HOST

The hostname of the web frontend. It defaults to `localhost`.

```sh
HOST=localhost
```

#### PORT

The port number of the web frontend. It defaults to `80`.

```sh
PORT=8080
```

#### API_HOST

The hostname of the application backend. It defaults to `localhost`. The web frontend uses it to communicate with the backend service.

```sh
API_HOST=localhost
```

#### API_PORT

The port number of the application backend. It defaults to `80`. The web frontend uses it to communicate with the backend service.

```sh
API_PORT=8081
```

#### DDAY

The date that logs begin. It defaults to `1970-01-01`.

```sh
DDAY=2013-07-26
```

[Logbot]: https://github.com/g0v/Logbot

## 其他

### 測試

```
npm run test
```

### 型別檢查

```
flow-typed install
npm run flow
```

## License

[CC0][CC0]

[CC0]: https://creativecommons.org/publicdomain/zero/1.0/

## References

* 讀取圖示 `g0v.jump.l.gif` 取自 [g0v/style-guide](https://github.com/g0v/style-guide) ，以[ MIT 授權](https://github.com/g0v/style-guide/blob/gh-pages/LICENSE)釋出。

