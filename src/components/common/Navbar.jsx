import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bike, Menu, X, User, LogOut, LayoutDashboard, Star, MessageCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <Bike size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800">BikeRent<span className="text-orange-500">Nepal</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/bikes" className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Browse Bikes</Link>
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'superadmin') && (
                  <>
                    <Link to="/admin" className="text-gray-600 hover:text-orange-500 font-medium flex items-center gap-1">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/admin/chat" className="text-gray-600 hover:text-orange-500 font-medium flex items-center gap-1">
                      <MessageCircle size={16} /> Chat
                    </Link>
                  </>
                )}
                {user.role === 'customer' && (
                  <>
                    <Link to="/my-bookings" className="text-gray-600 hover:text-orange-500 font-medium">My Bookings</Link>
                    <Link to="/chat" className="text-gray-600 hover:text-orange-500 font-medium flex items-center gap-1">
                      <MessageCircle size={16} /> Support
                    </Link>
                  </>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                    <User size={16} />
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                    {user.loyalty_points > 0 && (
                      <span className="flex items-center gap-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        <Star size={10} /> {user.loyalty_points}
                      </span>
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                        onClick={() => setDropdownOpen(false)}>Profile</Link>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link to="/bikes" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Browse Bikes</Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/my-bookings" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                  <Link to="/chat" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>💬 Support Chat</Link>
                </>
              )}
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <>
                  <Link to="/admin" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                  <Link to="/admin/chat" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>💬 Customer Chat</Link>
                </>
              )}
              <Link to="/profile" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="text-red-600 font-medium py-2 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
