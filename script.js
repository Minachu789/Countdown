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
    bgColorPicker: document.querySelector("#bgColorPicker"),
    lineColorLabel: document.querySelector("#lineColorLabel"),
    bgColorLabel: document.querySelector("#bgColorLabel")
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
        second: "Seconds",
        bgColor: "Background color",
        lineColor: "Line color"
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
        second: "秒",
        bgColor: "背景顏色",
        lineColor: "線條顏色"
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
    box.bgColorLabel.textContent = translate[state.language].bgColor;
    box.lineColorLabel.textContent = translate[state.language].lineColor;

    if (state.lastResult) {
        box.result.textContent = translate[state.language][state.lastResult];
    }

    renderList();
}

function calculateDays(date) {
    const target = new Date(date);
    const today = new Date();
    const diffTime = target - today;

    if (diffTime <= 0) return { totalDiff: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
        totalDiff: diffTime,
        days: Math.floor(diffTime / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffTime / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffTime / (1000 * 60)) % 60),
        seconds: Math.floor((diffTime / 1000) % 60)
    };


}

function calculatePercent(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let now = new Date();

    if (now >= end) {
        return 100;
    }

    if (now <= start) {
        return 0;
    }

    let total = end - start;
    let left = end - now;
    let percent = left / total * 100;
    return percent.toFixed(2);
}

function animateResult() {
    box.result.classList.add("animate");

    setTimeout(() => { box.result.classList.remove("animate") }, 300);
}

function renderList() {
    if (box.list.children.length !== state.items.length) {
        box.list.innerHTML = "";

        const formatToTiles = () => `
            <div class="digit-tile">
                <div class="digit-strip">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
                    <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
                </div>
            </div>`;

        state.items.forEach((item, index) => {
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
            eventDisplay.textContent = item.name;
            eventDisplay.style.borderBottomColor = item.lineColor;

            const timeElement = document.createElement("div");
            timeElement.className = "timer_display";
            timeElement.innerHTML = `
                <div class="time-unit"><div class="tiles-wrapper">${formatToTiles()}${formatToTiles()}</div><small>${translate[state.language].day}</small></div>
                <div class="time-unit"><div class="tiles-wrapper">${formatToTiles()}${formatToTiles()}</div><small>${translate[state.language].hour}</small></div>
                <div class="time-unit"><div class="tiles-wrapper">${formatToTiles()}${formatToTiles()}</div><small>${translate[state.language].minute}</small></div>
                <div class="time-unit"><div class="tiles-wrapper">${formatToTiles()}${formatToTiles()}</div><small>${translate[state.language].second}</small></div>
            `;

            const percentContainer = document.createElement("div");
            percentContainer.className = "percent-container";

            const percentBar = document.createElement("div");
            percentBar.className = "percent-bar";

            percentBar.style.backgroundImage = "none";
            percentBar.style.backgroundColor = item.lineColor;

            percentContainer.appendChild(percentBar);
            content.appendChild(eventDisplay);
            content.appendChild(timeElement);
            content.appendChild(percentContainer);
            row.appendChild(del);
            row.appendChild(content);
            box.list.appendChild(row);
        });
    }

    const rows = box.list.querySelectorAll(".item_row");
    rows.forEach((row, index) => {
        const item = state.items[index];
        if (!item) return;

        const time = calculateDays(item.date);
        const strips = row.querySelectorAll(".digit-strip");
        const timeStr = String(time.days).padStart(2, '0') + String(time.hours).padStart(2, '0') +
            String(time.minutes).padStart(2, '0') + String(time.seconds).padStart(2, '0');

        for (let i = 0; i < 8; i++) {
            if (strips[i]) {
                const digit = parseInt(timeStr[i]);
                strips[i].style.transform = `translateY(-${digit * 40}px)`;
            }
        }

        const percentBar = row.querySelector(".percent-bar");
        if (percentBar) {
            const progress = calculatePercent(item.start, item.date);
            percentBar.style.width = progress + "%";
            percentBar.style.backgroundImage = "none";
            percentBar.style.backgroundColor = item.lineColor;
        }
    });
}

box.languageButton.addEventListener("click", function () {
    state.language = (state.language === "en") ? "zh" : "en";
    save();
    changeLanguage();
});

box.AddCountdownButton.addEventListener("click", function () {
    const inputDate = box.input.value;
    const eventName = box.eventName.value.trim();

    const lineColor = box.lineColorPicker.value;
    const bgColor = box.bgColorPicker.value;

    if (!inputDate && !eventName) {
        state.lastResult = "noDN";
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].noDN;
        return;
    }

    if (!inputDate) {
        state.lastResult = "noDate";
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].noDate;
        return;
    }

    if (!eventName) {
        state.lastResult = "noName";
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].noName;
        return;
    }

    const check = calculateDays(inputDate);
    if (check.totalDiff <= 0) {
        state.lastResult = "passed";
        box.result.style.color = "red";
        box.result.textContent = translate[state.language].passed;
        return;
    }

    state.items.push({
        name: eventName,
        date: inputDate,
        lineColor: lineColor,
        bgColor: bgColor,
        start: new Date().toISOString()
    });

    save();
    renderList();

    // 清空輸入框
    box.eventName.value = "";
    box.input.value = "";
    box.result.textContent = "";
});

animateResult();
changeLanguage();
setInterval(renderList, 1000);