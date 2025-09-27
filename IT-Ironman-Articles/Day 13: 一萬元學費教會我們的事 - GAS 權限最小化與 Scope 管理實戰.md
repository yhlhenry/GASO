
昨天 Vibe Coding 圈子發生了一件大事，
話題延燒橫跨了工程師界、麻瓜界、行銷界。

如果他沒刪文的話，原始發文在此：
https://www.facebook.com/share/p/17FKcqBW6K/

如果他刪文了，社群上也有非常多的截圖可以參考😆

這個事件以我的視角來簡述的話就是：
有人不懂 Google AI Studio 的用法，
不小心發佈了一個工具給大家用，衍生了台幣一萬元左右的費用。
而他認為這都是 Google 的錯，大罵了一番。

這個事件激起了各方人士從不同角度的思考。
其中有一些做資訊教育的朋友，
有的慶幸自己課程早有納入相關資安內容，
有的則是開始反思自己的課程是不是要多放一些這種非功能面的教學。

把功能快速開發出來固然重要，
但資安課題卻是一個不能忽略的底線。

所以我今天就決定在我的 GASO 地圖上，
新增更多的資安相關知識點。
並且把一些重點寫進鐵人賽文章裡。


---

不過仔細一想，資安領域又廣又深，
真的要寫，
不要說 30 天鐵人賽不夠寫了，
寫 300 天都不一定能完整涵蓋。
我就先從新手比較常發問的幾個關鍵開始。

今天先來聊聊「**權限最小化（Least Privilege）**」原則，
這不僅在 Google Apps Script 是一個重要觀念，
在任何系統都是！


當我們說「**權限最小化（Least Privilege）**」時，你可以把它想成：**只借出必要的那一把鑰匙，不要把全家所有房間的鑰匙都給出去**。\
GAS（Google Apps Script）每做一件事，都需要相對應的「**Scope**（存取權限）」。你的目標是：**只要求程式「一定需要」的那幾個 Scope**，不要圖方便一次要一大包。

---

## 什麼是 Scope？

當你第一次執行或部署腳本時，Google 會跳出授權畫面，列出像：

- `.../spreadsheets.readonly`（只能讀取試算表）
- `.../gmail.send`（代你寄信）
- `.../drive`（完整存取你的雲端硬碟）

這些就是 Scope。**Scope 越大、風險越高**；如果程式或代碼被誤改/被人濫用，資料外洩的範圍就越大。

---

## 為什麼要最小化？

- **降低風險**：萬一腳本被人插入惡意程式碼，權限越少，傷害越有限。
- **減少審查與阻力**：給同事或使用者用時，授權畫面越「克制」，他們越安心。
- **好維護**：之後需求變動，只要調整到「剛好需要」的權限組合即可。

---

## 初學者實作步驟（一步一步來）

### 步驟 1｜先寫下「腳本真的要做什麼」

例：*讀取一個 Google Sheet，整理後寄出一封 Email*。\
→ 需要的權限其實只有：`spreadsheets.readonly` + `gmail.send`。

### 步驟 2｜打開並**手動指定**最小 Scope

1. 在 Apps Script 編輯器右上角點 **齒輪（Project Settings）**。
2. 勾選 **Show "appsscript.json" manifest file in editor**。
3. 在專案左側打開 `appsscript.json`，加入你要的最小範圍：

```json
{
  "timeZone": "Asia/Taipei",
  "exceptionLogging": "STACKDRIVER",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/gmail.send"
  ]
}
```

> 提醒：不手動指定時，GAS 會「自動偵測」你在程式碼裡用到的服務來決定 Scopes，**常常比你實際需要的還多**。手動列出可以更精準。

### 步驟 3｜選「讀取」就別要「寫入」

能用 `*.readonly` 的就用它（如 `spreadsheets.readonly`、`calendar.readonly`）。\
真的要寫入，才改用可寫的（如 `spreadsheets`、`calendar`）。

### 步驟 4｜Drive 範圍要特別保守

- **避免** `https://www.googleapis.com/auth/drive`（完整雲端硬碟存取）。
- 若只要操作「自己建立/使用者透過檔案選擇器挑選」的檔案，**偏好** `https://www.googleapis.com/auth/drive.file`。
- 只讀檔名/中繼資料則用 `drive.metadata.readonly`。

### 步驟 5｜沒有要發網路請求，就別加 `script.external_request`

`UrlFetchApp` 會需要 `https://www.googleapis.com/auth/script.external_request`。\
**不需要就不要列**；需要時，也在程式碼裡限制只打到特定網域。

### 步驟 6｜驗證與重授權

調整好 `oauthScopes` 後：

- 在你的 Google 帳戶 → **安全性** → **第三方存取**，撤銷舊的腳本授權。
- 回到腳本重新執行一次，確認授權畫面只出現你列的那幾項。

---

## 最小範例：讀 Sheet → 寄信

**需求**：讀取指定 Sheet 的資料，寄出 Email 摘要。\
**最小 Scopes**：

```json
"oauthScopes": [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/gmail.send"
]
```

**為什麼不需要 Drive/Gmail 其他大範圍？**

- 你用 `SpreadsheetApp.openById()` 只讀資料 → `spreadsheets.readonly` 就夠。
- 你只要「寄信」→ `gmail.send` 就夠，不必讀收件匣或刪信。



---

有些人為了開發求快，
權限直接整個開下去，
我覺得也不是不行，前提是你完全知道自己在做什麼。
如果你知道當意外發生時，最慘的損害會是什麼，而且你願意承擔這個風險，
那就是個人取捨問題了。

舉例來說，
如果我為了開發一個新專案，
開了一個獨立全新的 Google 帳號，
裡面乾淨的很，沒有個資、沒有敏感資訊，
而且沒有牽動任何付款方式。

如果這個獨立新帳號安全到一個地步是我可以直接把他交給陌生人也不擔心的話，
那我在裡面權限大開、隨便測試，應該也不會怎麼樣……吧？

不過資安領域真的水很深，
我們**往往不知道我們不知道什麼**，
時時保持謙卑的心，
一邊照著業界 Best Practice 做，一邊學習其中背後的道理，
通常是不會錯的。

一個人瞎搞一通可以走得快，
跟著前輩腳步小心前進才能走得遠。


Google Apps Script 資安小教室，我們明天見！



---

如果想要看一些我鐵人賽之外的 Google Apps Script 分享，
也歡迎追蹤我的 [Threads](https://www.threads.com/@henryyang_tw) 和 [Facebook](https://www.facebook.com/henry.yang.3956)
