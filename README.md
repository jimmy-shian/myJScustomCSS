# myJScustomCSS

這個專案提供一個 **自訂 CSS 與 JS**，可以套用到 [狂人小說](https://czbooks.net/)，改善排版、字體大小、背景顏色，加入「閱讀設定」下拉選單動畫，以及自動捲動、自動翻頁等功能。

你可以快速透過書籤 (bookmarklet) 或手動載入來使用。

---

## 📌 功能

* 調整閱讀版面：隱藏側邊廣告、內文區置中、最佳閱讀寬度
* 調整字體大小與行距（`body.use-custom-font` 時套用自訂字體）
* 空白鍵自動捲動頁面，`↑` 加快／`↓` 減慢，即時 Toast 提示目前速度
* 捲到章節底部時彈出 4 秒確認視窗，倒數結束自動跳下一章（可取消）
* 在「閱讀設定」面板自動注入「取消自訂字體／恢復自訂字體」切換按鈕，選擇會被記住
* 「閱讀設定」下拉選單開合動畫：內容區展開／收合、右側箭頭旋轉，點擊選單外自動收合
* 右上角 Toast 通知，提示載入與操作狀態

---

## ⚡ 快速使用方法

### 方法 1：透過書籤快速套用

1. 複製下面程式碼 在瀏覽器 [新增書籤，貼上 程式碼]
```javascript
javascript:(function(){
  // 先取得最新的 commit hash，避免 jsdelivr 快取
  fetch("https://api.github.com/repos/jimmy-shian/myJScustomCSS/commits/main")
    .then(res => res.json())
    .then(data => {
      var hash = data.sha || "main"; // 萬一 API 失敗則退回使用 main

      // 如果還沒加載 CSS
      if(!document.getElementById("myCustomStyle")){
        var css = document.createElement("link");
        css.id = "myCustomStyle";
        css.rel = "stylesheet";
        css.href = "https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@" + hash + "/custom.css";
        document.head.appendChild(css);
      }

      // 載入 JS (內部會阻擋重複執行)
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@" + hash + "/custom.js";
      document.body.appendChild(script);
    })
    .catch(err => console.error("無法取得最新 commit hash:", err));
})();
```
1.1. 如果失敗，改用 一行版本
```javascript
javascript:(function(){fetch("https://api.github.com/repos/jimmy-shian/myJScustomCSS/commits/main").then(r=>r.json()).then(d=>{var h=d.sha||"main";if(!document.getElementById("myCustomStyle")){var c=document.createElement("link");c.id="myCustomStyle";c.rel="stylesheet";c.href="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@"+h+"/custom.css";document.head.appendChild(c);}var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@"+h+"/custom.js";document.body.appendChild(s);}).catch(e=>console.error(e));})();
```
---
1.2. 如果抓取最新失敗，改用抓穩定的舊版 一行版本
```javascript
javascript:(()=>{const c='https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.css',j='https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.js';if(!document.querySelector('link[href="'+c+'"]')){const l=document.createElement('link');l.rel='stylesheet';l.href=c;document.head.appendChild(l)}if(!document.querySelector('script[src="'+j+'"]')){const s=document.createElement('script');s.src=j;s.onload=()=>console.log('main JS + CSS 載入完成');s.onerror=e=>console.error('JS 載入失敗',e);document.head.appendChild(s)}})();
```

2. 先 開啟你想套用的網站。
3. 然後 點擊剛剛那個自訂的書籤，即可立即套用此資料庫的 CSS 與 JS。

---

### 方法 2：手動載入

如果你想在開發者工具或臨時頁面直接載入：

```javascript
// 先取得最新的 commit hash，避免 jsdelivr 快取
fetch("https://api.github.com/repos/jimmy-shian/myJScustomCSS/commits/main")
  .then(res => res.json())
  .then(data => {
    var hash = data.sha || "main"; // 萬一 API 失敗則退回使用 main

    // 載入 CSS
    var css=document.createElement("link");
    css.rel="stylesheet";
    css.href="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@" + hash + "/custom.css";
    document.head.appendChild(css);

    // 載入 JS
    var script=document.createElement("script");
    script.src="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@" + hash + "/custom.js";
    document.body.appendChild(script);
  })
  .catch(err => console.error("無法取得最新 commit hash:", err));
```

---

## 🖌️ 自訂樣式說明

* CSS 位於：
  `https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.css`
* JS 位於：
  `https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.js`

`custom.css` 主要分區：

| 區塊 | 說明 |
| --- | --- |
| 版面調整 | 隱藏 `.chapter-sidebar`／`.ads` 廣告、`#sticky-parent` 置中、`.chapter-detail` 閱讀寬度 |
| 字體控制 | `body.use-custom-font` 時套用內文 / 章節標題的字體與行距 |
| 下一章視窗 | `#auto-next-modal` 遮罩與 `.auto-next-card` 卡片 |
| Toast 通知 | `.toast-notification`（含滑入／淡出動畫） |
| 閱讀設定面板 | `.reader-settings` 深色面板、`summary` 觸發列、`.reader-settings-chevron` 箭頭旋轉、`#toggle-custom-font` 自訂按鈕 |

你可以直接使用這兩個檔案，或 fork 後自行修改調整。

---

## ⚙️ JS 功能細節

1. **空白鍵自動捲動**

   * 按空白鍵開始／停止自動捲動（游標在輸入框時不會觸發）
   * `↑` 加快（延遲 −5ms）、`↓` 減慢（延遲 +5ms），速度即時顯示在 Toast
   * 捲到底時自動停止並彈出下一章確認視窗
2. **下一章確認視窗（Modal）**

   * 顯示 4 秒倒數，時間到自動點擊「下一章」
   * 按「取消」、點視窗外區域或按 `ESC` 可以取消跳轉
3. **「閱讀設定」下拉選單動畫**

   * 點擊標題列展開（280ms）／收合（240ms），`cubic-bezier(0.25, 1, 0.5, 1)` 緩動
   * 右側箭頭隨展開狀態旋轉 180°
   * 點擊選單外部區域會自動收合
   * **防死鎖保底**：動畫若因瀏覽器節流（背景／被遮住視窗、省電模式）或被取消而沒有正常結束，會在保底時間內強制收尾，不會發生「收不起來」
   * 若網站或擴充套件重新渲染選單區塊，會自動偵測並重新綁定事件
4. **字體大小切換**

   * 在「閱讀設定」面板自動注入「取消自訂字體／恢復自訂字體」按鈕
   * 選擇存於 `localStorage`（`use_custom_font_size`），下次開啟自動套用

---

## 🔧 最近更新

* 2026-11-06
  * 因應新版介面調整注入/下拉選單

---

## 📝 注意事項

* 這個套件僅改變前端顯示，不會修改網站原始內容
* 部分網站可能有 CSP 或安全策略，導致書籤無法套用
* 使用時請確保網頁已完全載入
* 若遇更新未生效：jsdelivr 對 `@main` 有快取，建議使用方法 1（自動抓最新 hash）的書籤
