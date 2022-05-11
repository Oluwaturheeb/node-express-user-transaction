import express from 'express';
import app from '../conf/app.js';
import dashboard from '../controllers/userController.js';

const router = express.Router();

/* GET users listing. */
router.get('/dashboard', app.verifyMiddleware, dashboard);
export default router;
