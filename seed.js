import mongoose from 'mongoose';
import Word from './models/Word.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// const words =
//  [ "elma", "araba", "kitap", "bilgisayar", "masa", "kalem", "sigara", "mercedes", "televizyon", "sandalye", "hesap makinesi", "galatasaray" ];
//Bu sekile cok kotu gozkuyordu kod ben de bir text file ekleyip onun icine bir liste dizdim
const filePath = path.resolve('./data/kelimeler.txt');


const fileContent = fs.readFileSync(filePath, 'utf-8');
const words = fileContent
  .split('\n')
  .map(w => w.trim())//text file da yanliskla kelime eklerken bosluk olursa silmesi icin ekledim ama su an icin bosluk yok :D
  .filter(w => w.length > 0);





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
