import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  FileText,
  ChevronRight,
  TrendingUp,
  Shield,
  Database,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminPokemonPage from './admin/AdminPokemonPage';
import AdminStatsPage from './admin/AdminStatsPage';
import AdminManagementPage from './admin/AdminManagementPage';
import AdminAddPokemonPage from './admin/AdminAddPokemonPage';
import AdminEmptyPage from './admin/AdminEmptyPage';
import AdminAllPokemonPage from './admin/AdminAllPokemonPage';
import AdminDatabasePokemonPage from './admin/AdminDatabasePokemonPage';

type AdminView = 'dashboard' | 'users' | 'pokemon' | 'stats' | 'management' | 'add-pokemon' | 'empty' | 'all-pokemon' | 'database-pokemon';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    userCount,
    libraryCount,
    favoritesCount,
    loading: statsLoading
  } = useUserStats();

  const [role, setRole] = useState<string | null>(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;

      const { data: roleData, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
        return;
      }

      setRole(roleData?.role ?? null);
      setIsRoleLoaded(true);
    };

    fetchInitialData();
  }, [user]);

  if (!user || !isRoleLoaded) return null;

  if (role !== 'admin') {
    return (
      <div className="text-center mt-20 text-blue-800 font-semibold">
        ⛔ You don't have permission to access the admin panel.
      </div>
    );
  }

  // Render specific admin view
  if (currentView !== 'dashboard') {
    const renderView = () => {
      switch (currentView) {
        case 'users':
          return <AdminUsersPage onBack={() => setCurrentView('dashboard')} />;
        case 'pokemon':
          return <AdminPokemonPage onBack={() => setCurrentView('dashboard')} />;
        case 'stats':
          return <AdminStatsPage onBack={() => setCurrentView('dashboard')} />;
        case 'management':
          return <AdminManagementPage onBack={() => setCurrentView('dashboard')} />;
        case 'add-pokemon':
          return <AdminAddPokemonPage onBack={() => setCurrentView('dashboard')} />;
        case 'all-pokemon':
          return <AdminAllPokemonPage onBack={() => setCurrentView('dashboard')} />;
        case 'database-pokemon':
          return <AdminDatabasePokemonPage onBack={() => setCurrentView('dashboard')} />;
        case 'empty':
          return <AdminEmptyPage onBack={() => setCurrentView('dashboard')} />;
        default:
          return null;
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-blue-300 mt-8">
        {renderView()}
      </div>
    );
  }

  // Dashboard view with cards
  const adminCards = [
    {
      id: 'users',
      title: 'User Management',
      description: 'View and manage all registered users',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      stats: `${statsLoading ? '...' : userCount} users`,
      onClick: () => setCurrentView('users')
    },
    {
      id: 'all-pokemon',
      title: 'All Pokémon (API)',
      description: 'Browse all Pokémon from API and add to database',
      icon: Download,
      color: 'from-purple-500 to-purple-600',
      stats: 'API Integration',
      onClick: () => setCurrentView('all-pokemon')
    },
    {
      id: 'database-pokemon',
      title: 'Database Pokémon',
      description: 'Manage Pokémon stored in your database',
      icon: Database,
      color: 'from-green-500 to-green-600',
      stats: 'Database Only',
      onClick: () => setCurrentView('database-pokemon')
    },
    {
      id: 'stats',
      title: 'Statistics',
      description: 'View detailed analytics and user statistics',
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      stats: `${statsLoading ? '...' : favoritesCount} favorites`,
      onClick: () => setCurrentView('stats')
    },
    {
      id: 'management',
      title: 'User Management',
      description: 'Ban, delete users and manage admin rights',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      stats: 'Admin tools',
      onClick: () => setCurrentView('management')
    },
    {
      id: 'add-pokemon',
      title: 'Add Pokémon (Legacy)',
      description: 'Legacy Pokemon addition interface',
      icon: Plus,
      color: 'from-yellow-500 to-yellow-600',
      stats: 'Legacy feature',
      onClick: () => setCurrentView('add-pokemon')
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-300 mt-8 p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-blue-700 mb-2 flex items-center">
          <Shield className="mr-3" size={32} />
          Admin Dashboard
        </h3>
        <p className="text-gray-600">Manage your Pokémon application from this central hub</p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-blue-700 font-semibold mb-1">Total Users</h4>
              <p className="text-2xl font-bold text-blue-800">{statsLoading ? '...' : userCount}</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-green-700 font-semibold mb-1">Library Items</h4>
              <p className="text-2xl font-bold text-green-800">{statsLoading ? '...' : libraryCount}</p>
            </div>
            <Database className="text-green-600" size={32} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-purple-700 font-semibold mb-1">Favorites</h4>
              <p className="text-2xl font-bold text-purple-800">{statsLoading ? '...' : favoritesCount}</p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Admin Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="text-white" size={24} />
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h4>
                <ChevronRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {card.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {card.stats}
                </span>
                <span className="text-xs text-blue-600 font-medium group-hover:text-blue-700">
                  Click to open →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Admin Panel v2.0 - Database Integration</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;