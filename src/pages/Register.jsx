import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Bike, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', license_number: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to BikeRentNepal!');
      navigate('/bikes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-orange-500 text-white p-3 rounded-xl inline-flex mb-3"><Bike size={28} /></div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join BikeRentNepal today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" className="input-field" placeholder="Sagar Acharya" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" className="input-field" placeholder="98XXXXXXXX" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
            <input type="text" className="input-field" placeholder="License No. (optional)" value={form.license_number} onChange={set('license_number')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="input-field pr-10" placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} required />
              <button type="button" className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
