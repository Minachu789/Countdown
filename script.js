const ITEMS_KEY = "mina_countdown_items";
const LANG_KEY = "mina_countdown_lang";

const state = {
    language: localStorage.getItem(LANG_KEY) || "en",
    lastResult: "",
    lastDays: 0,
    lastDate: "",
    items: JSON.parse(localStorage.getItem(ITEMS_KEY)) || []
}

const box = {
    title: document.querySelector("#title"),
    languageButton: document.querySelector("#language_button"),
    word: document.querySelector("#word"),
    input: document.querySelector("#dateInput"),
    eventName: document.querySelector("#eventName"),
    eventLabel: document.querySelector("#eventLabel"),
    AddCountdownButton: document.querySelector("#Start_button"),
    result: document.querySelector("#result"),
    list: document.querySelector("#list")
}

const translate = {
    en: {
        title: "Mina's Countdown Website",
        button: "切換為中文",
        word: "Please choose a date",
        start: "Start Countdown",
        noDate: "Please select a date.",
        noName: "Please enter event name",
        noDN: "Please enter event name and select a date",
        event: "Event Name",
        result: (days, date) => `There are still ${days} days until ${date}`,
        passed: "The date has already passed."
    },
    zh: {
        title: "Mina的倒數網站",
        button: "Switch to English",
        word: "請選擇日期",
        start: "開始倒數",
        noDate: "請選擇一個日期",
        noName: "請輸入事件名稱",
        noDN: "請輸入事件名稱和選擇一個日期",
        event: "事件名稱",
        result: (days, date) => `距離 ${date} 還有 ${days} 天`,
        passed: "這個日期已經過了"
    }
};

function save() {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(state.items));
    localStorage.setItem(LANG_KEY, state.language);
}

function changeLanguage() {
    box.title.textContent = translate[state.language].title;
    box.languageButton.textContent = translate[state.language].button;
    box.word.textContent = translate[state.language].word;
    box.eventLabel.textContent = translate[state.language].event;
    box.AddCountdownButton.textContent = translate[state.language].start;
    renderList();
}

function updateResult() {
    box.result.textContent = "";
    box.result.style.color = "red";

    if (state.lastResult === "noDate") {
        box.result.textContent = translate[state.language].noDate;
    } else if (state.lastResult === "noName") {
        box.result.textContent = translate[state.language].noName;
    } else if (state.lastResult === "noDN") {
        box.result.textContent = translate[state.language].noDN;
    } else if (state.lastResult === "passed") {
        box.result.textContent = translate[state.language].passed;
    }
}

box.languageButton.addEventListener("click", function () {
    state.language = (state.language === "en") ? "zh" : "en";

    save();
    changeLanguage();
    updateResult();
});

box.AddCountdownButton.addEventListener("click", function () {
    let inputDate = box.input.value;
    let eventName = box.eventName.value.trim();

    if (!inputDate && !eventName) {
        state.lastResult = "noDN";
    } else if (!inputDate) {
        state.lastResult = "noDate";
    } else if (!eventName) {
        state.lastResult = "noName";
    } else {
        let diffDays = calculateDays(inputDate);

        if (diffDays < 0) {
            state.lastResult = "passed";
        } else {
            state.items.push({ name: eventName, date: inputDate });
            state.lastDate = inputDate;
            state.lastDays = diffDays;
            state.lastResult = "countdown";

            save();
            box.eventName.value = "";
            box.input.value = "";
            state.lastResult = "";
        }
    }

    renderList();
    updateResult();
});

function calculateDays(date) {
    let target = new Date(date);
    let today = new Date();
    let diffTime = target - today;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderList() {
    box.list.innerHTML = "";
    state.items.forEach((item, index) => {
        let days = calculateDays(item.date);
        let text = (days < 0) ? translate[state.language].passed : translate[state.language].result(days, item.date);

        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.padding = "10px 15px";
        row.style.gap = "15px";

        let del = document.createElement("button");
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.style.color = "#ff4d4d";
        del.style.background = "transparent";
        del.style.border = "none";
        del.style.cursor = "pointer";
        del.style.fontSize = "1.1rem";
        del.addEventListener("click", () => {
            state.items.splice(index, 1);
            save();
            renderList();
        });

        let content = document.createElement("p");
        content.innerHTML = `<strong>${item.name}</strong> - ${text}`;
        content.style.margin = "0";
        content.style.flex = "1";

        row.appendChild(del);
        row.appendChild(content);

        box.list.appendChild(row);
    });
}
changeLanguage();
renderList();