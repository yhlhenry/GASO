# Day 20: 互動體驗升級 - 實作流暢的拖曳與滑鼠縮放功能

## 前言

在學習地圖的互動體驗中，**拖曳**和**縮放**功能是使用者最常使用的操作。今天我們要為 GASO 添加這些核心互動功能，讓使用者能夠像操作 Google Maps 一樣流暢地瀏覽學習地圖。

## 功能需求分析

### 🎯 拖曳功能需求
- 滑鼠拖曳移動地圖
- 觸控裝置支援
- 流暢的拖曳體驗
- 防止文字選取干擾

### 🎯 縮放功能需求
- 滑鼠滾輪縮放
- 以滑鼠位置為中心縮放
- 平滑的縮放動畫
- 縮放範圍限制

## 實作步驟

### 第一步：建立拖曳狀態管理

首先，我們需要在狀態物件中加入拖曳相關的變數：

```javascript
// 拖曳狀態管理
state.isDragging = false;
state.dragStartX = 0;
state.dragStartY = 0;
state.dragOffsetX = 0;
state.dragOffsetY = 0;
state.currentTranslateX = 0;
state.currentTranslateY = 0;
```

### 第二步：實作拖曳開始事件

```javascript
// 開始拖曳
function startDrag(e) {
  // 防止在節點上拖曳
  if (e.target.closest('g.node')) return;
  
  state.isDragging = true;
  graph.classList.add('dragging');
  zoomInner.classList.add('dragging');
  
  // 記錄起始位置
  state.dragStartX = e.clientX;
  state.dragStartY = e.clientY;
  state.dragOffsetX = state.currentTranslateX;
  state.dragOffsetY = state.currentTranslateY;
  
  console.log('開始拖曳，起始位置:', state.dragStartX, state.dragStartY);
}
```

### 第三步：實作拖曳過程處理

```javascript
// 拖曳中
function drag(e) {
  if (!state.isDragging) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // 計算位移
  const deltaX = e.clientX - state.dragStartX;
  const deltaY = e.clientY - state.dragStartY;
  
  // 更新位置
  state.currentTranslateX = state.dragOffsetX + deltaX;
  state.currentTranslateY = state.dragOffsetY + deltaY;
  
  // 應用變換
  applyDragTransform();
}
```

### 第四步：實作拖曳結束處理

```javascript
// 拖曳結束
function endDrag(e) {
  if (!state.isDragging) return;
  
  state.isDragging = false;
  graph.classList.remove('dragging');
  zoomInner.classList.remove('dragging');
  
  console.log('拖曳結束');
}
```

### 第五步：實作變換應用函數

```javascript
// 應用拖曳變換
function applyDragTransform() {
  const scale = state.scalePct / 100;
  zoomInner.style.transform = `translate(${state.currentTranslateX}px, ${state.currentTranslateY}px) scale(${scale})`;
}
```

### 第六步：綁定拖曳事件

```javascript
// 綁定拖曳事件
graph.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);
```

### 第七步：添加觸控支援

```javascript
// 觸控支援
graph.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrag(mouseEvent);
  }
});

document.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && state.isDragging) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    drag(mouseEvent);
  }
});

document.addEventListener('touchend', (e) => {
  if (state.isDragging) {
    endDrag(e);
  }
});
```

### 第八步：實作滑鼠縮放功能

```javascript
// Google Maps 風格的滾輪縮放
graph.addEventListener("wheel", (e) => {
  e.preventDefault();
  
  // 取得滑鼠相對於畫布的位置
  const rect = graph.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // 計算縮放前的滑鼠相對於地圖的位置
  const scale = state.scalePct / 100;
  const mapX = (mouseX - state.currentTranslateX) / scale;
  const mapY = (mouseY - state.currentTranslateY) / scale;
  
  // 計算縮放變化
  const delta = Math.sign(e.deltaY);
  const zoomChange = delta > 0 ? -10 : 10;
  const newScale = Math.max(10, Math.min(500, state.scalePct + zoomChange));
  const scaleRatio = newScale / state.scalePct;
  
  // 更新縮放比例
  state.scalePct = newScale;
  
  // 計算新的位移，保持滑鼠位置不變
  const newScaleValue = state.scalePct / 100;
  state.currentTranslateX = mouseX - mapX * newScaleValue;
  state.currentTranslateY = mouseY - mapY * newScaleValue;
  
  // 添加縮放動畫效果
  zoomInner.classList.add('zooming');
  
  // 應用變換
  applyDragTransform();
  zoomLabel.textContent = `${state.scalePct}%`;
  zoomRange.value = String(state.scalePct);
  
  // 移除動畫類別
  setTimeout(() => {
    zoomInner.classList.remove('zooming');
  }, 300);
  
  console.log(`縮放到 ${state.scalePct}%，滑鼠位置: (${mouseX}, ${mouseY})`);
}, { passive: false });
```

## CSS 樣式優化

### 拖曳游標樣式

```css
#graph { 
  cursor: grab;
  user-select: none;
}

#graph.dragging {
  cursor: grabbing;
}

#graph.drag-mode {
  cursor: grab;
}

#graph.drag-mode.dragging {
  cursor: grabbing;
}
```

### 平滑動畫效果

```css
#zoomInner { 
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

#zoomInner.dragging {
  transition: none;
}

#zoomInner.zooming {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 防止文字選取

```css
#graph {
  overflow: hidden; /* 改為 hidden，讓拖曳更流暢 */
  user-select: none;
}
```

## 核心技術解析

### 🎯 拖曳技術要點

1. **事件處理順序**
   - `mousedown` → 開始拖曳
   - `mousemove` → 拖曳過程
   - `mouseup` → 結束拖曳

2. **位置計算**
   ```javascript
   const deltaX = e.clientX - state.dragStartX;
   const deltaY = e.clientY - state.dragStartY;
   ```

3. **變換應用**
   ```javascript
   zoomInner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
   ```

### 🎯 縮放技術要點

1. **以滑鼠為中心縮放**
   ```javascript
   const mapX = (mouseX - state.currentTranslateX) / scale;
   const mapY = (mouseY - state.currentTranslateY) / scale;
   ```

2. **保持滑鼠位置不變**
   ```javascript
   state.currentTranslateX = mouseX - mapX * newScaleValue;
   state.currentTranslateY = mouseY - mapY * newScaleValue;
   ```

3. **縮放範圍限制**
   ```javascript
   const newScale = Math.max(10, Math.min(500, state.scalePct + zoomChange));
   ```

## 觸控支援實作

### 觸控事件轉換

```javascript
// 將觸控事件轉換為滑鼠事件
const mouseEvent = new MouseEvent('mousedown', {
  clientX: touch.clientX,
  clientY: touch.clientY
});
```

### 多點觸控處理

```javascript
if (e.touches.length === 1) {
  // 單點觸控，視為拖曳
} else if (e.touches.length === 2) {
  // 雙點觸控，視為縮放
}
```

## 效能優化策略

### 1. 事件防抖
```javascript
// 使用 requestAnimationFrame 優化拖曳效能
let animationId;
function drag(e) {
  if (!state.isDragging) return;
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  animationId = requestAnimationFrame(() => {
    // 拖曳邏輯
    applyDragTransform();
  });
}
```

### 2. 條件式事件綁定
```javascript
// 只在需要時綁定事件
if (state.isDragMode) {
  graph.addEventListener('mousedown', startDrag);
}
```

### 3. 記憶體管理
```javascript
// 清理事件監聽器
function cleanup() {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
}
```

## 使用者體驗優化

### 視覺回饋

1. **游標變化**
   - 預設：`grab`
   - 拖曳中：`grabbing`

2. **動畫效果**
   - 平滑的縮放動畫
   - 流暢的拖曳體驗

3. **邊界處理**
   - 防止拖曳超出合理範圍
   - 縮放範圍限制

### 互動邏輯

1. **節點保護**
   ```javascript
   if (e.target.closest('g.node')) return;
   ```

2. **事件優先級**
   - 拖曳優先於節點點擊
   - 縮放優先於頁面滾動

## 測試與除錯

### 除錯工具

```javascript
console.log('開始拖曳，起始位置:', state.dragStartX, state.dragStartY);
console.log('拖曳中，偏移:', deltaX, deltaY);
console.log(`縮放到 ${state.scalePct}%，滑鼠位置: (${mouseX}, ${mouseY})`);
```

### 常見問題解決

1. **拖曳不流暢**
   - 檢查 `overflow: hidden`
   - 確認 `user-select: none`

2. **縮放位置偏移**
   - 檢查座標計算
   - 確認變換順序

3. **觸控不響應**
   - 檢查事件轉換
   - 確認觸控事件綁定

## 完整實作效果

### 功能特色

✅ **流暢拖曳**：像 Google Maps 一樣的拖曳體驗
✅ **智能縮放**：以滑鼠位置為中心的縮放
✅ **觸控支援**：完整的行動裝置支援
✅ **動畫效果**：平滑的視覺回饋
✅ **效能優化**：流暢的 60fps 體驗

### 技術亮點

1. **座標系統**：精確的座標轉換計算
2. **事件處理**：完整的事件生命週期管理
3. **動畫系統**：CSS3 動畫與 JavaScript 結合
4. **跨平台**：滑鼠與觸控統一處理

## 總結

今天的實作為 GASO 添加了核心的互動功能：

### 🎯 技術成就
- **拖曳系統**：完整的拖曳狀態管理與事件處理
- **縮放系統**：智能的滑鼠中心縮放算法
- **觸控支援**：跨平台的觸控事件處理
- **效能優化**：流暢的動畫與事件處理

### 🎯 使用者體驗
- **直觀操作**：符合使用者習慣的互動方式
- **視覺回饋**：清晰的游標變化與動畫效果
- **跨裝置**：桌面與行動裝置的完美支援

### 🎯 程式碼品質
- **模組化設計**：清晰的函數分離與職責劃分
- **錯誤處理**：完善的邊界條件處理
- **效能考量**：優化的事件處理與動畫

這些互動功能讓 GASO 的學習地圖從靜態展示升級為動態互動平台，使用者可以自由探索學習路徑，就像在數位地圖上導航一樣自然流暢！

