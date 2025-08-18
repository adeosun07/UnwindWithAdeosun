const startBtn = document.getElementById("start-btn");
const gameArea = document.getElementById("game-area");
const computerImg = document.getElementById("computer-choice-img");
const resultDiv = document.getElementById("result");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const resetBtn = document.getElementById("reset-btn");

const images = {
  rock: "/images/rock.jpg",
  paper: "/images/paper.jpg",
  scissors: "/images/scissors.jpg"
};
let shuffleInterval;
let playerScore = 0;
let computerScore = 0;
let roundsPlayed = 0;
const maxRounds = 5;
let gameOver = false;

startBtn.addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  gameArea.classList.remove("hidden");
  startShuffle();
});

function startShuffle() {
  const choices = Object.keys(images);
  let index = 0;
  shuffleInterval = setInterval(() => {
    computerImg.src = images[choices[index]];
    index = (index + 1) % choices.length;
  }, 200);
}

document.querySelectorAll(".player-choice").forEach(button => {
  button.addEventListener("click", () => {
    if (gameOver) return; 

    clearInterval(shuffleInterval);

    const playerChoice = button.dataset.choice;
    const compChoices = Object.keys(images);
    const computerChoice = compChoices[Math.floor(Math.random() * compChoices.length)];

    computerImg.src = images[computerChoice];
    let result;
    if (playerChoice === computerChoice) {
      result = "It's a Tie!";
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      result = "You Win this round!";
      playerScore++;
      playerScoreEl.textContent = playerScore;
    } else {
      result = "Computer Wins this round!";
      computerScore++;
      computerScoreEl.textContent = computerScore;
    }
    roundsPlayed++;
    resultDiv.textContent = `${result} (Round ${roundsPlayed}/${maxRounds})`;

    if (roundsPlayed >= maxRounds) {
      gameOver = true;

      let finalMessage;
      if (playerScore > computerScore) {
        finalMessage = `🎉 You are the Winner! Final Score: ${playerScore} - ${computerScore}`;
        saveScore(playerScore); 
      } else if (computerScore > playerScore) {
        finalMessage = `Do better. Lol. Final Score: ${computerScore} - ${playerScore}`;
      } else {
        finalMessage = `🤝 It's a Tie! Final Score: ${playerScore} - ${computerScore}`;
      }

      resultDiv.textContent = finalMessage;
    } else {
      setTimeout(startShuffle, 1000);
    }
  });
  async function saveScore(points) {
    try {
      const response = await fetch("/scores/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "rps",
          points: points,
        }),
      });

      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  }
});

resetBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  roundsPlayed = 0;
  gameOver = false;
  playerScoreEl.textContent = 0;
  computerScoreEl.textContent = 0;
  resultDiv.textContent = "Make your move!";
  startShuffle();
});
