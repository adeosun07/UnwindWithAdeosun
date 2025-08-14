async function fetchJoke() {
  try {
    const res = await fetch("/joke/next");
    const data = await res.json();

    const jokeText = document.getElementById("joke-text");

    if (data.type === "single") {
      jokeText.textContent = data.joke;
    } else if (data.type === "twopart") {
      jokeText.textContent = `${data.setup} — ${data.delivery}`;
    }
  } catch (error) {
    console.error("Error fetching joke:", error);
  }
}

document.getElementById("next-btn").addEventListener("click", fetchJoke);

// Load first joke
fetchJoke();
