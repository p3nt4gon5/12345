import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Database, Heart, TrendingUp, Calendar, Activity, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminStatsPageProps {
  onBack: () => void;
}

interface StatsData {
  totalUsers: number;
  totalLibraryItems: number;
  totalFavorites: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  mostPopularPokemon: Array<{ name: string; count: number }>;
  userRegistrations: Array<{ date: string; count: number }>;
  dailyActivity: Array<{ date: string; users: number; pokemon: number }>;
}

const AdminStatsPage: React.FC<AdminStatsPageProps> = ({ onBack }) => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalLibraryItems: 0,
    totalFavorites: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    mostPopularPokemon: [],
    userRegistrations: [],
    dailyActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Total library items
      const { count: totalLibraryItems } = await supabase
        .from('user_pokemon')
        .select('*', { count: 'exact', head: true });

      // Total favorites
      const { count: totalFavorites } = await supabase
        .from('user_pokemon')
        .select('*', { count: 'exact', head: true })
        .eq('is_favorite', true);

      // New users this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: newUsersThisWeek } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // New users this month
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      // Most popular Pokemon
      const { data: pokemonData } = await supabase
        .from('user_pokemon')
        .select('pokemon_name')
        .limit(1000);

      const pokemonCounts: { [key: string]: number } = {};
      pokemonData?.forEach(item => {
        pokemonCounts[item.pokemon_name] = (pokemonCounts[item.pokemon_name] || 0) + 1;
      });

      const mostPopularPokemon = Object.entries(pokemonCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // User registrations over time (last 30 days)
      const { data: registrationData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', monthAgo.toISOString())
        .order('created_at', { ascending: true });

      const registrationsByDate: { [key: string]: number } = {};
      registrationData?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
      });

      const userRegistrations = Object.entries(registrationsByDate)
        .map(([date, count]) => ({ date, count }))
        .slice(-14); // Last 14 days

      // Daily activity data
      const { data: activityData } = await supabase
        .from('user_pokemon')
        .select('created_at')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true });

      const activityByDate: { [key: string]: number } = {};
      activityData?.forEach(item => {
        const date = new Date(item.created_at).toISOString().split('T')[0];
        activityByDate[date] = (activityByDate[date] || 0) + 1;
      });

      const dailyActivity = Object.entries(activityByDate)
        .map(([date, pokemon]) => ({ date, users: 0, pokemon }))
        .slice(-7);

      setStats({
        totalUsers: totalUsers || 0,
        totalLibraryItems: totalLibraryItems || 0,
        totalFavorites: totalFavorites || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        mostPopularPokemon,
        userRegistrations,
        dailyActivity
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  const maxRegistrations = Math.max(...stats.userRegistrations.map(r => r.count), 1);
  const maxPokemon = Math.max(...stats.mostPopularPokemon.map(p => p.count), 1);
  const maxActivity = Math.max(...stats.dailyActivity.map(a => a.pokemon), 1);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h2>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Library Items</p>
              <p className="text-3xl font-bold">{stats.totalLibraryItems}</p>
            </div>
            <Database size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Favorites</p>
              <p className="text-3xl font-bold">{stats.totalFavorites}</p>
            </div>
            <Heart size={32} className="text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">New This Week</p>
              <p className="text-3xl font-bold">{stats.newUsersThisWeek}</p>
            </div>
            <TrendingUp size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Registration Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            User Registrations (Last 14 Days)
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {stats.userRegistrations.length > 0 ? (
              stats.userRegistrations.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t flex items-end justify-center relative" style={{ height: '200px' }}>
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 w-full flex items-end justify-center text-white text-xs font-bold pb-1"
                      style={{ 
                        height: `${Math.max((item.count / maxRegistrations) * 180, 20)}px`,
                        minHeight: '20px'
                      }}
                    >
                      {item.count}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 w-full">No registration data available</p>
            )}
          </div>
        </div>

        {/* Most Popular Pokemon Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            Most Popular Pokémon
          </h3>
          <div className="space-y-3">
            {stats.mostPopularPokemon.length > 0 ? (
              stats.mostPopularPokemon.map((pokemon, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-800 capitalize flex-1">{pokemon.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max((pokemon.count / maxPokemon) * 100, 10)}%`,
                          minWidth: '10%'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-8 text-right">{pokemon.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No Pokémon data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Daily Pokémon Activity (Last 7 Days)
        </h3>
        <div className="h-48 flex items-end justify-between space-x-4">
          {stats.dailyActivity.length > 0 ? (
            stats.dailyActivity.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t flex items-end justify-center relative" style={{ height: '160px' }}>
                  <div 
                    className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all duration-500 w-full flex items-end justify-center text-white text-xs font-bold pb-1"
                    style={{ 
                      height: `${Math.max((item.pokemon / maxActivity) * 140, 15)}px`,
                      minHeight: '15px'
                    }}
                  >
                    {item.pokemon}
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4 w-full">No activity data available</p>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.newUsersThisWeek}</p>
            <p className="text-sm text-gray-600">New users this week</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.newUsersThisMonth}</p>
            <p className="text-sm text-gray-600">New users this month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalFavorites > 0 ? Math.round((stats.totalFavorites / stats.totalLibraryItems) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Favorite rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {stats.totalUsers > 0 ? Math.round(stats.totalLibraryItems / stats.totalUsers) : 0}
            </p>
            <p className="text-sm text-gray-600">Avg Pokémon per user</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;