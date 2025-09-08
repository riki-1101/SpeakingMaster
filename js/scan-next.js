const radio = document.getElementById("radio");
const savedGenre = JSON.parse(localStorage.getItem("savedGenre"));

savedGenre.categories.forEach((category, index) => {
    // input要素作成
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "category";  // nameを共通にすることでラジオボタンになる
    input.id = `category-${index}`;
    input.value = category;

    // 最初の要素にチェック
    if (index === 0) {
        input.checked = true;
    }

    // label要素作成
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = category;

    // containerに追加
    radio.appendChild(input);
    radio.appendChild(label);
});



const next = JSON.parse(localStorage.getItem("savedPhrase")).next;  // 続くタイプを取得 [do,did,done]
const ul = document.getElementById("phrase-list");
fetch(`./genre_json/${savedGenre.json}.json`)
    .then(res => res.json())
    .then(data => {
        function renderList() {
            // 選択されている category を取得
            const selectedCategory = document.querySelector('input[name="category"]:checked').value;
            ul.innerHTML = ''; // 一旦クリア
            data.forEach(phrase => {
                if (phrase.category === selectedCategory && phrase[next]) {
                    const li = document.createElement('li');
                    li.classList.add('phrase');
                    li.innerHTML = `
                        ${phrase[next]}
                        <span class="play-sound" style="float:right; cursor:pointer;">🔊</span>
                    `;
                    ul.appendChild(li);

                    // クリック → ポップアップ表示
                    li.addEventListener("click", function (event) {
                        if (event.target.classList.contains('play-sound'))
                            return; // 🔊は除外
                        document.getElementById("en").textContent = phrase.do;
                        document.getElementById("ja").textContent = phrase.ja;
                        document.getElementById("popup").style.display = "flex";
                    });

                    // 🔊 音声マーククリック → 読み上げ
                    li.querySelector('.play-sound').addEventListener('click', function () {
                        const textToSpeak = phrase[next].replace(/(\(.*?\)|\[.*?\])/g, '').trim();
                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
                        speechSynthesis.speak(utterance);
                    });
                }
            });
        }

        renderList(); // 初期表示

        // category 切り替え時に再レンダー
        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', renderList);
        });
    })
    .catch(err => console.error(`${savedGenre.json}.json の読み込みに失敗しました:`, err));

// 背景クリックでポップアップを閉じる
document.getElementById("popup").addEventListener("click", function (event) {
    if (event.target === this) {
        this.style.display = "none";
    }
});
