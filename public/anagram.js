const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const scrambledWord = document.getElementById("scrambled-word");
const wordHint = document.getElementById("word-hint");
const submitBtn = document.getElementById("submit-btn");
const guessInput = document.getElementById("guess");
const feedback = document.getElementById("feedback");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const popup = document.getElementById("popup");
const finalScoreEl = document.getElementById("final-score");

let correctWord = "";
let timer = 180; 
let countdown;
let score = 0;

startBtn.addEventListener("click", async () => {
  document.getElementById("start-screen").classList.add("hidden");
  gameArea.classList.remove("hidden");
  score = 0;
  scoreDisplay.textContent = score;
  await loadWord();
  startTimer();
});


async function loadWord() {
  const res = await fetch("/word-anagram/api/anagram");
  const data = await res.json();
  scrambledWord.textContent = data.scrambled;
  wordHint.textContent = data.meaning;
  correctWord = data.word;
  guessInput.value = "";
  feedback.textContent = "";
}


function startTimer() {
  updateTimerDisplay();
  countdown = setInterval(() => {
  timer--;
  updateTimerDisplay();
    if (timer <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}
function updateTimerDisplay() {
  let minutes = Math.floor(timer / 60);
  let seconds = timer % 60;
  timerDisplay.innerText = `⏳ Time Left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function endGame() {
  submitBtn.disabled = true;
  guessInput.disabled = true;
  let msg = "You need help😭";
  
  if (score < 3) {
    msg = " at this point, you gotta rethink your life choices, cause wtf😐";
  } else if (score > 3 && score < 5) {
    msg = "I knew you were not that smart, but fairs, i'll allow";
  } else if (score >= 5 && score < 10) {
    msg = "not bad, but try again let's see the real you";
  } else if (score > 10) {
    msg = "OG 💀 <br> I hail oo";
  }
  finalScoreEl.innerHTML = `Your Final Score: ${score} <br> ${msg}`;
  popup.classList.remove("hidden");
  saveScore(score);
}
async function saveScore(points) {
  try {
    const response = await fetch("/scores/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: "quiz",
        points: points,
      }),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

const clean = (s) =>
  (s || "")
    .toString()
    .replace(/\s+/g, "") // remove all whitespace
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-alphanumeric
    .toLowerCase();
    
function submitGuess() {
  if (clean(guessInput) === clean(correctWord)) {
    score++;
    scoreDisplay.textContent = score;
    feedback.textContent = "Correct! 🎉";
  } else {
    feedback.textContent = `😜 Wrong! The word was: ${correctWord}`;
  }

  setTimeout(() => {
    loadWord();
  }, 1000);
}

submitBtn.addEventListener("click", submitGuess);

guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitGuess();
  }
});
