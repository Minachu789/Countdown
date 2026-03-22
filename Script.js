const state = {
    language: "en",
    lastResult: "",
    lastDays: 0
}

const box = {
    title: document.querySelector("#title"),
    languageButton: document.querySelector("#language_button"),
    word: document.querySelector("#word"),
    input: document.querySelector("#dateInput"),
    startButton: document.querySelector("#Start_button"),
    result: document.querySelector("#result")
}

const translate = {
    en: {
        title: "Mina's Countdown Website",
        button: "切換為中文",
        word: "Please choose a date",
        start: "Start Countdown",
        noDate: "Please select a date.",
        result: (days) => `There are still ${days} days until that date.`,
        passed: "That date has already passed."
    },
    zh: {
        title: "Mina的倒數網站",
        button: "Switch to English",
        word: "請選擇日期",
        start: "開始倒數",
        noDate: "請選擇一個日期",
        result: (days) => `距離該日期還有 ${days} 天`,
        passed: "這個日期已經過了"
    }
};

function updateText() {
    box.title.textContent = translate[state.language].title;
    box.languageButton.textContent = translate[state.language].button;
    box.word.textContent = translate[state.language].word;
    box.startButton.textContent = translate[state.language].start;
}

function updateResult() {
    const resultElement = box.result;
    switch (state.lastResult) {
        case "noDate":
            resultElement.textContent = translate[state.language].noDate;
            resultElement.style.color = "red";
            break;
        case "passed":
            resultElement.textContent = translate[state.language].passed;
            break;
        case "countdown":
            resultElement.textContent = translate[state.language].result(state.lastDays);
            break;
        default: resultElement.textContent = "";
    }
}

box.languageButton.addEventListener("click", function () {
    state.language = (state.language === "en") ? "zh" : "en";
    updateText();
    updateResult();
});

box.startButton.addEventListener("click", function () {
    let inputDate = box.input.value;
    let resultElement = box.result;

    if (!inputDate) {
        state.lastResult = "noDate";
        updateResult();
        return;
    }

    let target = new Date(inputDate);
    let today = new Date();
    let diffTime = target - today;
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    resultElement.style.color = "black";

    if (diffDays < 0) {
        state.lastResult = "passed";
        updateResult();
        return;
    }

    state.lastResult = "countdown";
    state.lastDays = diffDays;
    resultElement.textContent = translate[state.language].result(diffDays);
});