import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = new User({ username, password});
    //Im doing the hashing in models user so i deleted from here
    //accidently hashed twice and couldnt login when created a new user
    //fixed.
    await user.save();

    res.status(201).json({
      message: 'User created',
      user: { username: user.username }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
