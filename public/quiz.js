let questions = [];
let currentIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 120;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
});

async function startGame() {
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("score").style.display = "block";
  await fetchQuestions();
  showQuestion();
  startTimer();
}

async function fetchQuestions() {
  const res = await fetch("/quiz/questions");
  questions = await res.json();
}

function showQuestion() {
  const q = questions[currentIndex];
  document.getElementById("answers").innerHTML = "";
  document.getElementById("next-btn").disabled = true;
  document.getElementById("question").innerHTML = decodeHtml(q.question);
  const answers = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(answers);

  answers.forEach(answer => {
    const li = document.createElement("li");
    li.innerHTML = decodeHtml(answer);
    li.addEventListener("click", () => selectAnswer(li, answer, q.correct_answer));
    document.getElementById("answers").appendChild(li);
  });
}

function selectAnswer(li, selected, correct) {
  const options = document.querySelectorAll("#answers li");
  options.forEach(opt => opt.style.pointerEvents = "none");
  if (selected === correct) {
    li.style.backgroundColor = "green";
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
  } else {
    li.style.backgroundColor = "red";
  }

  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  document.getElementById("timer").innerText = `⏳ Time Left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function endGame(byTimer = false) {
  clearInterval(timerInterval);
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("score").style.display = "none";
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  document.getElementById("final-score").innerText = `Your Score: ${score}`;
  let message = "";

  if (score < 3) {
    message = "please just go and read jokes man 😭";
  } else if (score >= 3 && score < 5) {
    message = "Not bad, but you need help. Lol";
  } else if (score >= 5 && score < 10) {
    message = "Hmm what can I say? Try again let's see";
  } else if (score >= 10) {
    message = "Original Gangster! 🥶";
  }

  if (byTimer) {
    popup.querySelector("h2").innerText = "⏰ Time’s Up!";
  } else {
    popup.querySelector("h2").innerText = "Quiz Finished!";
  }

  const feedback = document.createElement("p");
  feedback.innerText = message;
  document.getElementById("final-score").appendChild(feedback);
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

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
