let frames = [];
let filteredFrames = [];
let currentIndex = 0;
let showingJapanese = false;

// JSONを読み込み
const fileName = location.pathname.split("/").pop().replace(".html", "");
fetch(`../json/${fileName}.json`)
    .then(res => res.json())
    .then(data => {
        frames = data;
        applyFilter();
        showEnglish(); // ←最初は英語を表示
    })
    .catch(err => console.error("Error loading JSON:", err));

// HTML要素
const englishDiv = document.getElementById("english");
const japaneseDiv = document.getElementById("japanese");
const exList = document.getElementById("ex-list");
const jaBtn = document.getElementById("ja-btn");
const main = document.querySelector("main");

// nextボタンを作成
const button = document.createElement("button");
button.classList.add("next-btn");
button.textContent = "next";
main.appendChild(button);

button.addEventListener("click", handleButtonClick);
jaBtn.addEventListener("click", showJapanese);

// カテゴリ切り替え
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener("change", () => {
        applyFilter();
        showEnglish();
    });
});

function handleButtonClick() {
    nextCard();
}

// カテゴリフィルタ＋ランダムシャッフル
function applyFilter() {
    const selected = document.querySelector('input[name="category"]:checked').value;
    filteredFrames = frames.filter(f => f.category === selected);

    for (let i = filteredFrames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredFrames[i], filteredFrames[j]] = [filteredFrames[j], filteredFrames[i]];
    }

    currentIndex = 0;
    showingJapanese = false;
    button.style.display = filteredFrames.length ? "inline-block" : "none";

    if (!filteredFrames.length) {
        englishDiv.textContent = "";
        japaneseDiv.textContent = "該当する文がありません。";
        exList.innerHTML = "";
    }
}

// 英語を表示＋音声再生＋例文表示
function showEnglish() {
    if (!filteredFrames.length) return;
    const frame = filteredFrames[currentIndex];
    englishDiv.textContent = frame.en;
    japaneseDiv.textContent = "";
    showingJapanese = false;
    speakEnglish(frame.en);
    showExamples(frame.ex); // ← ここで例文表示
}

// 日本語を表示（jaボタンで）
function showJapanese() {
    if (!filteredFrames.length) return;
    const frame = filteredFrames[currentIndex];
    japaneseDiv.textContent = frame.ja;
    showingJapanese = true;
}

// 例文をex-listに表示
function showExamples(examples) {
    exList.innerHTML = ""; // 一旦クリア

    if (!examples || !examples.length) return;

    examples.forEach(ex => {
        if (!ex.en && !ex.ja) return; // 空の項目はスキップ
        const li = document.createElement("li");

        // 英文を表示
        const enSpan = document.createElement("span");
        enSpan.textContent = ex.en || "";

        li.appendChild(enSpan);
        exList.appendChild(li);
    });
}

// 次のカードへ
function nextCard() {
    currentIndex++;
    if (currentIndex >= filteredFrames.length) {
        englishDiv.textContent = "That's all!";
        japaneseDiv.textContent = "";
        exList.innerHTML = "";
        button.textContent = "Start again";
        button.removeEventListener("click", handleButtonClick);
        button.addEventListener("click", restartSession);
        return;
    }
    showEnglish();
}

// 再スタート処理
function restartSession() {
    applyFilter();
    showEnglish();
    button.textContent = "next";
    button.removeEventListener("click", restartSession);
    button.addEventListener("click", handleButtonClick);
}

// 音声再生
function speakEnglish(text) {
    if (!text) return;
    window.speechSynthesis.cancel();
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}