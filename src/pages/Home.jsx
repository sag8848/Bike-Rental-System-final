import { Link } from 'react-router-dom';
import { Bike, Shield, CreditCard, MapPin, ChevronRight, Clock, Award } from 'lucide-react';

const Home = () => {
  const features = [
    { icon: <Bike size={28} className="text-orange-500" />, title: 'Wide Selection', desc: 'Choose from motorcycles, scooters, and electric bikes across Nepal.' },
    { icon: <Shield size={28} className="text-orange-500" />, title: 'Secure Booking', desc: 'JWT authenticated accounts with secure payment processing.' },
    { icon: <CreditCard size={28} className="text-orange-500" />, title: 'Easy Payment', desc: 'Pay via Khalti, eSewa, or cash at pickup location.' },
    { icon: <MapPin size={28} className="text-orange-500" />, title: 'Multiple Locations', desc: 'Available in Kathmandu, Pokhara, Chitwan, and more.' },
    { icon: <Clock size={28} className="text-orange-500" />, title: 'Hourly & Daily Rates', desc: 'Flexible rental durations to suit your travel plans.' },
    { icon: <Award size={28} className="text-orange-500" />, title: 'Loyalty Rewards', desc: 'Earn points on every rental and redeem for discounts.' },
  ];

  const stats = [
    { label: 'Bikes Available', value: '100+' },
    { label: 'Happy Customers', value: '5,000+' },
    { label: 'Cities Covered', value: '10+' },
    { label: 'Average Rating', value: '4.8★' },
  ];

  return (
    <div>
      {/* Hero Section - Full Background Image */}
      <section className="relative text-white py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://wallpaperaccess.com/full/4005627.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-orange-1000 opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Rent Bikes Across<br />
            <span className="text-orange-100">Nepal Online</span>
          </h1>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl">
            Browse, book, and pay for bikes instantly. No paperwork, no waiting
            <br /> just ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/bikes" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
              Browse Bikes <ChevronRight size={20} />
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-colors text-center">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose BikeRentNepal?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">The most trusted bike rental platform in Nepal, designed for locals and tourists alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Register with your email and driving license' },
              { step: '02', title: 'Browse & Select', desc: 'Filter bikes by location, type, and price' },
              { step: '03', title: 'Book & Pay', desc: 'Select dates and pay via Khalti or eSewa' },
              { step: '04', title: 'Ride & Review', desc: 'Pick up your bike and enjoy the ride!' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-black text-orange-100 mb-3">{step.step}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
          <p className="text-orange-100 mb-8 text-lg">Join thousands of happy riders across Nepal.</p>
          <Link to="/bikes" className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl hover:bg-orange-50 transition-colors inline-block">
            Browse Available Bikes
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
