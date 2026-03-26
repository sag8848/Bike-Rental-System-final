import { useState, useEffect } from 'react';
import { bookingAPI, reviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Calendar, Star, X } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'badge-pending', approved: 'badge-approved', active: 'badge-approved',
  completed: 'badge-completed', cancelled: 'badge-cancelled', rejected: 'badge-rejected',
};

const ReviewModal = ({ booking, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await reviewAPI.create({ bike_id: booking.bike_id, booking_id: booking.id, rating, comment });
      toast.success('Review submitted!');
      onSubmit();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Rate {booking.bike?.name}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="flex gap-2 mb-4 justify-center">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}>
              <Star size={32} className={n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>
        <textarea className="input-field mb-4" rows={3} placeholder="Share your experience (optional)..."
          value={comment} onChange={e => setComment(e.target.value)} />
        <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = () => {
    bookingAPI.getMyBookings()
      .then(res => setBookings(res.data.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Calendar size={28} className="text-orange-500" /> My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-xl font-bold text-gray-700">No bookings yet</h3>
            <p className="text-gray-500 mt-2 mb-6">Start exploring and book your first ride!</p>
            <a href="/bikes" className="btn-primary px-8 py-3">Browse Bikes</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Bike image */}
                  <div className="w-full md:w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {b.bike?.image
                      ? <img src={b.bike.image} alt={b.bike?.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-3xl">🏍️</div>
                    }
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{b.bike?.name}</h3>
                        <p className="text-gray-500 text-sm">{b.bike?.brand} · {b.bike?.model}</p>
                      </div>
                      <span className={STATUS_COLORS[b.status] || 'badge-pending'}>{b.status}</span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>📅 {new Date(b.start_date).toLocaleString()} → {new Date(b.end_date).toLocaleString()}</div>
                      <div>📍 {b.pickup_location} · ⏱ {b.total_hours} hours</div>
                      <div className="flex gap-4">
                        <span>💳 {b.payment_method || 'N/A'} · <span className={b.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>{b.payment_status}</span></span>
                        <span className="font-bold text-orange-500">NPR {parseFloat(b.final_amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:items-end">
                    {b.status === 'completed' && !b.review && (
                      <button onClick={() => setReviewBooking(b)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                        <Star size={14} /> Review
                      </button>
                    )}
                    {b.status === 'completed' && b.review && (
                      <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                        <Star size={14} className="fill-yellow-400" /> Reviewed ({b.review.rating}/5)
                      </div>
                    )}
                    {['pending', 'approved'].includes(b.status) && (
                      <button onClick={() => handleCancel(b.id)}
                        className="text-sm px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel
                      </button>
                    )}
                    {b.loyalty_points_earned > 0 && b.status === 'completed' && (
                      <span className="text-xs text-green-600">+{b.loyalty_points_earned} pts earned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={fetchBookings}
        />
      )}
    </div>
  );
};

export default MyBookings;
