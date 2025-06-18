import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import redisClient from './utils/redis.js';
import router from './routes/appUse.js';



const app = express();
const PORT = 8080;



app.use(cors());
app.use(express.json());
app.use(router);




redisClient.connect()
  .then(() => console.log('✅ Connected to Redis'))
  .catch(err => {
    console.error('❌ Redis connection error:', err);
    process.exit(1); //  exit app if Redis fails
  });


const __dirname = path.dirname(fileURLToPath(import.meta.url));
// I now added the  env variable to connect to look more proffesional
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.text());


//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
