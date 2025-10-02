# Day 14: 敏感資訊的安全管理 - 在 Google Apps Script 中妥善存放 API Key 與密碼

一個常見的常識問答：
「密碼或是 API Key 或是 Secret 可以直接寫在程式碼裡嗎？」

幾乎所有的人都能正確回答說「當然不行！」

好的，那如果不寫在程式碼裡，那要寫在哪裡呢？
這個問題就考驗了你對這個系統的了解程度了。

我們今天就來聊聊，在 Google Apps Script 中要怎麼樣妥善存放這些敏感資訊。



## 敏感資訊這麼多種，密碼、token、secret、credential、API key，這些東西有什麼不一樣？

這幾個詞常常混在一起用，但其實各自有不同的角色或語境。

### 🔑 常見敏感資訊的差別

#### 1. Password（密碼）

- **給人用的**：主要是使用者（人）登入帳號時使用的認證憑證。
- **用途**：通常搭配帳號（username/email）使用。
- **例子**：你登入 Google 帳號的密碼。
- **👉 比喻**：像門鎖的鑰匙，只有你（人）知道。

#### 2. Token（存取憑證 / 訪問憑證）

- **給程式用的**：通常由伺服器簽發，用來代表「某個使用者或程式已經被認證過」。
- **用途**：常用於 API 認證，通常有有效期限（例如幾分鐘或幾小時）。
- **例子**：OAuth2 的 access_token。
- **👉 比喻**：像一次性的票根，告訴檢票員「這個人已經買票，可以進去」。

#### 3. Secret（密鑰 / 秘鑰）

- **廣義的「秘密值」**：可以是加密金鑰、API 驗證所需的秘密字串。
- **用途**：通常搭配 public key 使用，或用於 HMAC 驗證。
- **例子**：client_secret。
- **👉 比喻**：像銀行保險箱的「密碼」，需要和「櫃號」一起用。

#### 4. Credential（憑證 / 認證資訊）

- **比較泛的概念**：包含任何能識別與驗證使用者/應用的資訊，可能包含帳號+密碼、API key、token。
- **用途**：泛指「登入系統」所需的身份資料。
- **例子**：Google Cloud 的 JSON 憑證檔案，裡面包含 client_id、client_secret、private key 等。
- **👉 比喻**：像你帶著的「身分證 + 駕照 + 工作證」一整套組合。

#### 5. API Key（應用程式金鑰）

- **給程式用的**：一個長字串，用來辨識「呼叫 API 的應用程式」。
- **用途**：常用於控制使用配額（rate limit），或追蹤是哪個應用在呼叫。
- **缺點**：很多時候沒有過期時間，安全性相對弱。
- **例子**：Google Maps API key。
- **👉 比喻**：像餐廳給你的「會員卡號」，誰拿到都能用，但店家知道是誰的卡。


## 這些敏感資訊為什麼不能直接寫在程式碼裡？

不建議直接把密碼、token、secret、credential、API key 等敏感資訊寫死在 Google Apps Script 程式碼裡，原因主要有以下幾點：

### ⚠️ 風險

#### 安全性問題
- 如果你把程式碼分享出去（或公開為 Web App / library），這些金鑰就等於暴露了。
- Apps Script 是雲端環境，任何有編輯權限的人都能看到完整程式碼。

#### 難以管理
- 一旦要更換 API key 或密碼，你需要修改程式碼並重新部署。
- 不利於版本控管與多人協作。

### ✅ 建議做法

Google Apps Script 提供幾種更安全的方式來管理敏感資訊：

#### 1. Properties Service

可以把 key/secret 存在 Script Properties 或 User Properties，程式裡用 `PropertiesService.getScriptProperties()` 來讀取。

**優點**：程式碼裡不會出現敏感字串，可以集中管理。

```javascript
// 設定（只需要執行一次）
function setApiKey() {
  PropertiesService.getScriptProperties().setProperty("API_KEY", "your_api_key_here");
}

// 取用
function callApi() {
  const apiKey = PropertiesService.getScriptProperties().getProperty("API_KEY");
  const response = UrlFetchApp.fetch("https://example.com/api", {
    headers: { "Authorization": "Bearer " + apiKey }
  });
  Logger.log(response.getContentText());
}
```

#### 2. Google Cloud Secret Manager

如果你的專案比較大、需要多人協作，可以把 secrets 放在 Secret Manager，然後 Apps Script 透過服務帳號存取。

適合企業級需求，管理權限更精細。

#### 3. Environment-like Configuration

若是小專案，也可以把敏感資訊放在一個獨立檔案（例如 properties.json），存放於 Google Drive（但要小心檔案分享權限）。

### 🚫 千萬不要做的事

- 直接在程式碼裡寫：
  ```javascript
  const API_KEY = "hardcoded_api_key";  // ❌ 不要這樣
  ```
- 把帶有金鑰的程式碼分享給別人。
- 把程式碼 push 到公開的 GitHub repo。

## 總結

今天我們深入探討了在 Google Apps Script 中管理敏感資訊的最佳實踐：

1. **了解不同類型的敏感資訊**：從密碼、token、secret 到 API key，每種都有其特定的用途和安全性考量。

2. **避免硬編碼**：絕對不要將敏感資訊直接寫在程式碼中，這會帶來嚴重的安全風險。

3. **使用 Properties Service**：這是 Google Apps Script 內建的安全儲存方案，適合大多數使用情境。

4. **企業級方案**：對於大型專案，可以考慮使用 Google Cloud Secret Manager 來集中管理。

記住，安全不是一次性的工作，而是持續的過程。定期檢查和更新你的敏感資訊，確保你的應用程式始終保持最佳的安全狀態。

Google Apps Script 資安小教室，我們明天見！

---

如果想要看一些我鐵人賽之外的 Google Apps Script 分享，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
