import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, UserX, UserCheck } from 'lucide-react';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers(roleFilter ? { role: roleFilter } : {})
      .then(res => setUsers(res.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const toggleActive = async (user) => {
    try {
      await adminAPI.updateUser(user.id, { is_active: !user.is_active });
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const changeRole = async (user, role) => {
    if (!confirm(`Change ${user.name}'s role to ${role}?`)) return;
    try {
      await adminAPI.updateUser(user.id, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(user.id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const roleColors = {
    customer: 'bg-gray-100 text-gray-700',
    admin: 'bg-blue-100 text-blue-700',
    superadmin: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <select className="input-field w-40" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
            <option value="superadmin">Super Admins</option>
          </select>
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
                    {['User', 'Role', 'Phone', 'License', 'Loyalty Pts', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[user.role]}`}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.license_number || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium text-yellow-600">⭐ {user.loyalty_points}</td>
                      <td className="px-4 py-3">
                        <span className={user.is_active ? 'badge-available' : 'badge-rejected'}>{user.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3">
                        {user.id !== currentUser.id && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleActive(user)}
                              className={`p-1.5 rounded-lg transition-colors ${user.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                              title={user.is_active ? 'Deactivate' : 'Activate'}>
                              {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                            {user.role === 'customer' && (
                              <button onClick={() => changeRole(user, 'admin')}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Make Admin">
                                <Shield size={16} />
                              </button>
                            )}
                            {user.role === 'admin' && (
                              <button onClick={() => changeRole(user, 'customer')}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Remove Admin">
                                <Shield size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="text-center py-12 text-gray-500">No users found</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
