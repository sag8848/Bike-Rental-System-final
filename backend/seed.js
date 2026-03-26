// Run: node seed.js
// Seeds the database with sample bikes and an admin user
require('dotenv').config();
const { sequelize, User, Bike } = require('./models');

const bikes = [
  {
    name: 'Honda CB150R', brand: 'Honda', model: 'CB150R', type: 'motorcycle',
    price_per_hour: 200, price_per_day: 1500, location: 'Kathmandu',
    cc: 150, fuel_type: 'petrol', status: 'available',
    description: 'A sporty and reliable motorcycle perfect for city rides and short trips. Well-maintained with full tank on delivery.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  },
  {
    name: 'Yamaha FZS V3', brand: 'Yamaha', model: 'FZS V3', type: 'motorcycle',
    price_per_hour: 220, price_per_day: 1800, location: 'Kathmandu',
    cc: 149, fuel_type: 'petrol', status: 'available',
    description: 'Powerful street fighter with fuel injection. Ideal for Kathmandu valley commutes.',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600',
  },
  {
    name: 'Honda Activa 6G', brand: 'Honda', model: 'Activa 6G', type: 'scooter',
    price_per_hour: 120, price_per_day: 900, location: 'Pokhara',
    cc: 110, fuel_type: 'petrol', status: 'available',
    description: 'Smooth, reliable scooter perfect for Pokhara sightseeing. Easy to ride for beginners.',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600',
  },
  {
    name: 'Royal Enfield Himalayan', brand: 'Royal Enfield', model: 'Himalayan 411', type: 'motorcycle',
    price_per_hour: 350, price_per_day: 2800, location: 'Pokhara',
    cc: 411, fuel_type: 'petrol', status: 'available',
    description: 'Purpose-built adventure tourer for Himalayan trails. Perfect for treks to Manang or Mustang.',
    image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?w=600',
  },
  {
    name: 'Bajaj Pulsar NS200', brand: 'Bajaj', model: 'Pulsar NS200', type: 'motorcycle',
    price_per_hour: 250, price_per_day: 2000, location: 'Chitwan',
    cc: 200, fuel_type: 'petrol', status: 'available',
    description: 'High performance naked sport bike. Great for highway rides to Chitwan National Park.',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600',
  },
  {
    name: 'TVS Jupiter ZX', brand: 'TVS', model: 'Jupiter ZX', type: 'scooter',
    price_per_hour: 100, price_per_day: 800, location: 'Bhaktapur',
    cc: 110, fuel_type: 'petrol', status: 'available',
    description: 'Comfortable scooter with spacious seat and good fuel economy for Bhaktapur exploration.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600',
  },
  {
    name: 'Yadea G5 Electric', brand: 'Yadea', model: 'G5', type: 'electric',
    price_per_hour: 150, price_per_day: 1200, location: 'Kathmandu',
    cc: null, fuel_type: 'electric', status: 'available',
    description: 'Zero emission electric scooter. Charged and ready. Perfect for eco-conscious travelers in Kathmandu.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600',
  },
  {
    name: 'KTM Duke 200', brand: 'KTM', model: 'Duke 200', type: 'motorcycle',
    price_per_hour: 300, price_per_day: 2500, location: 'Kathmandu',
    cc: 200, fuel_type: 'petrol', status: 'available',
    description: 'Agile and aggressive street naked bike. Loved by riders who enjoy spirited urban riding.',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600',
  },
  {
    name: 'Hero Xpulse 200', brand: 'Hero', model: 'Xpulse 200', type: 'mountain',
    price_per_hour: 280, price_per_day: 2200, location: 'Pokhara',
    cc: 200, fuel_type: 'petrol', status: 'available',
    description: 'Off-road adventure motorcycle with long travel suspension. Ideal for dirt trails around Pokhara.',
    image: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=600',
  },
  {
    name: 'Suzuki Access 125', brand: 'Suzuki', model: 'Access 125', type: 'scooter',
    price_per_hour: 110, price_per_day: 850, location: 'Lalitpur',
    cc: 125, fuel_type: 'petrol', status: 'available',
    description: 'Premium scooter with SEP engine. Comfortable for long rides around Lalitpur heritage sites.',
    image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600',
  },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected');

    // Create admin user
    const admin = await User.findOne({ where: { email: 'admin@bikerental.com' } });
    if (!admin) {
      await User.create({
        name: 'Admin User', email: 'admin@bikerental.com',
        password: 'Admin@123', role: 'admin', phone: '9800000001',
      });
      console.log('✅ Admin created: admin@bikerental.com / Admin@123');
    }

    // Create sample customer
    const customer = await User.findOne({ where: { email: 'sagar@example.com' } });
    if (!customer) {
      await User.create({
        name: 'Sagar Acharya', email: 'sagar@example.com',
        password: 'Test@123', role: 'customer', phone: '9800000002',
        license_number: 'Ba-12-3456', loyalty_points: 50,
      });
      console.log('✅ Test customer: sagar@example.com / Test@123');
    }

    // Seed bikes
    const existing = await Bike.count();
    if (existing === 0) {
      await Bike.bulkCreate(bikes);
      console.log(`✅ ${bikes.length} bikes seeded`);
    } else {
      console.log(`ℹ️  Bikes already exist (${existing}), skipping`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log('─────────────────────────────────');
    console.log('Super Admin: superadmin@bikerental.com / Admin@123');
    console.log('Admin:       admin@bikerental.com / Admin@123');
    console.log('Customer:    sagar@example.com / Test@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
