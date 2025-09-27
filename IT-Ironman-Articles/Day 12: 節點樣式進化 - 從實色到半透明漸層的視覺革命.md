# Day 12: 節點樣式進化 - 從實色到半透明漸層的視覺革命

## 前言

我是一個務實的人，買手機的時候從來只講規格、不看顏色。
「為什麼要選顏色？顏色會影響 CPU 嗎？會影響 RAM 嗎？ 功能才重要，顏色無關緊要。」

所以如果同機型有任何一個顏色稍微便宜一點點，我就會選便宜的。
或是如果某些顏色缺貨要等，我就會直接買有現貨的。

「花樣顏色哪有什麼差，功能還不是都一樣！」

但這僅限對我個人而言。
如果我要送別人東西，我一定會精挑細選最好的圖樣顏色。
因為這種視覺上的效果，是會實質影響效用的！

所以如果我要做一個功能給別人用，
功能固然要顧，外觀也不能馬虎。


今天早上，我看著 GASO 的學習地圖，突然意識到一個問題：雖然我們已經有了中古世紀地圖的整體風格，但節點本身還是使用 Graphviz 的預設樣式。這些節點看起來太「現代化」了，與我們精心設計的古樸風格格格不入。

就像在一張古老的羊皮紙地圖上，卻貼著現代化的彩色標籤一樣，總覺得哪裡不對勁。

於是，我決定給節點來一場徹底的視覺革命。

## 今日目標

1. 將節點形狀從橢圓形改為矩形，更符合地圖標記的風格
2. 移除節點邊框，創造更簡潔的視覺效果
3. 實現半透明背景，讓背景地圖透過節點顯示
4. 添加漸層效果，從線性漸層進化到放射狀漸層
5. 優化文字可讀性，確保在半透明背景上清晰可見

## 開發歷程

### 第一步：節點形狀的重新思考

一開始，我思考著什麼樣的節點形狀最適合中古世紀地圖的風格。

**橢圓形 vs 矩形：**
- 橢圓形：現代化、圓潤，但缺乏地圖標記的感覺
- 矩形：古典、方正，更像古代地圖上的標記

我選擇了矩形，因為它更符合古代地圖的視覺語言。

```javascript
// 修改預設節點形狀
nodeShape: localStorage.getItem("gv_nodeShape") || "box",
```

同時，我也調整了節點的尺寸設定，讓它們自動適應文字內容，而不是使用固定的寬高。

### 第二步：移除邊框的挑戰

在 Graphviz 中，節點預設會有邊框。我想要移除這些邊框，創造更簡潔的視覺效果。

**第一次嘗試：使用 CSS**
```css
#zoomInner svg g.node rect,
#zoomInner svg g.node ellipse,
#zoomInner svg g.node polygon {
  stroke: none !important;
}
```

但這並不完全有效，因為 Graphviz 生成的 SVG 會有內聯樣式。

**第二次嘗試：直接修改 SVG 屬性**
```javascript
// 直接修改所有節點的 fill 屬性為漸層
const nodeElements = svg.querySelectorAll('g.node polygon, g.node rect, g.node ellipse');
nodeElements.forEach(element => {
  element.setAttribute('fill', 'url(#nodeGradient)');
  element.setAttribute('stroke', 'none');
});
```

這次成功了！直接修改 SVG 元素的屬性比 CSS 更有效。

### 第三步：半透明效果的實現

這是最有趣的部分。我最初想要實現半透明效果，但發現 Graphviz 的 `fillcolor` 屬性只支援實色，不支援透明度。

**問題分析：**
- Graphviz 的 `fillcolor="#8b4513"` 只能設定實色
- 無法直接設定 `rgba()` 或透明度
- 需要在前端使用 CSS 或 JavaScript 來實現半透明

**解決方案：**
我決定使用 SVG 的漸層功能，並在 JavaScript 中動態創建漸層定義：

```javascript
// 創建漸層定義
const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
gradient.setAttribute('id', 'nodeGradient');
gradient.setAttribute('x1', '0%');
gradient.setAttribute('y1', '0%');
gradient.setAttribute('x2', '100%');
gradient.setAttribute('y2', '100%');

const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop1.setAttribute('offset', '0%');
stop1.setAttribute('stop-color', 'rgba(139, 69, 19, 0.8)');

const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop2.setAttribute('offset', '100%');
stop2.setAttribute('stop-color', 'rgba(160, 82, 45, 0.6)');
```

### 第四步：漸層效果的進化

最初的線性漸層效果不錯，但總覺得缺少了什麼。我開始思考如何讓節點更有立體感和吸引力。

**線性漸層的問題：**
- 從一個方向到另一個方向的漸變
- 缺乏立體感
- 不夠突出

**放射狀漸層的優勢：**
- 從中心向外擴散的漸變
- 創造「發光」效果
- 更符合按鈕或標記的視覺特徵

```javascript
// 從 linearGradient 改為 radialGradient
const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
gradient.setAttribute('id', 'nodeGradient');
gradient.setAttribute('cx', '50%');  // 中心 X 座標
gradient.setAttribute('cy', '50%');  // 中心 Y 座標
gradient.setAttribute('r', '50%');   // 半徑
```

### 第五步：顏色和透明度的精細調整

在實現放射狀漸層後，我開始微調顏色和透明度，以達到最佳的視覺效果。

**第一次調整：**
- 中心色：`rgba(160, 82, 45, 0.9)` - 較亮的棕色，90% 不透明度
- 邊緣色：`rgba(139, 69, 19, 0.4)` - 較深的棕色，40% 不透明度

**最終調整（根據使用者反饋）：**
- 中心色：`rgba(160, 82, 45, 1.0)` - 完全不透明
- 邊緣色：`rgba(139, 69, 19, 0)` - 完全透明

這個調整創造了更強烈的對比效果，讓節點看起來像發光的標記。

## 技術細節與思考

### SVG 漸層的技術原理

在 SVG 中，漸層是通過 `<defs>` 元素定義的，然後通過 `url(#gradientId)` 引用：

```xml
<defs>
  <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(160, 82, 45, 1.0)"/>
    <stop offset="100%" stop-color="rgba(139, 69, 19, 0)"/>
  </radialGradient>
</defs>
```

### 為什麼要動態創建漸層？

1. **Graphviz 的限制**：Graphviz 無法直接生成帶有漸層的 SVG
2. **靈活性**：動態創建讓我們可以根據需要調整漸層效果
3. **一致性**：確保所有節點都使用相同的漸層定義

### 文字可讀性的考量

在半透明背景上，文字的可讀性是一個重要問題。我採用了以下策略：

```css
#zoomInner svg g.node text {
  fill: white !important;
  font-weight: bold !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
}
```

- **白色文字**：在棕色背景上提供良好的對比度
- **粗體字**：增加文字的視覺重量
- **文字陰影**：讓文字在各種背景下都清晰可讀

## 遇到的挑戰與解決方案

### 挑戰一：CSS 無法覆蓋 SVG 內聯樣式

**問題**：Graphviz 生成的 SVG 會有內聯的 `fill` 屬性，CSS 的 `!important` 無法覆蓋。

**解決方案**：使用 JavaScript 直接修改 SVG 元素的屬性。

```javascript
element.setAttribute('fill', 'url(#nodeGradient)');
```

### 挑戰二：漸層定義的重複創建

**問題**：每次重新渲染圖形時，可能會重複創建漸層定義。

**解決方案**：檢查漸層是否已存在，避免重複創建。

```javascript
if (!defs.querySelector('#nodeGradient')) {
  // 創建漸層定義
}
```

### 挑戰三：錯誤處理的一致性

**問題**：在錯誤處理的分支中也需要應用相同的漸層效果。

**解決方案**：將漸層創建和應用的邏輯複製到錯誤處理分支中。

## 視覺效果的演進

### 階段一：實色節點
- 使用 Graphviz 預設的實色填充
- 有邊框，看起來現代化
- 與中古世紀風格不協調

### 階段二：半透明實色
- 移除邊框
- 使用半透明的實色填充
- 背景地圖可以透過節點顯示

### 階段三：線性漸層
- 從左上角到右下角的漸變
- 增加了一些視覺層次
- 但仍然缺乏立體感

### 階段四：放射狀漸層
- 從中心向外擴散的漸變
- 創造發光效果
- 更符合古代地圖標記的視覺特徵

## 使用者體驗的改善

這次的節點樣式進化主要從以下幾個方面提升了使用者體驗：

### 1. 視覺一致性
- 節點樣式與整體中古世紀風格完美融合
- 創造了統一、協調的視覺語言

### 2. 可讀性提升
- 白色粗體文字在半透明背景上清晰可讀
- 文字陰影確保在各種背景下都能清楚顯示

### 3. 視覺吸引力
- 放射狀漸層創造了發光效果
- 讓節點看起來更有活力和吸引力

### 4. 背景融合
- 半透明效果讓背景地圖透過節點顯示
- 創造了更自然的視覺層次

## 反思與學習

### 設計思維的轉變

這次的開發讓我深刻體會到，**技術實現只是手段，視覺效果才是目標**。我們需要不斷地調整和優化，直到達到理想的視覺效果。

### SVG 技術的深入理解

通過這次的開發，我對 SVG 的漸層技術有了更深入的理解：
- 線性漸層 vs 放射狀漸層的區別
- 漸層定義的創建和引用方式
- 動態修改 SVG 元素屬性的方法

### 使用者反饋的價值

最終的透明度調整（中心完全不透明，邊緣完全透明）是根據使用者的反饋進行的。這讓我意識到，**使用者的直觀感受往往比技術理論更重要**。


## 結語

今天的開發過程讓我深刻體會到，**細節決定體驗**。一個看似簡單的節點樣式調整，實際上涉及了 SVG 技術、視覺設計、使用者體驗等多個層面。

從實色到半透明，從線性漸層到放射狀漸層，每一次調整都讓 GASO 的學習地圖變得更加精緻和吸引人。

現在，當使用者看到這些發光的節點時，他們會感受到一種探索的興奮感，就像古代探險家在地圖上發現了新的標記一樣。

因為學習 Google Apps Script，真的就像一場偉大的探險，而每一個節點，都是這場探險中的一個重要地標。

---

*明天，我們將繼續探索 GASO 的可能性，讓這個學習地圖變得更加豐富和有趣。敬請期待！*

## 相關資源

- [SVG 漸層文檔](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients)
- [Graphviz 節點屬性](https://graphviz.org/doc/info/attrs.html)
- [中古世紀地圖風格參考](https://www.oldmapsonline.org/)

---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
