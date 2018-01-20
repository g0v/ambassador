/* @flow */

// g0v.json 2.0
//   * old spec: https://g0v.hackpad.tw/g0v.json-spec-c07sSfauWSc
// 這個版本新增了 `group` 和 `dependencies` 欄位，移除了 `projects` 欄位。
// 詳情請見 `Product` 和 `Dependency` types 。
export type Project = {
  // g0v.json 版本，省略時視為 1.0 版
  g0v_json?: '2.0',
  // 主要作者
  author: string,
  // 專案狀況
  status: ProjectStatus,
  // 英文名, 一般為簡短的代號 (不含 .#$[] 等符號)
  name: string,
  // 中文名
  name_zh?: string,
  // 英文描述
  description: string,
  // 中文描述
  description_zh?: string,
  // 網頁
  homepage?: Url,
  // 縮圖 (TODO 建議大小?)
  thumbnail?: Url,
  // 說明這個 project 的文件、網頁、或 hackpad
  document?: Url,
  // 工作資料區
  //   * 這欄位主要是給程式專案使用, 表示 code 公開的 url
  //   * 其他類型的專案也許是 google doc 或是 dropbox folder 之類. 譬如的圖庫、照片、資料檔
  repository: {
    type: RepoType,
    url: Url
  },
  // 專案授權
  //   * 若是少見或是特別的 license, 請加上 url, 譬如 http://g0v.mit-license.org/
  licenses: License[],
  // 專案關鍵字
  //   * 目前沒有限定哪方面的關鍵字
  //   * 可以是專案性質、解決哪方面的問題，也可以是用到的技術、技能
  keywords: string[],
  // 這個專案的目標群
  audience: Audience[],
  // 主專案，自己就是主要專案時，請填上自己的 url
  group: Url,
  // 這個專案的產出
  products: Product[],
  // 同計畫相關專案
  dependencies: Dependency[],
  // 參與者
  contributors: string[],
  // 需要哪種人、技術支援
  needs: Skill[]
}

export type Url = string

export type ProjectStatus
  = 'planning'
  | 'pre-alpha'
  | 'alpha'
  | 'beta'
  | 'production'
  | 'stable'
  | 'mature'
  | 'inactive'

export type RepoType = 'git' | 'hg' | 'svn' | 'cvs' | 'svk'

export type Audience = 'contributor' | 'public'

export type License = {
  // TODO: should be one of the SPDX listed licenses: https://spdx.org/licenses/
  type: SPDXLicense | 'custom',
  url?: string,
}

// Product 描述專案成果
// 成果不見得是程式碼，現在分成五類：
//   * string:           兼容舊版 g0v.json
//   * WebsiteProduct:   網站
//   * AppProduct:       應用程式
//   * ExtensionProduct: 擴充套件
//   * DevProduct:       程式工具
// 有些 type 有 subtype ，方便在 YA0H 這樣的 project hub 上挑選適當的 icon 來呈現。
export type Product
  = string
  | WebsiteProduct
  | AppProduct
  | BotProduct
  | ExtensionProduct
  | DevProduct

export type WebsiteProduct = {
  type: 'website',
  name: string,
  url?: Url,
  source?: Url
}

export type AppProduct = {
  type: 'app',
  // mobile app 分成 Android, iOS, Firefox 三類， desktop app 先不細分
  subtype: 'android' | 'ios' | 'firefox' | 'desktop',
  name: string,
  url?: Url,
  source?: Url
}

export type BotProduct = {
  type: 'bot',
  subtype: 'facebook' | 'line' | 'slack' | 'telegram' | 'wechat',
  name: string,
  url?: Url,
  source?: Url
}

export type ExtensionProduct = {
  type: 'extension',
  // 包含瀏覽器套件和開發工具套件
  subtype: 'chrome' | 'firefox' | 'safari' | 'visualstudio' | 'vscode' | 'sublime' | 'atom' | 'vim' | 'emacs',
  name: string,
  url?: Url,
  source?: Url
}

export type DevProduct = {
  type: 'dev',
  // 承襲 g0v.json 1.0 的 product type
  subtype: 'api' | 'data' | 'script' | 'library',
  name: string,
  url?: Url,
  source?: Url
}

// Dependency type 描述專案在開發上的相依性，不像 package.json 那樣把所有的套件都列出來，只列出依賴的 g0v 專案。
// 專案間的依賴關係圖可以在爬完 g0v.json 後離線產生，但 YA0H repo dashboard 還沒有準備好呈現這樣的資訊。
export type Dependency = {
  url: Url
}

// 需求清單，最好和尚未決定的「通用 GitHub issue labels」通用，才有機會以 needs 列表找出重要的 issues 。
export type Skill = 'designer' | 'writer' | 'programmer' | 'money'

// https://spdx.org/licenses/
export type SPDXLicense
  = '0BSD'
  | 'AAL'
  | 'Abstyles'
  | 'Adobe-2006'
  | 'Adobe-Glyph'
  | 'ADSL'
  | 'AFL-1.1'
  | 'AFL-1.2'
  | 'AFL-2.0'
  | 'AFL-2.1'
  | 'AFL-3.0'
  | 'Afmparse'
  | 'AGPL-1.0'
  | 'AGPL-3.0-only'
  | 'AGPL-3.0-or-later'
  | 'Aladdin'
  | 'AMDPLPA'
  | 'AML'
  | 'AMPAS'
  | 'ANTLR-PD'
  | 'Apache-1.0'
  | 'Apache-1.1'
  | 'Apache-2.0'
  | 'APAFML'
  | 'APL-1.0'
  | 'APSL-1.0'
  | 'APSL-1.1'
  | 'APSL-1.2'
  | 'APSL-2.0'
  | 'Artistic-1.0-cl8'
  | 'Artistic-1.0-Perl'
  | 'Artistic-1.0'
  | 'Artistic-2.0'
  | 'Bahyph'
  | 'Barr'
  | 'Beerware'
  | 'BitTorrent-1.0'
  | 'BitTorrent-1.1'
  | 'Borceux'
  | 'BSD-1-Clause'
  | 'BSD-2-Clause-FreeBSD'
  | 'BSD-2-Clause-NetBSD'
  | 'BSD-2-Clause-Patent'
  | 'BSD-2-Clause'
  | 'BSD-3-Clause-Attribution'
  | 'BSD-3-Clause-Clear'
  | 'BSD-3-Clause-LBNL'
  | 'BSD-3-Clause-No-Nuclear-License-2014'
  | 'BSD-3-Clause-No-Nuclear-License'
  | 'BSD-3-Clause-No-Nuclear-Warranty'
  | 'BSD-3-Clause'
  | 'BSD-4-Clause-UC'
  | 'BSD-4-Clause'
  | 'BSD-Protection'
  | 'BSD-Source-Code'
  | 'BSL-1.0'
  | 'bzip2-1.0.5'
  | 'bzip2-1.0.6'
  | 'Caldera'
  | 'CATOSL-1.1'
  | 'CC-BY-1.0'
  | 'CC-BY-2.0'
  | 'CC-BY-2.5'
  | 'CC-BY-3.0'
  | 'CC-BY-4.0'
  | 'CC-BY-NC-1.0'
  | 'CC-BY-NC-2.0'
  | 'CC-BY-NC-2.5'
  | 'CC-BY-NC-3.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-NC-ND-1.0'
  | 'CC-BY-NC-ND-2.0'
  | 'CC-BY-NC-ND-2.5'
  | 'CC-BY-NC-ND-3.0'
  | 'CC-BY-NC-ND-4.0'
  | 'CC-BY-NC-SA-1.0'
  | 'CC-BY-NC-SA-2.0'
  | 'CC-BY-NC-SA-2.5'
  | 'CC-BY-NC-SA-3.0'
  | 'CC-BY-NC-SA-4.0'
  | 'CC-BY-ND-1.0'
  | 'CC-BY-ND-2.0'
  | 'CC-BY-ND-2.5'
  | 'CC-BY-ND-3.0'
  | 'CC-BY-ND-4.0'
  | 'CC-BY-SA-1.0'
  | 'CC-BY-SA-2.0'
  | 'CC-BY-SA-2.5'
  | 'CC-BY-SA-3.0'
  | 'CC-BY-SA-4.0'
  | 'CC0-1.0'
  | 'CDDL-1.0'
  | 'CDDL-1.1'
  | 'CDLA-Permissive-1.0'
  | 'CDLA-Sharing-1.0'
  | 'CECILL-1.0'
  | 'CECILL-1.1'
  | 'CECILL-2.0'
  | 'CECILL-2.1'
  | 'CECILL-B'
  | 'CECILL-C'
  | 'ClArtistic'
  | 'CNRI-Jython'
  | 'CNRI-Python-GPL-Compatible'
  | 'CNRI-Python'
  | 'Condor-1.1'
  | 'CPAL-1.0'
  | 'CPL-1.0'
  | 'CPOL-1.02'
  | 'Crossword'
  | 'CrystalStacker'
  | 'CUA-OPL-1.0'
  | 'Cube'
  | 'curl'
