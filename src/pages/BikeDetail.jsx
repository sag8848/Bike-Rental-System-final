import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bikeAPI, bookingAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Star, Zap, Fuel, Calendar, Clock, CreditCard } from 'lucide-react';

const BikeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    start_date: '', end_date: '', pickup_location: '',
    payment_method: 'khalti', loyalty_points_used: 0,
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {
    bikeAPI.getById(id)
      .then(res => setBike(res.data.bike))
      .catch(() => toast.error('Bike not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (booking.start_date && booking.end_date && bike) {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      if (end > start) {
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        const amount = hours >= 24
          ? Math.ceil(hours / 24) * parseFloat(bike.price_per_day)
          : hours * parseFloat(bike.price_per_hour);
        const discount = booking.loyalty_points_used * 10;
        setTotalCost({ hours, amount, discount, final: Math.max(0, amount - discount) });
      } else {
        setTotalCost(null);
      }
    }
  }, [booking.start_date, booking.end_date, booking.loyalty_points_used, bike]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!booking.start_date || !booking.end_date || !booking.pickup_location) {
      toast.error('Please fill all booking fields'); return;
    }
    setBookingLoading(true);
    try {
      await bookingAPI.create({ bike_id: id, ...booking });
      toast.success('Booking created! Awaiting admin approval.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  );

  if (!bike) return <div className="min-h-screen flex items-center justify-center text-gray-500">Bike not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bike Info */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="h-80 bg-gray-100 overflow-hidden">
                {bike.image ? (
                  <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 text-9xl">🏍️</div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{bike.name}</h1>
                    <p className="text-gray-500">{bike.brand} · {bike.model}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">NPR {parseFloat(bike.price_per_day).toLocaleString()}<span className="text-base font-normal text-gray-400">/day</span></div>
                    <div className="text-gray-400 text-sm">NPR {parseFloat(bike.price_per_hour)}/hr</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-400" /> {bike.location}</span>
                  {bike.cc && <span className="flex items-center gap-1"><Zap size={14} className="text-orange-400" /> {bike.cc}cc</span>}
                  <span className="flex items-center gap-1 capitalize"><Fuel size={14} className="text-orange-400" /> {bike.fuel_type}</span>
                  <span className={`capitalize font-medium ${bike.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>{bike.status}</span>
                  {bike.rating > 0 && (
                    <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" /> {parseFloat(bike.rating).toFixed(1)} ({bike.total_reviews} reviews)</span>
                  )}
                </div>

                {bike.description && <p className="text-gray-600 leading-relaxed">{bike.description}</p>}
              </div>
            </div>

            {/* Reviews */}
            {bike.reviews?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                  {bike.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                          {review.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{review.user?.name}</span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-gray-600 text-sm pl-10">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Calendar size={20} className="text-orange-500" /> Book This Bike
              </h2>

              {bike.status !== 'available' ? (
                <div className="bg-red-50 text-red-600 rounded-lg p-4 text-center font-medium">
                  This bike is currently {bike.status}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <input type="datetime-local" className="input-field"
                      min={new Date().toISOString().slice(0, 16)}
                      value={booking.start_date} onChange={e => setBooking({ ...booking, start_date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                    <input type="datetime-local" className="input-field"
                      min={booking.start_date || new Date().toISOString().slice(0, 16)}
                      value={booking.end_date} onChange={e => setBooking({ ...booking, end_date: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <input type="text" className="input-field" placeholder="e.g. Thamel, Kathmandu"
                      value={booking.pickup_location} onChange={e => setBooking({ ...booking, pickup_location: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><CreditCard size={14} /> Payment Method</label>
                    <select className="input-field" value={booking.payment_method} onChange={e => setBooking({ ...booking, payment_method: e.target.value })}>
                      <option value="khalti">Khalti</option>
                      <option value="esewa">eSewa</option>
                      <option value="cash">Cash at Pickup</option>
                    </select>
                  </div>

                  {user && user.loyalty_points > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Use Loyalty Points (You have: {user.loyalty_points} pts = NPR {user.loyalty_points * 10})
                      </label>
                      <input type="number" className="input-field" min="0" max={user.loyalty_points}
                        placeholder="0" value={booking.loyalty_points_used}
                        onChange={e => setBooking({ ...booking, loyalty_points_used: parseInt(e.target.value) || 0 })} />
                    </div>
                  )}

                  {totalCost && (
                    <div className="bg-orange-50 rounded-lg p-4 text-sm space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span><Clock size={14} className="inline mr-1" />{totalCost.hours} hours</span>
                        <span>NPR {totalCost.amount.toLocaleString()}</span>
                      </div>
                      {totalCost.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Loyalty Discount</span>
                          <span>- NPR {totalCost.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-gray-800 text-base border-t border-orange-200 pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-orange-500">NPR {totalCost.final.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <button onClick={handleBook} disabled={bookingLoading || !user}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                    {bookingLoading
                      ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      : user ? 'Confirm Booking' : 'Login to Book'
                    }
                  </button>

                  {!user && (
                    <p className="text-center text-sm text-gray-500">
                      Please <a href="/login" className="text-orange-500 font-medium">log in</a> to book this bike
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetail;
