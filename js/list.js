const menu = document.querySelector(".menu");
let jsonData = [];

const fileName = location.pathname.split("/").pop().replace(".html", "");
const ul = document.getElementById("phrase-list");
fetch(`./json/${fileName}.json`)
.then(res => res.json())
.then(data => {
    jsonData = data;
    updateMenu();
});

const popup = document.getElementById("popup");
const popupEn = document.getElementById("popup-en");
const popupJa = document.getElementById("popup-ja");
const closeBtn = document.getElementById("close");

function updateMenu(){
    const category = document.querySelector('input[name="category"]:checked').value;
    menu.innerHTML = "";
    jsonData
    .filter(item => item.category === category)
    .forEach(item => {
        const li = document.createElement("li");
        const en = document.createElement("div");
        en.className = "en";
        en.textContent = item.en;
        const ja = document.createElement("div");
        ja.className = "ja";
        ja.textContent = item.ja;
        li.appendChild(en);
        li.appendChild(ja);
        menu.appendChild(li);
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

// ラジオ変更
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", updateMenu);
});