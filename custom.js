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
