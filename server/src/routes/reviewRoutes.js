import express from 'express';
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view reviews
router.get('/:propertyId', getPropertyReviews);

// Protected routes (require user login)
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
