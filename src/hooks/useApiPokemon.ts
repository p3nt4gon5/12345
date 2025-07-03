import { useState, useEffect, useCallback } from 'react';
import { PokemonService, PokemonListItem } from '../services/pokemonService';
import { Pokemon } from '../types/pokemon';

// Хук для работы с API покемонов с пагинацией
export const useApiPokemon = (limit: number = 20) => {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentOffset = reset ? 0 : offset;
      const response = await PokemonService.getPokemonList(currentOffset, limit);
      
      if (reset) {
        setPokemon(response.results);
        setOffset(limit);
      } else {
        setPokemon(prev => [...prev, ...response.results]);
        setOffset(prev => prev + limit);
      }
      
      setHasMore(!!response.next);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [offset, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPokemon(false);
    }
  }, [fetchPokemon, loading, hasMore]);

  const reset = useCallback(() => {
    setOffset(0);
    setPokemon([]);
    setHasMore(true);
    fetchPokemon(true);
  }, [fetchPokemon]);

  useEffect(() => {
    fetchPokemon(true);
  }, []);

  return {
    pokemon,
    loading,
    error,
    hasMore,
    loadMore,
    reset
  };
};

// Хук для получения детальной информации о покемоне
export const usePokemonDetails = (nameOrId: string | number | null) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nameOrId) {
      setPokemon(null);
      return;
    }

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PokemonService.getPokemonDetails(nameOrId);
        setPokemon(data);
      } catch (err: any) {
        setError(err.message);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [nameOrId]);

  return { pokemon, loading, error };
};

// Хук для пакетной загрузки покемонов
export const usePokemonBatch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatch = async (names: string[]): Promise<Pokemon[]> => {
    try {
      setLoading(true);
      setError(null);
      const pokemon = await PokemonService.getPokemonBatch(names);
      return pokemon;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchRange = async (start: number, end: number): Promise<Pokemon[]> => {
    try {
      setLoading(true);
      setError(null);
      const pokemon = await PokemonService.getPokemonRange(start, end);
      return pokemon;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchBatch,
    fetchRange,
    loading,
    error
  };
};