import express from "express";
import axios from "axios";

const router = express.Router();

function scramble(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}
async function getWordWithDefinition(maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const randomRes = await axios.get("https://random-word-api.herokuapp.com/word");
      const word = randomRes.data[0];
      if (word.length < 3) continue;
      const dictRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const meaning = dictRes.data[0].meanings[0].definitions[0].definition;
      return { word, meaning };
    } catch (err) {
      console.log(`Retry ${attempt + 1}: Failed for word, trying again...`);
    }
  }
  return null;
}

router.get("/api/anagram", async (req, res) => {
  try {
    const result = await getWordWithDefinition();

    if (!result) {
      return res.status(500).json({ error: "Could not fetch a word with definition" });
    }

    res.json({
      scrambled: scramble(result.word),
      word: result.word,
      meaning: result.meaning,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
