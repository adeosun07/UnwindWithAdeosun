import axios from "axios";

let jokeCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; 

async function fetchJokesFromAPI() {
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,explicit&amount=10");
    return response.data.jokes || [];
  } catch (error) {
    console.error("Error fetching jokes:", error);
    return [];
  }
}

export const getJoke = async (req, res) => {
  const now = Date.now();


  if (jokeCache.length === 0 || now - lastFetchTime > CACHE_DURATION) {
    jokeCache = await fetchJokesFromAPI();
    lastFetchTime = now;
  }

  const joke = jokeCache.shift();

  if (!joke) {
    return res.status(503).json({ error: "No jokes available at the moment." });
  }

  if (joke.type === "single") {
    res.json({ type: "single", joke: joke.joke });
  } else if (joke.type === "twopart") {
    res.json({ type: "twopart", setup: joke.setup, delivery: joke.delivery });
  }
};

export const renderJoke = (req, res) => {
  res.render("jokes");
};
