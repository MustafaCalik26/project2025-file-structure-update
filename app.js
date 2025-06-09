import dotenv from 'dotenv'; 
dotenv.config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import apiRouter from './routes/api.js';
import cors from 'cors'; 
import usersRouter from './routes/users.js';
import loginRouter from './routes/login.js';
import protectedRouter from './routes/protected.js';




const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 8080;
app.use(cors());
// I now added the  env variable to connect to look more proffesional
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
//app.use(express.text());

app.use('/api', apiRouter);
app.use('/api/users', usersRouter);
app.use('/api/login',loginRouter)
app.use('/api/protected', protectedRouter);

//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
