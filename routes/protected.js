import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({
    message: '🕵️ Bu gizli içerik sadece giriş yapmış kullanıcılar içindir.',
    user: req.user,
  });
});

export default router;
