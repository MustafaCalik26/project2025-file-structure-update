import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import redisClient from '../utils/redis.js';


const router = express.Router();

router.post('/', async (req, res) => {
  const SECRET = process.env.JWT_SECRET;

  if (!SECRET) {
    return res.status(500).json({ error_code: 'SERVER_ERROR', error: 'JWT_SECRET is not defined' });
  }

  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ error_code: 'BAD_REQUEST', error: 'Username and password required' });
  }

  const redisKey = `login:attempts:${username}`;
  const attempts = parseInt(await redisClient.get(redisKey)) || 0;
  if (attempts >= 5) {
    return res.status(429).json({
    error_code: 'TOO_MANY_ATTEMPTS',
    error: 'Too many login attempts. Please try again in a few minutes.',
    });
  }

  const user = await User.findOne({ username });
  if (!user) {
    await redisClient.setEx(redisKey, 300, (attempts + 1).toString());
    return res.status(404).json({ error_code: 'USER_NOT_FOUND', error: 'User not found' });
  }
  // console.log('Login - incoming password', password);
  // console.log('Login - hash:', user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Login - match :', isMatch);
  if (!isMatch) {
    await redisClient.setEx(redisKey, 300, (attempts + 1).toString());
    return res.status(401).json({ error_code: 'INVALID_PASSWORD', error: 'Invalid password' });
  }
  await redisClient.del(redisKey);
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
    expiresIn: '2h',
  });

  res.json({ message: 'Login successful', token });
});

export default router;
