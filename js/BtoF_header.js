const header = document.getElementById('header');
if( header != null) {
    header.innerHTML = `
    <div id="type-select">
        <input type="radio" name="type" id="do" value="do" checked>
        <label for="do">do</label>
        <input type="radio" name="type" id="did" value="did">
        <label for="did">did</label>
        <input type="radio" name="type" id="done" value="done">
        <label for="done">done</label>
        <input type="radio" name="type" id="c" value="c">
        <label for="c">c</label>
    </div>
    <nav>
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul>
            <li><a href="/EnglishMaster/index.html">ホーム</a></li>
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
