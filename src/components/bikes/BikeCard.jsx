import { Link } from 'react-router-dom';
import { MapPin, Star, Zap, Fuel } from 'lucide-react';

const BikeCard = ({ bike }) => {
  const statusClass = {
    available: 'badge-available',
    rented: 'badge-rented',
    maintenance: 'bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full',
  }[bike.status] || 'badge-available';

  return (
    <div className="card hover:shadow-lg transition-shadow group">
      <div className="relative overflow-hidden h-48 bg-gray-100">
        {bike.image ? (
          <img src={bike.image} alt={bike.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-6xl">🏍️</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 ${statusClass} capitalize font-medium`}>{bike.status}</span>
        <span className="absolute top-3 left-3 bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">{bike.type}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{bike.name}</h3>
            <p className="text-gray-500 text-sm">{bike.brand} — {bike.model}</p>
          </div>
          {bike.rating > 0 && (
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {parseFloat(bike.rating).toFixed(1)}
              <span className="text-gray-400 font-normal">({bike.total_reviews})</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><MapPin size={12} /> {bike.location}</span>
          {bike.cc && <span className="flex items-center gap-1"><Zap size={12} /> {bike.cc}cc</span>}
          <span className="flex items-center gap-1 capitalize"><Fuel size={12} /> {bike.fuel_type}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-orange-500 font-bold text-xl">NPR {parseFloat(bike.price_per_day).toLocaleString()}</span>
            <span className="text-gray-400 text-sm">/day</span>
            <span className="text-gray-400 text-xs ml-2">(NPR {parseFloat(bike.price_per_hour)}/hr)</span>
          </div>
          <Link to={`/bikes/${bike.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              bike.status === 'available'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}>
            {bike.status === 'available' ? 'Book Now' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
