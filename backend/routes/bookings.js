import express from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus, processPayment, cancelBooking } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin', 'superadmin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateBookingStatus);
router.put('/:id/pay', protect, processPayment);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
