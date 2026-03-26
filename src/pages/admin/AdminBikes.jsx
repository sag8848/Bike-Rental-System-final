import { useState, useEffect } from 'react';
import { bikeAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const BIKE_TYPES = ['motorcycle', 'scooter', 'electric', 'mountain'];
const FUEL_TYPES = ['petrol', 'electric', 'diesel'];
const LOCATIONS = ['Kathmandu', 'Pokhara', 'Chitwan', 'Bhaktapur', 'Lalitpur', 'Butwal', 'Biratnagar'];

const emptyBike = { name: '', model: '', brand: '', type: 'motorcycle', price_per_hour: '', price_per_day: '', location: '', description: '', image: '', cc: '', fuel_type: 'petrol', status: 'available' };

const BikeModal = ({ bike, onClose, onSave }) => {
  const [form, setForm] = useState(bike || emptyBike);
  const [loading, setLoading] = useState(false);
  const isEdit = !!bike?.id;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    if (!form.name || !form.model || !form.brand || !form.price_per_hour || !form.price_per_day || !form.location) {
      toast.error('Please fill required fields'); return;
    }
    setLoading(true);
    try {
      if (isEdit) await bikeAPI.update(bike.id, form);
      else await bikeAPI.create(form);
      toast.success(`Bike ${isEdit ? 'updated' : 'created'}!`);
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bike');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-4 p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Bike' : 'Add New Bike'}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Bike Name *</label>
            <input className="input-field" placeholder="e.g. Honda CB150" value={form.name} onChange={set('name')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <input className="input-field" placeholder="e.g. Honda" value={form.brand} onChange={set('brand')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input className="input-field" placeholder="e.g. CB150R" value={form.model} onChange={set('model')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="input-field" value={form.type} onChange={set('type')}>
              {BIKE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price/Hour (NPR) *</label>
            <input type="number" className="input-field" placeholder="150" value={form.price_per_hour} onChange={set('price_per_hour')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price/Day (NPR) *</label>
            <input type="number" className="input-field" placeholder="1200" value={form.price_per_day} onChange={set('price_per_day')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <select className="input-field" value={form.location} onChange={set('location')}>
              <option value="">Select location</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">CC (Engine)</label>
            <input type="number" className="input-field" placeholder="150" value={form.cc} onChange={set('cc')} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select className="input-field" value={form.fuel_type} onChange={set('fuel_type')}>
              {FUEL_TYPES.map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="input-field" value={form.status} onChange={set('status')}>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select></div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input className="input-field" placeholder="https://..." value={form.image} onChange={set('image')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} placeholder="Describe the bike..." value={form.description} onChange={set('description')} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Bike' : 'Add Bike'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | bike object

  const fetchBikes = () => {
    setLoading(true);
    bikeAPI.getAllAdmin()
      .then(res => setBikes(res.data.bikes))
      .catch(() => toast.error('Failed to load bikes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBikes(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete bike "${name}"? This cannot be undone.`)) return;
    try {
      await bikeAPI.delete(id);
      toast.success('Bike deleted');
      fetchBikes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const statusClass = { available: 'badge-available', rented: 'badge-rented', maintenance: 'bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full' };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Bikes</h1>
          <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Bike
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Bike', 'Type', 'Location', 'Price/hr', 'Price/day', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bikes.map(bike => (
                    <tr key={bike.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-orange-50 rounded-lg overflow-hidden flex-shrink-0">
                            {bike.image ? <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-xl">🏍️</div>}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{bike.name}</div>
                            <div className="text-xs text-gray-400">{bike.brand} · {bike.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-gray-600">{bike.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{bike.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">NPR {parseFloat(bike.price_per_hour)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">NPR {parseFloat(bike.price_per_day).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={statusClass[bike.status] || 'badge-available'}>{bike.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModal(bike)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(bike.id, bike.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bikes.length === 0 && (
                <div className="text-center py-12 text-gray-500">No bikes yet. Add your first bike!</div>
              )}
            </div>
          </div>
        )}
      </div>

      {modal !== null && (
        <BikeModal
          bike={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={fetchBikes}
        />
      )}
    </div>
  );
};

export default AdminBikes;
