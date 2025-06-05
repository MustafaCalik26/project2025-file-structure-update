// const scrambledDiv = document.getElementById('scrambled');
// const guessInput = document.getElementById('guessInput');
// const resultP = document.getElementById('result');
// const guessBtn = document.getElementById('guessBtn');
// const newWordBtn = document.getElementById('newWordBtn');
// const hintBtn = document.getElementById('hintBtn');
// const hintDisplay = document.getElementById('hintDisplay');

// const API = 'http://localhost:8080/api';

// async function fetchWord() {
//   try {
//     const res = await fetch(`${API}/word`);
//     const text = await res.text();
//     scrambledDiv.textContent = text;
//     resultP.textContent = '';
//     guessInput.value = '';
//   } catch (error) {
//     resultP.textContent = 'An error occurred while connecting to the server.';
//     console.error(error);
//   }
// }
// async function fetchHint() {
//   try {
//     const res = await fetch(`${API}/hint`);
//     if (!res.ok) {
//       const errorText = await res.text();
//       hintDisplay.textContent = `Error: ${errorText}`;
//       return;
//     }
//     const hint = await res.text();
//     hintDisplay.textContent = `Hint: ${hint}`;
//   } catch (error) {
//     hintDisplay.textContent = 'Error fetching hint.';
//     console.error('Hint error:', error);
//   }
// }


// async function sendGuess() {
//   const guess = guessInput.value.trim();
//   if (!guess) return;

//   try {
//     const res = await fetch(`${API}/guess`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },  
//       body: JSON.stringify({ guess })
//     });
//     if (!res.ok) throw new Error('Guess submission failed');

//     const text = await res.text();
//     resultP.textContent = text;
//      if (text.toLowerCase().includes("correct")) {
//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 }
//       });
//     }
//   } catch (error) {
//     resultP.textContent = 'An error occurred while connecting to the server';
//     console.error('Guess error:', error);
//   }
// }

// guessBtn.addEventListener('click', sendGuess);
// newWordBtn.addEventListener('click', fetchWord);
// document.addEventListener('DOMContentLoaded', fetchWord);
// hintBtn.addEventListener('click', fetchHint);