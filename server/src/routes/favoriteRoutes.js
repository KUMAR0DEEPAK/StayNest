import express from 'express';
import {
  addToFavorites,
  getMyFavorites,
  removeFromFavorites
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All favorite routes require student login
router.use(protect);

router.post('/', addToFavorites);
router.get('/', getMyFavorites);
router.delete('/:propertyId', removeFromFavorites);

export default router;
