const card = document.getElementById("card");
const english = document.getElementById("english");
const meaning = document.getElementById("meaning");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const jaBtn = document.getElementById("ja-btn");

let phrases = [];
let filteredPhrases = []; // sentenceごとにフィルタしたもの
let current = null;
let history = [];   // 過去に表示したカードの履歴
let historyIndex = -1;
let showingJa = false; // jaの表示状態


function getRandomPhrase() {
    return filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
}

function speakEnglish(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // 再生中のものをキャンセル
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
}


function showCard(phrase) {
    current = phrase;
    showingJa = true;
    english.textContent = current.en;   // 英語だけ表示
    speakEnglish(current.en);            // 音声再生
    meaning.style.display = "none";      // 日本語訳は隠す
}

function showNewCard() {
    if (filteredPhrases.length === 0) {
        english.textContent = "No cards available";
        meaning.textContent = "";
        meaning.style.display = "none";
        return;
    }
    const phrase = getRandomPhrase();
    history.push(phrase);
    historyIndex = history.length - 1;
    showCard(phrase);
}

function resetState() {
    current = null;
    history = [];
    historyIndex = -1;
    english.textContent = "Tap to start"; // カード内の英語用divを更新
    meaning.textContent = "";
    meaning.style.display = "none";
}

// JSONを読み込み
fetch("./json/frames.json")
    .then(response => response.json())
    .then(data => {
        phrases = data;
        applyFilter(); // 初期化時にフィルタ
    })
    .catch(err => {
        card.textContent = "Error";
        console.error(err);
    });

// sentenceフィルタ適用
function applyFilter() {
    const selected = document.querySelector('input[name="sentence"]:checked').value;
    filteredPhrases = phrases.filter(p => p.sentence === selected);
    resetState();
}

// ラジオボタン切り替え時にフィルタ更新
document.querySelectorAll('input[name="sentence"]').forEach(radio => {
    radio.addEventListener("change", () => {
        applyFilter();
    });
});

card.addEventListener("click", function() {
    if (!current) return;
    speakEnglish(current.en);
});

// jaボタン
jaBtn.addEventListener("click", () => {
    if (current && current.ja) {
        meaning.textContent = current.ja;
        meaning.style.display = "block";
    }
});

// Next ボタン → 新しいカード
nextBtn.addEventListener("click", () => {
    if (filteredPhrases.length === 0) return;
    showNewCard();
});

// Back ボタン → 前のカードに戻る
backBtn.addEventListener("click", () => {
    if (historyIndex > 0) {
        historyIndex--;
        showCard(history[historyIndex]);
    }
});
