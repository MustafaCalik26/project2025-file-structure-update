function shuffle(word) {
  let arr = word.split('');
  while (true) {
    let shuffled = arr.sort(() => Math.random() - 0.5).join('');
    if (shuffled !== word) return shuffled;
  }
}

export { shuffle };
