# 沒有人一起看 g0v 專案 - 阿美語萌典

## 團隊 Q&A

YA0H 其中一個初衷是「沒有人一起讀 code 」！第二彈是阿美語萌典。 au 開發的萌典是 g0v 最經典的專案之一， README 詳盡，但是用上了一些冷門技術，像是 LiveScript 。阿美語萌典在 miaoski 的手中上線，現在主要開發者是 wildjcrt ，未來會如何發展呢？

### Q: 可以介紹一下團隊成員嗎？

* Lafin Miku  
  阿美族，原住民族轉型正義委員會 副研究員，阿美語萌典發起人，萌典系統維護統籌。
* Weiting Tseng (a.k.a 維庭）  
  人類學家。阿美語萌典校對與宣傳。
* miaoski (a.k.a 喵斯基)  
  阿美語萌典發起人與系統維護工程師。
* 小蟹 (a.k.a Jerry Lee, id: wildjcrt)  
  女人迷工程師，擅長 Ruby / Ruby on Rails。  
  目前阿美語萌典網站功能開發、架構與維護的主要工程師，同時也負責需求統合和規劃開發進度。


### Q: 之前聽小蟹（wildjcrt）說，阿美語萌典團隊報名了「原住民族語言認證」，為什麼會有這樣的念頭？

小蟹：

對我來說，我的 native 是國語和台語，我台語也可以還算流利的溝通，那這兩種語言考認證對我是沒有吸引力的。而阿美語是台灣在地語言之一，但會講的人越來越少，我希望可以盡點力協助保留文化，再加上阿美語對我來說是一門新語言，考認證是有意義的。所以維庭在 7 月大松時提議大家一起去考試後，我想說參與貢獻也一年多了，應該也要學著講，種種原因就促使我答應一起去報名去考試。沒想到還沒學， 9 月大松就被迫上台硬講了 XDD

### Q: 阿美語萌典要發佈到幾個平台上？

小蟹：

就我所知，目前還活著的有：

* Web
* iOS -- 目前依賴 au 的 key 發佈更新
* Android -- 目前是 miaoski 的 key 發佈更新

死掉的有：

* Line bot -- 申請 Line 免費專案沒有通過，廢棄半年後 Line 公司也更改營運模式了，在沒有錢繳年費的情況下，大概不可能復活
* Messenger bot -- 申請 FB messenger 公開 (測試版不需要審核) 沒有通過，廢棄半年後聽說審核變容易了，但是沒有再次嘗試
* Telegram bot -- 不需要申請，直接掛 WebSocket 就可以，非常方便，但是台灣使用 TG 的人還是少數。

### Q: 阿美語萌典和本來的萌典有什麼不同？

小蟹：

我的認知主要有幾大差異：

* 沒有注音符號，族語是用英文字與符號拼音
* 搜尋列要同時支援中文搜尋與族語搜尋
* 搜尋列排序方式有針對族語特性調整
* 各字典來源本身都沒有發音
* 阿美語沒有文字與書寫系統，因此字典來源會導致族語拼法不同
* 方敏英與潘世光博利亞字典來源，本身是紙本，需要先做數位化
* 蔡中涵大辭典的數位檔案是 Word，因此需要先做正規化整理才能使用

會想要一次展現多個字典來源

miaoski:

* 符號拼音後面有經過一些處理，可以容許模糊的地方 (如 o/u 變體，有沒有喉塞音 ' )
* 原來字典可能是使用天主教拼寫法，經過老師們的努力，修改成教育部拼寫法
* 除了數位化之外，需要符合語言特性的調整，像是計算出每個詞的詞幹 (i.e. 查不到某個詞的時候，至少可以跳轉到詞幹)

小蟹補充，搜尋也有針對詞幹做排序，讓相同的詞彙會在一起

### Q: 最近阿美語萌典移除了對 [LiveScript][LiveScript] 的依賴，背後的考量是什麼？

小蟹：

這是我下的決定，最主要的考量在於降低新參者上手的難度。我自己本身不是前端，所以不管寫或讀，純 JS 對我來說比較友善；同時根據我的觀察，最近一年多大松時前來協助的工程師，幾乎沒有人是熟悉 LiveScript，常常光是看懂 LiveScript code 就下午 3~4 點了。所以我決定先移除掉這個門檻，希望未來可以有更多前端工程師一起開發維護。

miaoski:

我比較喜歡 LS, 它看起來比較 functional 一點，不過維護的成本真的高。加上 au 的功力比較高，要改動她的 code 困難度也高一點，可以把門檻往下降是個好事。

[LiveScript]: http://livescript.net/

### Q: 對阿美語萌典未來的想像是什麼？

小蟹：

1. 加入更多的字典來源，像是原民會、千詞表、潘世光博利亞阿漢等等
1. 加入更多的原住民語，目前的想像也許會先動手的是噶瑪蘭語（看向維庭）
1. 希望不管是老師或學生，或是想學習阿美語的人，都可以利用阿美語萌典網站找到想要的資訊

miaoski:

1. 語音辨識
1. 語音合成 (看向 sing5-hong5)
1. 像 iTaigi 那樣的「這樣說好」「這樣說不好」

### Q: 如果想參與阿美語萌典的開發，該會些什麼技能？

小蟹：

我們有個 hackmd 大概列出了目前已經規劃要做的功能，傳送門 >> [連結][roadmap]

最缺的是前端工程師，因為網站主要的語言是 nodejs。我們在 9 月大松時，獲得來自緬甸設計師的協助，已有設計好的 layout，想找前端工程師協助套版，讓網站視覺更新。

其次是文字人，特別是懂法語、阿美語和國語，這三種只要會一種就歡迎來幫忙。因為我們有很大量的文字校對需要協助。懂法語的人，我們有潘世光博利亞的阿美語法語辭典要校對；懂阿美語的人，可以幫忙看各辭典的族語拼音；懂國語的人就不用說了（笑）。

後端工程師，可以協助處理辭典的正規化，這部份也需要更新，才能讓辭典一直跟上作者的進度。用什麼語言都無所謂，可以處理文字就好，目前專案內已經有 Ruby, Python, Perl, NodeJS XD 歡迎參與大亂鬥。

[roadmap]: https://hackmd.io/BwZmBMCMAYE4CYC0wCsIBsiAsAzdtEZoBGRAYxz2mhFizK0iA===?view

miaoski:

專案內還有 C (望向 CindyLinz)

如果可能的話，希望找到語言學背景的人，或是對 LSTM and/or HMM 熟的人。但其實 toolkit 都蠻成熟的了，麻煩的還是苦工。

caasi:

補充一下， miaoski 提到以 C 語言寫的部分，是指 CindyLinz 的 [StripPhotoIntoRows][StripPhotoIntoRows] ，這個工具幫忙把原始資料切成一行一行，方便人工 OCR ，被戲稱為切豆腐。切起來的示意圖如 [cut_line_output.jpg][cut_line_output] 。

CindyLinz 也為中選會選舉公報寫了類似的工具 [BulletinCEC-LocateBlockFromPNG][BulletinCEC-LocateBlockFromPNG] ，如果想入這類坑，可以參考看看。

[StripPhotoIntoRows]: https://github.com/CindyLinz/StripPhotoIntoRows
[cut_line_output]: https://github.com/CindyLinz/StripPhotoIntoRows/blob/master/cut_line_output.jpg
[BulletinCEC-LocateBlockFromPNG]: https://github.com/CindyLinz/BulletinCEC-LocateBlockFromPNG

## 要怎麼參與阿美語萌典的開發呢？

小蟹：

歡迎大松時來找我們聊天，g0v slack 有 #amis channel，也可以關注我們的粉絲團或 Github 看看更新。只要人來，永遠會有坑可以讓你妳你跳的！
