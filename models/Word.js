import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  original: { type: String, required: true }
});

const Word = mongoose.model('Word', wordSchema);
export default Word;
