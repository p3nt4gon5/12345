import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Trash2, Eye, EyeOff, Upload, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminPokemon {
  id: string;
  pokemon_name: string;
  pokemon_image: string;
  hidden: boolean;
  created_at: string;
}

interface AdminAddPokemonPageProps {
  onBack: () => void;
}

const AdminAddPokemonPage: React.FC<AdminAddPokemonPageProps> = ({ onBack }) => {
  const [pokemons, setPokemons] = useState<AdminPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPokemon, setNewPokemon] = useState({
    name: '',
    image: '',
    hidden: false
  });
  const [addingPokemon, setAddingPokemon] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    if (newPokemon.image) {
      setImagePreview(newPokemon.image);
    }
  }, [newPokemon.image]);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_pokemon')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPokemons(data || []);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPokemon = async () => {
    if (!newPokemon.name.trim() || !newPokemon.image.trim()) {
      alert('Please fill in both name and image URL');
      return;
    }

    setAddingPokemon(true);
    try {
      const { error } = await supabase
        .from('admin_pokemon')
        .insert({
          pokemon_name: newPokemon.name.trim().toLowerCase(),
          pokemon_image: newPokemon.image.trim(),
          hidden: newPokemon.hidden
        });

      if (error) throw error;

      setNewPokemon({ name: '', image: '', hidden: false });
      setImagePreview('');
      fetchPokemons();
    } catch (error) {
      console.error('Error adding pokemon:', error);
      alert('Error adding Pokémon. Please try again.');
    } finally {
      setAddingPokemon(false);
    }
  };

  const handleDeletePokemon = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

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

  const fetchPokemonFromAPI = async (pokemonName: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon not found');
      
      const data = await response.json();
      const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
      
      setNewPokemon(prev => ({
        ...prev,
        name: data.name,
        image: imageUrl
      }));
    } catch (error) {
      alert('Pokémon not found in PokéAPI. Please enter details manually.');
    }
  };

  const filteredPokemons = pokemons.filter(pokemon =>
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
          <h2 className="text-2xl font-bold text-gray-800">Add Pokémon</h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: {pokemons.length} Pokémon
        </div>
      </div>

      {/* Add Pokemon Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Pokémon</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pokémon Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g., pikachu, charizard"
                  value={newPokemon.name}
                  onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => fetchPokemonFromAPI(newPokemon.name)}
                  disabled={!newPokemon.name.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Fetch from PokéAPI"
                >
                  <LinkIcon size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter a Pokémon name and click the link button to auto-fetch from PokéAPI
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/pokemon-image.png"
                value={newPokemon.image}
                onChange={(e) => setNewPokemon({ ...newPokemon, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hidden"
                checked={newPokemon.hidden}
                onChange={(e) => setNewPokemon({ ...newPokemon, hidden: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hidden" className="ml-2 text-sm text-gray-700">
                Hide from users initially
              </label>
            </div>

            <button
              onClick={handleAddPokemon}
              disabled={addingPokemon || !newPokemon.name.trim() || !newPokemon.image.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingPokemon ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Plus size={16} className="mr-2" />
              )}
              {addingPokemon ? 'Adding...' : 'Add Pokémon'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            {imagePreview ? (
              <div className="text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-48 h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  onError={() => setImagePreview('')}
                />
                <p className="text-sm text-gray-500 mt-2">Image Preview</p>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Upload size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Image preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
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

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon) => (
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
                onClick={() => handleDeletePokemon(pokemon.id, pokemon.pokemon_name)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPokemons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pokémon Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first Pokémon above'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAddPokemonPage;