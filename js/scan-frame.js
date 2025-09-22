const ul = document.getElementById("phrase-list");
fetch(`./json/frame.json`)
    .then(res => res.json())
    .then(data => {
        function renderList() {
            const selectedSubject = document.querySelector('input[name="subject"]:checked').value;
            ul.innerHTML = ''; // 一旦クリア
            data.forEach(phrase => {
                if (phrase.subject === selectedSubject) {
                    const li = document.createElement('li');
                    li.classList.add('phrase');
                    li.innerHTML = `
                        ${phrase.en}
                        <span class="play-sound" style="float:right; cursor:pointer;">🔊</span>
                    `;
                    ul.appendChild(li);

                    // クリック → ポップアップ表示・保存
                    li.addEventListener("click", function (event) {
                        if (event.target.classList.contains('play-sound'))
                            return; // 🔊は除外
                        document.getElementById("en").textContent = phrase.en;
                        document.getElementById("ja").textContent = phrase.ja;
                        document.getElementById("popup").style.display = "flex";
                        const savedPhrase = {
                            en: phrase.en,
                            ja: phrase.ja,
                            next: phrase.next
                        };
                        localStorage.setItem("savedPhrase", JSON.stringify(savedPhrase));
                        console.log("最新のフレーズを保存:", savedPhrase);
                    });

                    // 🔊 音声マーククリック → 読み上げ
                    li.querySelector('.play-sound').addEventListener('click', function () {
                        const textToSpeak = phrase.en.replace(/(\(.*?\)|\[.*?\])/g, '').trim();
                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        utterance.lang = localStorage.getItem("selectedCountry") || "en-US";
                        speechSynthesis.speak(utterance);
                    });
                }
            });
        }

        renderList(); // 初期表示

        // subject 切り替え時に再レンダー
        document.querySelectorAll('input[name="subject"]').forEach(radio => {
            radio.addEventListener('change', renderList);
        });
    })
    .catch(err => console.error(`json の読み込みに失敗しました:`, err));

// 背景クリックでポップアップを閉じる
document.getElementById("popup").addEventListener("click", function (event) {
    if (event.target === this) {
        this.style.display = "none";
    }
    document.getElementById("genre-list").open = false;
});

// ジャンルリスト
const genre_div = document.getElementById("genre-list");
const genre_ul = document.createElement("ul");
genre_div.appendChild(genre_ul);
fetch("./json/index.json")
    .then(res => res.json())
    .then(index => {
        function genreList() {
            genre_ul.innerHTML = ''; // 一旦クリア
            index.forEach(genre => {
                if(document.querySelector('input[name="subject"]:checked').value === genre.subject) {
                    const genre_li = document.createElement('li');
                    genre_li.classList.add('genre');
                    genre_li.innerHTML = genre.genre;
                    genre_li.addEventListener("click", function() {
                        const savedGenre = {
                            json: genre.json,
                            categories: genre.categories
                        };
                        localStorage.setItem("savedGenre", JSON.stringify(savedGenre));
                        console.log("ジャンルを保存:", savedGenre);
                        window.location.href = "next.html";
                    });
                    genre_ul.appendChild(genre_li);
                }
            });
        }
        genreList();
        // subject 切り替え時に再レンダー
        document.querySelectorAll('input[name="subject"]').forEach(radio => {
            radio.addEventListener('change', genreList);
        });
    });
