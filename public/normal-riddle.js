const startBtn     = document.getElementById("start-btn");
const gameScreen   = document.getElementById("game-screen");
const startScreen  = document.getElementById("start-screen");
const emojiEl      = document.getElementById("emoji");
const optionsDiv   = document.getElementById("options");
const submitBtn    = document.getElementById("submit-btn");
const scoreEl      = document.getElementById("score");
const timeEl       = document.getElementById("time");
const modal        = document.getElementById("result-popup");
const finalScoreEl = document.getElementById("final-score");
const finalMsgEl   = document.getElementById("final-message");
const restartBtn   = document.getElementById("restart-btn");

let riddles = [];
let index = 0;
let score = 0;
let timeLeft = 120; 
let timerId = null;


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
  if (index >= riddles.length) index = 0;

  const current = riddles[index];
  emojiEl.innerHTML = current.question;
  optionsDiv.innerHTML = "";

  current.options.forEach((opt, i) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="radio" name="answer" value="${opt}" required>
      ${opt}
    `;
    optionsDiv.appendChild(label);
    optionsDiv.appendChild(document.createElement("br"));
  });
};

const submitAnswer = () => {
  const selected = document.querySelector("input[name='answer']:checked");
  if (!selected) return; 

  const user = clean(selected.value);
  const correct = clean(riddles[index].correct_answer);

  if (user === correct) {
    score++;
    scoreEl.textContent = score;
  }

  index++;
  loadRiddle();
};

const endGame = () => {
  optionsDiv.querySelectorAll("input").forEach(i => (i.disabled = true));
  submitBtn.disabled = true;

  finalScoreEl.textContent = score;

  let msg = "You need help😭";
  if (score < 3) {
    msg = " at this point, you gotta rethink your life choices, cause wtf😐";
  } else if (score > 3 && score < 5) {
    msg = "I knew you were not that smart, but fairs, i'll allow";
  } else if (score > 5 && score < 10) {
    msg = "not bad, but try again let's see the real you";
  } else if (score > 10) {
    msg = "OG 💀 <br> I hail oo";
  }
  finalMsgEl.innerHTML = msg;

  modal.classList.remove("hidden");
  saveScore(score);
};
async function saveScore(points) {
  try {
    const response = await fetch("/scores/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game: "normal_riddle",
        points: points,
      }),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error saving score:", error);
  }
}

const restart = () => {
  score = 0;
  index = 0;
  timeLeft = 60;
  scoreEl.textContent = "0";
  timeEl.textContent = formatTime(timeLeft);
  optionsDiv.disabled = false;
  submitBtn.disabled = false;
  modal.classList.add("hidden");
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
};


startBtn.addEventListener("click", async () => {
  try {
    const res = await axios.get("/normal-riddle/api/riddles");
    const response = res.data || [];

    riddles = (response.results || []).map(r => {
      const options = [...r.incorrect_answers, r.correct_answer];

      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        question: r.question,
        correct_answer: r.correct_answer,
        options
      };
    });

    console.log("Riddles loaded:", riddles);
  } catch (e) {
    console.error("Failed to load riddles:", e);
    riddles = [];
  }
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  startTimer();
  loadRiddle();
});


submitBtn.addEventListener("click", submitAnswer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});
restartBtn.addEventListener("click", restart);
