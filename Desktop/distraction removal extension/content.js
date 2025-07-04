console.log("Distraction Killer content script loaded!");
const pageText = document.body.innerText.slice(0, 3000);  // Take first 3000 characters
chrome.runtime.sendMessage({action: "analyzeContent", content: pageText});

// Motivational quotes array
const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Dream big and dare to fail. – Norman Vaughan",
  "Don't let yesterday take up too much of today. – Will Rogers"
];

// Emoji array
const funEmojis = [
  "😎", "🚀", "🦄", "🐱‍👤", "🎉", "🤩", "🦸‍♂️", "🌈", "🔥", "🍕", "🥳", "💡", "🧠", "💪", "🎯", "🦋", "🧸", "🦊", "🐧", "🐼", "🦁"
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

function getRandomEmoji() {
  return funEmojis[Math.floor(Math.random() * funEmojis.length)];
}

// Helper to show the modal (so we can call it again after break)
function showDistractionModal() {
  // Prevent multiple overlays
  if (document.getElementById("distraction-warning-overlay")) return;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "distraction-warning-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.7)";
  overlay.style.zIndex = 999999;
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  // Modal content
  const modal = document.createElement("div");
  modal.style.background = "#fff";
  modal.style.padding = "32px 24px";
  modal.style.borderRadius = "16px";
  modal.style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)";
  modal.style.textAlign = "center";
  modal.style.maxWidth = "90vw";
  modal.style.minWidth = "320px";
  modal.style.fontFamily = "Arial, sans-serif";

  // Get a random quote
  const quote = getRandomQuote();
  // Get a random emoji
  const emoji = getRandomEmoji();

  // Timer HTML
  const timerHTML = `
    <div id="pomodoro-timer" style="margin-bottom:8px;font-size:1.3em;color:#333;display:none;">25:00</div>
    <div id="pomodoro-progress-container" style="width: 100%; max-width: 260px; height: 10px; background: #eee; border-radius: 5px; margin: 0 auto 18px auto; display: none; overflow: hidden;">
      <div id="pomodoro-progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #0275d8, #5cb85c); border-radius: 5px; transition: width 1s linear;"></div>
    </div>
    <div style="display:flex;justify-content:center;gap:16px;margin-bottom:18px;">
      <button id="start-focus" style="
        min-width: 120px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0275d8;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 600;
        line-height: 1;
        padding: 0 18px;
        transition: background 0.2s, transform 0.1s;
        outline: none;
        letter-spacing: 0.5px;
        box-sizing: border-box;
      ">Start Focus</button>
      <button id="start-break" style="
        min-width: 120px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0ad4e;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 600;
        line-height: 1;
        padding: 0 18px;
        transition: background 0.2s, transform 0.1s;
        outline: none;
        letter-spacing: 0.5px;
        box-sizing: border-box;
      ">Start Break</button>
    </div>
  `;

  modal.innerHTML = `
    <h2 style='color:#d9534f;margin-bottom:16px;font-size:1.5em;display:flex;align-items:center;justify-content:center;gap:8px;'>
      <span style="font-size:1.7em;">${emoji}</span> Distraction Alert!
    </h2>
    <p style='margin-bottom:18px;font-size:1.1em;color:#333;'>This site may be distracting. What would you like to do?</p>
    <blockquote style="margin:0 0 24px 0;padding:12px 18px;background:#f5f5f5;border-left:4px solid #d9534f;border-radius:6px;font-style:italic;color:#444;">${quote}</blockquote>
    ${timerHTML}
    <div style="display:flex;justify-content:center;gap:24px;">
      <button id="dw-close-tab" style="
        min-width: 140px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #d9534f;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.08em;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: background 0.2s, transform 0.1s;
        outline: none;
        letter-spacing: 0.5px;
        line-height: 1.2;
        padding: 0 24px;
      ">Take a Break</button>
      <button id="dw-stay-here" style="
        min-width: 140px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #5cb85c;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.08em;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: background 0.2s, transform 0.1s;
        outline: none;
        letter-spacing: 0.5px;
        line-height: 1.2;
        padding: 0 24px;
      ">Stay Here</button>
    </div>
    <style>
      #dw-close-tab:hover { background: #c9302c !important; transform: translateY(-2px) scale(1.04);}
      #dw-stay-here:hover { background: #449d44 !important; transform: translateY(-2px) scale(1.04);}
      #dw-close-tab:active, #dw-stay-here:active { transform: scale(0.98);}
    </style>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Pomodoro timer logic
  let timerInterval = null;
  let timerSeconds = 0;
  const timerDisplay = document.getElementById("pomodoro-timer");
  const progressContainer = document.getElementById("pomodoro-progress-container");
  const progressBar = document.getElementById("pomodoro-progress-bar");
  const startFocusBtn = document.getElementById("start-focus");
  const startBreakBtn = document.getElementById("start-break");
  let totalSessionSeconds = 0;

  function updateTimerDisplay() {
    const min = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const sec = String(timerSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
  }

  function updateProgressBar() {
    if (totalSessionSeconds > 0) {
      const percent = 100 * (1 - timerSeconds / totalSessionSeconds);
      progressBar.style.width = percent + "%";
    }
  }

  function startTimer(seconds, label) {
    if (timerInterval) clearInterval(timerInterval);
    timerSeconds = seconds;
    totalSessionSeconds = seconds;
    timerDisplay.style.display = "block";
    if (label === "Focus") {
      progressContainer.style.display = "block";
      progressBar.style.width = "0%";
    } else {
      progressContainer.style.display = "none";
      progressBar.style.width = "0%";
    }
    updateTimerDisplay();
    updateProgressBar();
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (label === "Focus") updateProgressBar();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = label + " finished!";
        progressBar.style.width = "100%";
      }
    }, 1000);
  }

  startFocusBtn.onclick = () => startTimer(25 * 60, "Focus");
  startBreakBtn.onclick = () => {
    // Close modal and re-show after 5 minutes
    overlay.remove();
    if (timerInterval) clearInterval(timerInterval);
    setTimeout(() => {
      showDistractionModal();
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Button actions
  document.getElementById("dw-close-tab").onclick = () => {
    launchConfetti();
    setTimeout(() => {
      chrome.runtime.sendMessage({action: "closeTab"});
    }, 1500); // Wait for confetti to finish
  };
  document.getElementById("dw-stay-here").onclick = () => {
    overlay.remove();
    if (timerInterval) clearInterval(timerInterval);
  };
}

// Listen for messages from background.js to show a warning overlay
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showWarning") {
    showDistractionModal();
  }
});

// Confetti animation function
function launchConfetti() {
  // Prevent multiple confetti canvases
  if (document.getElementById('dw-confetti-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'dw-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 1000000;
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  // Confetti parameters
  const confettiCount = 120;
  const confettiColors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#4caf50', '#ffeb3b', '#ff9800'];
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 6 + Math.random() * 6,
      d: 2 + Math.random() * 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    });
  }

  let angle = 0;
  let animationFrame;
  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) / 2;
      c.x += Math.sin(angle);
      c.tiltAngle += c.tiltAngleIncremental;
      c.tilt = Math.sin(c.tiltAngle) * 15;
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
      ctx.stroke();
    }
    animationFrame = requestAnimationFrame(drawConfetti);
  }
  drawConfetti();

  // Remove confetti after 1.5 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    canvas.remove();
  }, 1500);
}
