import express from 'express';
import { getBikes, getBike, createBike, updateBike, deleteBike, getAllBikesAdmin } from '../controllers/bikeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBikes);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAllBikesAdmin);
router.get('/:id', getBike);
router.post('/', protect, authorize('admin', 'superadmin'), createBike);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateBike);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBike);

export default router;
