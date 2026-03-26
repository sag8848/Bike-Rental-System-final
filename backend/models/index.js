import sequelize from '../config/database.js';
import User from './User.js';
import Bike from './Bike.js';
import Booking from './Booking.js';
import Review from './Review.js';
import Chat from './Chat.js';
import Notification from './Notification.js';

// Associations
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Bike.hasMany(Booking, { foreignKey: 'bike_id', as: 'bookings' });
Booking.belongsTo(Bike, { foreignKey: 'bike_id', as: 'bike' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Bike.hasMany(Review, { foreignKey: 'bike_id', as: 'reviews' });
Review.belongsTo(Bike, { foreignKey: 'bike_id', as: 'bike' });

Booking.hasOne(Review, { foreignKey: 'booking_id', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// Chat associations
User.hasMany(Chat, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Chat, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Chat.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Chat.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { sequelize, User, Bike, Booking, Review, Chat, Notification };
