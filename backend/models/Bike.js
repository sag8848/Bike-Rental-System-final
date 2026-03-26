import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Bike = sequelize.define('Bike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('motorcycle', 'scooter', 'electric', 'mountain'),
    defaultValue: 'motorcycle',
  },
  price_per_hour: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  cc: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fuel_type: {
    type: DataTypes.ENUM('petrol', 'electric', 'diesel'),
    defaultValue: 'petrol',
  },
  status: {
    type: DataTypes.ENUM('available', 'rented', 'maintenance'),
    defaultValue: 'available',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'bikes',
  timestamps: true,
});

export default Bike;
