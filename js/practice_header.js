const header = document.getElementById('practice_header');
if( header != null) {
    header.innerHTML = `
    <div id="saved-phrase"></div>
    <nav>
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul>
            <li><a href="/SpeakingMaster/index.html">ホーム</a></li>
        </ul>
        <label for="country">発音</label>
        <select id="country">
            <option value="en-US">アメリカ英語</option>
            <option value="en-GB">イギリス英語</option>
        </select>
    </nav>
    `
}

const countrySelect = document.getElementById("country");

function restoreCountry() {
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry) {
        countrySelect.value = savedCountry;
    }
}

// ページ読み込み時
document.addEventListener("DOMContentLoaded", restoreCountry);

// ページバック時
window.addEventListener("pageshow", restoreCountry);

// 選択変更時に保存
countrySelect.addEventListener("change", () => {
    localStorage.setItem("selectedCountry", countrySelect.value);
    console.log("国設定を保存:", countrySelect.value);
});

// 保存された最新フレーズを復元して表示
const savedPhrase = JSON.parse(localStorage.getItem("savedPhrase"));
if (savedPhrase && savedPhrase.en) {
    document.getElementById("saved-phrase").textContent = savedPhrase.en;
}
