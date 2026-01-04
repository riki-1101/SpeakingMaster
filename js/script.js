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

    // カッコ内の補足を削除
    text = text.replace(/(\(.*?\)|\[.*?\])/g, "").trim();

    // 指定言語の音声を探す
    const voices = speechSynthesis.getVoices();
    const lang = localStorage.getItem("selectedCountry") || "en-US";
    const voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith("en"));

    // いったん完全に停止
    speechSynthesis.cancel();

    // cancel直後を避ける
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
    }, 100); // 50〜150ms で安定
}
