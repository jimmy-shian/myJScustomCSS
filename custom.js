(function () {

    /* =====================================================
       Toast 系統（先定義，避免重複注入時出錯）
    ===================================================== */
    window.showToast = window.showToast || function (message) {

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

        const createToast = () => {
            const toast = document.createElement("div");
            toast.className = "toast-notification";
            toast.innerHTML = `
                <span class="icon">✓</span>
                <span>${message}</span>
            `;
            document.body.appendChild(toast);

            toast.offsetHeight;
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 400);
            }, 3000);
        };

        if (document.body) {
            createToast();
        } else {
            document.addEventListener("DOMContentLoaded", createToast);
        }
    };


    /* =====================================================
       防止重複注入
    ===================================================== */
    if (window.__myCustomJsLoaded) {
        setTimeout(() => window.showToast("自定義腳本已載入"), 1000);
        return;
    }
    window.__myCustomJsLoaded = true;


    /* =====================================================
       自動滾動系統（使用 setInterval）
    ===================================================== */
    let isScrolling = false;
    let scrollInterval = null;
    let scrollDelay = 20; // 預設延遲（越大越慢）

    function startScrolling() {
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1);

            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
                stopScrolling();
                showNextModal();
            }
        }, scrollDelay);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
        scrollInterval = null;
        isScrolling = false;
    }

    function restartScrollingIfActive() {
        if (isScrolling) {
            clearInterval(scrollInterval);
            startScrolling();
        }
    }


    /* =====================================================
       下一章彈窗
    ===================================================== */
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

        setTimeout(() => modal.remove(), 300);

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

        requestAnimationFrame(() => modal.classList.add("show"));

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

        document.getElementById("cancel-next").onclick = removeModal;

        modal.addEventListener("click", (e) => {
            if (e.target.id === "auto-next-modal") removeModal();
        });
    }


    /* =====================================================
       鍵盤控制
    ===================================================== */
    document.addEventListener('keydown', (e) => {

        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // 空白鍵 開關滾動
        if (e.key === ' ') {
            e.preventDefault();

            if (isScrolling) {
                stopScrolling();
            } else {
                isScrolling = true;
                startScrolling();
            }
        }

        // ↑ 加快（延遲 -5ms）
        if (e.key === 'ArrowUp') {
            scrollDelay = Math.max(1, scrollDelay - 5);
            restartScrollingIfActive();
            showToast(`延遲：${scrollDelay} ms`);
        }

        // ↓ 變慢（延遲 +5ms）
        if (e.key === 'ArrowDown') {
            scrollDelay += 5;
            restartScrollingIfActive();
            showToast(`延遲：${scrollDelay} ms`);
        }

        // ESC 關閉彈窗
        if (e.key === 'Escape') {
            removeModal();
        }
    });


    /* =====================================================
       字體大小切換
    ===================================================== */
    function initFontSizeToggle() {

        const STORAGE_KEY = 'use_custom_font_size';
        let useCustomFont = localStorage.getItem(STORAGE_KEY) !== 'false';
        let isButtonInjected = false;

        function updateUI() {
            document.body.classList.toggle('use-custom-font', useCustomFont);

            const toggleBtn = document.getElementById('toggle-custom-font');
            if (toggleBtn) {
                toggleBtn.textContent = useCustomFont ? '[取消自訂]' : '[恢復自訂]';
            }
        }

        updateUI();

        function tryInjectButton() {
            if (isButtonInjected) return true;

            const navs = Array.from(document.querySelectorAll('.customs-function .nav'));

            for (const nav of navs) {
                const firstLi = nav.querySelector('li:first-child');
                if (firstLi && firstLi.textContent.includes('選擇字體大小')) {

                    if (!document.getElementById('toggle-custom-font')) {
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
                        nav.appendChild(li);

                        updateUI();
                        isButtonInjected = true;
                        return true;
                    }
                }
            }
            return false;
        }

        if (!tryInjectButton()) {
            const observer = new MutationObserver((_, obs) => {
                if (tryInjectButton()) obs.disconnect();
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 10000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFontSizeToggle);
    } else {
        initFontSizeToggle();
    }


    /* =====================================================
       啟動提示
    ===================================================== */
    window.showToast("自定義腳本已啟動");

})();