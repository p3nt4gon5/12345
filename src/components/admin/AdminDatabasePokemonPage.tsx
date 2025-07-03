import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2, Eye, EyeOff, Edit } from 'lucide-react';
import { useDatabasePokemon } from '../../hooks/useDatabasePokemon';
import { DatabaseService } from '../../services/databaseService';

interface AdminDatabasePokemonPageProps {
  onBack: () => void;
}

const AdminDatabasePokemonPage: React.FC<AdminDatabasePokemonPageProps> = ({ onBack }) => {
  const { pokemon, loading, refetch } = useDatabasePokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [removingPokemon, setRemovingPokemon] = useState<Set<number>>(new Set());

  const handleRemovePokemon = async (pokemonId: number, pokemonName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${pokemonName} from the database?`)) {
      return;
    }

    setRemovingPokemon(prev => new Set([...prev, pokemonId]));

    try {
      await DatabaseService.removePokemonFromDatabase(pokemonId);
      await refetch(); // Обновляем список
    } catch (error) {
      console.error('Error removing pokemon:', error);
    } finally {
      setRemovingPokemon(prev => {
        const newSet = new Set(prev);
        newSet.delete(pokemonId);
        return newSet;
      });
    }
  };

  const filteredPokemon = pokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p>Loading database Pokémon...</p>
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
          <h2 className="text-2xl font-bold text-gray-800">Database Pokémon</h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: {pokemon.length} Pokémon in database
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Pokémon in database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Сетка покемонов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemon.map((pokemon) => (
          <div key={pokemon.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="relative mb-3">
              <img
                src={pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default}
                alt={pokemon.name}
                className="w-full h-32 object-contain rounded-lg bg-gray-50"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
                }}
              />
              
              <div className="absolute top-2 right-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 mb-1 capitalize">{pokemon.name}</h4>
              <p className="text-xs text-gray-500 mb-2">#{pokemon.id.toString().padStart(3, '0')}</p>
              
              {/* Типы */}
              <div className="flex flex-wrap gap-1 mb-2">
                {pokemon.types.map((type: any, index: number) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              
              {/* Характеристики */}
              <div className="text-xs text-gray-600">
                <div>Height: {pokemon.height / 10}m</div>
                <div>Weight: {pokemon.weight / 10}kg</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleRemovePokemon(pokemon.id, pokemon.name)}
                disabled={removingPokemon.has(pokemon.id)}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {removingPokemon.has(pokemon.id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredPokemon.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No Pokémon Found' : 'No Pokémon in Database'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Start by adding Pokémon from the API to your database'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDatabasePokemonPage;