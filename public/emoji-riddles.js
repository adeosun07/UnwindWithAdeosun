// public/js/emojiRiddle.js

// UI elements
const startBtn     = document.getElementById("start-btn");
const gameScreen   = document.getElementById("game-screen");
const startScreen  = document.getElementById("start-screen");
const emojiEl      = document.getElementById("emoji");
const answerEl     = document.getElementById("answer");
const submitBtn    = document.getElementById("submit-btn");
const scoreEl      = document.getElementById("score");
const timeEl       = document.getElementById("time");
const modal        = document.getElementById("result-popup");
const finalScoreEl = document.getElementById("final-score");
const finalMsgEl   = document.getElementById("final-message");
const restartBtn   = document.getElementById("restart-btn");

// Game state
let riddles = [];
let index = 0;
let score = 0;
let timeLeft = 60; // 2 minutes
let timerId = null;

// Sanitize: remove ALL spaces & special chars; keep only [A-Za-z0-9], lowercase
const clean = (s) => (s || "").toString().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

const formatTime = (t) => {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const startTimer = () => {
  timeEl.textContent = formatTime(timeLeft);
  timerId = setInterval(() => {
    timeLeft--;
    timeEl.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
};

const loadRiddle = () => {
  if (!riddles.length) return;
  // Loop through if we reach the end so the player can keep answering until time ends
  if (index >= riddles.length) index = 0;
  emojiEl.textContent = riddles[index].emoji;
  answerEl.value = "";
  answerEl.focus();
};

const submitAnswer = () => {
  // Evaluate silently; no feedback shown during play
  const user = clean(answerEl.value);
  const correct = clean(riddles[index].answer);
  if (user && user === correct) {
    score++;
    scoreEl.textContent = score;
  }
  index++;
  loadRiddle();
};

const endGame = () => {
  // Disable input during popup
  answerEl.disabled = true;
  submitBtn.disabled = true;

  finalScoreEl.textContent = score;

  // Messages per your exact ranges:
  // < 3
  // > 3 && < 5
  // > 5 && < 10
  // > 10
  // (3, 5, 10 fall to a neutral message)
  let msg = "You need help😭";
  if (score < 3) {
    msg = " at this point, you gotta rethink your life choices, cause wtf😐";
  } else if (score > 3 && score < 5) {
    msg = "I knew you were not that smart, but fairs, i'll allow";
  } else if (score > 5 && score < 10) {
    msg = "not bad, but try again let's see the real you";
  } else if (score > 10) {
    msg = "OG 💀 \n I hail oo";
  }
  finalMsgEl.textContent = msg;

  modal.classList.remove("hidden");
};

const restart = () => {
  // Reset state
  score = 0;
  index = 0;
  timeLeft = 60;
  scoreEl.textContent = "0";
  timeEl.textContent = formatTime(timeLeft);
  answerEl.disabled = false;
  submitBtn.disabled = false;
  modal.classList.add("hidden");
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};

// Event listeners
startBtn.addEventListener("click", async () => {
  // Fetch riddles then start timer and game
  try {
    const res = await axios.get("/emoji-riddle/api/riddles");
    riddles = res.data || [];
  } catch (e) {
    console.error("Failed to load riddles:", e);
    riddles = [];
  }

  // Show game UI
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  // Start timer & first riddle
  startTimer();
  loadRiddle();
});

submitBtn.addEventListener("click", submitAnswer);
answerEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});
restartBtn.addEventListener("click", restart);
