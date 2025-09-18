在我想像中的美好理想世界，
我只要把節點跟邊的定義文字寫清楚，
Graphviz 就會幫我把漂亮的圖畫出來。

但是實際上，要畫出漂亮的圖，
還是需要仔細的調教過。


我自己的期待是：
這個學習地圖應該就要像畫真實的世界地圖一樣，
各個地點散落在整個平面世界各地，
是一種自然散佈的風格。

當然，同樣的關係架構下，如果要畫成非常整齊的流程圖，那也不是不行，
看起來就會蠻整齊的。但也蠻死板的。
我的期待是，讓他畫得更像真實地圖，就能感覺愈好玩。

所以我花了一些時間來研究 Graphviz 這個工具，
看看到底有哪些自動排版的選項或參數可以調。
以下就來簡單介紹。

## Graphviz 的排版引擎

Graphviz 提供了多種不同的排版引擎，每種都有其特色和適用場景：

### 1. dot（階層式排版）
- **名稱由來**：dot 是 Graphviz 最核心、最古老的排版引擎，專為有向無環圖 (DAGs) 設計，名稱來自圖論 (Graph Theory) 中的術語，在圖論中常用「點」（dot）來表示節點
- **特色**：最常用的引擎，適合有明確層級關係的圖，在流程圖、組織圖等具有清晰流向的場景中表現最為出色
- **效果**：節點會按照層級排列，從上到下或從左到右
- **適用場景**：組織架構圖、流程圖、決策樹
- **參數**：支援 `rankdir`（TB/LR/BT/RL）控制方向

![dot 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/dot_sample.png)

### 2. neato（力導向排版）
- **名稱由來**：我查了一下，但找不到一個權威說法來解釋這個名稱是怎麼取的。我個人覺得比較可信的是來自於「neat」（整潔、優雅）的概念，表達這個演算法能夠產生整潔美觀的圖形佈局。
- **特色**：基於物理模擬的力導向演算法，使用「彈簧模型」(spring model) 演算法，是力導向佈局的經典實現
- **效果**：節點會自然散佈，類似真實地圖的感覺
- **適用場景**：網路圖、關係圖、社交網路
- **優點**：最接近我想要的自然散佈效果

![neato 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/neato_sample.png)

### 3. fdp（力導向排版）
- **名稱由來**：fdp 是「Force-Directed Placement」的縮寫，表示基於力導向的節點放置演算法
- **特色**：另一種力導向演算法，使用了不同的力導向演算法（Fruchterman-Reingold），通常能更快地收斂並減少節點重疊，更適合用於數百或數千個節點以上的大型網路圖
- **效果**：與 neato 類似，但對大圖的處理更好
- **適用場景**：大型網路圖、複雜關係圖

![fdp 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/fdp_sample.png)

### 4. twopi（放射狀排版）
- **名稱由來**：twopi 來自於「two pi」（2π）的概念，表示圓周的角度，完美詮釋了其環繞佈局的特性
- **特色**：以某個中心節點（root 節點）為圓心，其餘節點則會根據它們到中心節點的距離，一層一層地以同心圓方式向外排列
- **效果**：像太陽系一樣的放射狀結構
- **適用場景**：以某個核心概念為中心的知識地圖

![twopi 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/twopi_sample.png)

### 5. circo（圓環排版）
- **名稱由來**：circo 來自於「circular」（圓形的）的概念，表示將節點排列成圓形或橢圓形的佈局方式
- **特色**：擅長識別圖中的雙連接元件 (biconnected components) 和循環結構，並將這些結構中的節點佈置在圓圈上
- **效果**：整齊的圓形排列
- **適用場景**：循環流程、對稱關係圖，特別適合呈現環狀網路拓撲（如環形網路）或強調循環關係

![circo 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/circo_sample.png)

### 6. osage（叢集排版）
- **名稱由來**：osage 這個名字的確切來源已不可考，但將其與「Osage」部落連結是一個非常有趣且富有創意的聯想，有助於記憶其叢集功能
- **特色**：專門處理「叢集圖」的工具，針對已定義了「叢集」(cluster) 的圖形進行佈局，將叢集視為一個個單元來安排
- **效果**：相關節點會聚集在一起，形成清晰的群組，能夠清晰地展現模組與模組之間的關係
- **適用場景**：模組化設計、分類圖表

![osage 排版範例](https://raw.githubusercontent.com/yhlhenry/GASO/main/image/osage_sample.png)



經過測試後，我個人最喜歡 **neato** 引擎，因為它最符合我想要的效果：

1. **自然散佈**：節點會根據連接關係自然散佈在平面上
2. **物理模擬**：基於彈簧-質點模型，模擬真實的物理效果
3. **視覺平衡**：自動調整節點間距，達到視覺上的平衡

但幾番測試後，
我發現其實每一種排版引擎都各有優點，
一時之間其實難以取捨。

好吧，就通通都做上去好了！
我決定提供一個選單，讓使用者可以自己快速切換成喜歡的樣子！

## 在 GASO 中的實作

在我的 GASO 專案中，我實作了多種排版引擎的切換功能：

```javascript
// 在 HTML 中提供排版引擎選擇
<select id="layoutSelect">
  <option value="dot">dot（階層式）</option>
  <option value="neato">neato（力導向）</option>
  <option value="fdp">fdp（力導向）</option>
  <option value="twopi">twopi（放射狀）</option>
  <option value="circo">circo（圓環）</option>
  <option value="osage">osage（叢集）</option>
  <option value="patchwork">patchwork（樹圖）</option>
</select>
```

## 其它可調的排版參數

另外還有一些參數可以調，有機會讓圖形更接近你想要的形狀。
但都要自己慢慢嘗試就是了，
畢竟美感這種東西是很主觀的。

### 1. rankdir（方向控制）
- `TB`：從上到下（Top to Bottom）
- `LR`：從左到右（Left to Right）
- `BT`：從下到上（Bottom to Top）
- `RL`：從右到左（Right to Left）

### 2. splines（邊的樣式）
- `splines=curved`：彎曲的邊，看起來更自然
- `splines=ortho`：直角邊
- `splines=line`：直線邊

### 3. overlap（重疊處理）
- `overlap=false`：避免節點重疊
- `overlap=scale`：縮放圖表避免重疊



## 使用者體驗設計

為了讓使用者能夠輕鬆體驗不同的排版效果，
並根據自己的裝置特性來進行調整。除了排版引擎的選項，我也把以下這些通通開放給使用者自行調整：

1. **即時切換**：選擇不同引擎後立即重新渲染
2. **縮放控制**：可以放大縮小查看細節
3. **方向調整**：針對 dot 引擎提供方向選擇
4. **字體大小**：可以調整文字大小以適應不同螢幕

## 結語

透過 Graphviz 的多種排版引擎，我們可以創造出不同風格的學習地圖：

- **階層式**：適合有明確學習順序的內容
- **自然散佈**：適合探索式學習，像在真實世界中漫遊
- **放射狀**：適合以某個核心概念為中心的學習

在 GASO 中，我個人喜歡自然散佈的風格，
讓學習地圖看起來更像真實的世界地圖，增加學習的趣味性和探索感。
但也提供選項使用者自行切換。

下一篇文章，我將介紹如何為學習地圖添加互動功能，讓使用者可以點擊節點查看詳細資訊。


---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)

