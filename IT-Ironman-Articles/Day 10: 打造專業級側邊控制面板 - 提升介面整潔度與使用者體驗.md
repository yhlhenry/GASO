## 前言

在昨天的文章中，我們成功為 GASO 添加了搜尋功能，現在頁面上的功能愈來愈多了。
今天我們就來解決一個重要的介面設計問題：隨著功能越來越多，原本分散在頁面頂部的控制項變得雜亂，影響了整體的使用體驗。

因此，我們決定打造一個專業級的側邊控制面板，將所有使用者可調整的參數都整合到一個可收合的面板中，大幅提升介面的整潔度和專業感。

## 今日目標

1. 設計側邊面板的整體架構
2. 實現面板的收合/展開功能
3. 將所有控制項重新組織到面板中
4. 優化面板的視覺設計和動畫效果
5. 添加響應式設計支援

## 開發歷程

### 第一步：分析現有控制項結構

首先，我們分析了當前頁面上的所有控制項：

**原有控制項：**
- 縮放控制：縮放滑桿、放大/縮小按鈕、適應螢幕、重設
- 版面配置：Layout 引擎、方向 (rankdir)、邊線樣式、節點形狀
- 字體控制：字體大小滑桿、字體調整按鈕、重設字體
- 路徑控制：清除路徑高亮按鈕

**問題分析：**
- 控制項分散在兩個控制列中，視覺上不統一
- 佔用過多垂直空間，壓縮了圖表顯示區域
- 在手機版上控制項會堆疊，影響使用體驗
- 缺乏視覺分組，使用者難以快速找到需要的功能

### 第二步：設計側邊面板架構

我們決定採用側邊面板的設計方案：

```html
<!-- 側邊面板切換按鈕 -->
<button class="sidebar-toggle" id="sidebarToggle">⚙️</button>

<!-- 側邊控制面板 -->
<div class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <h3 class="sidebar-title">控制面板</h3>
    <button class="sidebar-close" id="sidebarClose">×</button>
  </div>
  
  <!-- 分組的控制項 -->
  <div class="control-group">
    <!-- 控制項內容 -->
  </div>
</div>
```

**設計考量：**
- 使用固定定位，不影響頁面滾動
- 預設隱藏在右側，需要時才展開
- 分組管理，相關功能放在一起
- 提供多種關閉方式，提升使用者體驗

### 第三步：實現面板樣式設計

為了提供專業的視覺效果，我們設計了完整的 CSS 樣式：

```css
/* 側邊面板樣式 */
.sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background: #f8f9fa;
  border-left: 1px solid #dee2e6;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar.open {
  right: 0;
}

.sidebar-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 1001;
}
```

**樣式特色：**
- 現代化的卡片式設計
- 平滑的展開/收合動畫
- 清晰的視覺層次和分組
- 一致的按鈕樣式和 hover 效果

### 第四步：重新組織控制項

我們將所有控制項按功能分為 4 個群組：

#### 1. 縮放控制組
```html
<div class="control-group">
  <div class="control-group-title">縮放控制</div>
  <div class="control-item">
    <label>縮放比例</label>
    <input id="zoomRange" type="range" min="25" max="400" step="5" value="100" />
    <span id="zoomLabel" class="value-display">100%</span>
  </div>
  <div class="control-item">
    <button id="zoomOut">縮小 (−)</button>
  </div>
  <div class="control-item">
    <button id="zoomIn">放大 (＋)</button>
  </div>
  <div class="control-item">
    <button id="fitWidth">適應螢幕寬度</button>
  </div>
  <div class="control-item">
    <button id="resetZoom">重設縮放</button>
  </div>
</div>
```

#### 2. 版面配置控制組
```html
<div class="control-group">
  <div class="control-group-title">版面配置</div>
  <div class="control-item">
    <label>Layout 引擎</label>
    <select id="layoutSelect">
      <option value="dot">dot（階層式）</option>
      <option value="neato">neato（力導向）</option>
      <!-- 其他選項... -->
    </select>
  </div>
  <!-- 其他版面配置選項... -->
</div>
```

#### 3. 字體設定控制組
```html
<div class="control-group">
  <div class="control-group-title">字體設定</div>
  <div class="control-item">
    <label>字體大小</label>
    <input id="fontRange" type="range" min="8" max="40" step="1" value="14" />
    <span id="fontLabel" class="value-display">14px</span>
  </div>
  <!-- 其他字體控制項... -->
</div>
```

#### 4. 路徑控制組
```html
<div class="control-group">
  <div class="control-group-title">路徑控制</div>
  <div class="control-item">
    <button id="clearPathHighlight" class="danger">清除路徑高亮</button>
  </div>
</div>
```

### 第五步：實現面板控制邏輯

接下來實現面板的 JavaScript 控制邏輯：

```javascript
// --- 側邊面板控制 ---
function toggleSidebar() {
  sidebar.classList.toggle('open');
  sidebarToggle.classList.toggle('open');
  adjustGraphMargin();
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarToggle.classList.remove('open');
  adjustGraphMargin();
}

function adjustGraphMargin() {
  const graph = $("graph");
  if (sidebar.classList.contains('open')) {
    // 在桌面版時調整邊距
    if (window.innerWidth > 768) {
      graph.style.marginRight = '350px';
    }
  } else {
    graph.style.marginRight = '0';
  }
}

// 側邊面板事件監聽
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener('click', closeSidebar);
}

// 點擊外部關閉側邊面板
document.addEventListener('click', function(e) {
  if (sidebar.classList.contains('open') && 
      !sidebar.contains(e.target) && 
      !sidebarToggle.contains(e.target)) {
    closeSidebar();
  }
});

// ESC 鍵關閉側邊面板
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
  }
});
```

**功能特色：**
- 多種關閉方式：按鈕點擊、外部點擊、ESC 鍵
- 智能邊距調整：面板打開時自動調整圖表右邊距
- 響應式支援：根據螢幕大小調整行為

### 第六步：優化視覺設計

為了提供更好的視覺體驗，我們添加了詳細的樣式設計：

```css
.control-group {
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-group-title {
  font-size: 14px;
  font-weight: bold;
  color: #495057;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-item {
  margin-bottom: 15px;
}

.control-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.control-item button {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.control-item button:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.control-item button.danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}
```

**設計亮點：**
- 卡片式分組設計，每個控制組都有獨立的白色背景
- 清晰的標題層次，使用大寫字母和間距
- 一致的按鈕樣式，包含 hover 效果
- 危險操作使用紅色警告樣式

### 第七步：實現響應式設計

最後，我們添加了完整的響應式設計支援：

```css
/* 響應式設計優化 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    right: -100%;
  }

  .sidebar.open {
    right: 0;
  }

  .sidebar-toggle.open {
    right: 20px;
  }
}
```

**響應式特色：**
- 桌面版：面板寬度 350px，圖表自動調整右邊距
- 手機版：面板佔滿整個螢幕寬度
- 自動適應：視窗大小變化時自動調整佈局

## 技術亮點

### 1. 現代化 CSS 設計
- 使用 CSS Grid 和 Flexbox 實現靈活佈局
- 平滑的 CSS 動畫和過渡效果
- 一致的設計語言和視覺層次

### 2. 智能 JavaScript 控制
- 多種面板關閉方式，提升使用者體驗
- 智能邊距調整，確保圖表顯示最佳
- 響應式事件處理，適配不同設備

### 3. 分組式功能管理
- 按功能邏輯分組，提升可發現性
- 清晰的視覺分隔，降低認知負擔
- 可擴展的架構，便於未來功能添加

### 4. 無障礙設計
- 支援鍵盤操作（ESC 鍵關閉）
- 清晰的視覺回饋和狀態指示
- 適當的色彩對比和字體大小

## 最終效果

經過今天的開發，GASO 現在具備了：

1. **專業級側邊控制面板**：所有控制項都整合在一個可收合的面板中
2. **分組式功能管理**：相關功能被分組管理，提升可發現性
3. **現代化視覺設計**：卡片式設計和一致的視覺語言
4. **多種操作方式**：按鈕點擊、外部點擊、ESC 鍵等多種關閉方式
5. **響應式支援**：在桌面和手機設備上都有良好的使用體驗
6. **智能佈局調整**：面板打開時自動調整圖表邊距

## 使用範例

**操作流程：**
1. 點擊右上角的 ⚙️ 按鈕打開控制面板
2. 在分組的控制項中調整各種參數
3. 使用多種方式關閉面板（× 按鈕、外部點擊、ESC 鍵）
4. 享受更整潔和專業的使用介面

**功能分組：**
- **縮放控制**：調整圖表的縮放比例和視圖
- **版面配置**：選擇不同的佈局引擎和視覺樣式
- **字體設定**：調整文字大小和顯示效果
- **路徑控制**：管理路徑高亮功能

## 明日展望

明天我們將繼續優化 GASO 的功能，可能的方向包括：
- 添加更多自定義選項（顏色主題、動畫效果等）
- 實現設定檔的匯入/匯出功能
- 添加快捷鍵支援
- 優化面板的搜尋和過濾功能

## 總結

今天的開發重點在於解決介面設計和使用者體驗的問題。通過實現專業級的側邊控制面板，我們大幅提升了 GASO 的介面整潔度和專業感。

這個功能看似簡單，但實際上涉及了：
- 現代化的 CSS 設計和動畫效果
- 複雜的 JavaScript 狀態管理和事件處理
- 響應式設計和無障礙設計考量
- 使用者體驗設計和互動模式
- 可擴展的架構設計

這些技術要點都是前端開發中重要的技能，對於創建專業級的 Web 應用程式至關重要。側邊面板的設計不僅解決了當前的問題，也為未來的功能擴展奠定了良好的基礎。

---

如果想要看一些我的鐵人賽花邊心得，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
