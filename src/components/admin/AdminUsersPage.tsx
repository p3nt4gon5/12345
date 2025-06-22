import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Mail, User, MapPin, Phone, Globe, Ban, Trash2, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  is_public?: boolean;
  banned_until?: string | null;
  role: string;
  created_at: string;
  avatar_url?: string;
}

interface AdminUsersPageProps {
  onBack: () => void;
}

const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.filter(u => u.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBanUser = async (userId: string) => {
    const bannedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ banned_until: bannedUntil })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ banned_until: null })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        </div>
        <div className="text-sm text-gray-500">
          Total users: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">All Users</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 bg-white rounded-lg border cursor-pointer transition-all ${
                    selectedUser?.id === user.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-gray-500">@{user.username || 'no-username'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Admin</span>
                      )}
                      {user.banned_until && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Banned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">User Details</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
                      <User size={32} className="text-gray-600" />
                    </div>
                  )}
                  <h4 className="font-bold text-lg">{selectedUser.full_name || 'No name'}</h4>
                  <p className="text-gray-500">@{selectedUser.username || 'no-username'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                  
                  {selectedUser.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                  )}
                  
                  {selectedUser.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedUser.location}</span>
                    </div>
                  )}
                  
                  {selectedUser.website && (
                    <div className="flex items-center space-x-2">
                      <Globe size={16} className="text-gray-400" />
                      <a href={selectedUser.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm">Joined {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Bio</h5>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">{selectedUser.bio}</p>
                  </div>
                )}

                {/* Admin Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3">Admin Actions</h5>
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleAdminRole(selectedUser.id, selectedUser.role)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                      <Shield size={16} />
                      <span>{selectedUser.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</span>
                    </button>
                    
                    {selectedUser.banned_until ? (
                      <button
                        onClick={() => handleUnbanUser(selectedUser.id)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        <Ban size={16} />
                        <span>Unban User</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanUser(selectedUser.id)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      >
                        <Ban size={16} />
                        <span>Ban User (7 days)</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete User</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              <User size={48} className="mx-auto mb-3 text-gray-300" />
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;