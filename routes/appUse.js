import express from 'express';
import apiRouter from './api.js';
import usersRouter from './users.js';
import loginRouter from './login.js';
import protectedRouter from './protected.js';

const router = express.Router();

router.use('/api', apiRouter);
router.use('/api/users', usersRouter);
router.use('/api/login', loginRouter);
router.use('/api/protected', protectedRouter);

export default router;
