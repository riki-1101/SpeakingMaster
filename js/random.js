const card = document.getElementById("card");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");

let phrases = [];
let filteredPhrases = []; // sentenceごとにフィルタしたもの
let current = null;
let showingJa = true;
let history = [];   // 過去に表示したカードの履歴
let historyIndex = -1;

function getRandomPhrase() {
    return filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
}

function showCard(phrase) {
    current = phrase;
    showingJa = true;
    card.textContent = current.ja;
}

function showNewCard() {
    if (filteredPhrases.length === 0) {
        card.textContent = "No cards available";
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
    card.textContent = "Tap to start";
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

// カードクリック → ja/en 切り替え
card.addEventListener("click", () => {
    if (!current) return;
    if (showingJa) {
        card.textContent = current.en;
        showingJa = false;
    } else {
        card.textContent = current.ja;
        showingJa = true;
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

