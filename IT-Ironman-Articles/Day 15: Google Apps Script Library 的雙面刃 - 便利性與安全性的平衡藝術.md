# Day 15: Google Apps Script Library 的雙面刃 - 便利性與安全性的平衡藝術

在 Google Apps Script 的世界裡，Library 就像是一把瑞士刀 - 功能強大、使用方便，但如果不小心使用，也可能傷到自己。

今天我們要來深入探討 Google Apps Script Library 這個既令人愛不釋手，又讓人不得不謹慎對待的功能。

## 什麼是 Google Apps Script Library？

簡單來說，Library 就像是一個「共用的程式碼工具箱」。

您可以將一些常用、寫好的函式 (function) 封裝在一個獨立的 Apps Script 專案裡，然後將這個專案發布成一個 Library。之後，任何其他的 Apps Script 專案都可以「引用」這個 Library，直接使用裡面寫好的函式，而不需要重複複製貼上相同的程式碼。

這就像是在 Python 裡 `import requests`，或在 JavaScript 裡 `import lodash` 一樣的概念。

## 為什麼要使用 Library？

使用 Library 有幾個非常顯著的優點：

### 1. 程式碼重複使用 (DRY - Don't Repeat Yourself)
如果您有很多個試算表都需要一個「發送客製化 Email」的功能，您不需要在每個試算表的指令碼中都寫一次同樣的程式碼。只要寫一次在 Library 中，然後讓所有專案都去呼叫它即可。

### 2. 方便維護與更新
當您需要修改這個共用功能時（例如：Email 格式要調整），您只需要更新 Library 的程式碼。所有引用這個 Library 的專案在更新版本後，就能立刻享受到新的功能，而不用一個個去修改。

### 3. 保持主程式碼乾淨
您可以將一些複雜的、通用的邏輯（例如：處理日期格式、連接外部 API 等）移到 Library 中，讓您的主要專案程式碼更專注於核心業務邏輯，看起來更簡潔、更容易閱讀。

### 4. 分享與協作
您可以輕鬆地將您寫好的工具函式庫分享給同事或開發社群，他們只需要知道您的 Library ID 就可以使用，而不需要看到或修改您的原始碼。

## 如何建立並使用一個 Library？

讓我們用一個簡單的例子來走一遍完整流程：建立一個會傳送問候語的 Library，然後在另一個專案中使用它。

### 步驟一：建立您的 Library 專案

**建立新的 Apps Script 專案**
1. 前往 script.google.com
2. 點擊左上角的 + 新專案
3. 為這個專案命名，例如 MyGreetingLibrary

**撰寫共用函式**
在程式碼編輯器中，刪除預設的 myFunction，然後貼上以下程式碼：

```javascript
/**
 * 產生一句帶有名字的問候語。
 * @param {string} name 要問候的人名。
 * @returns {string} 完整的問候語。
 */
function sayHello(name) {
  return 'Hello, ' + name + '! 歡迎使用我的 Library。';
}

/**
 * 這是一個私有函式，不會被外部看到。
 * 結尾有底線 "_" 是 GAS 的慣例，代表這個函式僅供內部使用。
 */
function internalHelper_() {
  // 這個函式無法被其他專案呼叫
}
```

> **注意**：只有在全域範圍 (global scope) 中定義的函式才能被外部引用。結尾有底線 _ 的函式會被自動隱藏，這是一個很好的習慣，用來區分公用和私有函式。

**儲存並部署為 Library**
1. 點擊 儲存專案 圖示
2. 點擊右上角的 部署 > 新增部署作業
3. 在左邊的 選取類型 旁點擊齒輪圖示，然後選擇 程式庫
4. 為這次部署加上描述，例如 v1 - 初版
5. 點擊 部署
6. **複製 Library 的 Script ID** - 這是一長串的字元，請務必把它複製下來

### 步驟二：在您的主專案中使用這個 Library

**建立或打開另一個專案**
到 script.google.com 建立一個新專案，並命名為 TestMyLibrary。

**加入 Library**
1. 在左側選單中，找到「程式庫」旁邊的 + 按鈕並點擊
2. 在「指令碼 ID」欄位中，貼上您在步驟一複製的那個 Script ID
3. 點擊 查詢

**設定 Library 屬性**
- **ID (識別碼)**：這是您要在程式碼中用來呼叫這個 Library 的「暱稱」。系統會預設一個，您可以改成簡短好記的，例如 Greeting
- **版本**：選擇您想要使用的版本
- **開發模式**：這個模式主要用於測試。開啟後，它會永遠抓取 Library 最新的「已儲存」版本，而不是發布的版本

**呼叫 Library 的函式**
撰寫以下程式碼來呼叫 Library 裡的 sayHello 函式：

```javascript
function testMyNewLibrary() {
  // 使用您設定的「ID」來呼叫 Library
  // 就像呼叫 MailApp.sendEmail() 一樣的語法
  var message = Greeting.sayHello('Peter');

  // Logger.log() 會把訊息顯示在執行紀錄中
  Logger.log(message);
}
```

執行後，您應該會看到以下輸出：
```
Hello, Peter! 歡迎使用我的 Library。
```

## Library 的安全風險：隱藏在便利性背後的陷阱

雖然 Library 提供了極大的便利性，但它也帶來了不容忽視的安全風險。

### 為什麼會有安全風險？

因為 Library 的程式碼通常不是你自己寫的，可能來自：

- 朋友分享的 Script ID
- 網路上部落格/論壇貼的 Script ID  
- GitHub 或其他社群網站提供的範例

**問題在於：你不知道這份 Library 的程式裡面到底做了什麼。**

它可能會：
- 偷偷存取你的 Google Drive、Gmail、Contacts 等敏感資料
- 在背景發送外部請求，把資料傳到駭客的伺服器
- 即使看起來沒問題，若作者後續更新了 Library（因為 Library 是遠端載入的），它可能突然多了惡意功能

這就像是你拿到一個「安裝程式」，但沒檢查來源就直接安裝到電腦裡一樣。

### 具體該怎麼保護自己？

#### 1. 確認來源可靠性
- 只使用來自可信任的作者或官方文件的 Library
- 盡量避免使用來路不明的 Script ID

#### 2. 閱讀程式碼（若有提供原始碼）
- 有些作者會公開 GitHub Repo 或 Script Source，你可以先看程式碼有沒有不合理的權限要求
- 如果程式碼封閉（只給 Script ID，沒提供原始碼），就要更謹慎

#### 3. 注意 OAuth 權限
- 加入 Library 之後，Apps Script 會要求你授權權限
- 如果一個「單純處理字串」的 Library，卻要求 Gmail/Drive/Calendar 權限，就要警覺

#### 4. 最小化使用
- 如果你只需要 Library 的部分功能，考慮自己複製相關程式碼到專案，而不是整個 Library 都引入

#### 5. 組織內共用
- 在公司或團隊內，可以建立「可信任的共用 Library」，統一由內部維護，減少外部依賴

### 實際案例：安全的 vs 不安全的作法

假設你找到一個 Library，說可以幫你快速寄 Email：

**安全的作法：**
- 來源是 Google 官方文件提供的範例
- 權限需求是 Gmail.send，符合用途

**不安全的作法：**
- 來源是一個論壇上陌生人貼的 Script ID
- 權限需求包含 Drive.read、Contacts.read，但跟「寄 Email」完全無關

這時就要小心，因為它可能在背後偷偷讀取你的資料。

## 重要注意事項與最佳實踐

### 版本控制
當您修改了 Library 的程式碼後，必須儲存一個新的版本，然後回到您的主專案，手動將 Library 的版本更新到最新，否則主專案會繼續使用舊版本的程式碼。

### 權限管理
Library 的程式碼是以使用者的身分來執行的。例如，如果您的 Library 有一個寄信功能，那麼執行主專案的使用者必須授權「寄送電子郵件」的權限，而不是 Library 的作者。

### 文件註解
在 Library 的函式上方使用 JSDoc 格式撰寫註解，可以讓使用者在呼叫您的 Library 時獲得非常有用的自動完成提示和說明。

## 結語：在便利與安全之間找到平衡

使用第三方 Library，就像請別人幫你搬家。

如果是認識的專業搬家公司（可信來源），風險低。

如果是陌生人說「我免費幫你搬」，還要求你交出家裡鑰匙（過度權限），那就是高風險行為。

Library 是 Google Apps Script 生態系中不可或缺的一環，它讓我們能夠快速建構功能豐富的應用程式。但同時，我們也必須保持警覺，確保我們使用的 Library 是安全可靠的。

在 GASO 的學習地圖中，Library 的使用與安全防護都是重要的學習節點。只有掌握了正確的使用方式，我們才能真正發揮 Library 的威力，同時保護我們的資料安全。

明天，我們將繼續探索 Google Apps Script 的其他重要主題，讓我們的學習地圖更加完整！

---

如果想要看一些我鐵人賽之外的 Google Apps Script 分享，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)