const englishDiv = document.getElementById("english");
const japaneseDiv = document.getElementById("japanese");
const playPauseButton = document.getElementById("PlayPause");
const intervalSelect = document.getElementById("intervalSelect");

let allData = [];     // JSON全部
let data = [];        // フィルタ後（再生に使う）
let timer = null;
let index = 0;
let isPlaying = false;

/* JSON読み込み */
const fileName = location.pathname.split("/").pop().replace(".html", "");
fetch(`../json/${fileName}.json`)
    .then(response => response.json())
    .then(json => {
        allData = json;
        filterByCategory(); // 初期表示
    })
    .catch(error => {
        console.error("JSONの読み込みに失敗しました", error);
    });


const categoryRadios = document.querySelectorAll('input[name="category"]');
categoryRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        stopPlayback();        // 再生中なら止める
        filterByCategory();    // データを絞り直す
    });
});


playPauseButton.addEventListener("click", () => {
    if (data.length === 0) return;

    if (!isPlaying) {
        startPlayback();
    }
    else {
        pausePlayback();
    }
});


function filterByCategory() {
    const selected = document.querySelector('input[name="category"]:checked').value;
    data = allData.filter(item => item.category === selected);
    index = 0;
    if (data.length > 0) {
        showCard(index);
    }
    else {
        englishDiv.textContent = "";
        japaneseDiv.textContent = "";
    }
}


// 開始動作
function startPlayback() {
    isPlaying = true;
    playPauseButton.textContent = "⏸";
    const interval = Number(intervalSelect.value);

    // 初回 or 再開時に表示
    showCard(index);

    timer = setInterval(() => {
        index++;
        if (index >= data.length) {
            stopPlayback();
            return;
        }
        showCard(index);
    }, interval);
}

// 停止動作
function pausePlayback() {
    isPlaying = false;
    playPauseButton.textContent = "▶";
    clearInterval(timer);
    timer = null;
    speechSynthesis.cancel();  // 音声も止める
}

function stopPlayback() {
    pausePlayback();
    index = 0;
}

function showCard(i) {
    const phrase = data[i];
    englishDiv.textContent = phrase.en;
    japaneseDiv.textContent = phrase.ja;
    speakEnglish(phrase.en);
}

function speakEnglish(text) {
    speechSynthesis.cancel();
    text = text.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
}
