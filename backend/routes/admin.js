import express from 'express';
import { getDashboard, getUsers, updateUser, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'superadmin'), getDashboard);
router.get('/users', protect, authorize('superadmin'), getUsers);
router.put('/users/:id', protect, authorize('superadmin'), updateUser);
router.delete('/users/:id', protect, authorize('superadmin'), deleteUser);

export default router;
