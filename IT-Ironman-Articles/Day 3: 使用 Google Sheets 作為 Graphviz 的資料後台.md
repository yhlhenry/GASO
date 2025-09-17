如果我想要在 GASO ( Google Apps Script Odyssey) 畫出一個學習地圖，
概念上來說，  
只需要把所有 Google Apps Script 的知識點都化為一個一個的節點(Node)，  
然後再把相關聯的節點用邊(Edge)連起來即可。  

也就是說，如果有一個自動畫出學習地圖的工具，  
那麼我至少要提供它這兩組資訊  
1. 節點的清單 (有哪些節點)
2. 邊的清單 (哪些節點要互相連結起來)  
  
然後就可以自動產生圖了。  
  
而 Graphviz 恰是最適合處理這個問題的工具，  
它的核心理念就是：你只需要用文字描述節點和邊的關係，程式就會自動幫你計算最佳的佈局並生成美觀的圖形。  
  
這就像是用程式語言來「寫圖」而不是「畫圖」，舉例來說我只要用文字描述如下：

```
digraph G {
A -> B;
B -> C;
A -> C;
}
```


Graphviz 可以讀取上面這段簡單的 DOT 語法， 並自動生成如下的有向圖，  
![image.png](https://docs.google.com/drawings/d/e/2PACX-1vTgRsg6t7w2pjJvXiLnsp3BuvaEO5b_eariK5dDoCEh2XceQbPu18IOAZHXpEuwFIAizrBFJO1OeCSh/pub?w=480&h=360)  
  
GASO 專案選擇 Graphviz 的原因很明確：  
	1. 自動佈局：不需要手動調整節點位置，Graphviz 會自動計算最佳排列
	2. 多種佈局引擎：支援階層式、力導向、放射狀等多種佈局方式
	3. 網頁友好：可以直接輸出 SVG 格式，在網頁上完美顯示
	4. 維護簡單：只需要維護節點和邊的數據，圖形會自動更新  
  
  
如此我可以把主要的心力放在學習路徑的規劃上，  
而不用煩惱畫圖的問題。

## GASO 的技術實現：從 Google Sheets 到視覺化地圖
  
  以下說明一下我是怎麼讓前端網頁連動到後台的 Google Sheets 的：  
### 第一步：數據結構設計
  
  GASO 使用 Google Sheets 作為數據來源，設計了兩個工作表：  
  
1. Node 工作表（節點清單）：  
  A 欄：節點 ID（如 "N1"）
  B 欄：節點標籤（如 "初學者起點"）

![Node List](https://docs.google.com/drawings/d/e/2PACX-1vSN1MyT-AEul0XryJf9B4rzw6p7cWZhMp-1ANamOuUeWcKVbU4m6lOay2fslRahOgfU7I2IgEwtmQrN/pub?w=960&h=720)


2. Edge 工作表（邊清單）：  
  A 欄：來源節點 ID
  B 欄：目標節點 ID

![Edge List](https://docs.google.com/drawings/d/e/2PACX-1vTXaMJFRILbo-XFMnEn8J4BAIxAbK64rt33Q--HLeQsbHRNpqcpdvfuWYMksWsfvkqNPGjDeruYa7_6/pub?w=960&h=720)

  換句話說，  
  在 Node 清單中，每一列資料都代表一個節點。  
  在 Edge 清單中，每一列資料都代表一個邊，用來連結「來源節點」與「目標節點」  
  
### 第二步：Google Apps Script 數據處理
  
  我們現在有了記載在  Google Sheets 中的 Node and Edge list，  
  但他還不是 Graphviz 讀得懂的語法，  
  Graphviz 的語法叫做 DOT，並不複雜。  
  所以我們可以用 Google Apps Script 做個簡單的轉換：  
  把 Sheet 上的內容翻譯成 DOT 語法。  
  
  我做了一個(其實是 AI 做了一個) `getGraphData()` 函數負責將 Google Sheets 的數據轉換為 Graphviz 的 DOT 語法，  
  以下僅摘要重點，  
  如果想看完整版可以上 Github 參考。  
  
```javascript
function getGraphData() {
// 從 Google Sheets 讀取節點和邊的數據
const nodes = nodeSheet.getRange(2, 1, nodeSheet.getLastRow() - 1, 4).getValues();
const edges = edgeSheet.getRange(2, 1, edgeSheet.getLastRow() - 1, 2).getValues();

// 開始構建 DOT 語法
let dot = `
  digraph G {
  `;

// 處理每個節點
nodes.forEach(([id, label, attr, status]) => {
  if (id && label) {
    dot += `  ${id} [label="${label}", style=filled];\n`;
  }
});

// 處理每條邊
edges.forEach(([src, tgt]) => {
  if (src && tgt) {
    dot += `  ${src} -> ${tgt};\n`;
  }
});

dot += "}";
return dot;
}
```
  
### 第三步：前端視覺化渲染
  
  有了 DOT 的語法後，  
  接下來只要在 `index.html` 中，使用 viz.js 這個 JavaScript 版本的 Graphviz 來渲染圖形即可：  
  
```javascript
// 引入 viz.js
<script src="https://cdnjs.cloudflare.com/ajax/libs/viz.js/2.1.2/viz.js"></script>
```
  
```javascript
// 使用 viz.js 將 DOT 語法轉換為 SVG
const svg = await viz.renderSVGElement(dotToUse, { engine: state.engine });
```


把以上三步做完之後，
我只要在 Google Sheets 上更新節點與邊的資訊，
然後重新整理網頁，就會自動呈現出最新的內容了。

既不用改 code，也不用重新部署。就只要維護 Google Sheets 就好了。
連猴子都會用(？)

基本版的地圖是成功畫出來了，
但是其實在排版的選擇上需要花點心思。
Graphviz 雖然可以自動畫圖，
但隨著給他的參數不同，畫出來的感覺也會很不一樣。
當這個世界地圖非常龐大複雜的時候，如何簡明清楚的呈現就變成了一個大挑戰。

明天就來跟大家分享一下我在調整地圖時所遭遇的困難與解方。