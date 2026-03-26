import { useState, useEffect } from 'react';
import { bikeAPI } from '../utils/api';
import BikeCard from '../components/bikes/BikeCard';
import { Search, Filter, X } from 'lucide-react';

const TYPES = ['', 'motorcycle', 'scooter', 'electric', 'mountain'];
const LOCATIONS = ['', 'Kathmandu', 'Pokhara', 'Chitwan', 'Bhaktapur', 'Lalitpur'];

const Bikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', type: '', location: '', min_price: '', max_price: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const res = await bikeAPI.getAll(params);
      setBikes(res.data.bikes);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, [page, filters]);

  const clearFilters = () => setFilters({ search: '', type: '', location: '', min_price: '', max_price: '' });

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Bikes</h1>
            <p className="text-gray-500 mt-1">{total} bikes found</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" placeholder="Search bikes..." className="input-field pl-10"
                value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 font-medium text-gray-700 relative">
              <Filter size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-5 shadow-sm mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="input-field" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                {TYPES.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select className="input-field" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l || 'All Locations'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (NPR/day)</label>
              <input type="number" className="input-field" placeholder="0" value={filters.min_price}
                onChange={e => setFilters({ ...filters, min_price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (NPR/day)</label>
              <input type="number" className="input-field" placeholder="10000" value={filters.max_price}
                onChange={e => setFilters({ ...filters, max_price: e.target.value })} />
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="col-span-2 md:col-span-4 flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-xl font-bold text-gray-700">No bikes found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-4 btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bikes.map(bike => <BikeCard key={bike.id} bike={bike} />)}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      p === page ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                    }`}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bikes;
