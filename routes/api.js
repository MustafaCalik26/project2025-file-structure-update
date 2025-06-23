import express from 'express';
import Word from '../models/Word.js';
import { shuffle } from '../utils/puzzle.js';
import Guess from '../models/Guess.js';


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
router.get('/hint', (req, res) => {
  if (!currentPuzzle) {
    return res.status(400).send("Please get a word first.");
  }
  
  // Simple hint for the user cause i think the scrambling is very bad some words are crazy :(
  const hint = currentPuzzle[0] + '_'.repeat(currentPuzzle.length - 1);
  
  res.send(hint);
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


    if (isCorrect){
   res.json({ status: 'correct' });
  } else {
    res.json({ status: 'wrong' });
  }
});

export default router;
