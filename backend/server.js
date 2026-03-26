import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import bikeRoutes from './routes/bikes.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import notificationRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Bike Rental API is running' });
});

// Socket.io - Real-time chat & notifications
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins with their ID
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined`);
  });

  // Send message
  socket.on('sendMessage', (data) => {
    const { receiver_id, message, sender } = data;
    // Emit to receiver
    io.to(`user_${receiver_id}`).emit('receiveMessage', {
      sender_id: sender.id,
      sender,
      message,
      created_at: new Date(),
    });
    // Emit notification
    io.to(`user_${receiver_id}`).emit('newNotification', {
      title: 'New Message',
      message: `${sender.name}: ${message.substring(0, 50)}`,
      type: 'chat',
    });
  });

  // Booking notification
  socket.on('bookingUpdate', (data) => {
    const { user_id, title, message } = data;
    io.to(`user_${user_id}`).emit('newNotification', { title, message, type: 'booking' });
  });

  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) onlineUsers.delete(userId);
    });
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    const { User } = await import('./models/index.js');
    const superadmin = await User.findOne({ where: { role: 'superadmin' } });
    if (!superadmin) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@bikerental.com',
        password: 'Admin@123',
        role: 'superadmin',
        phone: '9800000000',
      });
      console.log('✅ Default superadmin created');
    }

    server.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
    process.exit(1);
  }
};

start();
