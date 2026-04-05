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
    list: document.querySelector("#list"),
    lineColorPicker: document.querySelector("#lineColorPicker"),
    bgColorPicker: document.querySelector("#bgColorPicker")
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
        passed: "The date has already passed.",
        day: "Days",
        minute: "Minutes",
        hour: "Hours",
        second: "Seconds"
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
        passed: "這個日期已經過了",
        day: "天",
        minute: "分",
        hour: "小時",
        second: "秒"
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

box.languageButton.addEventListener("click", function () {
    state.language = (state.language === "en") ? "zh" : "en";
    save();
    changeLanguage();
});

box.AddCountdownButton.addEventListener("click", function () {
    const inputDate = box.input.value;
    const eventName = box.eventName.value.trim();

    console.log("Button Clicked!", { inputDate, eventName });

    const lineColor = box.lineColorPicker.value;
    const bgColor = box.bgColorPicker.value;

    if (!inputDate || !eventName) {
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].noDN;
        return;
    }

    const check = calculateDays(inputDate);
    if (check.totalDiff < 0) {
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].passed;
        return;
    }

    state.items.push({
        name: eventName,
        date: inputDate,
        lineColor: lineColor,
        bgColor: bgColor
    });

    save();
    renderList();

    // 清空輸入框
    box.eventName.value = "";
    box.input.value = "";
    box.result.textContent = "";
});

function calculateDays(date) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const today = new Date();
    const diffTime = target - today;

    return {
        totalDiff: diffTime,
        days: Math.floor(diffTime / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffTime / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffTime / (1000 * 60)) % 60),
        seconds: Math.floor((diffTime / 1000) % 60)
    };
}

function renderList() {
    box.list.innerHTML = "";
    state.items.forEach((item, index) => {
        const time = calculateDays(item.date);
        const row = document.createElement("div");
        row.classList.add("item_row");
        row.style.backgroundColor = item.bgColor;

        const del = document.createElement("button");
        del.innerHTML = '<i class="fas fa-trash"></i>';
        del.classList.add("delete_button");
        del.addEventListener("click", () => {
            state.items.splice(index, 1);
            save();
            renderList();
        });

        const content = document.createElement("div");
        content.className = "item_content";

        const eventDisplay = document.createElement("p");
        eventDisplay.className = "item_eventName";
        eventDisplay.style.borderBottomColor = item.lineColor;
        eventDisplay.textContent = item.name;

        const timeElement = document.createElement("div");
        timeElement.className = "timer_display";

        if (time.totalDiff < 0) {
            timeElement.textContent = translate[state.language].passed;
        } else {
            const format = (num) => String(Math.max(0, num)).padStart(2, '0');
            timeElement.innerHTML = `
                <div class="time-unit"><span>${format(time.days)}</span><small>${translate[state.language].day}</small></div>
                <div class="time-unit"><span>${format(time.hours)}</span><small>${translate[state.language].hour}</small></div>
                <div class="time-unit"><span>${format(time.minutes)}</span><small>${translate[state.language].minute}</small></div>
                <div class="time-unit"><span>${format(time.seconds)}</span><small>${translate[state.language].second}</small></div>
            `;
        }
        
        const bgColor = item.bgColor || "#ffffff";
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 255;
        const g = parseInt(hex.substring(2, 4), 16) || 255;
        const b = parseInt(hex.substring(4, 6), 16) || 255;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        row.style.color = (brightness < 128) ? "white" : "#333";

        eventDisplay.style.borderBottomColor = item.lineColor;
        eventDisplay.style.color = "inherit";
        content.appendChild(eventDisplay);
        content.appendChild(timeElement);
        row.appendChild(del);
        row.appendChild(content);
        box.list.appendChild(row);
    });
}

changeLanguage();
setInterval(renderList, 1000);