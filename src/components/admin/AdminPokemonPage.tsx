import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminPokemon {
  id: string;
  pokemon_name: string;
  pokemon_image: string;
  hidden: boolean;
  created_at: string;
}

interface UserPokemon {
  id: string;
  pokemon_name: string;
  pokemon_data: any;
  is_favorite: boolean;
  user_id: string;
  created_at: string;
}

interface AdminPokemonPageProps {
  onBack: () => void;
}

const AdminPokemonPage: React.FC<AdminPokemonPageProps> = ({ onBack }) => {
  const [adminPokemons, setAdminPokemons] = useState<AdminPokemon[]>([]);
  const [userPokemons, setUserPokemons] = useState<UserPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [newPokemon, setNewPokemon] = useState({ name: '', image: '' });

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      // Fetch admin pokemons
      const { data: adminData, error: adminError } = await supabase
        .from('admin_pokemon')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;

      // Fetch user pokemons
      const { data: userData, error: userError } = await supabase
        .from('user_pokemon')
        .select('*')
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      setAdminPokemons(adminData || []);
      setUserPokemons(userData || []);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPokemon = async () => {
    if (!newPokemon.name || !newPokemon.image) return;

    try {
      const { error } = await supabase
        .from('admin_pokemon')
        .insert({
          pokemon_name: newPokemon.name,
          pokemon_image: newPokemon.image,
          hidden: false
        });

      if (error) throw error;

      setNewPokemon({ name: '', image: '' });
      fetchPokemons();
    } catch (error) {
      console.error('Error adding pokemon:', error);
    }
  };

  const handleDeletePokemon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Pokémon?')) return;

    try {
      const { error } = await supabase
        .from('admin_pokemon')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPokemons();
    } catch (error) {
      console.error('Error deleting pokemon:', error);
    }
  };

  const toggleVisibility = async (id: string, hidden: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_pokemon')
        .update({ hidden: !hidden })
        .eq('id', id);

      if (error) throw error;
      fetchPokemons();
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const filteredAdminPokemons = adminPokemons.filter(pokemon =>
    pokemon.pokemon_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserPokemons = userPokemons.filter(pokemon =>
    pokemon.pokemon_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p>Loading Pokémon...</p>
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
          <h2 className="text-2xl font-bold text-gray-800">Pokémon Management</h2>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Admin Pokémon ({adminPokemons.length})
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'user'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            User Pokémon ({userPokemons.length})
          </button>
        </div>
      </div>

      {/* Add Pokemon Form (only for admin tab) */}
      {activeTab === 'admin' && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Add New Pokémon</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Pokémon name"
              value={newPokemon.name}
              onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newPokemon.image}
              onChange={(e) => setNewPokemon({ ...newPokemon, image: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddPokemon}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeTab === 'admin' ? (
          filteredAdminPokemons.map((pokemon) => (
            <div key={pokemon.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="relative mb-3">
                <img
                  src={pokemon.pokemon_image}
                  alt={pokemon.pokemon_name}
                  className="w-full h-32 object-contain rounded-lg bg-gray-50"
                />
                <div className="absolute top-2 right-2">
                  {pokemon.hidden ? (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Hidden</span>
                  ) : (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Visible</span>
                  )}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2 capitalize">{pokemon.pokemon_name}</h4>
              <p className="text-xs text-gray-500 mb-3">Added: {new Date(pokemon.created_at).toLocaleDateString()}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleVisibility(pokemon.id, pokemon.hidden)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded text-sm transition-colors ${
                    pokemon.hidden
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {pokemon.hidden ? <Eye size={14} className="mr-1" /> : <EyeOff size={14} className="mr-1" />}
                  {pokemon.hidden ? 'Show' : 'Hide'}
                </button>
                
                <button
                  onClick={() => handleDeletePokemon(pokemon.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          filteredUserPokemons.map((pokemon) => (
            <div key={pokemon.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="relative mb-3">
                <img
                  src={pokemon.pokemon_data?.sprites?.other?.['official-artwork']?.front_default || pokemon.pokemon_data?.sprites?.front_default}
                  alt={pokemon.pokemon_name}
                  className="w-full h-32 object-contain rounded-lg bg-gray-50"
                />
                {pokemon.is_favorite && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">❤️ Favorite</span>
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold text-gray-800 mb-2 capitalize">{pokemon.pokemon_name}</h4>
              <p className="text-xs text-gray-500 mb-1">User ID: {pokemon.user_id.slice(0, 8)}...</p>
              <p className="text-xs text-gray-500">Added: {new Date(pokemon.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'admin' && filteredAdminPokemons.length === 0) || 
        (activeTab === 'user' && filteredUserPokemons.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pokémon Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No Pokémon available in this category'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPokemonPage;