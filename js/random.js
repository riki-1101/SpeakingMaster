const card = document.getElementById("card");
const english = document.getElementById("english");
const meaning = document.getElementById("meaning");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const jaBtn = document.getElementById("ja-btn");

let phrases = [];
let filteredPhrases = [];
let shuffledPhrases = [];
let currentIndex = -1;
let current = null;

// --- ヘルパー: 配列シャッフル ---
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// --- 英語を音声再生 ---
function speakEnglish(text) {
    if (!text) return;
    window.speechSynthesis.cancel(); // 再生中をキャンセル
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
}

// --- カード表示 ---
function showCard(phrase) {
    current = phrase;
    english.textContent = current.en; // 英語のみ表示
    meaning.style.display = "none";   // 日本語は隠す
    speakEnglish(current.en);         // 音声再生
}

// --- 次のカード取得 ---
function showNewCard() {
    if (shuffledPhrases.length === 0) {
        english.textContent = "No cards available";
        meaning.textContent = "";
        meaning.style.display = "none";
        return;
    }
    currentIndex++;
    if (currentIndex >= shuffledPhrases.length) {
        // 一周したら再シャッフル
        shuffledPhrases = shuffleArray(filteredPhrases);
        currentIndex = 0;
    }
    showCard(shuffledPhrases[currentIndex]);
}

// --- 初期状態リセット ---
function resetState() {
    current = null;
    currentIndex = -1;
    english.textContent = "Tap to start";
    meaning.textContent = "";
    meaning.style.display = "none";
}

// --- フィルタ適用 ---
function applyFilter() {
    const selected = document.querySelector('input[name="category"]:checked').value;
    filteredPhrases = phrases.filter(p => p.category === selected);
    shuffledPhrases = shuffleArray(filteredPhrases);
    resetState();
}

// --- JSON読み込み ---
const fileName = location.pathname.split("/").pop().replace(".html", "");
fetch(`./json/${fileName}.json`)
    .then(response => response.json())
    .then(data => {
        phrases = data;
        applyFilter();
    })
    .catch(err => {
        english.textContent = "Error";
        console.error(err);
    });

// --- ラジオボタン切り替え ---
document.querySelectorAll('input[name="category"]').forEach(radio => {
    radio.addEventListener("change", applyFilter);
});

// --- カードクリックで音声再生 ---
card.addEventListener("click", () => {
    if (!current) return;
    speakEnglish(current.en);
});

// --- jaボタン ---
jaBtn.addEventListener("click", () => {
    if (current && current.ja) {
        meaning.textContent = current.ja;
        meaning.style.display = "block";
    }
});

// --- Next ボタン ---
nextBtn.addEventListener("click", showNewCard);

// --- Back ボタン（履歴管理はしない場合） ---
backBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        showCard(shuffledPhrases[currentIndex]);
    }
});