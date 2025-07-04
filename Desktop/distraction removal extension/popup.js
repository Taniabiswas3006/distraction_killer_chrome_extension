const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

let timeLeft = FOCUS_TIME;
let isFocus = true;
let timer;

const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const dingSound = document.getElementById("here-i-am-449");

function playDingSound() {
  dingSound.currentTime = 0;
  dingSound.play().catch(err => {
    console.warn("Ding failed to play:", err);
  });
}

function updateUI() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  statusDisplay.textContent = isFocus ? "Focus Time" : "Break Time";
}

function startTimer() {
  playDingSound(); // 🔔 Play ding at start of session
  updateUI();
  timer = setInterval(() => {
    timeLeft--;
    updateUI();

    if (timeLeft <= 0) {
      clearInterval(timer);
      playDingSound(); // 🔔 Play ding at end

      isFocus = !isFocus;
      timeLeft = isFocus ? FOCUS_TIME : BREAK_TIME;
      updateUI();
      startTimer();
    }
  }, 1000);
}

// Start button triggers everything
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  timeLeft = FOCUS_TIME;
  isFocus = true;
  startTimer();
});

// Close/Stay buttons
document.getElementById("closeTab").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.remove(tabs[0].id);
  });
});

document.getElementById("stayHere").addEventListener("click", () => {
  window.close();
});

