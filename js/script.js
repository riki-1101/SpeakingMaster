// ハンバーガーメニュー
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");

    hamburger.addEventListener("click", function () {
        this.classList.toggle("active"); // ハンバーガーアイコンの変化
        nav.classList.toggle("open"); // ナビゲーションメニューの開閉
    });
});

document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
        e.preventDefault(); // 右クリック/長押しメニューを無効化
    }
});