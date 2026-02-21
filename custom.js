(function () {
    // 避免腳本被重複注入執行，導致變數重複宣告錯誤
    if (window.__myCustomJsLoaded) {
        showToast("自定義腳本已載入");
        return;
    }
    window.__myCustomJsLoaded = true;

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

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === ' ') {
            e.preventDefault();

            if (isScrolling) {
                clearInterval(scrollInterval);
            } else {
                scrollInterval = setInterval(() => {
                    window.scrollBy(0, 0.3);
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
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
        let isButtonInjected = false;

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

        function tryInjectButton() {
            if (isButtonInjected) return true;

            // 尋找包含「選擇字體大小」的 ul.nav
            const navs = Array.from(document.querySelectorAll('.customs-function .nav'));
            let fontSizeNav = null;

            for (const nav of navs) {
                const firstLi = nav.querySelector('li:first-child');
                if (firstLi && firstLi.textContent.includes('選擇字體大小')) {
                    fontSizeNav = nav;
                    break;
                }
            }

            if (fontSizeNav && !document.getElementById('toggle-custom-font')) {
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
                isButtonInjected = true;
                return true;
            }
            return false;
        }

        // 嘗試立即插入
        if (!tryInjectButton()) {
            // 如果找不到，可能選單是動態生成的，使用 MutationObserver 監聽
            const observer = new MutationObserver((mutations, obs) => {
                if (tryInjectButton()) {
                    obs.disconnect(); // 成功插入後停止監聽
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 設置一個超時，避免永遠監聽
            setTimeout(() => {
                observer.disconnect();
            }, 10000);
        }
    }

    // 在 DOM 加載完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFontSizeToggle);
    } else {
        initFontSizeToggle();
    }

    function showToast(message) {
        // 確保 Toast 樣式存在，避免 custom.css 載入較慢導致無樣式
        if (!document.getElementById('custom-toast-style')) {
            const style = document.createElement('style');
            style.id = 'custom-toast-style';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(44, 62, 80, 0.95);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    z-index: 100000;
                    font-size: 16px;
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.4s ease;
                    opacity: 0;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-left: 4px solid #2ecc71;
                    backdrop-filter: blur(5px);
                }
                .toast-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                .toast-notification .icon {
                    font-size: 20px;
                    color: #2ecc71;
                }
            `;
            document.head.appendChild(style);
        }

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

})();
