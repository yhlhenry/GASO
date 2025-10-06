# Day 21: 開發者工具實戰 - 添加即時尺寸監控功能來解決佈局問題

## 🤔 為什麼需要這個功能？

在開發 GASO 的過程中，我遇到了一個讓我困擾好幾天的問題：**頁面佈局的尺寸問題**。

### 問題的起源

前幾天，我一直想把頁面佈局弄得漂亮一點，讓地圖能夠完美地適應螢幕。但是，我發現自己對於各層容器與 SVG 的尺寸關係一直搞不定：

- 📱 **螢幕尺寸** vs 🗺️ **地圖容器** vs 🎨 **SVG 元素**
- 為什麼地圖會超出容器？
- 為什麼有時候會出現空白區域？
- 為什麼縮放後尺寸會變得奇怪？

這些問題讓我在 CSS 和 JavaScript 之間來回修改，但始終無法找到問題的根源。

### 轉折點：從盲目修改到科學診斷

直到今天，我意識到一個重要的道理：

> **在沒有數據支持的情況下修改代碼，就像在黑暗中摸索。**

與其繼續盲目地調整數值，不如先建立一個「觀察系統」，讓我能夠即時看到各個元素的尺寸變化。這樣一來，我就能：

1. ✅ **看見問題**：知道哪個元素的尺寸不對
2. ✅ **追蹤變化**：觀察修改後的即時效果
3. ✅ **找到規律**：理解尺寸之間的關係

於是，我決定先暫停佈局的修改，轉而開發一個「即時尺寸監控功能」。

---

## 🎯 功能需求

我需要一個簡單但實用的 debug 工具，能夠：

### 核心需求
1. **即時顯示**：在頁面上隨時顯示關鍵尺寸資訊
2. **自動更新**：尺寸變化時自動更新數值
3. **不影響功能**：不能破壞現有的頁面功能
4. **易於觀察**：顯示位置和樣式要醒目

### 需要監控的資訊
- 🖥️ **螢幕尺寸**：瀏覽器視窗的寬度和高度
- 📦 **容器尺寸**：地圖容器的寬度和高度
- 🎨 **SVG 尺寸**：SVG 元素的寬度和高度

---

## 💡 設計思路

### 1. 顯示位置的選擇

我選擇將 debug 資訊固定在**左上角**，原因是：

- ✅ 不會遮擋主要內容（地圖在中央）
- ✅ 容易觀察（視線自然會看向左上角）
- ✅ 不會與其他 UI 元素衝突

### 2. 視覺設計

為了讓 debug 資訊醒目且專業，我採用了「駭客風格」的設計：

```css
.debug-info {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);  /* 黑色半透明背景 */
  color: #00ff00;                   /* 綠色文字 */
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;           /* 等寬字體 */
  font-size: 12px;
  z-index: 9999;                    /* 確保在最上層 */
  border: 1px solid #00ff00;        /* 綠色邊框 */
}
```

**設計理由**：
- 🎨 **黑底綠字**：經典的終端機風格，專業且醒目
- 📐 **等寬字體**：數字對齊，易於比較
- 🔝 **高 z-index**：確保不會被其他元素遮擋

### 3. 更新機制

我設計了兩種更新觸發方式：

```javascript
// 定期更新（每秒一次）
setInterval(updateDebugInfo, 1000);

// 視窗變化時立即更新
window.addEventListener("resize", updateDebugInfo);
```

**為什麼需要兩種？**
- ⏱️ **定期更新**：捕捉 JavaScript 動態修改的尺寸變化
- 📱 **事件觸發**：即時回應使用者的視窗調整

---

## 🛠️ 實作步驟

### 步驟 1：添加 CSS 樣式

首先，在 `<style>` 區塊中添加 debug 資訊的樣式：

```css
/* Debug 資訊樣式 */
.debug-info {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  border: 1px solid #00ff00;
}

.debug-info div {
  margin: 2px 0;
}
```

### 步驟 2：添加 HTML 結構

在 `<body>` 標籤內，添加 debug 資訊的顯示區域：

```html
<!-- Debug 資訊顯示 -->
<div class="debug-info" id="debugInfo">
  <div>螢幕: <span id="screenWidth">-</span> x <span id="screenHeight">-</span></div>
  <div>容器: <span id="containerWidth">-</span> x <span id="containerHeight">-</span></div>
  <div>SVG: <span id="svgWidth">-</span> x <span id="svgHeight">-</span></div>
</div>
```

**設計說明**：
- 使用 `<span>` 標籤來存放動態更新的數值
- 預設顯示 `-`，表示尚未載入
- 格式為 `寬度 x 高度`，清晰易讀

### 步驟 3：實作更新函數

在 JavaScript 區塊中，添加更新函數：

```javascript
// --- Debug 資訊更新函數 ---
function updateDebugInfo() {
  try {
    // 取得各項尺寸
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const containerWidth = graph ? graph.clientWidth : 0;
    const containerHeight = graph ? graph.clientHeight : 0;
    const svgWidth = zoomInner ? zoomInner.clientWidth : 0;
    const svgHeight = zoomInner ? zoomInner.clientHeight : 0;
    
    // 取得 DOM 元素
    const screenWidthEl = document.getElementById("screenWidth");
    const screenHeightEl = document.getElementById("screenHeight");
    const containerWidthEl = document.getElementById("containerWidth");
    const containerHeightEl = document.getElementById("containerHeight");
    const svgWidthEl = document.getElementById("svgWidth");
    const svgHeightEl = document.getElementById("svgHeight");
    
    // 更新顯示內容
    if (screenWidthEl) screenWidthEl.textContent = screenWidth + "px";
    if (screenHeightEl) screenHeightEl.textContent = screenHeight + "px";
    if (containerWidthEl) containerWidthEl.textContent = containerWidth + "px";
    if (containerHeightEl) containerHeightEl.textContent = containerHeight + "px";
    if (svgWidthEl) svgWidthEl.textContent = svgWidth + "px";
    if (svgHeightEl) svgHeightEl.textContent = svgHeight + "px";
  } catch (e) {
    console.error("Debug 更新錯誤:", e);
  }
}

// 定期更新 debug 資訊
setInterval(updateDebugInfo, 1000);
window.addEventListener("resize", updateDebugInfo);
```

**重點說明**：

1. **安全檢查**：
   ```javascript
   const containerWidth = graph ? graph.clientWidth : 0;
   ```
   使用三元運算子確保元素存在，避免錯誤

2. **錯誤處理**：
   ```javascript
   try {
     // 更新邏輯
   } catch (e) {
     console.error("Debug 更新錯誤:", e);
   }
   ```
   使用 `try-catch` 包裹，確保錯誤不會影響其他功能

3. **條件更新**：
   ```javascript
   if (screenWidthEl) screenWidthEl.textContent = screenWidth + "px";
   ```
   檢查元素存在才更新，避免 null reference 錯誤

---

## 🎨 實際效果

完成後，頁面左上角會顯示類似這樣的資訊：

```
┌─────────────────────────┐
│ 螢幕: 1710px x 1080px   │
│ 容器: 1670px x 900px    │
│ SVG: 1200px x 800px     │
└─────────────────────────┘
```

### 觀察到的現象

有了這個工具後，我立刻發現了一些有趣的現象：

1. **容器寬度 < 螢幕寬度**
   - 原因：側邊面板打開時會佔用空間
   - 解決方向：需要動態調整容器寬度

2. **SVG 寬度 ≠ 容器寬度**
   - 原因：SVG 的尺寸設定可能有問題
   - 解決方向：檢查 `renderGraph()` 函數中的尺寸計算

3. **視窗變化時的延遲**
   - 現象：調整視窗大小時，SVG 尺寸沒有立即更新
   - 解決方向：需要在 resize 事件中觸發重新計算

---

## 🔍 開發過程中的挑戰

### 挑戰 1：避免破壞現有功能

**問題**：之前嘗試添加 debug 功能時，多次導致頁面載入失敗。

**解決方案**：
1. 使用 `try-catch` 包裹所有 debug 相關代碼
2. 將 debug 函數放在變數定義之後
3. 使用條件檢查確保元素存在

```javascript
// ❌ 錯誤做法：直接存取可能不存在的元素
const width = graph.clientWidth;

// ✅ 正確做法：先檢查元素是否存在
const width = graph ? graph.clientWidth : 0;
```

### 挑戰 2：更新時機的選擇

**問題**：什麼時候開始更新 debug 資訊？

**考慮的方案**：
1. ❌ 頁面載入時立即開始 → 可能元素還沒準備好
2. ❌ 地圖載入完成後才開始 → 無法觀察載入過程
3. ✅ 使用定時器和事件監聽 → 簡單可靠

**最終方案**：
```javascript
// 定期更新（每秒一次）
setInterval(updateDebugInfo, 1000);

// 視窗變化時立即更新
window.addEventListener("resize", updateDebugInfo);
```

這樣既能觀察載入過程，又能即時回應變化。

### 挑戰 3：顯示格式的優化

**初始版本**：
```
螢幕寬度: 1710px
螢幕高度: 1080px
容器寬度: 1670px
容器高度: 900px
...
```

**問題**：太冗長，不易快速掃視

**改進版本**：
```
螢幕: 1710px x 1080px
容器: 1670px x 900px
SVG: 1200px x 800px
```

**優點**：
- 更簡潔
- 寬高並列，易於比較
- 使用 `x` 符號，符合尺寸表示習慣

---

## 💡 從這次開發學到的經驗

### 1. 先診斷，再治療

在沒有充分了解問題之前，不要急於修改代碼。建立觀察工具，讓問題自己「現形」。

> **「如果你無法測量它，你就無法改進它。」** - Peter Drucker

### 2. 開發者工具的重要性

好的開發者工具能夠：
- 🔍 **快速定位問題**：不用反覆 `console.log`
- 📊 **即時觀察變化**：看到修改的即時效果
- 🎯 **提高開發效率**：減少猜測和試錯

### 3. 錯誤處理的重要性

在添加新功能時，一定要考慮：
- ✅ 元素是否存在？
- ✅ 變數是否已定義？
- ✅ 錯誤會不會影響其他功能？

使用 `try-catch` 和條件檢查，讓代碼更健壯。

### 4. 漸進式開發

這次我學到了一個重要的教訓：

**不要一次性添加太多功能。**

之前我嘗試同時添加：
- Debug 資訊顯示
- Google Maps 風格佈局
- 無捲軸設計
- 自動尺寸調整

結果導致頁面完全無法載入。

**正確的做法**：
1. 先添加基本的 debug 功能
2. 確認功能正常運作
3. 再逐步添加其他功能

---

## 🎯 下一步計畫

有了這個 debug 工具後，我可以：

### 短期目標
1. **觀察現有佈局的問題**
   - 記錄不同螢幕尺寸下的數值
   - 找出尺寸不匹配的原因

2. **測試不同的佈局方案**
   - 嘗試 Google Maps 風格的無捲軸設計
   - 即時觀察修改效果

3. **優化響應式設計**
   - 確保在不同螢幕尺寸下都能正常顯示
   - 調整容器和 SVG 的尺寸計算邏輯

### 長期目標
1. **建立完整的開發者工具面板**
   - 添加更多診斷資訊（縮放比例、拖曳位置等）
   - 提供開關按鈕，方便開發時使用

2. **記錄和分析**
   - 將尺寸資訊記錄到 localStorage
   - 分析不同使用情境下的尺寸變化

---

## 📝 總結

今天雖然沒有直接解決佈局問題，但我做了一件更重要的事：**建立了診斷工具**。

### 關鍵收穫

1. **工具先行**：在解決複雜問題之前，先建立觀察工具
2. **數據驅動**：用數據指導決策，而不是憑感覺修改
3. **安全第一**：添加新功能時要確保不破壞現有功能
4. **漸進開發**：一次只做一件事，確認無誤後再繼續

### 實用價值

這個 debug 工具不僅幫助我診斷佈局問題，還能：
- 🎓 **學習 CSS 佈局**：直觀地看到尺寸變化
- 🐛 **快速定位 bug**：發現尺寸異常時立即知道
- 📱 **測試響應式設計**：觀察不同螢幕尺寸的表現
