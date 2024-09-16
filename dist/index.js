"use strict";
let time = document.getElementById("time");
let submitAlarm = document.getElementById("submit");
let hourAlarm = document.getElementById("alarm-hour");
let minuteAlarm = document.getElementById("alarm-min");
let dateAlarm = document.getElementById("alarm-date");
let files = document.getElementsByTagName("input")[0];
let file;
let fileURL;
files.addEventListener("change", (e) => {
    file = e.target.files[0];
    console.log(file);
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
let video = document.getElementById("videoPlayer");
let audio = document.getElementById("audioPlayer");
// Create URL Of File And Play It
function readyFile() {
    if (file) {
        if (file.type.startsWith("audio")) {
            audio.src = fileURL;
            audio.play();
        }
        else if (file.type.startsWith("video")) {
            video.src = fileURL;
            video.play();
        }
    }
}
submitAlarm === null || submitAlarm === void 0 ? void 0 : submitAlarm.addEventListener("click", () => {
    let equalChecker = setInterval(() => {
        if (HOURS == hourAlarm.value &&
            MINUTES == minuteAlarm.value &&
            DATE.toUpperCase() == dateAlarm.value.toUpperCase()) {
            readyFile();
            return clearInterval(equalChecker);
        }
    }, 0);
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
// Play/Pause the audio
function updatePlayerTimeValues() {
    let fullTime = audio.duration;
    let maxMinutes = Math.floor(fullTime / 60);
    let maxSeconds = Math.floor(fullTime % 60);
    if (audioMaxMinutes)
        audioMaxMinutes.innerHTML = `${maxMinutes < 10 ? "0" + maxMinutes : maxMinutes}`;
    if (audioMaxSecunds)
        audioMaxSecunds.innerHTML = `${maxSeconds < 10 ? "0" + maxSeconds : maxSeconds}`;
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
        updatePlayerTimeValues();
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
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    console.log(audio.currentTime % 60, audioCurrnetSecunds);
});
// Change volume control
volumeControl === null || volumeControl === void 0 ? void 0 : volumeControl.addEventListener("input", function () {
    audio.volume = volumeControl.value / 100;
});
// Mute/Unmute audio
muteBtn === null || muteBtn === void 0 ? void 0 : muteBtn.addEventListener("click", function () {
    if (audio.muted) {
        audio.muted = false;
        muteBtn === null || muteBtn === void 0 ? void 0 : muteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
    }
    else {
        audio.muted = true;
        muteBtn === null || muteBtn === void 0 ? void 0 : muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
    }
});
audio === null || audio === void 0 ? void 0 : audio.addEventListener("play", () => {
    if (playPauseBtn)
        playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
});
