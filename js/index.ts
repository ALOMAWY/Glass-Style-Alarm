let time = document.getElementById("time");

let submitAlarm = document.getElementById("submit");

let hourAlarm = document.getElementById("alarm-hour") as HTMLSelectElement;

let minuteAlarm = document.getElementById("alarm-min") as HTMLSelectElement;

let dateAlarm = document.getElementById("alarm-date") as HTMLSelectElement;

let files = document.getElementsByTagName("input")[0];

let file: File;

interface File {
  type: string;
}

let fileURL: string;

files.addEventListener("change", (e) => {
  let target = e.target as HTMLInputElement;

  if (target.files) {
    file = target.files[0];
  }

  fileURL = URL.createObjectURL(file);
});

let HOURS: string = "12";

let MINUTES: string = "22";

let SECONDS: string = "36";

let DATE: string = "AM";

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

  if (time) time.innerHTML = `${HOURS}:${MINUTES}:${SECONDS} ${DATE}`;
}

let audio = document.getElementById("audioPlayer") as HTMLAudioElement;

// Make Blob URL From Default Alarm Song

async function makeBlobUrl() {
  let alarmSrc = audio.src;

  try {
    let respownse = await fetch(alarmSrc);

    console.log(respownse);

    if (!respownse.ok) throw new Error("Failed To Fetch File ");

    let audioBlob = await respownse.blob();

    let blobUrl = URL.createObjectURL(audioBlob);

    audio.src = blobUrl;
  } catch {}
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
}

submitAlarm?.addEventListener("click", () => {
  let equalChecker = setInterval(() => {
    if (
      HOURS == hourAlarm.value &&
      MINUTES == minuteAlarm.value &&
      DATE.toUpperCase() == dateAlarm.value.toUpperCase()
    ) {
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

const progressBar = document.getElementById("progress-bar") as HTMLInputElement;

const volumeControl = document.getElementById(
  "volume-control"
) as HTMLInputElement;

const muteBtn = document.getElementById("mute-btn");

const audioMaxMinutes = document.getElementById("audio-max-min");

const audioMaxSecunds = document.getElementById("audio-max-sec");

const audioCurrnetMinutes = document.getElementById("audio-currnet-min");

const audioCurrnetSecunds = document.getElementById("audio-current-sec");

// Play/Pause the audio

function updatePlayerTimeValues() {
  let fullTime = audio.duration;

  if (!isNaN(fullTime)) {
    let maxMinutes = Math.floor(fullTime / 60);

    let maxSeconds = Math.floor(fullTime % 60);
    if (audioMaxMinutes)
      audioMaxMinutes.innerHTML = `${
        maxMinutes < 10 ? "0" + maxMinutes : maxMinutes
      }`;

    if (audioMaxSecunds)
      audioMaxSecunds.innerHTML = `${
        maxSeconds < 10 ? "0" + maxSeconds : maxSeconds
      }`;
  }

  setInterval(() => {
    let currentTime = audio.currentTime;

    let currentMinute = Math.floor(currentTime / 60);

    let currentSecund = Math.floor(currentTime % 60);
    if (audioCurrnetMinutes)
      audioCurrnetMinutes.innerText = `${
        currentMinute < 10 ? "0" + currentMinute : currentMinute
      }`;
    if (audioCurrnetSecunds)
      audioCurrnetSecunds.innerText = `${
        currentSecund < 10 ? "0" + currentSecund : currentSecund
      }`;
  }, 0);
}

playPauseBtn?.addEventListener("click", function () {
  if (audio.paused || audio.ended) {
    audio.play();
    if (playPauseBtn)
      playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  } else {
    audio.pause();
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  }
});

// Update progress bar as the audio plays
audio?.addEventListener("timeupdate", function () {
  const progressValue = (audio.currentTime / audio.duration) * 100;
  if (progressBar) progressBar.value = `${progressValue}`;
});

// Seek audio when progress bar is clicked
progressBar?.addEventListener("input", function () {
  const seekTime = (+progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;

  console.log(audio.currentTime % 60, audioCurrnetSecunds);
});

// Change volume control
volumeControl?.addEventListener("input", function () {
  audio.volume = +volumeControl.value / 100;
});

// Mute/Unmute audio
muteBtn?.addEventListener("click", function () {
  if (audio.muted) {
    audio.muted = false;
    if (muteBtn) muteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
  } else {
    audio.muted = true;
    if (muteBtn) muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
  }
});

audio?.addEventListener("play", () => {
  if (playPauseBtn)
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
});

audio?.addEventListener("loadedmetadata", () => {
  updatePlayerTimeValues();
});
