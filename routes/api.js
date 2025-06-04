
import express from 'express';
import Word from '../models/Word.js';
import { shuffle } from '../utils/puzzle.js';
import Guess from '../models/Guess.js';

const router = express.Router();

let currentPuzzle = null;

router.get('/word', async (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'easy';

    let lengthFilter;
    if (difficulty === 'easy') {
      lengthFilter = { $expr: { $eq: [{ $strLenCP: "$original" }, 3] } };
    } else if (difficulty === 'normal') {
      lengthFilter = { $expr: { $eq: [{ $strLenCP: "$original" }, 5] } };
    } else if (difficulty === 'hard') {
      lengthFilter = {
        $expr: {
          $gte: [{ $strLenCP: "$original" }, 7]
          //  { $lte: [{ $strLenCP: "$original" }, 8] } I first wanted words of 7-8 letters
          //  but i create the words with ai and it was random so i setted min 7 as rule
        }
      };
    } else {
      return res.status(400).send("Invalid difficulty level");
    }

    const count = await Word.countDocuments(lengthFilter);
    if (count === 0) return res.status(404).send("No words found for selected difficulty");

    const random = Math.floor(Math.random() * count);
    const wordDoc = await Word.findOne(lengthFilter).skip(random);

    currentPuzzle = wordDoc.original;
    const scrambled = shuffle(wordDoc.original);

    res.send(scrambled);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
  router.get('/hint', (req, res) => {
  if (!currentPuzzle) {
    return res.status(400).send("Please get a word first.");
  }

  const hint = currentPuzzle[0] + '_'.repeat(currentPuzzle.length - 1);
  res.send(hint);
});

router.post('/guess', async (req, res) => {
  const guess = req.body.guess?.trim().toLowerCase();
  if (!currentPuzzle) return res.status(400).send("Please get a word first.");
  if (!guess) return res.status(400).send("Please send a guess.");

  const isCorrect = guess === currentPuzzle.toLowerCase();

  try {
    await Guess.create({ guess, correct: isCorrect });
  } catch (err) {
    console.error('Error saving guess:', err);
  }

  if (isCorrect) {
    res.send("Correct Answer 🎉");
  } else {
    res.send(`False. Correct Answer Is: ${currentPuzzle}`);
  }
});
});
export default router;