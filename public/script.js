const scrambledDiv = document.getElementById('scrambled');
const guessInput = document.getElementById('guessInput');
const resultP = document.getElementById('result');
const guessBtn = document.getElementById('guessBtn');
const newWordBtn = document.getElementById('newWordBtn');

const API = 'http://localhost:8080/api';

async function fetchWord() {
  try {
    const res = await fetch(`${API}/word`);
    const text = await res.text();
    scrambledDiv.textContent = text;
    resultP.textContent = '';
    guessInput.value = '';
  } catch (error) {
    resultP.textContent = 'An error occurred while connecting to the server.';
    console.error(error);
  }
}

async function sendGuess() {
  const guess = guessInput.value.trim();
  if (!guess) return;

  try {
    const res = await fetch(`${API}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({ guess })
    });
    if (!res.ok) throw new Error('Guess submission failed');

    const text = await res.text();
    resultP.textContent = text;
  } catch (error) {
    resultP.textContent = 'An error occurred while connecting to the server';
    console.error('Guess error:', error);
  }
}

guessBtn.addEventListener('click', sendGuess);
newWordBtn.addEventListener('click', fetchWord);
document.addEventListener('DOMContentLoaded', fetchWord);
