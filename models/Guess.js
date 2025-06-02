import mongoose from 'mongoose';

const guessSchema = new mongoose.Schema({
  guess: { type: String, required: true },
  correct: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Guess = mongoose.model('Guess', guessSchema);
export default Guess;
