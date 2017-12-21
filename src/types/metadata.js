/* @flow */

// g0v.json 2.0
//   * old spec: https://g0v.hackpad.tw/g0v.json-spec-c07sSfauWSc
export type Project = {
  // 主要作者
  author: string,
  // 專案狀況
  status: ProjectStatus,
  // 英文名, 一般為簡短的代號 (不含 .#$[] 等符號)
  name: string,
  // 中文名
  name_zh: string,
  // 英文描述
  description: string,
  // 中文描述
  description_zh: string,
  // 網頁
  homepage: Url,
  // 縮圖 (TODO 建議大小?)
  thumbnail: Url,
  // 說明這個 project 的文件、網頁、或 hackpad
  document: Url,
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
  // 主專案
  //   * 專案自己就是主要專案時，可以為 null 或不填寫
  parent?: ?Product,
  // 這個專案的產出
  products: Product[],
  // 同計畫相關專案
  projects: Product[],
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
  // should be one of the SPDX listed licenses: https://spdx.org/licenses/
  type: string
}

export type Product
  = string
  | WebsiteProduct
  | AppProduct
  | ExtensionProduct
  | LibraryProduct
  | ApiProduct
  | DataProduct
  | ScriptProduct

export type WebsiteProduct = {
  type: 'website',
  name: string,
  url?: Url
}

export type AppProduct = {
  type: 'app',
  subtype: 'android' | 'ios' | 'firefox' | 'desktop',
  name: string,
  url?: Url
}

export type ExtensionProduct = {
  type: 'extension',
  subtype: 'chrome' | 'firefox' | 'safari' | 'visualstudio' | 'vscode' | 'sublime' | 'atom' | 'vim' | 'emacs',
  name: string,
  url?: Url
}

export type LibraryProduct = {
  type: 'library',
  name: string,
  url?: Url
}

export type ApiProduct = {
  type: 'api',
  name: string,
  url?: Url
}

export type DataProduct = {
  type: 'data',
  name: string,
  url?: Url
}

export type ScriptProduct = {
  type: 'script',
  name: string,
  url?: Url
}

export type Skill = 'designer' | 'writer' | 'programmer' | 'money'
