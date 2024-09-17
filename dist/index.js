"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let time = document.getElementById("time");
let submitAlarm = document.getElementById("submit");
let hourAlarm = document.getElementById("alarm-hour");
let minuteAlarm = document.getElementById("alarm-min");
let dateAlarm = document.getElementById("alarm-date");
let audioPlayer = document.querySelector(".audio-player");
let alertAlarm = document.querySelector(".alert");
let alarmsListContainer = document.getElementById("alarms-list");
let alarmHolders = document.querySelectorAll(".alarm-holder");
let arrayOfAlarmsDOM = Array.from(alarmHolders);
let alarmsList = [
    {
        alarmDate: `${"03"} : ${"30"} : ${"AM"}`,
        id: new Date(Date.now()).getTime(),
    },
];
let alarmsInStorege = window.localStorage.getItem("alarms-list");
if (alarmsInStorege) {
    alarmsList = JSON.parse(alarmsInStorege);
    createAlarmsDOM();
}
if (alarmsList.length == 0) {
    if (alarmsListContainer)
        alarmsListContainer.innerHTML = "There is no alarm.";
}
let files = document.getElementsByTagName("input")[0];
let file;
let fileURL;
files.addEventListener("change", (e) => {
    let target = e.target;
    if (target.files) {
        file = target.files[0];
    }
    fileURL = URL.createObjectURL(file);
});
let HOURS = "12";
let MINUTES = "22";
let SECONDS = "36";
let DATE = "AM";
function setCurrentValues() {
    let currentTime = new Date(Date.now());
    HOURS =
        currentTime.getHours() < 10
            ? `${"0" + currentTime.getHours()}`
            : currentTime.getHours() > 12
                ? `${currentTime.getHours() - 12}`
                : `${currentTime.getHours()}`;
    MINUTES =
        currentTime.getMinutes() < 10
            ? `${"0" + currentTime.getMinutes()}`
            : `${currentTime.getMinutes()}`;
    SECONDS =
        currentTime.getSeconds() < 10
            ? `${0 + currentTime.getSeconds()}`
            : `${currentTime.getSeconds()}`;
    DATE = currentTime.getHours() < 12 ? "AM" : "PM";
    if (time)
        time.innerHTML = `${HOURS}:${MINUTES}:${SECONDS} ${DATE}`;
}
let audio = document.getElementById("audioPlayer");
// Make Blob URL From Default Alarm Song
function makeBlobUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        let alarmSrc = audio.src;
        try {
            let respownse = yield fetch(alarmSrc);
            if (!respownse.ok)
                throw new Error("Failed To Fetch File ");
            let audioBlob = yield respownse.blob();
            let blobUrl = URL.createObjectURL(audioBlob);
            audio.src = blobUrl;
        }
        catch (_a) { }
    });
}
makeBlobUrl();
// Create URL Of File And Play It
function readyFile() {
    if (file) {
        if (file.type.startsWith("audio")) {
            audio.src = fileURL;
            audio.play();
        }
    }
    else {
        audio.play();
    }
}
submitAlarm === null || submitAlarm === void 0 ? void 0 : submitAlarm.addEventListener("click", () => {
    let alarmId = new Date(Date.now()).getTime();
    createNewAlarm(`${hourAlarm.value} : ${minuteAlarm.value} : ${dateAlarm.value.toUpperCase()}`, alarmId);
    if (alertAlarm) {
        alertAlarm.innerHTML = `We will alert you at the hour : ${hourAlarm.value}:${minuteAlarm.value}:${dateAlarm.value}`;
        alertAlarm.style.animation = "dropAlert 5s 0s 1 ease-in-out forwards";
        // setTimeout(() => {
        //   alertAlarm.style.animation = "none";
        // }, 3000);
    }
    // let equalChecker = setInterval(() => {
    //   if (
    //     HOURS == hourAlarm.value &&
    //     MINUTES == minuteAlarm.value &&
    //     DATE.toUpperCase() == dateAlarm.value.toUpperCase()
    //   ) {
    //     readyFile();
    //     if (audioPlayer) {
    //       audioPlayer.style.height = "fit-content";
    //       audioPlayer.style.opacity = "1";
    //     }
    //     return clearInterval(equalChecker);
    //   } else {
    //     if (audioPlayer) {
    //       audioPlayer.style.height = "0";
    //       audioPlayer.style.opacity = "0";
    //     }
    //     if (audio) audio.pause();
    //   }
    // }, 0);
});
// Set Currnet Time On Login Website
setCurrentValues();
hourAlarm.value = HOURS;
minuteAlarm.value = MINUTES;
dateAlarm.value = DATE.toLowerCase();
// Update Time Each All Second
setInterval(() => {
    setCurrentValues();
}, 1000);
function createNewAlarm(alarmDate, id) {
    let newAlarm = {
        alarmDate: alarmDate,
        id: id,
    };
    let equal = false;
    for (let i = 0; i < alarmsList.length; i++) {
        if (alarmsList[i].alarmDate == newAlarm.alarmDate) {
            equal = true;
        }
    }
    if (!equal) {
        alarmsList.push(newAlarm);
        window.localStorage.setItem("alarms-list", JSON.stringify(alarmsList));
        createAlarmsDOM();
    }
}
function createAlarmsDOM() {
    if (alarmsListContainer)
        alarmsListContainer.innerHTML = ``;
    alarmsList.forEach((e) => {
        let alarmHolder = document.createElement("div");
        alarmHolder.classList.add("alarm-holder", "d-flex", "align-items-center", "justify-content-between", "gap-4");
        alarmHolder.setAttribute("data-id", `${e.id}`);
        let alarmDate = document.createElement("p");
        alarmDate.classList.add("text-white", "fs-2");
        alarmDate.innerText = e.alarmDate;
        alarmHolder.appendChild(alarmDate);
        let alarmRemove = document.createElement("span");
        alarmRemove.classList.add("remove-alarm", "d-block", "position-relative");
        let clickLayer = document.createElement("span");
        clickLayer.classList.add("remove", "position-absolute", "w-100", "h-100");
        alarmRemove.appendChild(clickLayer);
        let iconLayer = document.createElement("i");
        iconLayer.classList.add("fa-solid", "fa-trash", "fs-3");
        alarmRemove.appendChild(iconLayer);
        alarmHolder.appendChild(alarmRemove);
        if (alarmsListContainer)
            alarmsListContainer.appendChild(alarmHolder);
        alarmHolders = document.querySelectorAll(".alarm-holder");
        arrayOfAlarmsDOM = Array.from(alarmHolders);
        arrayOfAlarmsDOM.forEach((ele) => {
            ele.addEventListener("click", (e) => checkDelete(e));
        });
    });
}
function checkDelete(e) {
    var _a;
    let target = e.target;
    let holder = (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
    let alarmId = holder.getAttribute("data-id");
    if (target.classList.contains("remove"))
        if (alarmId)
            deleteAlarm(alarmId);
    if ((alarmsListContainer === null || alarmsListContainer === void 0 ? void 0 : alarmsListContainer.innerHTML) == "")
        alarmsListContainer.innerHTML = "There is no alarm.";
}
function deleteFromStorege(id) {
    alarmsList = alarmsList.filter((e) => e.id != +id);
    localStorage.setItem("alarms-list", JSON.stringify(alarmsList));
}
function deleteAlarm(id) {
    deleteFromStorege(id);
    let removedElement = document.querySelector(`div[data-id="${id}"]`);
    removedElement === null || removedElement === void 0 ? void 0 : removedElement.remove();
}
alarmsListContainer === null || alarmsListContainer === void 0 ? void 0 : alarmsListContainer.addEventListener("click", () => alarmsListContainer === null || alarmsListContainer === void 0 ? void 0 : alarmsListContainer.classList.toggle("hidden"));
// Audio Player Controls
// Get references to the audio and controls
const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.getElementById("progress-bar");
const volumeControl = document.getElementById("volume-control");
const muteBtn = document.getElementById("mute-btn");
const audioMaxMinutes = document.getElementById("audio-max-min");
const audioMaxSecunds = document.getElementById("audio-max-sec");
const audioCurrnetMinutes = document.getElementById("audio-currnet-min");
const audioCurrnetSecunds = document.getElementById("audio-current-sec");
const audioSpeedSelecteElement = document.getElementById("speed");
const audioLoopBtn = document.getElementById("loop");
audioSpeedSelecteElement.addEventListener("change", () => {
    if (audio) {
        audio.playbackRate = +audioSpeedSelecteElement.value;
    }
});
audioLoopBtn === null || audioLoopBtn === void 0 ? void 0 : audioLoopBtn.addEventListener("click", () => {
    if (!audio.loop) {
        audio.loop = true;
        audioLoopBtn.style.position = "relative";
        audioLoopBtn.innerHTML = `<i style="position:relative; left:5%; top:60%; rotate:180deg; " class="fa-solid fa-arrow-rotate-left"></i><i style="position:relative;  " class="fa-solid fa-arrow-rotate-left"></i>`;
    }
    else {
        audio.loop = false;
        audioLoopBtn.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i>`;
    }
});
// Play/Pause the audio
function updatePlayerTimeValues() {
    let fullTime = audio.duration;
    if (!isNaN(fullTime)) {
        let maxMinutes = Math.floor(fullTime / 60);
        let maxSeconds = Math.floor(fullTime % 60);
        if (audioMaxMinutes)
            audioMaxMinutes.innerHTML = `${maxMinutes < 10 ? "0" + maxMinutes : maxMinutes}`;
        if (audioMaxSecunds)
            audioMaxSecunds.innerHTML = `${maxSeconds < 10 ? "0" + maxSeconds : maxSeconds}`;
    }
    setInterval(() => {
        let currentTime = audio.currentTime;
        let currentMinute = Math.floor(currentTime / 60);
        let currentSecund = Math.floor(currentTime % 60);
        if (audioCurrnetMinutes)
            audioCurrnetMinutes.innerText = `${currentMinute < 10 ? "0" + currentMinute : currentMinute}`;
        if (audioCurrnetSecunds)
            audioCurrnetSecunds.innerText = `${currentSecund < 10 ? "0" + currentSecund : currentSecund}`;
    }, 0);
}
playPauseBtn === null || playPauseBtn === void 0 ? void 0 : playPauseBtn.addEventListener("click", function () {
    if (audio.paused || audio.ended) {
        audio.play();
        if (playPauseBtn)
            playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
    else {
        audio.pause();
        playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
});
// Update progress bar as the audio plays
audio === null || audio === void 0 ? void 0 : audio.addEventListener("timeupdate", function () {
    const progressValue = (audio.currentTime / audio.duration) * 100;
    if (progressBar)
        progressBar.value = `${progressValue}`;
});
// Seek audio when progress bar is clicked
progressBar === null || progressBar === void 0 ? void 0 : progressBar.addEventListener("input", function () {
    const seekTime = (+progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    console.log(audio.currentTime % 60, audioCurrnetSecunds);
});
// Change volume control
volumeControl === null || volumeControl === void 0 ? void 0 : volumeControl.addEventListener("input", function () {
    audio.volume = +volumeControl.value / 100;
});
// Mute/Unmute audio
muteBtn === null || muteBtn === void 0 ? void 0 : muteBtn.addEventListener("click", function () {
    if (audio.muted) {
        audio.muted = false;
        if (muteBtn)
            muteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    }
    else {
        audio.muted = true;
        if (muteBtn)
            muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
});
audio === null || audio === void 0 ? void 0 : audio.addEventListener("play", () => {
    if (playPauseBtn)
        playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
});
audio === null || audio === void 0 ? void 0 : audio.addEventListener("loadedmetadata", () => {
    updatePlayerTimeValues();
});
