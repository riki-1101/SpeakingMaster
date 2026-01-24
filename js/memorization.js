window.addEventListener("load", () => {
    modal.style.display = "flex";
});

const modal = document.getElementById("timeModal");
const startBtn = document.getElementById("startBtn");
const timeSelect = document.getElementById("timeSelect");

// ★ 再生モード（radio button）
const modeRadios = document.querySelectorAll('input[name="mode"]');

const englishDiv = document.getElementById("english");
const japaneseDiv = document.getElementById("japanese");
const playPause = document.getElementById("PlayPause");

let originalData = []; // ← JSONの元データ
let data = [];         // ← 実際に再生するデータ
let timer = null;
let index = 0;
let isPlaying = false;

startBtn.disabled = true;

/* ---------- JSON 読み込み ---------- */
const fileName = location.pathname.split("/").pop().replace(".html", "");
fetch(`../json/${fileName}.json`)
    .then(res => res.json())
    .then(json => {
        originalData = json;
        startBtn.disabled = false;
    });

/* ---------- スタートボタン ---------- */
startBtn.addEventListener("click", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (mode === "full") {
        // 順にフル再生
        data = [...originalData];

    } else if (mode === "shuffle") {
        // シャッフルフル再生
        data = shuffle([...originalData]);

    } else if (mode === "time") {
        // 時間指定ランダム再生
        const seconds = Number(timeSelect.value);
        const wordCount = Math.floor(seconds / 3);
        data = shuffle([...originalData]).slice(0, wordCount);
    }

    index = 0;
    modal.style.display = "none";
});

/* ---------- シャッフル ---------- */
function shuffle(array) {
    return array
        .map(v => ({ v, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(obj => obj.v);
}

/* ---------- 再生 / 停止 ---------- */
playPause.addEventListener("change", () => {
    if (data.length === 0) {
        playPause.checked = false;
        return;
    }
    playPause.checked ? startPlayback() : pausePlayback();
});

function startPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    showCard(index);

    timer = setInterval(() => {
        index++;
        if (index >= data.length) {
            stopPlayback();
            playPause.checked = false;
            return;
        }
        showCard(index);
    }, 3000);
}

function pausePlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(timer);
    timer = null;
    speechSynthesis.cancel();
}

function stopPlayback() {
    pausePlayback();
    index = 0;
}

/* ---------- 表示 ---------- */
function showCard(i) {
    const phrase = data[i];
    englishDiv.textContent = phrase.en;
    japaneseDiv.textContent = "";
    speakEnglish(phrase.en);

    setTimeout(() => {
        japaneseDiv.textContent = phrase.ja;
    }, Number(delaySelect.value));
}