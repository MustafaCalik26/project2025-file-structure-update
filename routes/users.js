import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username?.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const user = new User({ username: username.trim() });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate username
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
