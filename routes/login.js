import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const SECRET = process.env.JWT_SECRET;

  if (!SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not defined' });
  }

  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
// console.log('Login - incoming password', password);
// console.log('Login - hash:', user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Login - match :', isMatch);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: '2h',
  });

  res.json({ message: 'Login successful', token });
});

export default router;
