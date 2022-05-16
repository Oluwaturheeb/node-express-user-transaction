import express from 'express';
import app from '../conf/app.js';
import * as trans from '../controllers/transactionController.js';

const router = express.Router();

/* GET users listing. */
router.put('/deposit', app.verifyMiddleware, trans.deposit);
router.put('/transfer', app.verifyMiddleware, trans.transfer);
router.put('/withdraw', app.verifyMiddleware, trans.withdraw);
export default router;
