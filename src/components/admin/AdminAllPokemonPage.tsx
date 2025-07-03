import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Check, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import { useApiPokemon, usePokemonBatch } from '../../hooks/useApiPokemon';
import { usePokemonInDatabase } from '../../hooks/useDatabasePokemon';
import { DatabaseService } from '../../services/databaseService';
import { PokemonService } from '../../services/pokemonService';
import { Pokemon } from '../../types/pokemon';

interface AdminAllPokemonPageProps {
  onBack: () => void;
}

interface PokemonWithStatus {
  id: number;
  name: string;
  url: string;
  inDatabase: boolean;
  details?: Pokemon;
  loading?: boolean;
}

const AdminAllPokemonPage: React.FC<AdminAllPokemonPageProps> = ({ onBack }) => {
  const { pokemon: apiPokemon, loading: apiLoading, hasMore, loadMore } = useApiPokemon(50);
  const { isPokemonInDatabase, addPokemonId, loading: dbLoading, refetch: refetchDbStatus } = usePokemonInDatabase();
  const { fetchBatch } = usePokemonBatch();
  
  const [pokemonWithStatus, setPokemonWithStatus] = useState<PokemonWithStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'inDatabase' | 'notInDatabase'>('all');
  const [addingPokemon, setAddingPokemon] = useState<Set<number>>(new Set());
  const [loadingDetails, setLoadingDetails] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем права администратора
  useEffect(() => {
    const checkAdminRights = async () => {
      try {
        const adminStatus = await DatabaseService.checkAdminRights();
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          setError('У вас нет прав администратора для выполнения этих действий');
        }
      } catch (error) {
        console.error('Error checking admin rights:', error);
        setError('Ошибка проверки прав доступа');
      }
    };

    checkAdminRights();
  }, []);

  // Обновляем статус покемонов при изменении данных
  useEffect(() => {
    const updatePokemonStatus = () => {
      const updated = apiPokemon.map(p => {
        const id = parseInt(p.url.split('/').slice(-2, -1)[0]);
        return {
          id,
          name: p.name,
          url: p.url,
          inDatabase: isPokemonInDatabase(id)
        };
      });
      setPokemonWithStatus(updated);
    };

    if (!dbLoading) {
      updatePokemonStatus();
    }
  }, [apiPokemon, isPokemonInDatabase, dbLoading]);

  // Загрузка детальной информации о покемоне
  const loadPokemonDetails = useCallback(async (pokemon: PokemonWithStatus) => {
    if (pokemon.details || loadingDetails.has(pokemon.id)) return;

    setLoadingDetails(prev => new Set([...prev, pokemon.id]));
    
    try {
      const details = await PokemonService.getPokemonDetails(pokemon.name);
      setPokemonWithStatus(prev => 
        prev.map(p => 
          p.id === pokemon.id 
            ? { ...p, details }
            : p
        )
      );
    } catch (error) {
      console.error(`Error loading details for ${pokemon.name}:`, error);
    } finally {
      setLoadingDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(pokemon.id);
        return newSet;
      });
    }
  }, [loadingDetails]);

  // Добавление покемона в базу данных
  const handleAddPokemon = async (pokemon: PokemonWithStatus) => {
    if (!isAdmin) {
      setError('У вас нет прав администратора');
      return;
    }

    if (pokemon.inDatabase || addingPokemon.has(pokemon.id)) {
      console.log('Pokemon already in database or being added');
      return;
    }

    console.log('Starting to add pokemon:', pokemon.name, pokemon.id);
    setError(null); // Очищаем предыдущие ошибки

    setAddingPokemon(prev => new Set([...prev, pokemon.id]));

    try {
      // Загружаем детали если их нет
      let pokemonDetails = pokemon.details;
      if (!pokemonDetails) {
        console.log('Loading pokemon details first...');
        pokemonDetails = await PokemonService.getPokemonDetails(pokemon.name);
        
        // Обновляем локальное состояние с деталями
        setPokemonWithStatus(prev =>
          prev.map(p =>
            p.id === pokemon.id
              ? { ...p, details: pokemonDetails }
              : p
          )
        );
      }

      console.log('Adding pokemon to database:', pokemonDetails);
      await DatabaseService.addPokemonToDatabase(pokemonDetails);
      
      console.log('Pokemon added successfully, updating UI...');
      
      // Обновляем статус в локальном состоянии
      setPokemonWithStatus(prev =>
        prev.map(p =>
          p.id === pokemon.id
            ? { ...p, inDatabase: true }
            : p
        )
      );
      
      // Обновляем глобальное состояние
      addPokemonId(pokemon.id);
      
      console.log('UI updated successfully');
      
    } catch (error: any) {
      console.error('Error adding pokemon to database:', error);
      setError(`Ошибка добавления покемона ${pokemon.name}: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setAddingPokemon(prev => {
        const newSet = new Set(prev);
        newSet.delete(pokemon.id);
        return newSet;
      });
    }
  };

  // Массовое добавление первых 100 покемонов
  const handleImportFirst100 = async () => {
    if (!isAdmin) {
      setError('У вас нет прав администратора');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите импортировать первые 100 покемонов? Это может занять некоторое время.')) {
      return;
    }

    try {
      setAddingPokemon(new Set([...Array(100)].map((_, i) => i + 1)));
      setError(null);
      
      console.log('Starting import of first 100 pokemon...');
      
      // Загружаем первые 100 покемонов
      const first100Pokemon = await fetchBatch(
        [...Array(100)].map((_, i) => (i + 1).toString())
      );
      
      console.log('Fetched pokemon from API:', first100Pokemon.length);
      
      // Импортируем в базу данных
      await DatabaseService.importPokemonBatch(first100Pokemon);
      
      console.log('Imported to database successfully');
      
      // Обновляем локальное состояние
      const importedIds = first100Pokemon.map(p => p.id);
      setPokemonWithStatus(prev =>
        prev.map(p =>
          importedIds.includes(p.id)
            ? { ...p, inDatabase: true }
            : p
        )
      );
      
      // Обновляем глобальное состояние
      importedIds.forEach(id => addPokemonId(id));
      
      // Обновляем статус из базы данных
      await refetchDbStatus();
      
      console.log('Import completed successfully');
      
    } catch (error: any) {
      console.error('Error importing first 100 pokemon:', error);
      setError(`Ошибка импорта: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setAddingPokemon(new Set());
    }
  };

  // Фильтрация покемонов
  const filteredPokemon = pokemonWithStatus.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'inDatabase' && pokemon.inDatabase) ||
      (filterStatus === 'notInDatabase' && !pokemon.inDatabase);
    
    return matchesSearch && matchesFilter;
  });

  // Обработчик скролла для ленивой загрузки
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (apiLoading && pokemonWithStatus.length === 0) {
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
          <p>Loading Pokémon from API...</p>
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
          <h2 className="text-2xl font-bold text-gray-800">All Pokémon (API)</h2>
        </div>
        <div className="text-sm text-gray-500">
          Loaded: {pokemonWithStatus.length} | In Database: {pokemonWithStatus.filter(p => p.inDatabase).length}
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="text-red-800 font-medium">Ошибка</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-2 underline"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Предупреждение о правах */}
      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={20} />
          <div>
            <h4 className="text-yellow-800 font-medium">Ограниченный доступ</h4>
            <p className="text-yellow-700 text-sm mt-1">
              У вас нет прав администратора. Вы можете просматривать покемонов, но не можете добавлять их в базу данных.
            </p>
          </div>
        </div>
      )}

      {/* Панель управления */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Фильтр */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Pokémon</option>
                <option value="inDatabase">In Database</option>
                <option value="notInDatabase">Not in Database</option>
              </select>
            </div>
          </div>

          {/* Кнопка массового импорта */}
          {isAdmin && (
            <button
              onClick={handleImportFirst100}
              disabled={addingPokemon.size > 0}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingPokemon.size > 0 ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Plus size={16} className="mr-2" />
              )}
              Import First 100
            </button>
          )}
        </div>
      </div>

      {/* Сетка покемонов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPokemon.map((pokemon) => (
          <PokemonApiCard
            key={pokemon.id}
            pokemon={pokemon}
            onAddToDatabase={() => handleAddPokemon(pokemon)}
            onLoadDetails={() => loadPokemonDetails(pokemon)}
            isAdding={addingPokemon.has(pokemon.id)}
            isLoadingDetails={loadingDetails.has(pokemon.id)}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Индикатор загрузки */}
      {apiLoading && (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={32} />
          <p className="text-gray-600">Loading more Pokémon...</p>
        </div>
      )}

      {/* Сообщение о конце списка */}
      {!hasMore && pokemonWithStatus.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">All Pokémon loaded!</p>
        </div>
      )}

      {/* Пустое состояние */}
      {filteredPokemon.length === 0 && !apiLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pokémon Found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search terms' : 'No Pokémon match the current filter'}
          </p>
        </div>
      )}
    </div>
  );
};

// Компонент карточки покемона из API
interface PokemonApiCardProps {
  pokemon: PokemonWithStatus;
  onAddToDatabase: () => void;
  onLoadDetails: () => void;
  isAdding: boolean;
  isLoadingDetails: boolean;
  isAdmin: boolean;
}

const PokemonApiCard: React.FC<PokemonApiCardProps> = ({
  pokemon,
  onAddToDatabase,
  onLoadDetails,
  isAdding,
  isLoadingDetails,
  isAdmin
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Загружаем детали при наведении
  const handleMouseEnter = () => {
    if (!pokemon.details && !isLoadingDetails) {
      onLoadDetails();
    }
  };

  const imageUrl = pokemon.details?.sprites?.other?.['official-artwork']?.front_default ||
                   pokemon.details?.sprites?.front_default ||
                   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
      onMouseEnter={handleMouseEnter}
    >
      {/* Изображение */}
      <div className="relative mb-3 h-32 flex items-center justify-center bg-gray-50 rounded-lg">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={pokemon.name}
            className={`max-w-full max-h-full object-contain transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-1">❓</div>
            <div className="text-xs">No image</div>
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        )}

        {/* Статус в базе данных */}
        <div className="absolute top-2 right-2">
          {pokemon.inDatabase ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Check size={12} className="mr-1" />
              In DB
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Not in DB
            </span>
          )}
        </div>
      </div>

      {/* Информация */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-800 capitalize mb-1">
          {pokemon.name}
        </h4>
        <p className="text-xs text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</p>
        
        {/* Типы покемона */}
        {pokemon.details?.types && (
          <div className="flex flex-wrap gap-1 mt-2">
            {pokemon.details.types.map((type, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка добавления */}
      <button
        onClick={onAddToDatabase}
        disabled={pokemon.inDatabase || isAdding || !isAdmin}
        className={`w-full flex items-center justify-center px-3 py-2 rounded text-sm transition-colors ${
          pokemon.inDatabase
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : isAdding
            ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
            : !isAdmin
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title={!isAdmin ? 'Требуются права администратора' : ''}
      >
        {isAdding ? (
          <>
            <Loader2 className="animate-spin mr-2" size={14} />
            Adding...
          </>
        ) : pokemon.inDatabase ? (
          <>
            <Check size={14} className="mr-2" />
            In Database
          </>
        ) : !isAdmin ? (
          <>
            <Plus size={14} className="mr-2" />
            No Access
          </>
        ) : (
          <>
            <Plus size={14} className="mr-2" />
            Add to Database
          </>
        )}
      </button>
    </div>
  );
};

export default AdminAllPokemonPage;