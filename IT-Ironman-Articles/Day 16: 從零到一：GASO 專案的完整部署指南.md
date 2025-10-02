# Day 16: 從零到一：GASO 專案的完整部署指南

經過前面 15 天的學習，我們已經完成了 GASO (Google Apps Script Odyssey) 專案的核心功能開發。今天，我們要來學習如何將這個專案完整地部署到 Google Apps Script 平台上，讓它真正成為一個可以分享給其他人使用的學習地圖工具。

## 部署前的準備工作

在開始部署之前，我們需要確保專案已經準備就緒：

### 1. 檢查專案結構
確保你的專案包含以下檔案：
- `code.js` - 主要的 Apps Script 程式碼
- `index.html` - 前端介面
- `appsscript.json` - 專案設定檔
- `image/` 資料夾 - 背景圖片等資源

### 2. 準備 Google Sheets 資料
在部署之前，你需要準備好包含學習地圖資料的 Google Sheets：
- **Node 工作表**：包含節點資訊（ID、標籤、屬性、狀態、Prompt）
- **Edge 工作表**：包含節點之間的連線關係

## 步驟一：建立 Google Apps Script 專案

### 1. 前往 Google Apps Script 平台
1. 打開瀏覽器，前往 [script.google.com](https://script.google.com)
2. 點擊「新增專案」
3. 為專案命名，例如「GASO - Google Apps Script Odyssey」

### 2. 上傳專案檔案
1. 在左側檔案清單中，點擊「檔案」→「新增」→「檔案」
2. 建立以下檔案：
   - `code.js` - 貼上你的主要程式碼
   - `index.html` - 貼上你的 HTML 介面
   - `appsscript.json` - 貼上你的專案設定

### 3. 設定 appsscript.json
確保你的 `appsscript.json` 包含正確的設定：

```json
{
  "timeZone": "Asia/Taipei",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```

## 步驟二：設定 Google Sheets 資料來源

### 1. 建立 Google Sheets
1. 前往 [sheets.google.com](https://sheets.google.com)
2. 建立新的試算表
3. 建立兩個工作表：
   - **Node** - 節點資料
   - **Edge** - 連線資料

### 2. 設定 Node 工作表
在 Node 工作表中，建立以下欄位：
- A 欄：Node Id（節點 ID）
- B 欄：Label（節點標籤）
- C 欄：Attribute（節點屬性）
- D 欄：Status（狀態：ToDo/InProgress/Done）
- E 欄：Prompt（學習提示）

### 3. 設定 Edge 工作表
在 Edge 工作表中，建立以下欄位：
- A 欄：Source（來源節點 ID）
- B 欄：Target（目標節點 ID）

### 4. 填入範例資料
```javascript
// Node 工作表範例資料
Node Id | Label | Attribute | Status | Prompt
--------|-------|-----------|--------|-------
1 | 基礎語法 | 入門 | ToDo | 學習 Google Apps Script 的基本語法和結構
2 | 函式與變數 | 入門 | ToDo | 了解如何定義函式和宣告變數
3 | 試算表操作 | 進階 | InProgress | 學習如何讀取和寫入 Google Sheets

// Edge 工作表範例資料
Source | Target
-------|-------
1 | 2
2 | 3
```

## 步驟三：設定 Script Properties

### 1. 設定試算表 ID
1. 在 Apps Script 編輯器中，點擊「專案設定」（齒輪圖示）
2. 在「Script Properties」區段，點擊「新增指令碼屬性」
3. 新增以下屬性：
   - **名稱**：`SPREADSHEET_ID`
   - **值**：你的 Google Sheets 的 ID（從 URL 中取得）

### 2. 設定背景圖片（可選）
如果需要自訂背景圖片：
1. 新增 Script Property：
   - **名稱**：`BACKGROUND_IMAGE_URL`
   - **值**：背景圖片的公開 URL

## 步驟四：部署為 Web 應用程式

### 1. 建立部署
1. 在 Apps Script 編輯器中，點擊右上角的「部署」
2. 選擇「新增部署作業」
3. 在「選取類型」旁點擊齒輪圖示，選擇「Web 應用程式」

### 2. 設定部署選項
- **說明**：輸入部署說明，例如「GASO v1.0 - 學習地圖工具」
- **執行身分**：選擇「我」
- **存取權限**：選擇「任何人」

### 3. 完成部署
1. 點擊「部署」
2. 首次部署時，系統會要求你授權權限
3. 點擊「檢閱權限」→「選擇帳戶」→「進階」→「前往 GASO（不安全）」
4. 點擊「允許」完成授權

### 4. 取得部署 URL
部署完成後，你會得到一個 Web 應用程式的 URL，例如：
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 步驟五：測試部署結果

### 1. 開啟部署的 URL
1. 複製部署 URL 到瀏覽器中開啟
2. 檢查頁面是否正常載入
3. 測試各個功能：
   - 節點點擊
   - 路徑高亮
   - 搜尋功能
   - 控制面板

### 2. 檢查控制台錯誤
1. 按 F12 開啟開發者工具
2. 查看 Console 是否有錯誤訊息
3. 檢查 Network 標籤，確認資料載入正常

## 步驟六：設定觸發器（可選）

如果你希望系統能夠自動更新或執行某些任務，可以設定觸發器：

### 1. 建立觸發器
1. 在 Apps Script 編輯器中，點擊左側的「觸發器」
2. 點擊「新增觸發器」
3. 設定觸發器選項：
   - **要執行的函式**：選擇要執行的函式
   - **事件來源**：選擇觸發來源
   - **事件類型**：選擇觸發類型

### 2. 常見觸發器用途
- **時間驅動**：定期更新資料
- **表單提交**：當使用者提交表單時觸發
- **開啟時**：當試算表開啟時觸發

## 步驟七：分享與協作

### 1. 分享專案
1. 在 Apps Script 編輯器中，點擊右上角的「共用」
2. 新增協作者的 Google 帳號
3. 設定權限（檢視者/編輯者）

### 2. 分享試算表
1. 開啟你的 Google Sheets
2. 點擊右上角的「共用」
3. 設定適當的存取權限

### 3. 建立使用說明
建議建立一個簡單的使用說明文件，包含：
- 專案介紹
- 功能說明
- 使用步驟
- 常見問題

## 常見問題與解決方案

### 1. 權限錯誤
**問題**：出現「您沒有權限執行此操作」錯誤
**解決方案**：
- 檢查 Script Properties 中的 SPREADSHEET_ID 是否正確
- 確認試算表的分享權限
- 重新授權 Apps Script 權限

### 2. 資料載入失敗
**問題**：頁面顯示「載入資料時發生錯誤」
**解決方案**：
- 檢查 Google Sheets 的工作表名稱是否為「Node」和「Edge」
- 確認資料格式是否正確
- 檢查網路連線

### 3. 背景圖片不顯示
**問題**：背景圖片無法載入
**解決方案**：
- 確認圖片 URL 是公開可存取的
- 檢查 URL 格式是否正確
- 嘗試使用不同的圖片託管服務

### 4. 部署後無法存取
**問題**：部署的 URL 無法開啟
**解決方案**：
- 檢查部署設定中的「存取權限」
- 確認「執行身分」設定正確
- 重新部署專案

## 最佳實踐建議

### 1. 版本控制
- 在部署前先儲存專案版本
- 使用有意義的部署說明
- 保留舊版本以備回滾

### 2. 安全性考量
- 定期檢查 Script Properties 中的敏感資訊
- 限制試算表的存取權限
- 避免在程式碼中硬編碼敏感資料

### 3. 效能優化
- 使用快取機制減少 API 呼叫
- 優化資料查詢邏輯
- 監控執行時間和配額使用

### 4. 使用者體驗
- 提供清楚的錯誤訊息
- 加入載入動畫
- 確保響應式設計

## 結語：從開發到部署的完整旅程

部署一個 Google Apps Script 專案，就像是在完成一個完整的軟體開發週期。從最初的程式碼撰寫，到最終的部署上線，每一步都需要仔細規劃和執行。

GASO 專案的部署過程，不僅讓我們學會了如何將 Apps Script 專案部署為 Web 應用程式，更重要的是，我們理解了整個開發流程的完整性。

在未來的開發中，記住這些部署的最佳實踐：
- **準備充分**：確保所有檔案和設定都正確
- **測試完整**：在部署前充分測試所有功能
- **監控持續**：部署後持續監控系統狀態
- **迭代改進**：根據使用者回饋持續優化

明天，我們將繼續探索 Google Apps Script 的其他進階主題，讓我們的學習地圖更加豐富完整！

---

如果想要看一些我鐵人賽之外的 Google Apps Script 分享，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)


