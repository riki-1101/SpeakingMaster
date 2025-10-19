let frames = [];
let filteredFrames = []; // カテゴリ＋ランダム後の配列
let currentIndex = 0;
let showingEnglish = false;

// JSONを読み込み
const fileName = location.pathname.split("/").pop().replace(".html", "");
fetch(`../json/${fileName}.json`)
    .then(res => res.json())
    .then(data => {
        frames = data;
        applyFilter(); // ← 初期カテゴリでランダム化も実行
        showJapanese();
    })
    .catch(err => console.error("Error loading JSON:", err));

// HTML要素
const englishDiv = document.getElementById("english");
const japaneseDiv = document.getElementById("japanese");
const main = document.querySelector("main");

// check / nextボタンを作成
const button = document.createElement("button");
button.id = "next-btn";
button.textContent = "check";
main.appendChild(button);

button.addEventListener("click", handleButtonClick);

// ラジオボタンでカテゴリ切り替え
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener("change", () => {
        applyFilter();   // ← カテゴリ変更時にランダム化も行う
        showJapanese();
    });
});

function handleButtonClick() {
    if (!filteredFrames.length) return;

    if (!showingEnglish) {
        showEnglish();
        showingEnglish = true;
        button.textContent = "next";
    } else {
        nextCard();
    }
}

// カテゴリフィルタ＋ランダムシャッフル
function applyFilter() {
    const selected = document.querySelector('input[name="category"]:checked').value;

    // カテゴリで絞り込み
    filteredFrames = frames.filter(f => f.category === selected);

    // 配列をシャッフル（Fisher–Yatesアルゴリズム）
    for (let i = filteredFrames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredFrames[i], filteredFrames[j]] = [filteredFrames[j], filteredFrames[i]];
    }

    currentIndex = 0;
    showingEnglish = false;
    button.style.display = "inline-block";

    if (filteredFrames.length === 0) {
        japaneseDiv.textContent = "該当する文がありません。";
        englishDiv.textContent = "";
        button.style.display = "none";
        return;
    }
}

// 日本語を表示
function showJapanese() {
    if (!filteredFrames.length) return;
    const frame = filteredFrames[currentIndex];
    englishDiv.textContent = "";
    japaneseDiv.textContent = frame.ja;
    showingEnglish = false;
    button.textContent = "check";
}

// 英語を表示＋音声再生
function showEnglish() {
    const frame = filteredFrames[currentIndex];
    englishDiv.textContent = frame.en;
    speakEnglish(frame.en);
}

// 次のカードへ
function nextCard() {
    currentIndex++;
    if (currentIndex >= filteredFrames.length) {
        japaneseDiv.textContent = "That's all!";
        englishDiv.textContent = "";
        button.textContent = "Start again";
        showingEnglish = false;

        // ボタンのクリック動作を「最初に戻る」に変更
        button.removeEventListener("click", handleButtonClick);
        button.addEventListener("click", restartSession);

        return;
    }
    showJapanese();
}

// 再スタート処理
function restartSession() {
    applyFilter(); // カテゴリ＋ランダム化
    showJapanese();

    // ボタンを元の動作に戻す
    button.textContent = "check";
    button.removeEventListener("click", restartSession);
    button.addEventListener("click", handleButtonClick);
}

// 音声再生関数
function speakEnglish(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // 再生中をキャンセル
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}