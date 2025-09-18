
# Day 5: 如何為學習地圖添加互動功能，讓使用者可以點擊節點查看詳細資訊

## 文章大綱（草稿）

### 1. 引言：從靜態地圖到互動式學習體驗
- 回顧前4天的成果：從概念發想到視覺化呈現
- 靜態地圖的局限性：只能看，不能互動
- 互動式學習地圖的價值：讓學習者主動探索

### 2. 互動功能的核心需求分析
- **節點點擊**：點擊節點查看詳細資訊
- **資訊彈窗**：在彈出視窗中顯示節點的詳細內容
- **學習提示**：為每個節點提供客製化的學習 Prompt

### 3. 技術實作：JavaScript 事件處理
- **SVG 節點事件綁定**
  ```javascript
  function addNodeClickEvents(svg) {
    const nodes = svg.querySelectorAll('g.node');
    nodes.forEach(node => {
      node.style.cursor = 'pointer';
      node.addEventListener('click', handleNodeClick);
    });
  }
  ```

- **節點識別與資料匹配**
  - SVG 節點 ID 與實際資料的對應
  - 通過標籤找到對應的節點詳細資訊


### 4. 彈出視窗設計與實作
- **Modal 設計**：美觀的彈出視窗樣式
- **節點資訊展示**：
  - 節點 ID 和標籤
  - 學習狀態（待辦/進行中/已完成）
  - 客製化學習 Prompt
- **使用者體驗**：ESC 鍵關閉、點擊背景關閉

### 5. 資料結構擴展：從 Google Sheets 到前端
- **Node 工作表擴展**：新增 Prompt 欄位（E 欄）
- **資料傳遞**：從 Google Apps Script 傳遞完整的節點詳細資訊
- **狀態管理**：在前端維護節點狀態和鄰接表



### 6. 結語：互動式學習的未來
- 從被動觀看到主動探索的轉變
- 個人化學習路徑的實現
- 下一階段：學習進度追蹤與個人化推薦

### 7. 技術總結與程式碼重點
- 關鍵函數說明
- 資料流程圖
- 可擴展性設計

---

## 文章內容

經過前四天的努力，我們已經成功打造出一個可以視覺化呈現 Google Apps Script 學習地圖的平台了！

從第一天提出 GASO 的概念，到第二天決定使用 Graphviz 來繪製地圖，再到第三天建立 Google Sheets 作為資料後台，最後第四天調整出多種美觀的排版效果。

現在這個地圖看起來已經很漂亮了，但還有一個重要的問題：

**它只能看，不能互動！**

就像你拿到一張精美的世界地圖，但卻不能點擊任何城市來了解當地的詳細資訊一樣，總覺得少了點什麼。

所以今天，我們要讓這個學習地圖「活」起來！

## 從靜態地圖到互動式學習體驗

在我想像中的 GASO 平台，使用者應該要能夠：

1. **點擊任何節點**：就像點擊地圖上的城市一樣
2. **查看詳細資訊**：彈出一個視窗顯示這個節點的完整資訊
3. **獲得學習指引**：每個節點都應該提供客製化的學習 Prompt

這樣一來，學習者就可以主動探索，而不是被動地觀看。

## 互動功能的核心需求分析

讓我先分析一下我們需要實現哪些互動功能：

### 1. 節點點擊功能
- 當使用者點擊地圖上的任何節點時，應該要有視覺回饋
- 游標要變成手指形狀，提示使用者這是一個可點擊的元素

### 2. 資訊彈窗
- 點擊節點後，要彈出一個美觀的視窗
- 視窗中要顯示節點的詳細資訊
- 要提供關閉視窗的方式（ESC 鍵、點擊背景等）

### 3. 學習提示
- 每個節點都要有客製化的學習 Prompt
- 讓使用者可以一鍵複製，拿去問 AI

## 技術實作：JavaScript 事件處理

現在來看看我們要怎麼實現這些功能。

### SVG 節點事件綁定

首先，我們需要為 SVG 中的每個節點添加點擊事件：

```javascript
function addNodeClickEvents(svg) {
  const nodes = svg.querySelectorAll('g.node');
  nodes.forEach(node => {
    // 讓游標變成手指形狀
    node.style.cursor = 'pointer';
    
    // 添加點擊事件
    node.addEventListener('click', handleNodeClick);
    
    // 添加 hover 效果
    node.addEventListener('mouseenter', function() {
      this.style.opacity = '0.8';
    });
    
    node.addEventListener('mouseleave', function() {
      this.style.opacity = '1';
    });
  });
}
```

### 節點識別與資料匹配

接下來，我們需要建立節點 ID 與實際資料的對應關係：

```javascript
function handleNodeClick(event) {
  // 取得被點擊的節點 ID
  const nodeId = event.currentTarget.id;
  
  // 從全域資料中找到對應的節點資訊
  const nodeData = findNodeData(nodeId);
  
  if (nodeData) {
    // 顯示節點詳細資訊
    showNodeModal(nodeData);
  }
}

function findNodeData(nodeId) {
  // 從我們之前從 Google Sheets 取得的資料中尋找
  return window.graphData.nodes.find(node => node.id === nodeId);
}
```

## 彈出視窗設計與實作

### Modal 設計

我設計了一個美觀的彈出視窗來顯示節點資訊：

```javascript
function showNodeModal(nodeData) {
  // 建立 Modal HTML
  const modalHTML = `
    <div id="nodeModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${nodeData.label}</h2>
        <div class="node-info">
          <p><strong>節點 ID：</strong>${nodeData.id}</p>
          <p><strong>學習狀態：</strong>${getStatusText(nodeData.status)}</p>
          <p><strong>學習提示：</strong></p>
          <div class="prompt-box">
            <textarea readonly>${nodeData.prompt}</textarea>
            <button onclick="copyPrompt()">複製 Prompt</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 插入到頁面中
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // 顯示 Modal
  const modal = document.getElementById('nodeModal');
  modal.style.display = 'block';
  
  // 添加關閉事件
  addModalCloseEvents();
}
```

### 使用者體驗優化

為了提供良好的使用者體驗，我添加了多種關閉視窗的方式：

```javascript
function addModalCloseEvents() {
  const modal = document.getElementById('nodeModal');
  const closeBtn = modal.querySelector('.close');
  
  // 點擊 X 關閉
  closeBtn.addEventListener('click', closeModal);
  
  // 點擊背景關閉
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // ESC 鍵關閉
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.getElementById('nodeModal');
  modal.remove();
}
```

## 資料結構擴展：從 Google Sheets 到前端

為了支援互動功能，我們需要擴展資料結構。

### Node 工作表擴展

我在 Google Sheets 的 Node 工作表中新增了一個欄位：

- **A 欄**：節點 ID（如 "N1"）
- **B 欄**：節點標籤（如 "初學者起點"）
- **C 欄**：節點屬性（如顏色、形狀等）
- **D 欄**：學習狀態（待辦/進行中/已完成）
- **E 欄**：客製化學習 Prompt（新增！）

### 資料傳遞優化

更新了 Google Apps Script 中的 `getGraphData()` 函數，讓它能夠傳遞完整的節點詳細資訊：

```javascript
function getGraphData() {
  // 從 Google Sheets 讀取節點和邊的數據
  const nodes = nodeSheet.getRange(2, 1, nodeSheet.getLastRow() - 1, 5).getValues();
  const edges = edgeSheet.getRange(2, 1, edgeSheet.getLastRow() - 1, 2).getValues();

  // 構建完整的資料結構
  const graphData = {
    nodes: nodes.map(([id, label, attr, status, prompt]) => ({
      id: id,
      label: label,
      attr: attr,
      status: status,
      prompt: prompt || '請告訴我關於 ' + label + ' 的詳細資訊'
    })),
    edges: edges.map(([src, tgt]) => ({ source: src, target: tgt }))
  };

  return graphData;
}
```

### 前端狀態管理

在前端，我們需要維護節點狀態和鄰接表：

```javascript
// 全域變數儲存圖形資料
let graphData = null;

// 載入圖形資料
async function loadGraphData() {
  try {
    const response = await fetch('/api/graph-data');
    graphData = await response.json();
    
    // 渲染圖形
    await renderGraph();
    
    // 添加互動功能
    addNodeClickEvents(document.querySelector('svg'));
  } catch (error) {
    console.error('載入圖形資料失敗:', error);
  }
}
```

## 實際效果展示

完成這些功能後，GASO 平台現在具備了完整的互動能力：

1. **視覺回饋**：滑鼠移到節點上時會有透明度變化
2. **點擊互動**：點擊任何節點都會彈出詳細資訊視窗
3. **學習指引**：每個節點都提供客製化的學習 Prompt
4. **使用者友善**：多種方式關閉視窗，操作直覺

## 結語：互動式學習的未來

透過今天的實作，我們成功將靜態的學習地圖轉化為互動式的學習平台。

這個轉變的意義不僅僅是技術上的進步，更重要的是學習體驗的革新：

- **從被動觀看到主動探索**：學習者不再只是被動地接收資訊，而是可以主動選擇想要了解的內容
- **個人化學習路徑**：每個節點都提供客製化的學習指引，讓學習更加精準有效
- **即時學習支援**：透過 Prompt 機制，學習者可以立即獲得 AI 的協助



## 技術總結與程式碼重點

### 關鍵函數說明

1. **`addNodeClickEvents(svg)`**：為 SVG 節點添加點擊事件
2. **`handleNodeClick(event)`**：處理節點點擊事件
3. **`showNodeModal(nodeData)`**：顯示節點詳細資訊彈窗
4. **`addModalCloseEvents()`**：添加彈窗關閉事件

### 資料流程圖

```
Google Sheets → Google Apps Script → 前端 JavaScript → SVG 渲染 → 事件綁定 → 使用者互動
```

### 可擴展性設計

目前的架構設計考慮了未來擴展的可能性：

- **模組化設計**：每個功能都是獨立的函數，易於維護和擴展
- **資料驅動**：所有內容都來自 Google Sheets，無需修改程式碼即可更新
- **事件驅動**：基於事件系統，容易添加新的互動功能

這樣的設計讓我們可以輕鬆地添加更多互動功能，比如：
- 節點搜尋功能
- 學習路徑規劃
- 進度追蹤
- 個人化推薦

明天見！

---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)

