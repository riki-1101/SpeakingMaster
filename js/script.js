// ハンバーガーメニュー
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");
    hamburger.addEventListener("click", function () {
        this.classList.toggle("active");    // ハンバーガーアイコンの変化
        nav.classList.toggle("open");       // ナビゲーションメニューの開閉
    });
});

document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
        e.preventDefault();  // 右クリック/長押しメニューを無効化
    }
});


// 共通の音声再生関数
function speakEnglish(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}