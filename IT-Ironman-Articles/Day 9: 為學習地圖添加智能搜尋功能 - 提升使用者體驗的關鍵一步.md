## 前言

在昨天的文章中，我們成功為 GASO 添加了美麗的世界地圖背景，讓視覺效果更加豐富。今天我們要解決一個實際的使用者痛點：當節點數量很多時，使用者很難快速找到想要的節點。

因此，我們決定為 GASO 添加一個智能搜尋功能，讓使用者可以透過輸入關鍵字來快速找到並選擇節點，大幅提升使用體驗。

## 今日目標

1. 設計並實現搜尋介面
2. 開發即時搜尋邏輯
3. 實現搜尋結果的互動功能
4. 優化搜尋體驗和視覺設計
5. 解決技術難題並完善功能

## 開發歷程

### 第一步：設計搜尋介面

首先，我們在頁面頂部添加了搜尋功能的基本結構：

```html
<!-- 搜尋功能 -->
<div class="search-container">
  <div class="search-box">
    <input type="text" id="searchInput" placeholder="搜尋節點..." autocomplete="off" />
    <div id="searchResults" class="search-results"></div>
  </div>
</div>
```

**設計考量：**
- 位置：放在頁面頂部，方便使用者快速找到
- 輸入框：使用 `autocomplete="off"` 避免瀏覽器自動完成干擾
- 結果容器：下拉式設計，不佔用過多空間

### 第二步：實現搜尋樣式

為了提供良好的視覺體驗，我們設計了現代化的搜尋介面樣式：

```css
/* 搜尋功能樣式 */
.search-container {
  margin: 1rem 0;
  position: relative;
}

.search-box {
  position: relative;
  max-width: 400px;
}

#searchInput {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

#searchInput:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

**樣式特色：**
- 響應式設計，最大寬度 400px
- 焦點效果，藍色邊框和陰影
- 下拉式結果，最大高度 300px 可滾動
- 現代化的圓角和陰影效果

### 第三步：開發搜尋邏輯

接下來實現核心的搜尋功能：

```javascript
// 搜尋節點
function searchNodes(keyword) {
  if (!keyword || keyword.length < 1) {
    searchResults.classList.remove('show');
    return;
  }

  const results = state.nodeDetails.filter(node => {
    const searchText = `${node.label} ${node.prompt} ${node.attribute}`.toLowerCase();
    return searchText.includes(keyword.toLowerCase());
  });

  displaySearchResults(results, keyword);
}

// 顯示搜尋結果
function displaySearchResults(results, keyword) {
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="no-results">找不到符合條件的節點</div>';
  } else {
    searchResults.innerHTML = results.map(node => `
      <div class="search-result-item" data-node-id="${node.id}">
        <div class="search-result-title">${highlightText(node.label, keyword)}</div>
        <div class="search-result-subtitle">${highlightText(node.prompt.substring(0, 100) + (node.prompt.length > 100 ? '...' : ''), keyword)}</div>
      </div>
    `).join('');
  }
  searchResults.classList.add('show');
}
```

**搜尋特色：**
- 即時搜尋：輸入時即時顯示結果
- 多欄位搜尋：搜尋節點標籤、提示內容、屬性
- 關鍵字高亮：搜尋結果中的關鍵字會高亮顯示
- 內容預覽：顯示前 100 字元的提示內容

### 第四步：實現關鍵字高亮

為了讓搜尋結果更直觀，我們實現了關鍵字高亮功能：

```javascript
// 高亮搜尋關鍵字
function highlightText(text, keyword) {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<span class="search-result-highlight">$1</span>');
}
```

**高亮效果：**
- 使用正則表達式匹配關鍵字
- 不區分大小寫（`gi` 標誌）
- 黃色背景高亮顯示

### 第五步：實現點擊互動

最關鍵的部分是讓搜尋結果的點擊能夠觸發節點點擊效果：

```javascript
// 處理搜尋結果點擊
function handleSearchResultClick(nodeId) {
  // 通過節點標籤找到對應的 SVG 節點
  const nodeDetail = state.nodeDetails.find(n => n.id === nodeId);
  if (!nodeDetail) return;

  // 通過標籤文字找到對應的 SVG 節點
  const allNodes = svg.querySelectorAll('g.node');
  let nodeElement = null;
  
  for (const node of allNodes) {
    const textElement = node.querySelector('text');
    if (textElement && textElement.textContent === nodeDetail.label) {
      nodeElement = node;
      break;
    }
  }

  if (nodeElement) {
    // 模擬節點點擊事件
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    nodeElement.dispatchEvent(clickEvent);
  }
}
```

**技術要點：**
- 通過節點標籤文字匹配 SVG 節點
- 使用 `MouseEvent` 模擬真實點擊事件
- 觸發後自動清空搜尋框並隱藏結果

### 第六步：解決技術難題

在開發過程中，我們遇到了一個重要的技術難題：

**問題：** 搜尋結果點擊後只顯示節點資訊，但沒有高亮路徑

**原因分析：**
- 搜尋結果中的節點 ID 是 `SL1`
- 但 SVG 中的節點 ID 是 `node45`
- 直接 ID 匹配失敗

**解決方案：**
改變查找邏輯，通過節點標籤文字來匹配：

```javascript
// 通過標籤文字找到對應的 SVG 節點
const allNodes = svg.querySelectorAll('g.node');
let nodeElement = null;

for (const node of allNodes) {
  const textElement = node.querySelector('text');
  if (textElement && textElement.textContent === nodeDetail.label) {
    nodeElement = node;
    break;
  }
}
```

### 第七步：優化使用者體驗

最後，我們添加了一些細節來提升使用者體驗：

```javascript
// 搜尋輸入事件監聽
if (searchInput) {
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchNodes(e.target.value);
    }, 150); // 150ms 延遲，避免過於頻繁的搜尋
  });

  // 點擊外部關閉搜尋結果
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });
}
```

**體驗優化：**
- 150ms 延遲搜尋，避免過於頻繁的 API 調用
- 點擊外部自動關閉搜尋結果
- 點擊後自動清空搜尋框

## 技術亮點

### 1. 智能搜尋演算法
- 多欄位搜尋：同時搜尋標籤、提示、屬性
- 不區分大小寫匹配
- 即時搜尋結果更新

### 2. 視覺化搜尋結果
- 關鍵字高亮顯示
- 內容預覽和截斷
- 現代化的下拉式設計

### 3. 事件模擬技術
- 使用 `MouseEvent` 模擬真實點擊
- 通過標籤文字匹配 SVG 節點
- 完整的事件冒泡和處理

### 4. 效能優化
- 防抖動搜尋（150ms 延遲）
- 結果數量限制和滾動
- 事件委託和記憶體管理

## 最終效果

經過今天的開發，GASO 現在具備了：

1. **智能搜尋功能**：輸入關鍵字即時顯示相關節點
2. **關鍵字高亮**：搜尋結果中的關鍵字會高亮顯示
3. **一鍵跳轉**：點擊搜尋結果直接觸發節點點擊效果
4. **路徑高亮**：搜尋結果點擊後會自動高亮學習路徑
5. **友善介面**：現代化的搜尋框和下拉式結果

## 使用範例

**搜尋範例：**
- 輸入「自動化」→ 找到所有包含自動化相關的節點
- 輸入「Gmail」→ 找到 Gmail 相關功能
- 輸入「觸發」→ 找到觸發器相關內容
- 輸入「API」→ 找到 API 相關功能

**操作流程：**
1. 在搜尋框輸入關鍵字
2. 即時顯示搜尋結果清單
3. 點擊任一搜尋結果
4. 自動高亮路徑並顯示節點詳細資訊

## 明日展望

明天我們將繼續優化 GASO 的功能，可能的方向包括：
- 搜尋結果的排序和過濾
- 搜尋歷史記錄功能
- 更進階的搜尋語法支援
- 搜尋結果的統計和分析

## 總結

今天的開發重點在於解決實際的使用者痛點：在節點數量眾多的情況下，如何快速找到想要的節點。通過實現智能搜尋功能，我們大幅提升了 GASO 的使用體驗。

這個功能看似簡單，但實際上涉及了：
- 前端搜尋演算法設計
- DOM 操作和事件處理
- 視覺化搜尋結果展示
- 事件模擬和節點匹配
- 使用者體驗優化

這些技術要點都是前端開發中常見但重要的技能，對於提升應用程式的可用性至關重要。

---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
