import mongoose from 'mongoose';
import Word from './models/Word.js';
import dotenv from 'dotenv';
dotenv.config();



const words = [
  "elma", "araba", "kitap", "bilgisayar", "masa", "kalem",
  "sigara", "mercedes", "televizyon", "sandalye",
  "hesap makinesi", "galatasaray"
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Word.deleteMany({});
    await Word.insertMany(words.map(w => ({ original: w })));
    console.log("✅ Seeded database with words");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
    