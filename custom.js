let isScrolling = false;
let scrollInterval = null;
let countdownInterval = null;
let pendingTimeout = null;

function goNextChapter() {
    const nextBtn = document.querySelector('.next-chapter');
    if (nextBtn) nextBtn.click();
}

function removeModal() {
    const modal = document.getElementById("auto-next-modal");
    if (!modal) return;

    modal.classList.remove("show");
    modal.classList.add("hide");

    setTimeout(() => {
        modal.remove();
    }, 300);

    clearTimeout(pendingTimeout);
    clearInterval(countdownInterval);
}

function showNextModal() {

    if (document.getElementById("auto-next-modal")) return;

    const modal = document.createElement("div");
    modal.id = "auto-next-modal";

    modal.innerHTML = `
        <div class="auto-next-card">
            <h3>已到達章節底部</h3>
            <p><span id="countdown">4</span> 秒後自動跳轉下一章</p>
            <button id="cancel-next">取消</button>
        </div>
    `;

    document.body.appendChild(modal);

    // 觸發動畫
    requestAnimationFrame(() => {
        modal.classList.add("show");
    });

    let seconds = 4;
    const countdownEl = document.getElementById("countdown");

    countdownInterval = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
    }, 1000);

    pendingTimeout = setTimeout(() => {
        removeModal();
        goNextChapter();
    }, 4000);

    // 按取消
    document.getElementById("cancel-next").onclick = removeModal;

    // 點背景取消
    modal.addEventListener("click", (e) => {
        if (e.target.id === "auto-next-modal") {
            removeModal();
        }
    });

    // ESC 取消
    document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
            removeModal();
            document.removeEventListener("keydown", escHandler);
        }
    });
}

document.addEventListener('keydown', function (e) {

    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.code === 'Space') {
        e.preventDefault();

        if (isScrolling) {
            clearInterval(scrollInterval);
        } else {
            scrollInterval = setInterval(() => {

                window.scrollBy(0, 0.3);

                if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
                    clearInterval(scrollInterval);
                    isScrolling = false;
                    showNextModal();
                }

            }, 10);
        }

        isScrolling = !isScrolling;
    }
});

// ===== 字體大小切換功能 =====
function initFontSizeToggle() {
    const STORAGE_KEY = 'use_custom_font_size';
    let useCustomFont = localStorage.getItem(STORAGE_KEY) !== 'false'; // 預設開啟

    function updateUI() {
        if (useCustomFont) {
            document.body.classList.add('use-custom-font');
        } else {
            document.body.classList.remove('use-custom-font');
        }

        const toggleBtn = document.getElementById('toggle-custom-font');
        if (toggleBtn) {
            toggleBtn.textContent = useCustomFont ? '[取消自訂]' : '[恢復自訂]';
        }
    }

    // 初始化狀態
    updateUI();

    // 尋找網站的選單位置並插入按鈕
    const navs = document.querySelectorAll('.customs-function .nav');
    if (navs.length >= 3) {
        const fontSizeNav = navs[2]; // 根據用戶提供的 HTML，第三個 .nav 是字體大小
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'javascript:void(0);';
        a.id = 'toggle-custom-font';
        a.onclick = () => {
            useCustomFont = !useCustomFont;
            localStorage.setItem(STORAGE_KEY, useCustomFont);
            updateUI();
            showToast(useCustomFont ? "已恢復自訂字體大小" : "已切換為網站原始字體大小");
        };
        li.appendChild(a);
        fontSizeNav.appendChild(li);
        updateUI(); // 確保按鈕文字正確
    }
}

// 在 DOM 加載完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontSizeToggle);
} else {
    initFontSizeToggle();
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `
        <span class="icon">✓</span>
        <span class="message">${message}</span>
    `;
    document.body.appendChild(toast);

    // Force reflow
    toast.offsetHeight;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// 腳本載入成功提示
showToast("自定義腳本已啟動");
