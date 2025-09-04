const fileName = location.pathname.split("/").pop().replace(".html", "");
const ul = document.getElementById("phrase-list");

fetch(`./json/${fileName}.json`)
    .then(res => res.json())
    .then(data => {
        function renderList() {
            // 選択されている tense と category を取得
            const selectedTense = document.querySelector('input[name="tense"]:checked').value;
            const selectedCategory = document.querySelector('input[name="category"]:checked').value;

            ul.innerHTML = ''; // 一旦クリア

            data.forEach(phrase => {
                const enKey = `en_${selectedTense}`;
                const jaKey = `ja_${selectedTense}`;

                // category一致 ＆ enKey が存在するものだけ表示
                if (phrase.category === selectedCategory && phrase[enKey]) {
                    const li = document.createElement('li');
                    li.classList.add('phrase');
                    li.innerHTML = `
                        ${phrase[enKey]}
                        <span class="play-sound" style="float:right; cursor:pointer;">🔊</span>
                    `;
                    ul.appendChild(li);

                    // クリック → ポップアップ表示
                    li.addEventListener("click", function (event) {
                        if (event.target.classList.contains('play-sound')) return; // 🔊は除外

                        document.getElementById("en").textContent = phrase[enKey];
                        document.getElementById("ja").textContent = phrase[jaKey] || "";
                        document.getElementById("popup").style.display = "flex";

                        // 保存
                        const savedPhrase = { en: phrase[enKey], ja: phrase[jaKey] };
                        localStorage.setItem("savedPhrase", JSON.stringify(savedPhrase));
                        console.log("最新のフレーズを保存:", savedPhrase);
                    });

                    // 🔊 音声マーククリック → 読み上げ
                    li.querySelector('.play-sound').addEventListener('click', function () {
                        const textToSpeak = phrase[enKey].replace(/(\(.*?\)|\[.*?\])/g, '').trim();
                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
                        speechSynthesis.speak(utterance);
                    });
                }
            });
        }

        renderList(); // 初期表示

        // tense / category 切り替え時に再レンダー
        document.querySelectorAll('input[name="tense"], input[name="category"]').forEach(radio => {
            radio.addEventListener('change', renderList);
        });
    })
    .catch(err => console.error(`${fileName}.json の読み込みに失敗しました:`, err));

// 背景クリックでポップアップを閉じる
document.getElementById("popup").addEventListener("click", function (event) {
    if (event.target === this) {
        this.style.display = "none";
    }
});
