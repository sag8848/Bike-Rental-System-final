import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Bike, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`card p-5 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className="opacity-20 text-gray-700">{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data.stats))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );

  const chartData = stats?.monthlyRevenue?.map(r => ({
    name: MONTHS[r.dataValues?.month - 1] || r.month,
    revenue: parseFloat(r.dataValues?.revenue || r.revenue || 0),
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/admin/bikes" className="btn-primary">Manage Bikes</Link>
            <Link to="/admin/bookings" className="btn-secondary">Manage Bookings</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<Users size={40} />} label="Total Customers" value={stats?.totalUsers || 0} color="border-blue-500" />
          <StatCard icon={<Bike size={40} />} label="Total Bikes" value={stats?.totalBikes || 0} color="border-orange-500"
            sub={`${stats?.availableBikes} available · ${stats?.rentedBikes} rented`} />
          <StatCard icon={<Calendar size={40} />} label="Total Bookings" value={stats?.totalBookings || 0} color="border-purple-500"
            sub={`${stats?.pendingBookings} pending`} />
          <StatCard icon={<DollarSign size={40} />} label="Total Revenue" value={`NPR ${parseFloat(stats?.totalRevenue || 0).toLocaleString()}`} color="border-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => `NPR ${val.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400">No revenue data yet</div>
            )}
          </div>

          {/* Booking Status Overview */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Overview</h2>
            <div className="space-y-3">
              {[
                { label: 'Pending', value: stats?.pendingBookings, color: 'bg-yellow-400', pct: stats?.totalBookings },
                { label: 'Active', value: stats?.activeBookings, color: 'bg-blue-400', pct: stats?.totalBookings },
                { label: 'Completed', value: stats?.completedBookings, color: 'bg-green-400', pct: stats?.totalBookings },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-800">{item.value || 0}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: item.pct ? `${Math.min(100, (item.value / item.pct) * 100)}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-500">{stats?.availableBikes || 0}</div>
                <div className="text-xs text-gray-500">Available Bikes</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{stats?.rentedBikes || 0}</div>
                <div className="text-xs text-gray-500">Currently Rented</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/bikes" className="card p-5 hover:shadow-lg transition-shadow flex items-center gap-4 group">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors"><Bike size={24} /></div>
            <div><p className="font-bold text-gray-800">Manage Bikes</p><p className="text-sm text-gray-500">Add, edit, remove bikes</p></div>
          </Link>
          <Link to="/admin/bookings" className="card p-5 hover:shadow-lg transition-shadow flex items-center gap-4 group">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors"><Clock size={24} /></div>
            <div><p className="font-bold text-gray-800">Manage Bookings</p><p className="text-sm text-gray-500">Approve, reject, track</p></div>
          </Link>
          <Link to="/admin/users" className="card p-5 hover:shadow-lg transition-shadow flex items-center gap-4 group">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors"><Users size={24} /></div>
            <div><p className="font-bold text-gray-800">Manage Users</p><p className="text-sm text-gray-500">Roles and access control</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
