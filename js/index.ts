let time = document.getElementById("time");

let HOURS: string = "12";

let MINUTES: string = "22";

let SECONDS: string = "36";

let DATE: string = "AM";

let hourAlarm = document.getElementById("alarm-hour") as HTMLSelectElement;

let minuteAlarm = document.getElementById("alarm-min") as HTMLSelectElement;

let dateAlarm = document.getElementById("alarm-date") as HTMLSelectElement;

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
      ? `${"0" + currentTime.getSeconds()}`
      : `${currentTime.getSeconds()}`;

  DATE = currentTime.getHours() < 12 ? "AM" : "PM";

  if (time) time.innerHTML = `${HOURS} : ${MINUTES} : ${SECONDS} ${DATE}`;
}

// Update Time Each All Second
setInterval(() => {
  setCurrentValues();
}, 1000);

let submitAlarm = document.getElementById("submit");

let audioPlayer = document.querySelector(".audio-player") as HTMLElement | null;

let alertAlarm = document.querySelector(".alert") as HTMLElement;

let alarmsListContainer = document.getElementById("alarms-list");

let alarmHolders = document.querySelectorAll(".alarm-holder");

let arrayOfAlarmsDOM = Array.from(alarmHolders);

let cancelAlarm = document.getElementById("cancel-alarm");

let snoozeAlarm = document.getElementById("snooze-alarm");

let audio = document.getElementById("audioPlayer") as HTMLAudioElement;

let addAlarmBtn = document.getElementById("add-alarm");

let addAlarmPopup = document.querySelector(".add-alarm-control");

let removeAlarmsBtn = document.getElementById("remove-alarms");

let arrayOfCloseBtns = Array.from(document.querySelectorAll(".close-popup"));

window.addEventListener("load", () => {
  // Start Check Alarms
  alarmCheck();

  // Set Currnet Time On Login Website
  setCurrentValues();

  hourAlarm.value = HOURS;

  minuteAlarm.value = MINUTES;

  dateAlarm.value = DATE.toLowerCase();

  // Make Blob URL From Default Audio SONG
  makeBlobUrl();
});

// Make Blob URL From Default Alarm Song

async function makeBlobUrl() {
  let alarmSrc = audio.src;

  try {
    let respownse = await fetch(alarmSrc);

    if (!respownse.ok) throw new Error("Failed To Fetch File ");

    let audioBlob = await respownse.blob();

    let blobUrl = URL.createObjectURL(audioBlob);

    audio.src = blobUrl;
  } catch {}
}

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
} else {
  createAlarmsDOM();
}

if (alarmsList.length == 0) {
  if (alarmsListContainer) alarmsListContainer.innerHTML = "There is no alarm.";
}

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

  localStorage.setItem("file", JSON.stringify(file));
  console.log(file);

  fileURL = URL.createObjectURL(file);
});

// Create URL Of File And Play It

// Create Alarm Player And Actions
function playAlarm() {
  resetAudio();
  if (file) {
    if (file.type.startsWith("audio")) if (fileURL) audio.src = fileURL;
    audio
      .play()
      .then(() => {
        if (audioPlayer) audioPlayer.classList.remove("hidden");
      })
      .catch(() => {
        if (audioPlayer) audioPlayer.classList.add("hidden");
      });
  } else {
    audio
      .play()
      .then(() => {
        if (audioPlayer) audioPlayer.classList.remove("hidden");
      })
      .catch(() => {
        if (audioPlayer) audioPlayer.classList.add("hidden");
      });
  }
}

function resetAudio() {
  audio.currentTime = 0;

  audio.volume = 1;
}

// Check If There Alarm Or Not Status
let checking = true;

// Check Second Per Second For Alarms
function alarmCheck() {
  checking = true;

  let checker = setInterval(() => {
    let currnetDate = `${HOURS} : ${MINUTES} : ${DATE}`;
    alarmsList.forEach((e) => {
      if (e.alarmDate == currnetDate) {
        console.log(e.alarmDate);
        console.log(currnetDate);
        playAlarm();

        clearInterval(checker);

        // Diseble Checking Alarms Holder

        checking = false;
      }
    });
  }, 1000);
}

submitAlarm?.addEventListener("click", () => {
  let alarmId = new Date(Date.now()).getTime();
  createNewAlarm(
    `${hourAlarm.value} : ${
      minuteAlarm.value
    } : ${dateAlarm.value.toUpperCase()}`,
    alarmId
  );

  if (alertAlarm) {
    alertAlarm.innerHTML = `We will alert you at the hour : ${hourAlarm.value}:${minuteAlarm.value}:${dateAlarm.value}`;
    alertAlarm.style.animation = "dropAlert 5s 0s 1 ease-in-out forwards";

    setTimeout(() => {
      alertAlarm.style.animation = "none";
    }, 3000);
  }
});

function createNewAlarm(alarmDate: string, id: number) {
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
  if (alarmsListContainer) alarmsListContainer.innerHTML = ``;
  alarmsList.forEach((e) => {
    let alarmHolder = document.createElement("div");

    alarmHolder.classList.add(
      "alarm-holder",
      "d-flex",
      "align-items-center",
      "justify-content-evenly",
      "w-100"
    );

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

    if (alarmsListContainer) alarmsListContainer.appendChild(alarmHolder);

    alarmHolders = document.querySelectorAll(".alarm-holder");

    arrayOfAlarmsDOM = Array.from(alarmHolders);

    arrayOfAlarmsDOM.forEach((ele) => {
      ele.addEventListener("click", (e) => checkDelete(e));
    });
  });
}

function checkDelete(e: Event) {
  let target = e.target as HTMLDivElement;

  let holder = target.parentNode?.parentNode as HTMLElement;

  let alarmId = holder.getAttribute("data-id");

  if (target.classList.contains("remove")) if (alarmId) deleteAlarm(alarmId);

  if (alarmsListContainer?.innerHTML == "")
    alarmsListContainer.innerHTML = "There is no alarm.";
}

function deleteFromStorege(id: string) {
  alarmsList = alarmsList.filter((e) => e.id != +id);

  localStorage.setItem("alarms-list", JSON.stringify(alarmsList));
}

function deleteAlarm(id: string): void {
  deleteFromStorege(id);
  let removedElement = document.querySelector(`div[data-id="${id}"]`);
  removedElement?.remove();
}

alarmsListContainer?.addEventListener("click", () =>
  alarmsListContainer?.classList.toggle("hidden")
);

// Audio Player Controls

// Play/Pause the audio

// Close The Audio Player And Pause Audio
function closeAudioPlayer() {
  audio.pause();

  if (audioPlayer) {
    audioPlayer.classList.add("hidden");
  }
}

// Update progress bar as the audio plays

// Seek audio when progress bar is clicked

addAlarmBtn?.addEventListener("click", () => {
  console.log("clicked");
  addAlarmPopup?.classList.toggle("hidden");
});

removeAlarmsBtn?.addEventListener("click", () => {
  alarmsList = [];

  localStorage.setItem("alarms-list", JSON.stringify(alarmsList));

  if (alarmsListContainer) alarmsListContainer.innerHTML = "There is no alarm.";
});

arrayOfCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.nodeName.toLowerCase() == "div")
      btn.parentElement?.classList.add("hidden");
  });
});

snoozeAlarm?.addEventListener("click", () => {
  closeAudioPlayer();

  let excludeSeconds: number = 60 - +SECONDS;

  setTimeout(() => {
    alarmCheck();
  }, excludeSeconds * 1000);

  let tenMinutesWithMilleSeconds = 10 * 60000;

  setTimeout(() => {
    playAlarm();
  }, tenMinutesWithMilleSeconds);
});

cancelAlarm?.addEventListener("click", () => {
  closeAudioPlayer();

  let excludeSeconds: number = 60 - +SECONDS;

  setTimeout(() => {
    alarmCheck();
  }, excludeSeconds * 1000);
});
