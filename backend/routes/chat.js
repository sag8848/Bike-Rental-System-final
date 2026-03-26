import express from 'express';
import { protect } from '../middleware/auth.js';
import { User } from '../models/index.js';
import { getConversations, getUnreadCount, sendMessage, getChatHistory } from '../controllers/chatController.js';

const router = express.Router();

// Get admin ID
router.get('/admin-id', protect, async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'superadmin' } });
    res.json({ adminId: admin?.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/conversations', protect, getConversations);
router.get('/unread', protect, getUnreadCount);
router.post('/send', protect, sendMessage);
router.get('/:userId', protect, getChatHistory);

export default router;
