# Day 19: 個人化學習體驗 - 為 GASO 添加客製化資訊輸入功能

## 🎯 今日目標

今天我們要為 GASO 添加一個重要的功能：**客製化資訊輸入系統**，讓使用者可以根據自己的角色和技能水平獲得個人化的學習建議。

## 🚀 功能規劃

### 核心需求
- 讓使用者輸入自己的職責、職位和 Google Apps Script 熟悉程度
- 提供預設選項和自訂輸入的靈活設計
- 將個人資訊整合到節點的 prompt 中
- 支援資料持久化儲存

### 使用者體驗設計
1. **首次訪問**：自動彈出個人資訊設定表單
2. **再次訪問**：自動載入已儲存的個人資訊
3. **隨時修改**：可透過側邊面板重新編輯
4. **一鍵清除**：可清除所有個人資訊重新設定

## 🛠️ 技術實作

### 1. HTML 表單結構

首先，我們在 HTML 中添加客製化資訊輸入表單：

```html
<!-- 客製化資訊輸入表單 -->
<div id="customInfoModal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close" id="customInfoClose">&times;</span>
    <h3>個人化設定</h3>
    <div class="custom-info-form">
      <div class="form-group">
        <label for="userRole">我是負責</label>
        <div class="input-group">
          <select id="userRoleSelect" class="form-select">
            <option value="">請選擇...</option>
            <option value="專案管理">專案管理</option>
            <option value="資料分析">資料分析</option>
            <option value="自動化流程">自動化流程</option>
            <option value="報表製作">報表製作</option>
            <option value="系統整合">系統整合</option>
            <option value="人力資源">人力資源</option>
            <option value="財務管理">財務管理</option>
            <option value="銷售業務">銷售業務</option>
            <option value="行銷推廣">行銷推廣</option>
            <option value="客戶服務">客戶服務</option>
            <option value="營運管理">營運管理</option>
            <option value="教育訓練">教育訓練</option>
            <option value="品質管控">品質管控</option>
            <option value="採購管理">採購管理</option>
            <option value="其他">其他</option>
          </select>
          <input type="text" id="userRoleCustom" class="form-input" placeholder="請輸入您的職責..." style="display: none;">
        </div>
      </div>
      
      <div class="form-group">
        <label for="userTitle">的</label>
        <div class="input-group">
          <select id="userTitleSelect" class="form-select">
            <option value="">請選擇...</option>
            <option value="專案經理">專案經理</option>
            <option value="資料分析師">資料分析師</option>
            <option value="業務分析師">業務分析師</option>
            <option value="系統管理員">系統管理員</option>
            <option value="開發人員">開發人員</option>
            <option value="人資專員">人資專員</option>
            <option value="財務專員">財務專員</option>
            <option value="會計師">會計師</option>
            <option value="業務代表">業務代表</option>
            <option value="行銷專員">行銷專員</option>
            <option value="客服專員">客服專員</option>
            <option value="營運專員">營運專員</option>
            <option value="訓練專員">訓練專員</option>
            <option value="品管專員">品管專員</option>
            <option value="採購專員">採購專員</option>
            <option value="主管">主管</option>
            <option value="經理">經理</option>
            <option value="總監">總監</option>
            <option value="其他">其他</option>
          </select>
          <input type="text" id="userTitleCustom" class="form-input" placeholder="請輸入您的職位..." style="display: none;">
        </div>
      </div>
      
      <div class="form-group">
        <label for="gasLevel">我對 Google Apps Script 熟悉的程度是</label>
        <div class="input-group">
          <select id="gasLevelSelect" class="form-select">
            <option value="">請選擇...</option>
            <option value="完全初學者">完全初學者 - 從未使用過</option>
            <option value="初學者">初學者 - 看過一些教學，但沒有實際操作</option>
            <option value="有基礎">有基礎 - 寫過簡單的腳本，了解基本概念</option>
            <option value="中級">中級 - 可以獨立完成中等複雜度的專案</option>
            <option value="高級">高級 - 可以處理複雜的整合和優化</option>
            <option value="專家">專家 - 可以指導他人並解決各種問題</option>
            <option value="自訂">自訂</option>
          </select>
          <input type="text" id="gasLevelCustom" class="form-input" placeholder="請描述您的熟悉程度..." style="display: none;">
        </div>
      </div>
      
      <div class="form-actions">
        <button id="saveCustomInfo" class="btn-primary">儲存設定</button>
        <button id="skipCustomInfo" class="btn-secondary">跳過</button>
      </div>
    </div>
  </div>
</div>
```

### 2. CSS 樣式設計

為了保持與現有設計的一致性，我們添加了中古世紀風格的表單樣式：

```css
/* 客製化資訊表單樣式 */
.custom-info-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #8b4513;
  font-size: 16px;
  font-family: 'Times New Roman', serif;
}

.input-group {
  position: relative;
}

.form-select, .form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #8b4513;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Times New Roman', serif;
  background: #faf8f3;
  color: #8b4513;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-select:focus, .form-input:focus {
  outline: none;
  border-color: #a0522d;
  box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.3);
  background: #fffef7;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: 2px solid;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Times New Roman', serif;
  min-width: 100px;
}

.btn-primary {
  background: #8b4513;
  color: #faf8f3;
  border-color: #654321;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: #a0522d;
  border-color: #8b4513;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
```

### 3. JavaScript 邏輯實作

#### 狀態管理
```javascript
const state = {
  // ... 其他狀態
  userInfo: { // 使用者客製化資訊
    role: "",
    title: "",
    gasLevel: ""
  }
};
```

#### 表單初始化
```javascript
// 初始化客製化資訊表單
function initCustomInfoForm() {
  // 檢查是否已經有儲存的客製化資訊
  const savedUserInfo = localStorage.getItem('gaso_userInfo');
  if (savedUserInfo) {
    state.userInfo = JSON.parse(savedUserInfo);
    return; // 如果已有資訊，不顯示表單
  }
  
  // 顯示客製化資訊表單
  showCustomInfoForm();
}
```

#### 動態表單處理
```javascript
// 綁定客製化資訊表單事件
function bindCustomInfoEvents() {
  const userRoleSelect = document.getElementById('userRoleSelect');
  const userRoleCustom = document.getElementById('userRoleCustom');
  // ... 其他元素
  
  // 職責選擇事件
  userRoleSelect.addEventListener('change', function() {
    if (this.value === '其他') {
      userRoleCustom.style.display = 'block';
      userRoleCustom.focus();
    } else {
      userRoleCustom.style.display = 'none';
      userRoleCustom.value = '';
    }
  });
  
  // 儲存按鈕事件
  saveBtn.addEventListener('click', function() {
    saveCustomInfo();
  });
}
```

#### 資料儲存與驗證
```javascript
// 儲存客製化資訊
function saveCustomInfo() {
  const userRoleSelect = document.getElementById('userRoleSelect');
  const userRoleCustom = document.getElementById('userRoleCustom');
  // ... 其他元素
  
  // 取得使用者輸入的資訊
  const role = userRoleSelect.value === '其他' ? userRoleCustom.value.trim() : userRoleSelect.value;
  const title = userTitleSelect.value === '其他' ? userTitleCustom.value.trim() : userTitleSelect.value;
  const gasLevel = gasLevelSelect.value === '自訂' ? gasLevelCustom.value.trim() : gasLevelSelect.value;
  
  // 驗證必填欄位
  if (!role || !title || !gasLevel) {
    alert('請填寫所有欄位');
    return;
  }
  
  // 儲存到 state 和 localStorage
  state.userInfo = {
    role: role,
    title: title,
    gasLevel: gasLevel
  };
  
  localStorage.setItem('gaso_userInfo', JSON.stringify(state.userInfo));
  
  // 更新個人資訊顯示
  updateUserInfoDisplay();
  
  // 關閉表單
  closeCustomInfoForm();
}
```

### 4. 個人化 Prompt 整合

#### 生成客製化前綴
```javascript
// 生成客製化的 prompt 前綴
function generateCustomPromptPrefix() {
  if (!state.userInfo.role || !state.userInfo.title || !state.userInfo.gasLevel) {
    return '';
  }
  
  return `我是負責${state.userInfo.role}的${state.userInfo.title}，我對 Google Apps Script 熟悉的程度是${state.userInfo.gasLevel}。\n\n`;
}
```

#### 整合到節點資訊顯示
```javascript
// 自定義彈出視窗
function showCustomModal(nodeDetail) {
  // 生成客製化的 prompt
  const customPrefix = generateCustomPromptPrefix();
  const fullPrompt = customPrefix + nodeDetail.prompt;
  
  title.textContent = `${nodeDetail.label}`;
  content.innerHTML = `
    <div class="node-info">
      <!-- ... 其他資訊 -->
      <div class="info-row">
        <span class="info-label">提示:</span>
        <div class="info-prompt">
          ${fullPrompt}
          <button class="copy-button" onclick="copyPromptToClipboard('${fullPrompt.replace(/'/g, "\\'")}')">複製</button>
        </div>
      </div>
      ${state.userInfo.role && state.userInfo.title && state.userInfo.gasLevel ? `
      <div class="info-row">
        <span class="info-label">個人化:</span>
        <span class="info-value">已套用您的個人資訊</span>
      </div>
      ` : ''}
    </div>
  `;
  
  modal.style.display = 'block';
}
```

### 5. 側邊面板管理功能

我們在側邊面板中添加了個人化設定組：

```html
<!-- 個人化設定組 -->
<div class="control-group">
  <div class="control-group-title">個人化設定</div>
  <div class="control-item">
    <button id="editCustomInfo">編輯個人資訊</button>
  </div>
  <div class="control-item">
    <button id="clearCustomInfo" class="danger">清除個人資訊</button>
  </div>
  <div class="control-item">
    <small style="color: #666;" id="currentUserInfo">未設定個人資訊</small>
  </div>
</div>
```

## 🎨 使用者體驗優化

### 智能表單設計
- **預設選項**：提供常見的職責和職位選項
- **自訂輸入**：選擇「其他」時自動顯示文字輸入框
- **表單驗證**：確保所有必填欄位都已填寫
- **視覺回饋**：按鈕 hover 效果和焦點狀態

### 資料持久化
- **自動載入**：下次訪問時自動載入已儲存的個人資訊
- **即時更新**：修改後立即更新顯示
- **一鍵清除**：可清除所有個人資訊重新設定

### 個人化整合
- **自動前綴**：節點 prompt 自動包含個人資訊
- **視覺指示**：顯示是否已套用個人資訊
- **無縫體驗**：不影響現有功能的使用

## 🐛 問題修復

在開發過程中，我們也修復了彈出視窗關閉按鈕失效的問題：

### 問題原因
原本使用 `document.querySelector('.close')` 只會選擇第一個 `.close` 元素，造成多個彈出視窗的事件綁定衝突。

### 修復方案
```javascript
// 修復前
document.querySelector('.close').onclick = function() {
  document.getElementById('nodeModal').style.display = 'none';
}

// 修復後
document.addEventListener('DOMContentLoaded', function() {
  const nodeModalClose = document.querySelector('#nodeModal .close');
  if (nodeModalClose) {
    nodeModalClose.onclick = function() {
      document.getElementById('nodeModal').style.display = 'none';
    }
  }
});
```

## 🚀 功能特色

### 1. 廣泛的角色支援
我們添加了多種非技術人員角色：
- 👥 人力資源
- 💰 財務管理
- 📈 銷售業務
- 📢 行銷推廣
- 🎧 客戶服務
- ⚙️ 營運管理
- 🎓 教育訓練
- ✅ 品質管控
- 🛒 採購管理

### 2. 靈活的職位選擇
包含各種職位層級：
- 專員級：人資專員、財務專員、行銷專員等
- 管理級：主管、經理、總監
- 專業級：會計師、開發人員等

### 3. 細緻的技能等級
從完全初學者到專家的6個等級，讓每個人都能找到適合的定位。

## 📊 使用場景範例

### HR 專員
```
我是負責人力資源的人資專員，我對 Google Apps Script 熟悉的程度是初學者。
```

### 財務專員
```
我是負責財務管理的財務專員，我對 Google Apps Script 熟悉的程度是有基礎。
```

### 行銷專員
```
我是負責行銷推廣的行銷專員，我對 Google Apps Script 熟悉的程度是完全初學者。
```

## 🎯 技術亮點

### 1. 響應式設計
表單在不同裝置上都能正常顯示和使用。

### 2. 資料驗證
確保使用者填寫完整的個人資訊。

### 3. 事件處理
智能的表單切換和事件綁定。

### 4. 狀態管理
使用 localStorage 實現資料持久化。

### 5. UI/UX 一致性
與現有的中古世紀風格完美融合。

## 🔮 未來展望

這個客製化資訊功能為 GASO 帶來了更多可能性：

1. **個人化學習路徑**：根據角色和技能水平推薦學習順序
2. **智能內容過濾**：只顯示相關的節點和內容
3. **學習進度追蹤**：記錄不同角色的學習進度
4. **社群功能**：讓相同角色的人可以交流學習心得

## 💡 學習心得

今天的開發讓我深刻體會到：

1. **使用者體驗的重要性**：一個好的功能不僅要技術上可行，更要考慮使用者的實際需求
2. **細節決定成敗**：表單的每個細節都會影響使用者的體驗
3. **向後兼容性**：新功能不能影響現有功能的使用
4. **資料持久化**：讓使用者的設定能夠保存，提升使用體驗

## 🎉 總結

今天的開發成功為 GASO 添加了完整的客製化資訊輸入功能，讓這個學習地圖能夠服務更廣泛的使用者群體。無論是技術人員還是非技術人員，都能根據自己的角色和技能水平獲得個人化的學習建議。

這個功能不僅提升了 GASO 的實用性，也為未來的功能擴展奠定了良好的基礎。明天我們將繼續探索更多有趣的功能，讓 GASO 變得更加強大和實用！

---

**今日成就：**
- ✅ 完成客製化資訊輸入表單設計
- ✅ 實作個人化 prompt 整合功能
- ✅ 添加側邊面板管理功能
- ✅ 修復彈出視窗關閉按鈕問題
- ✅ 支援多種角色和職位選項
- ✅ 實現資料持久化儲存

**明日預告：**
明天我們將探索更多進階功能，讓 GASO 變得更加智能和實用！

---

如果想要看一些我鐵人賽之外的 Google Apps Script 分享，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)

