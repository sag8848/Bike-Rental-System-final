import { Link } from 'react-router-dom';
import { Bike, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-500 text-white p-2 rounded-lg"><Bike size={18} /></div>
            <span className="font-bold text-white text-lg">BikeRent<span className="text-orange-400">Nepal</span></span>
          </div>
          <p className="text-sm text-gray-400">The easiest way to rent bikes across Nepal. Fast, safe, and affordable.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/bikes" className="hover:text-orange-400 transition-colors">Browse Bikes</Link>
            <Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link>
            <Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Locations</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span>Kathmandu</span>
            <span>Pokhara</span>
            <span>Chitwan</span>
            <span>Bhaktapur</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2"><Phone size={14} /> +977-9800000000</span>
            <span className="flex items-center gap-2"><Mail size={14} /> info@bikerentalnepal.com</span>
            <span className="flex items-center gap-2"><MapPin size={14} /> Kathmandu, Nepal</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © 2025 BikeRentNepal. Built with MERN Stack for London Metropolitan University.
      </div>
    </div>
  </footer>
);

export default Footer;
