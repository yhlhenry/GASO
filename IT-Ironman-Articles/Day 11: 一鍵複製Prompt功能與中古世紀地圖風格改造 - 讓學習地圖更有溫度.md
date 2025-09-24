# Day 11: 一鍵複製Prompt功能與中古世紀地圖風格改造 - 讓學習地圖更有溫度

## 前言

今天早上，我坐在電腦前看著 GASO 的介面，突然有種感覺：這個學習地圖雖然功能完整，但總覺得少了點什麼。

就像一張現代化的地圖，雖然精確實用，但缺乏了那種讓人想要探索的魔力。我想起了小時候翻閱的那些古老地圖集，那些泛黃的紙張、優雅的襯線字體、還有那些神秘的邊框裝飾，每一張都像是在訴說著一個探險的故事。

於是，我決定給 GASO 一個全新的靈魂。

## 今日目標

1. 實現一鍵複製 Prompt 功能，讓使用者能輕鬆複製節點內容
2. 將整體風格改造為中古世紀地圖風格，增加探索的趣味性
3. 優化介面佈局，讓標題和搜尋欄更協調
4. 統一所有控制元件的視覺風格

## 開發歷程

### 第一步：為什麼需要一鍵複製功能？

在實際使用 GASO 的過程中，我發現了一個痛點：當使用者看到某個節點的 Prompt 內容很感興趣時，想要複製到 AI 工具中使用，卻只能手動選取文字。這在手機上尤其麻煩，而且容易出錯。

於是我想到了添加一個「一鍵複製」按鈕。但這個按鈕放在哪裡呢？我思考了幾個選項：

1. **在節點上直接顯示**：會讓圖形變得雜亂
2. **在彈出視窗的標題列**：位置不夠明顯
3. **在 Prompt 區域內**：最直觀，但要注意不要遮住內容

最終我選擇了第三個方案，並特別注意了按鈕的位置設計。

### 第二步：實現複製功能

我使用了現代的 Clipboard API，但也準備了降級方案：

```javascript
async function copyPromptToClipboard(promptText) {
  try {
    // 使用現代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(promptText);
      showCopySuccess();
    } else {
      // 降級方案：使用傳統的 document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = promptText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showCopySuccess();
      } else {
        showCopyError();
      }
    }
  } catch (err) {
    console.error('複製失敗:', err);
    showCopyError();
  }
}
```

這個實現讓我學到了一個重要的教訓：**永遠要為使用者準備降級方案**。不是所有環境都支援最新的 API，但我們不能因此放棄功能。

### 第三步：視覺回饋的設計

複製功能如果沒有回饋，使用者會不知道是否成功。我設計了三種狀態：

- **預設狀態**：藍色按鈕，顯示「複製」
- **成功狀態**：綠色按鈕，顯示「已複製 ✓」
- **失敗狀態**：紅色按鈕，顯示「複製失敗」

```javascript
function showCopySuccess() {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    const originalText = button.textContent;
    button.classList.add('copied');
    button.textContent = '已複製';
    
    // 2秒後恢復原狀
    setTimeout(() => {
      button.classList.remove('copied');
      button.textContent = originalText;
    }, 2000);
  });
}
```

### 第四步：解決按鈕遮擋問題

第一次實現後，我發現複製按鈕會遮住 Prompt 的內容。這是一個典型的 UI 設計問題：功能性和美觀性的平衡。

我調整了 CSS：

```css
.info-prompt {
  padding: 10px 50px 10px 10px; /* 右邊增加內邊距避免被按鈕遮住 */
  min-height: 40px; /* 確保有足夠高度容納按鈕 */
}

.copy-button {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10; /* 確保按鈕在最上層 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.2); /* 添加陰影讓按鈕更明顯 */
}
```

這個小調整讓我意識到，**細節決定體驗**。一個按鈕的位置、一個陰影的效果，都可能影響使用者的感受。

### 第五步：中古世紀風格的靈感來源

當複製功能完成後，我開始思考整體的視覺風格。為什麼選擇中古世紀地圖風格？

1. **學習本身就是一場探險**：就像古代探險家拿著地圖探索未知領域一樣
2. **增加趣味性**：讓學習變得更有儀式感，而不是冷冰冰的工具
3. **與內容呼應**：Google Apps Script 的世界確實像一個需要探索的領域

我開始研究古代地圖的視覺特徵：
- 羊皮紙質感的背景
- 棕色系的配色
- 襯線字體
- 厚重的邊框和陰影

### 第六步：配色方案的選擇

我選擇了以下配色方案：

```css
:root {
  --primary-brown: #8b4513;    /* 深棕色 */
  --secondary-brown: #a0522d;  /* 中棕色 */
  --light-brown: #654321;      /* 淺棕色 */
  --parchment: #faf8f3;        /* 羊皮紙色 */
  --background: #f4f1e8;       /* 背景色 */
}
```

這些顏色不是隨意選擇的，而是參考了真實的古代地圖和羊皮紙的色調。

### 第七步：字體的選擇

我將字體從現代的無襯線字體改為襯線字體：

```css
body { 
  font-family: 'Times New Roman', 'Georgia', serif; 
}
```

這個改變讓整個介面瞬間有了古典的氣息。字體的力量真的很大，它能夠傳達出完全不同的情感。

### 第八步：標題的重新設計

我將標題從「Google Apps Script Graphviz Demo」改為「Google Apps Script Odyssey」。

為什麼選擇「Odyssey」？

1. **Odyssey 代表史詩般的旅程**：學習 Google Apps Script 確實是一段充滿挑戰的旅程
2. **與中古世紀風格呼應**：Odyssey 讓人聯想到古代的史詩故事
3. **更有故事性**：比「Demo」更有深度和意義

### 第九步：佈局的重新思考

我將標題和搜尋欄改為同一行的佈局：

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.search-container {
  flex: 1;
  max-width: 400px;
}
```

這個佈局讓頁面看起來更平衡，也更好地利用了水平空間。

### 第十步：控制面板的風格統一

最後，我需要統一控制面板的風格。原本的藍色按鈕和現代化設計與中古世紀風格格格不入。

我重新設計了所有控制元件：

```css
.sidebar-toggle {
  background: #8b4513;
  color: #faf8f3;
  border: 2px solid #654321;
  border-radius: 8px; /* 從圓形改為方角 */
  font-family: 'Times New Roman', serif;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

這個改變讓整個介面變得一致，每一處細節都在訴說著同一個故事。

## 技術細節與思考

### 複製功能的技術考量

在實現複製功能時，我考慮了幾個技術問題：

1. **瀏覽器相容性**：Clipboard API 在較舊的瀏覽器中可能不支援
2. **安全性**：Clipboard API 需要 HTTPS 環境
3. **使用者體驗**：需要提供即時的回饋

最終的解決方案兼顧了這些考量，確保功能在各種環境下都能正常工作。

### CSS 設計的系統性思考

在設計中古世紀風格時，我建立了一個設計系統：

- **色彩系統**：統一的棕色系配色
- **字體系統**：一致的襯線字體使用
- **間距系統**：統一的邊框寬度和陰影效果
- **互動系統**：一致的 hover 和 active 狀態

這種系統性的思考讓整個設計變得協調統一。

### 響應式設計的考量

在重新設計佈局時，我特別注意了響應式設計：

```css
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .title-section {
    min-width: auto;
  }
  
  .search-container {
    max-width: 100%;
  }
}
```

確保在各種螢幕尺寸下都能提供良好的使用體驗。

## 遇到的挑戰與解決方案

### 挑戰一：按鈕遮擋內容

**問題**：複製按鈕會遮住 Prompt 文字
**解決方案**：調整內邊距和按鈕位置，確保內容完全可見

### 挑戰二：風格統一

**問題**：控制面板的現代化風格與中古世紀風格不協調
**解決方案**：重新設計所有控制元件，建立統一的設計系統

### 挑戰三：瀏覽器相容性

**問題**：Clipboard API 在某些環境下不可用
**解決方案**：提供降級方案，使用傳統的 document.execCommand

## 使用者體驗的改善

這次的改進主要從以下幾個方面提升了使用者體驗：

1. **功能性提升**：一鍵複製功能讓內容分享變得簡單
2. **視覺體驗**：中古世紀風格增加了探索的趣味性
3. **操作效率**：優化的佈局讓功能更容易找到和使用
4. **情感連結**：整體風格讓學習變得更有儀式感

## 反思與學習

### 設計思維的轉變

這次的開發讓我意識到，**技術實現只是第一步，更重要的是設計思維**。一個好的產品不僅要功能完整，更要有靈魂。

中古世紀風格的選擇不是隨意的，而是基於對使用者心理的深入思考。學習本身就是一場探險，而我們的工具應該要能夠激發這種探險的熱情。

### 細節的重要性

在開發過程中，我發現很多看似微小的細節其實對整體體驗有重大影響：

- 按鈕的圓角還是方角
- 陰影的深度和方向
- 字體的選擇
- 顏色的搭配

這些細節加起來，就形成了完全不同的使用者感受。

### 系統性思考的價值

這次的改進讓我學會了系統性思考。不是單獨地修改某個元件，而是建立一個完整的設計系統，確保所有元素都協調一致。

## 下一步的規劃

今天的改進為 GASO 帶來了新的面貌，但這只是開始。我計劃在接下來的幾天中：

1. **優化動畫效果**：讓介面切換更加流暢
2. **增加更多互動元素**：讓探索變得更有趣
3. **完善響應式設計**：確保在各種裝置上都有良好體驗
4. **收集使用者回饋**：根據實際使用情況進行調整

## 結語

今天的開發過程讓我深刻體會到，**技術和藝術的結合**是多麼重要。一個好的工具不僅要實用，更要有溫度，要能夠觸動使用者的內心。

GASO 現在不再只是一個功能性的學習工具，而是一個有故事、有靈魂的探險地圖。每一處細節都在訴說著同一個故事：學習是一場偉大的探險，而我們都是這場探險中的探險家。

當使用者打開 GASO，看到那古樸的羊皮紙背景、優雅的襯線字體、還有那些神秘的邊框裝飾時，我希望他們能夠感受到那種探索未知領域的興奮和期待。

因為學習 Google Apps Script，真的就像一場史詩般的 Odyssey。

---

*明天，我們將繼續探索 GASO 的可能性，讓這個學習地圖變得更加豐富和有趣。敬請期待！*

## 相關資源

- [Clipboard API 文檔](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [CSS 設計系統指南](https://designsystemsrepo.com/)
- [中古世紀地圖風格參考](https://www.oldmapsonline.org/)

## 技術要點總結

1. **複製功能實現**：Clipboard API + 降級方案
2. **視覺回饋設計**：三種狀態的按鈕樣式
3. **中古世紀風格**：配色、字體、邊框的系統性設計
4. **響應式佈局**：Flexbox 實現的彈性佈局
5. **設計系統**：統一的視覺語言和互動模式
