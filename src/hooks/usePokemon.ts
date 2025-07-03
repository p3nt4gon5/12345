import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Pokemon } from '../types/pokemon';
import { DatabaseService, DatabasePokemon } from '../services/databaseService';

// Преобразование DatabasePokemon в Pokemon для совместимости
const convertDatabasePokemonToPokemon = (dbPokemon: DatabasePokemon): Pokemon => ({
  id: dbPokemon.id,
  name: dbPokemon.name,
  url: `https://pokeapi.co/api/v2/pokemon/${dbPokemon.id}/`,
  height: dbPokemon.height,
  weight: dbPokemon.weight,
  types: dbPokemon.types,
  abilities: dbPokemon.abilities,
  stats: dbPokemon.stats,
  sprites: dbPokemon.sprites,
  species: dbPokemon.species_url ? { url: dbPokemon.species_url } : undefined
});

// Хук для получения списка покемонов из базы данных
export const usePokemonList = () => {
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const dbPokemon = await DatabaseService.getAllPokemon();
        setPokemonList(dbPokemon.map(p => p.name));
      } catch (error) {
        console.error('Error fetching pokemon list from database:', error);
      }
    };
    
    fetchPokemonList();
  }, []);
  
  return pokemonList;
};

// Хук для получения одного покемона из базы данных
export const usePokemon = (name: string | null) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!name) return;
    
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        // Сначала пытаемся найти в базе данных
        const dbPokemon = await DatabaseService.searchPokemonInDatabase(name);
        const foundPokemon = dbPokemon.find(p => p.name.toLowerCase() === name.toLowerCase());
        
        if (foundPokemon) {
          setPokemon(convertDatabasePokemonToPokemon(foundPokemon));
        } else {
          throw new Error('Pokemon not found in database');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemon();
  }, [name]);
  
  return { pokemon, loading, error };
};

// Хук для поиска покемонов в базе данных с fuzzy matching
export const useSearchPokemon = (query: string) => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const pokemonList = usePokemonList();
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const searchPokemon = async () => {
      setLoading(true);
      
      try {
        // Fuzzy search по именам из базы данных
        const fuse = new Fuse(pokemonList, {
          threshold: 0.4,
          distance: 100,
          minMatchCharLength: 1,
          includeScore: true,
          keys: ['']
        });
        
        const fuzzyResults = fuse.search(query.toLowerCase());
        const matchedNames = fuzzyResults
          .slice(0, 12)
          .map(result => result.item);
        
        if (matchedNames.length > 0) {
          // Получаем детальную информацию из базы данных
          const dbPokemon = await DatabaseService.searchPokemonInDatabase(query);
          const filteredPokemon = dbPokemon.filter(p => 
            matchedNames.includes(p.name)
          );
          
          const convertedPokemon = filteredPokemon.map(convertDatabasePokemonToPokemon);
          setResults(convertedPokemon);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching pokemon in database:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, pokemonList]);
  
  return { results, loading };
};

// Хук для предложений поиска
export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const pokemonList = usePokemonList();
  
  useEffect(() => {
    if (!query.trim() || pokemonList.length === 0) {
      setSuggestions([]);
      return;
    }
    
    const fuse = new Fuse(pokemonList, {
      threshold: 0.3,
      distance: 50,
      minMatchCharLength: 1,
      keys: ['']
    });
    
    const fuzzyResults = fuse.search(query.toLowerCase());
    const matchedNames = fuzzyResults
      .slice(0, 8)
      .map(result => result.item);
    
    setSuggestions(matchedNames);
  }, [query, pokemonList]);
  
  return suggestions;
};