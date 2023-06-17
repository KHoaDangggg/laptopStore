import express from 'express';
import { protect } from '../controllers/authiencationControllers.mjs';
import { checkOutSession } from '../controllers/purchaseControllers.mjs';

const router = express.Router();

router.get('/checkout-session/:userID', protect, checkOutSession);
export default router;
