import { useState, useEffect } from 'react';
import { bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Package, Clock } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'badge-pending', approved: 'badge-approved', active: 'badge-approved',
  completed: 'badge-completed', cancelled: 'badge-cancelled', rejected: 'badge-rejected',
};

const TABS = ['all', 'pending', 'approved', 'active', 'completed', 'cancelled'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (activeTab !== 'all') params.status = activeTab;
    bookingAPI.getAll(params)
      .then(res => {
        setBookings(res.data.bookings);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [activeTab, page]);

  const handleStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
            <p className="text-gray-500 mt-1">{total} total bookings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No {activeTab} bookings found</div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="card p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Customer & Bike Info */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      {b.bike?.image ? <img src={b.bike.image} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🏍️</div>}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{b.bike?.name}</div>
                      <div className="text-xs text-gray-400">{b.bike?.brand} · {b.bike?.model}</div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Customer</div>
                      <div className="font-medium text-gray-800">{b.user?.name}</div>
                      <div className="text-gray-400 text-xs">{b.user?.phone}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Duration</div>
                      <div className="font-medium">{b.total_hours} hours</div>
                      <div className="text-gray-400 text-xs">{new Date(b.start_date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Amount</div>
                      <div className="font-bold text-orange-500">NPR {parseFloat(b.final_amount).toLocaleString()}</div>
                      <div className={`text-xs capitalize ${b.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{b.payment_status}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Pickup</div>
                      <div className="font-medium text-xs">{b.pickup_location}</div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <span className={STATUS_COLORS[b.status] || 'badge-pending'}>{b.status}</span>
                    <div className="flex gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(b.id, 'approved')}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => handleStatus(b.id, 'rejected')}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                            <XCircle size={12} /> Reject
                          </button>
                        </>
                      )}
                      {b.status === 'approved' && (
                        <button onClick={() => handleStatus(b.id, 'active')}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          <Clock size={12} /> Activate
                        </button>
                      )}
                      {b.status === 'active' && (
                        <button onClick={() => handleStatus(b.id, 'completed')}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          <Package size={12} /> Mark Returned
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg font-medium ${p === page ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
