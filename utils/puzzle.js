const wordList = [
  "elma", "araba", "kitap", "bilgisayar", "masa", "kalem",
  "sigara", "mercedes", "televizyon", "sandalye",
  "hesap makinesi", "galatasaray"
];

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

export { getRandomPuzzle };
