import express from 'express';
import User from '../models/User.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const ip = req.ip;
  const redisKey = `signup:ip:${ip}`;
  const attempts = parseInt(await redisClient.get(redisKey)) || 0;
  //same ip cannot register too many times
  if (attempts >= 5) {
    return res.status(429).json({
      error: 'Too many signup attempts. Try again in a few minutes.',
    });
  }


  try {
    const user = new User({ username, password });
    //Im doing the hashing in models user so i deleted from here
    //accidently hashed twice and couldnt login when created a new user
    //fixed.
    await user.save();
    await redisClient.del(redisKey);

    res.status(201).json({
      message: 'User created',
      user: { username: user.username }
    });
  } catch (err) {
    await redisClient.setEx(redisKey, 300,(attempts + 1).toString());
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
