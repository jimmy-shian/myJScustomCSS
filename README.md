# myJScustomCSS

這個專案提供一個 **自訂 CSS 與 JS**，可以套用到 [狂人小說](https://czbooks.net/)，改善排版、字體大小、背景顏色，以及自動翻頁等功能。

你可以快速透過書籤 (bookmarklet) 或手動載入來使用。
---

## 📌 功能

* 調整字體大小、行距
* 改變背景顏色（深色模式）
* 按空白鍵自動捲動頁面
* 自動切換到下一章節，帶 4 秒確認提示

---

## ⚡ 快速使用方法

### 方法 1：透過書籤快速套用

1. 複製下面程式碼 在瀏覽器 [新增書籤，貼上 程式碼]
```javascript
javascript:(function(){
  // 如果還沒加載 CSS
  if(!document.getElementById("myCustomStyle")){
    var css = document.createElement("link");
    css.id = "myCustomStyle";
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.css";
    document.head.appendChild(css);
  }

  // 如果還沒加載 JS
  if(!document.getElementById("myCustomScript")){
    var script = document.createElement("script");
    script.id = "myCustomScript";
    script.src = "https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.js";
    document.body.appendChild(script);
  }
})();
```
1.1. 如果失敗，改用 一行版本
```javascript
javascript:(function(){var css=document.createElement("link");css.id="myCustomStyle";css.rel="stylesheet";css.href="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.css";document.head.appendChild(css);var script=document.createElement("script");script.id="myCustomScript";script.src="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS@main/custom.js";document.body.appendChild(script);})();
```

2. 先 開啟你想套用的網站。
3. 然後 點擊剛剛那個自訂的書籤，即可立即套用此資料庫的 CSS 與 JS。

---

### 方法 2：手動載入

如果你想在開發者工具或臨時頁面直接載入：

```javascript
// 載入 CSS
var css=document.createElement("link");
css.rel="stylesheet";
css.href="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.css";
document.head.appendChild(css);

// 載入 JS
var script=document.createElement("script");
script.src="https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.js";
document.body.appendChild(script);
```

---

## 🖌️ 自訂樣式說明

* CSS 位於：
  `https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.css`
* JS 位於：
  `https://cdn.jsdelivr.net/gh/jimmy-shian/myJScustomCSS/custom.js`

你可以直接使用這兩個檔案，或 fork 後自行修改調整。

---

## ⚙️ JS 功能細節

1. **空白鍵自動捲動**

   * 按空白鍵開始/停止自動捲動
   * 捲到底時會彈出 4 秒確認跳轉下一章的 modal
2. **Modal 提示**

   * 4 秒後自動跳轉，或按取消可以停止
3. **字體與背景控制**

   * 可依照 `custom.css` 內的 class 修改字體大小與背景顏色

---

## 📝 注意事項

* 這個套件僅改變前端顯示，不會修改網站原始內容
* 部分網站可能有 CSP 或安全策略，導致書籤無法套用
* 使用時請確保網頁已完全載入
