import express from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-all-read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;