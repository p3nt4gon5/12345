import { useState, useEffect } from 'react';
import { DatabaseService, DatabasePokemon } from '../services/databaseService';

// Хук для работы с покемонами из базы данных
export const useDatabasePokemon = () => {
  const [pokemon, setPokemon] = useState<DatabasePokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getAllPokemon();
      setPokemon(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  return {
    pokemon,
    loading,
    error,
    refetch: fetchPokemon
  };
};

// Хук для поиска покемонов в базе данных
export const useSearchDatabasePokemon = (query: string) => {
  const [results, setResults] = useState<DatabasePokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchPokemon = async () => {
      try {
        setLoading(true);
        const data = await DatabaseService.searchPokemonInDatabase(query);
        setResults(data);
      } catch (error) {
        console.error('Error searching pokemon:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading };
};

// Хук для проверки наличия покемонов в базе данных
export const usePokemonInDatabase = () => {
  const [pokemonIds, setPokemonIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchPokemonIds = async () => {
    try {
      setLoading(true);
      const ids = await DatabaseService.getPokemonIdsInDatabase();
      setPokemonIds(new Set(ids));
    } catch (error) {
      console.error('Error fetching pokemon IDs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonIds();
  }, []);

  const isPokemonInDatabase = (id: number) => pokemonIds.has(id);

  const addPokemonId = (id: number) => {
    setPokemonIds(prev => new Set([...prev, id]));
  };

  const removePokemonId = (id: number) => {
    setPokemonIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return {
    isPokemonInDatabase,
    addPokemonId,
    removePokemonId,
    refetch: fetchPokemonIds,
    loading
  };
};