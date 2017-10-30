# YA0H: Yet Another g0v Hub

[獎助金網站連結](https://grants.g0v.tw/projects/5969ed35d60a0d001ed1f7f6)

是不是直接改名叫機器大使就好？ XD

## we b logs

### 2017-10-31

回到 web annotation 上來。知道怎麼把 `hypothesis/client` ，接著就要加功能了。

現在需要找個地方放「在 pdf 上畫框框」按鈕，看來看去放在 sidebar 上最好。可是 sidebar 裡面的東西其實是由 `hypothesis/h` 管的，也就是 `https://hypothes.is/app.html` ，我可不能在那裡加按鈕。

只剩下左邊的 toolbar 和 bucket 。 bucket 用來顯示可見範圍內有哪些 annotation 。 toolbar 當然就是最適合加功能的地方。

打算加上一個畫著筆的按鈕，當該按鈕被點擊後， pdf 會蓋上一層薄薄的灰色，讓 pdf 變得不明顯。這灰色就是可以畫框框的區域。接著可以以滑鼠拖拉，加上註解。但是加註解的輸入框，仍由 `app.html` 負責，不知道 `client` 和 `h` 怎麼溝通？

待新增成功後，再來煩惱怎麼呈現 PDF fragment 。

### 2017-10-29

專案架構訪問系列文，題目暫定為「沒有人一起看 g0v 專案」。第一彈是 itaigi ：

  * [沒有人一起看 g0v 專案 - 愛台語 itaigi][arch-itaigi]

雖然初衷寫著「沒有人一起讀 code 」，但可能的話還是希望這系列訪問不限於程式技術。

[arch-itaigi]: https://g0v.hackpad.tw/-g0v-itaigi-V0pJpwxbfl2

### 2017-10-27

itaigi 的技術特色：

  * 一開始選用 LiveScript 來寫 React 網站，後來用 ES2015
  * 丞宏（sih4sing5hong5）除了開發 API 功能外，也用 django-behave 管理功能需求
    * 但後來沒用到，還是拿掉了
  * API 先用 Apiary mock
  * API server 的一開始採用 Angular
  * 可以用中文的地方都用了中文，包含變數、 API routes 、 JSON field name
  * API server 後來移到了[臺灣言語平台][tai5-uan5_gian5-gi2_phing5-tai5]
  * 用 `react-transmit` 取得非同步資料，不知道後來有沒有換？
  * 一開始選用 standard coding style ，後來換成 airbnb ，定期跑 jscs
  * 留言外包給 Disqus

快一週只掃過 3xx 個 commits ，放棄，看 code 就好。

話說回來，真的看到專案架構底定就差不多了，後面都是加新功能。

[tai5-uan5_gian5-gi2_phing5-tai5]: https://github.com/sih4sing5hong5/tai5-uan5_gian5-gi2_phing5-tai5

### 2017-10-24

回到 web annotation 。除了 YA0H 以外， hychen 的 GGV 也用得上。 Hypothesis 的 [client][hypothesis/client] 在 pdf 上只支援附註與 highlight 。沒辦法畫框框，自然沒有辦法在未經過 OCR 的文件上註記。

加上附註的 selectors 像這樣：

```
[{
  type: 'TextPositionSelector',
  start: 0,
  end: 42
}, {
  type: 'TextQuoteSelector',
  exact: 'A History of Haskell:Being Lazy With Class',
  prefix: '  ↵        ↵↵        ↵          ',
  suffix: 'April 16, 2007Paul HudakYale Uni'
}]
``` 

和 html 上的附註不太一樣。 html 上會多一個 range selector ：

```
{
  type: 'RangeSelector',
  startContainer: '/div[2]/article[1]/div[1]/p[3]',
  startOffset: 8,
  endContainer: '/div[2]/article[1]/div[1]/p[3]',
  endOffset: 12
}
```

另外 Hypothesis 的 range selector 和 [web annotation data model][WADM] 中定義的不太一樣，不知道哪天會遇上按著 WADM 實作的版本？

下一步是找看看有沒有辦法在 pdf 上，實現畫框框(fragment selector)上註解。

[hypothesis/client]: https://github.com/hypothesis/client
[WADM]: https://www.w3.org/TR/annotation-model/

* * *

Hypothesis 重用了來自 [Open Annotation][openannotation] 的成果。

逛一逛會發現如果想自己搭 annotation 產品，可以用他們開發的 [Annotator][annotatorjs.org] 。而且 Annotator 上能開發 plugins 。如果想要畫框框上註解，目前有一個專門做圖片註解的 plugin 叫做 [annotator-imgselect][annotator-imgselect] ，還有個專門做圖片註解的服務叫做 [annotorious][annotorious] 。

如果我得在 pdf viewer 上實現類似功能，大概會先疊上一層 Canvas ，再開始做和圖片註解一樣的事。

[openannotation]: https://github.com/openannotation
[annotatorjs.org]: http://annotatorjs.org/
[annotator-imgselect]: https://github.com/emory-lits-labs/annotator-imgselect
[annotorious]: https://github.com/annotorious/annotorious

### 2017-10-23

加上了六類 hashtags ，並拿掉新增 hashtag 功能。

Jcrt 很熱心地幫我挖了挖 itaigi 的歷史，發現他們的 [hackpad][itaigi-hackpad] 。 [moed7ct][moed7ct] 和 [moed8ct][moed8ct] 也有紀錄。

他還翻到 au 提過 Liz [本來是台語字典的事務官][sayit-8585]，後來[自己跳坑][sayit-8586]，才有 itaigi 計畫。

話說 Logbot 的資料格式是不是向 SayIt 看齊比較好？

[itaigi-hackpad]: https://g0v.hackpad.tw/moed7ct-taigi-neologism#iTaigi-
[moed7ct]: https://g0v.hackpad.tw/11-moed7ct#11-moed7ct
[moed8ct]: https://g0v.hackpad.tw/1-moed8ct?r=3#1-moed8ct
[sayit-8585]: https://sayit.archive.tw/speech/8585
[sayit-8586]: https://sayit.archive.tw/speech/8586

### 2017-10-21

在基礎松問了問 ipa 她怎麼了解並介紹一個 g0v 專案，提到會先看三方面：

* 解決什麼問題？
* 現在用什麼方式解決？
* 需要什麼樣的人？

（和[專案介紹空白模板][project-template]關心的事情有點相似）

接著就能推給專案主。

我提到爬 log 時發現，有些人在 IRC/general 頻道求坑，被推了 project hub 或 awesome g0v 列表後就沒下文。 ipa 表示入坑有兩方面：

* 對主題有興趣，比較可能入坑
* 本來就有某種技能

後者若都沒有有興趣的主題，就很吃緣分。也因為想讓後者更好找坑，之前 kirby 好像做過一個人找事事找人的 project hub （連結待捕）。

向 ipa 展示了一下 YA0H dashboard ，她提到之前 project hub 的 hashtag 並沒有設限，結果一個人被加二三十個 tag ，反而讓 tag 失去效用，有鑑於此， grants 和現在 g0v.tw 官網統一使用六個分類，用了幾年，成效不錯：

* 開放政府
* 開放資料
* 社會參與
* 新媒體應用
* 政策共筆
* g0v基礎建設

看來我可以把這六類加到我的 hashtag 中，並取消使用者新增 tag 的功能，把新增 tag 當成管理功能，甚至靠投票來決定新 tag 。

ipa 還提到，如果新參者一開始就看到 issue 列表，被嚇走的機會很高（可能因為 issue 列表沒有馬上可見的脈絡，且太過技術導向）。

最後還跟 ipa 提了提想做共筆訪談遇到的問題，像是我得先了解要訪問的專案的技術 stack ，才有辦法藉著訪談問出專案架構，看能不能幫助技術入坑者更好上手。

[project-template]: http://beta.hackfoldr.org/g0v-hackath26n/https%253A%252F%252Fg0v.hackpad.tw%252FProject-Readme-aCZGg48I5pX

### 2017-10-20

poga [曾經提過][minimum-viable-ownership]他不喜歡「擁有」這個概念。在該文中，他提到 ZeroMQ 的 Pieter Hintjens 曾整理了一份叫做 [Collective Code Construction Contract][C4] 的 RFC。

除此之外，他還建議我可以去看 Rust 社群怎麼做 [Libz Blitz][libz-blitz] 。

[minimum-viable-ownership]: https://medium.com/@poga/minimum-viable-ownership-7b0c976f7163
[C4]: https://rfc.zeromq.org/spec:42/C4/
[libz-blitz]: https://blog.rust-lang.org/2017/05/05/libz-blitz.html

## 基礎建設松討論過的想法

* [awesome g0v][awesome-g0v]
* g0v hub
    * 現在成了 [g0ver-box][g0ver-box] ？
* [g0vis][g0vis] 專案介紹中心 by Lee
    * [project-from-registry] 後來變成這個？
    * data [repo][registry]
* [g0v Tour Guide 零時導遊][tour-guide] by ETBlue
    * [坑表的 prototype](http://g0v.github.io/g0v-tour-guide/public/hack-panel-pit.html)
    * [坑的 prototype](http://g0v.github.io/g0v-tour-guide/public/hack-panel-pit_ID.html)
* [發起專案 SOP][project-sop]
* [g0v.json][g0v.json]
* g0v repo description (with thumbnail by kirby)
* idea pool
* 早期專案的後續發展 by Kai Che Hung
* 淺坑列表 by ETBlue
* g0v 坑報 by poga
* [projecthub redux][projecthub-redux]
    * [hackpad][projecthub-hackpad] 裡有些珍貴的資料
* [g0vjson-editor]
    * 也許做成 cli 工具而不只是網頁工具？
* g0v.json [editor][editor]
    * civic.json[civic.json]
* [g0v issue tracker][g0v-issue-tracker]
* `www.dgpa.g0v.tw` 人事行政局 g0v 版
* [issue_aggregator][issue_aggregator] in python. 9/5 才發現 XD
* [零時坑報][零時坑報]
* [2014 年的 g0v projects backup][projects-backup]
* [e04 - g0v 人力資源部][e04]

為了降低門檻，也許還得包含部分 levelup 的功能？

另外 project hub 只是社群永續生存，招募新血這件事情的一部分，本來就有很多相關計畫，但只做 project hub 的話，就沒辦法顧及那些計畫。

[awesome-g0v]: https://github.com/g0v/awesome-g0v
[g0ver-box]: https://github.com/g0v/g0ver-box
[project-from-registry]: http://g0v.tw/en-US/project-from-registry.html
[g0vis]: https://g0v.github.io/g0vis/#!/project/0
[registry]: https://github.com/g0v-data/registry
[tour-guide]: https://g0v.hackpad.com/g0v-Tour-Guide--gQQawkQNUl3
[project-sop]: https://g0v.hackpad.com/MSObfHsp2wL
[g0v.json]: https://g0v.hackpad.com/g0v.json-spec-c07sSfauWSc
[projecthub-redux]: https://g0v.hackpad.com/projecthub-redux-9U6DLtdZc48
[projecthub-hackpad]: https://g0v.hackpad.tw/ep/pad/static/9U6DLtdZc48
[g0vjson-editor]: https://ronnywang.github.io/g0vjson-editor/
[editor]: https://github.com/g0v/editor
[civic.json]: https://github.com/BetaNYC/civic.json/blob/master/specification.md
[g0v-issue-tracker]: https://github.com/youchenlee/g0v-issue-tracker
[issue_aggregator]: https://github.com/g0v/issue_aggregator
[零時坑報]: https://g0v.hackpad.tw/-2014-5-6-7--i8tMqWAFi39
[projects-backup]: https://docs.google.com/spreadsheets/d/1MGPMjlEr6qdFLmATShlaXhjjhSwApJvMil5R-xMVyoM/edit#gid=0
[e04]: https://github.com/g0v/e04

## 實體活動經驗

* [g0v.tw 台灣零時政府 @ COSCUP 2014 網路攤位](https://g0v.hackpad.tw/g0v.tw-COSCUP-2014--gVkOW9b3FU8)

## 其他

* [g0v/reporter](https://github.com/g0v/reporter) 公民記者證 - 不知道還有多少案子是跟 318 有關的？可以說怎樣的故事？
* [20140528 自經區溝通會逐字](https://g0v.hackpad.tw/ep/pad/static/Zw8BPf9G4oQ) - venev 手打的五萬字逐字稿。那時還沒有 SayIt ，現在適合放到 SayIt 上嗎？ g0v 的在哪裡呢？[ PDIS 的](https://sayit.pdis.nat.gov.tw/speeches)實在是了不起。
* [超農域](https://g0v.hackpad.tw/ep/pad/static/8Hlh2hux8xg)
    * 原來 ly 也幫忙看過農業系統: https://logbot.g0v.tw/channel/g0v.tw/2014-06-04#192
* [g0v/twgeojson](https://github.com/g0v/twgeojson) - 用現在的新技術，可以拿 twgeojson 做什麼呢？現在有 WebVR, WebGL ...。
    * 更新氣象資料的 [repo](https://github.com/clkao/cwbtw): https://logbot.g0v.tw/channel/g0v.tw/2014-06-04#207
* [動民主](http://hack.g0v.tw/don-democracy/)
* [loomio/loomio](https://github.com/loomio/loomio) - loomio 現在怎麼樣了呢？台灣參與式民主還有在用它嗎？
* wethepeople.tw 也消滅了
* [ronnywang/newsdiff](https://github.com/ronnywang/newsdiff)
* [g0v/twangry](https://github.com/g0v/twangry) 政誌 - 停在 2016...
* [台大資工 CCSP](https://www.facebook.com/ntu.ccsp/) - 嗯，這個我也沒參與到
* [audreyt/archive.tw](https://github.com/audreyt/archive.tw) - 小蟹(Jcrt)講了我才知道這個 repo （艸），如果有這樣的工具存在，那也許 venev 的逐字稿已經匯入某個 SayIt instance 了吧。
* [零時坑報](https://g0v.hackpad.tw/-2014-5-6-7--i8tMqWAFi39) - 原來還有這種嘗試 XD
    > ETBlue> Lee1092: lanf0n: ipa: 每個月一個 pad ，各專案自己上去填，定期變成電子報給在 mailing list 自我介紹過的人，可以在 people project hub 做好之前先頂著用 XD
* 能建立專案與[台灣開源軟體社群列表](https://www.mindmeister.com/303031964/open-source-community-map-in-taiwan)的連結嗎？
* 處理 sandstorm i18n 時完全不知道有 [transifex](https://github.com/transifex/transifex) 這個翻譯平台 >_<
* PDF 處理工具: https://github.com/pdfliberation
* 萌典系列應該可以自成一張表了，例如我之前沒有注意到 [yllan/moedict-csld-mac](https://github.com/yllan/moedict-csld-mac) 。
* [全民除黴計畫](https://g0v.hackpad.tw/APP4AM-0.5--YGd0FvMp9Vr)的 repo 似乎消失了。
* 現在覺得 YA0H 會變成 fetch everything 然後加上 repo tag ，這算 linked data 吧？
* 放棄一句一句上 tag ，先找 itaigi 相關的句子，該不會 itaigi 沒在 general 頻道上討論過？

