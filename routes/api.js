import express from 'express';
const router = express.Router();

const wordList = ["elma", "araba", "kitap", "bilgisayar", "masa", "kalem", "sigara", "mercedes", "televizyon", "sandalye", "hesap makinesi", "galatasaray"];
let currentPuzzle = null;

function shuffle(word) {
  let arr = word.split('');
  while (true) {
    let shuffled = arr.sort(() => Math.random() - 0.5).join('');
    if (shuffled !== word) return shuffled;
  }
}

function getRandomPuzzle() {
  const original = wordList[Math.floor(Math.random() * wordList.length)];
  const scrambled = shuffle(original);
  return { original, scrambled };
}

router.get('/word', (req, res) => {
  currentPuzzle = getRandomPuzzle();
  res.send(currentPuzzle.scrambled);
});

router.post('/guess', (req, res) => {
  const guess = req.body.trim().toLowerCase();
  if (!currentPuzzle) return res.status(400).send("Please get a word first.");
  if (guess === currentPuzzle.original) {
    res.send("Doğru! 🎉");
  } else {
    res.send(`Yanlış. Doğru cevap: ${currentPuzzle.original}`);
  }
});

export default router;
