import express from 'express';
import Word from '../models/Word.js';
import { shuffle } from '../utils/puzzle.js';

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

router.post('/guess', (req, res) => {
  const guess = req.body.guess?.trim().toLowerCase();
  if (!currentPuzzle) return res.status(400).send("Please get a word first.");
  if (!guess) return res.status(400).send("Please send a guess.");

  if (guess === currentPuzzle.toLowerCase()) {
    res.send("Correct Answer 🎉");
  } else {
    res.send(`False. Correct Answer Is: ${currentPuzzle}`);
  }
});

export default router;
