import express from 'express';
import auth from './authRoute.js';
import user from './userRoute.js';
import transaction from './transactionRoute.js';

const router = express.Router();

// register our routes
router.use('/auth', auth);
router.use('/user', user);
router.use('/transaction', transaction);

export default router;