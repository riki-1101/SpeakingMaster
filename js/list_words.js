let jsonData = [];

const fileName = location.pathname.split("/").pop().replace(".html", "");
const ul = document.getElementById("phrase-list");
fetch(`./json/${fileName}.json`)
.then(res => res.json())
.then(data => {
    jsonData = data;
    updateList();
});

const popup = document.getElementById("popup");
const popupEn = document.getElementById("popup-en");
const popupJa = document.getElementById("popup-ja");
const speakBtn = document.getElementById("speak-btn");
const closeBtn = document.getElementById("close");

function updateList(){
    ul.innerHTML = "";
    jsonData
    .forEach(item => {
        const li = document.createElement("li");
        const en = document.createElement("div");
        en.className = "en";
        en.textContent = item.en;
        const ja = document.createElement("div");
        ja.className = "ja";
        ja.textContent = item.ja;

        // 🔊 読み上げボタン
        const speakBtn = document.createElement("button");
        speakBtn.textContent = "🔊";
        speakBtn.className = "speak-btn";

        speakBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // ← liクリック（ポップアップ）を防ぐ
            speakEnglish(item.en);
        });

        const textWrap = document.createElement("div");
        textWrap.className = "text-wrap";
        textWrap.appendChild(en);
        textWrap.appendChild(ja);
        li.appendChild(textWrap);
        li.appendChild(speakBtn);
        li.appendChild(speakBtn);
        ul.appendChild(li);

        li.addEventListener("click", () => {
            popupEn.textContent = item.en;
            popupJa.textContent = item.ja;
            popup.style.display = "flex";
        });
    });
}

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

// 背景クリックで閉じる
popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});