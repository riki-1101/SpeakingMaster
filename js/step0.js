const englishDiv = document.getElementById("english");
const japaneseDiv = document.getElementById("japanese");
const playPause = document.getElementById("PlayPause");
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
        playPause.checked = false;
        filterByCategory();    // データを絞り直す
    });
});

playPause.addEventListener("change", () => {
    if (data.length === 0) {
        playPause.checked = false;
        return;
    }
    if (playPause.checked) {
        startPlayback();
    } else {
        pausePlayback();
    }
});

function filterByCategory() {
    const selected = document.querySelector('input[name="category"]:checked').value;
    data = allData.filter(item => item.category === selected);
    index = 0;
    englishDiv.textContent = "";
    japaneseDiv.textContent = "";
}

playPause.addEventListener("change", () => {
    if (data.length === 0) {
        playPause.checked = false;
        return;
    }
    if (playPause.checked) {
        startPlayback();
    } else {
        pausePlayback();
    }
});

function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    const interval = Number(intervalSelect.value);
    showCard(index);  // 初回 or 再開時に表示
    timer = setInterval(() => {
        index++;
        if (index >= data.length) {
            stopPlayback();
            playPause.checked = false; // 最後まで行ったらOFF
            return;
        }
        showCard(index);
    }, interval);
}

function pausePlayback() {
    if (!isPlaying) return;
    isPlaying = false;
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
    englishDiv.textContent = phrase.en;         // 英語を表示
    japaneseDiv.textContent = "";               // 日本語を隠す
    speakEnglish(phrase.en);                    // 音声再生
    const delay = Number(delaySelect.value);    // 日本語を表示
    jaTimer = setTimeout(() => {
        japaneseDiv.textContent = phrase.ja;
    }, delay);
}
