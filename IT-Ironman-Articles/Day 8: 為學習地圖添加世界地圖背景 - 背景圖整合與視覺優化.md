## 前言

在前面的文章中，我們已經完成了 GASO 的核心功能：學習路徑的視覺化、互動功能、路徑高亮等。今天我們要為這個學習地圖添加一個美麗的背景圖，讓整個視覺效果更加豐富和吸引人。

不用說，這個美麗的地圖當然是請 AI 來畫囉！
我出動了 ChatGPT 和 Gemini 兩大畫師，
互相編輯修正之後，勉強得到了一個還算喜歡的風格。



## 今日目標

1. 為 Graphviz 圖表添加背景圖
2. 解決背景圖顯示問題
3. 優化背景圖的視覺效果（半透明處理）
4. 改善錯誤處理機制

## 開發歷程

### 第一步：基礎背景圖設定

一開始，我們嘗試直接在 CSS 中設定背景圖：

```css
#zoomInner { 
  background-image: url("image/World_Map_By_ChatGPT_Fixed_By_Gemini.png"); 
  background-repeat: no-repeat; 
  background-position: center center; 
  background-size: contain; 
}
```

但是發現背景圖沒有顯示出來。

### 第二步：診斷問題

通過檢查 HTML 結構，我們發現問題所在：

```html
<div id="zoomInner" style="width: 3654px; height: 2280px; transform: scale(0.39);">
  <svg xmlns="http://www.w3.org/2000/svg">
    <polygon fill="#ffffff" stroke="transparent" points="..."></polygon>
    <!-- 其他 SVG 元素 -->
  </svg>
</div>
```

**問題分析：**
- Graphviz 生成的 SVG 包含一個白色背景的 `polygon` 元素
- 這個白色背景覆蓋了我們設定的背景圖
- 需要讓 SVG 背景變透明才能看到背景圖

### 第三步：解決 SVG 背景問題

我們添加了 CSS 規則來讓 SVG 背景透明：

```css
#zoomInner svg { background: transparent !important; }
#zoomInner svg polygon[fill="#ffffff"] { fill: transparent !important; }
```

這樣就解決了背景圖被覆蓋的問題。

### 第四步：使用 GitHub 作為圖片來源

為了確保背景圖的穩定性和可訪問性，我們決定使用 GitHub 的 raw URL：

```css
background-image: url("https://raw.githubusercontent.com/yhlhenry/GASO/main/image/World_Map_By_ChatGPT_Fixed_By_Gemini.png");
```

**優點：**
- ✅ 公開存取，不需要登入
- ✅ 版本控制，圖片更新會自動反映
- ✅ 穩定的 URL，不會過期
- ✅ 免費且可靠

### 第五步：實現半透明效果

為了讓背景圖不會干擾圖表的可讀性，我們實現了半透明效果：

```css
#zoomInner { 
  transform-origin: 0 0; 
  display: inline-block; 
  position: relative; 
}

#zoomInner::before { 
  content: ''; 
  position: absolute; 
  top: 0; left: 0; right: 0; bottom: 0; 
  background-image: url("https://raw.githubusercontent.com/yhlhenry/GASO/main/image/World_Map_By_ChatGPT_Fixed_By_Gemini.png"); 
  background-repeat: no-repeat; 
  background-position: center center; 
  background-size: contain; 
  opacity: 0.3; 
  z-index: -1; 
}

#zoomInner svg { 
  background: transparent !important; 
  position: relative; 
  z-index: 1; 
}
```

**技術要點：**
- 使用 `::before` 偽元素創建背景層
- 背景層：`z-index: -1`，`opacity: 0.3`（30% 透明度）
- SVG 層：`z-index: 1`，保持完全不透明
- 確保層次正確，背景圖不會干擾圖表可讀性

### 第六步：改善錯誤處理

在開發過程中，我們也發現了一些潛在的問題，並進行了改善：

#### 後端改善：試算表後援機制

```javascript
function getSpreadsheet() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const { spreadsheetId } = getConfig();
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);
  throw new Error('找不到可用的試算表。請在 Script Properties 設定 SPREADSHEET_ID，或將此 Apps Script 綁定在目標試算表後再執行。');
}
```

#### 前端改善：錯誤處理

```javascript
google.script.run
  .withSuccessHandler(function (data) {
    // 成功處理邏輯
  })
  .withFailureHandler(function (err) {
    console.error('取得資料失敗：', err);
    const msg = (err && err.message) ? err.message : '載入資料時發生未知錯誤。';
    graph.innerHTML = `<div style="padding:16px;color:#b00020">${msg}</div>`;
  })
  .getGraphData();
```

## 技術亮點

### 1. CSS 層次管理
使用 `z-index` 和 `position` 屬性精確控制元素的層次關係，確保背景圖在後層，圖表在前層。

### 2. 偽元素應用
利用 `::before` 偽元素創建背景層，避免影響原有的 DOM 結構。

### 3. 透明度控制
通過 `opacity` 屬性實現半透明效果，平衡視覺美觀和功能實用性。

### 4. 錯誤處理機制
建立完善的錯誤處理流程，提升使用者體驗。

## 最終效果

經過今天的開發，我們的 GASO 學習地圖現在具備了：

1. **美麗的背景圖**：世界地圖作為背景，增加視覺吸引力
2. **半透明效果**：背景圖不會干擾圖表的可讀性
3. **穩定的圖片來源**：使用 GitHub 確保圖片長期可用
4. **完善的錯誤處理**：提供友善的錯誤訊息
5. **後援機制**：支援多種試算表配置方式

## 明日展望

明天我們將繼續優化 GASO 的功能，可能的方向包括：
- 添加更多視覺效果選項
- 優化使用者介面
- 增加更多互動功能
- 效能優化

## 總結

今天的開發重點在於視覺效果的提升和系統穩定性的改善。通過添加背景圖和實現半透明效果，我們讓 GASO 的視覺呈現更加豐富和專業。同時，改善的錯誤處理機制也讓系統更加穩定可靠。

這些看似簡單的視覺調整，實際上涉及了 CSS 層次管理、偽元素應用、透明度控制等多個技術要點，是前端開發中常見但重要的技能。


---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
