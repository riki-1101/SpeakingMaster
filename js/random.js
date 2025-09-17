const card = document.getElementById("card");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");

let phrases = [];
let current = null;
let showingJa = true;
let history = [];   // 過去に表示したカードの履歴
let historyIndex = -1;

function getRandomPhrase() {
    return phrases[Math.floor(Math.random() * phrases.length)];
}

function showCard(phrase) {
    current = phrase;
    showingJa = true;
    card.textContent = current.ja;
}

function showNewCard() {
    const phrase = getRandomPhrase();
    history.push(phrase);
    historyIndex = history.length - 1;
    showCard(phrase);
}

// JSONを読み込み
fetch("./json/frames.json")
    .then(response => response.json())
    .then(data => {
        phrases = data;
        card.textContent = "Tap to start";
    })
    .catch(err => {
        card.textContent = "Error";
        console.error(err);
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
    if (phrases.length === 0) return;
    showNewCard();
});

// Back ボタン → 前のカードに戻る
backBtn.addEventListener("click", () => {
    if (historyIndex > 0) {
        historyIndex--;
        showCard(history[historyIndex]);
    }
});
