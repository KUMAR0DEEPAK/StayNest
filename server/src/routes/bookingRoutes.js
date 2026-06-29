import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes require a logged-in user
router.use(protect);

router.post('/', createBooking);
router.get('/', getMyBookings);
router.put('/:id', updateBookingStatus);

export default router;
