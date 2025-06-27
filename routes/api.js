import express from 'express';
import Word from '../models/Word.js';
import { shuffle } from '../utils/puzzle.js';
import Guess from '../models/Guess.js';
import redisClient from '../utils/redis.js';


const router = express.Router();

let currentPuzzle = null;

router.get('/word', async (req, res) => {
  try {
    const count = await Word.countDocuments();
    if (count === 0) return res.status(404).send("No words found in database");

    const random = Math.floor(Math.random() * count);
    const wordDoc = await Word.findOne().skip(random);

    currentPuzzle = wordDoc.original;
    const scrambled = shuffle(wordDoc.original);

    res.send(scrambled);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get('/hint', async (req, res) => {
  if (!currentPuzzle) {
    return res.status(400).send("Please get a word first.");
  }

  const userId = req.ip;
  const redisKey = `hint:${userId}:${currentPuzzle}`;
  const revealedKey = `revealed:${userId}:${currentPuzzle}`;

  try {
    let hintCount = parseInt(await redisClient.get(redisKey)) || 0;

    if (hintCount >= 2) {
      return res.status(403).send("You have reached the maximum number of hints for this word.");
    }
    let revealedIndexes = JSON.parse(await redisClient.get(revealedKey)) || [];

    const availableIndexes = [...currentPuzzle]
      .map((_, idx) => idx)
      .filter(idx => !revealedIndexes.includes(idx));

    if (availableIndexes.length === 0) {
      return res.status(200).send("All letters have been revealed.");
    }

    // Pick a random unrevealed index
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    revealedIndexes.push(randomIndex);

    const hint = [...currentPuzzle].map((char, idx) =>
      revealedIndexes.includes(idx) ? char : '_'
    ).join('');

    // Save updated hint count and revealed indexes 
    await redisClient.set(redisKey, hintCount + 1, { EX: 600 }); 
    await redisClient.set(revealedKey, JSON.stringify(revealedIndexes), { EX: 600 });

    res.send(hint);

  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).send("Server error with hint system.");
  }
});

// When i implented the saving system  i forgot about 'await' so had multiple errors
// router.post('/guess',(req, res) => 
router.post('/guess', async (req, res) => {
  const guess = req.body.guess?.trim().toLowerCase();
  if (!currentPuzzle) return res.status(400).send("Please get a word first.");
  if (!guess) return res.status(400).send("Please send a guess.");

  const isCorrect = guess === currentPuzzle.toLowerCase();


  //I wanted to add a system to save the guesses made by the user to DB
  try {
    await Guess.create({ guess, correct: isCorrect });
  } catch (err) {
    console.error('Error saving guess:', err);
  }


  if (isCorrect) {
    res.send("Correct Answer 🎉");
  } else {
    res.send(`False. Try Again Or Use Hint`);
  }
});

export default router;
