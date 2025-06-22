import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

// Custom hook to get complete Pokemon list for fuzzy search
export const usePokemonList = () => {
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  
  useEffect(() => {
    // Fetch all Pokemon names for search functionality
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=1500`);
        const data: PokemonListResponse = await response.json();
        setPokemonList(data.results.map(p => p.name));
      } catch (error) {
        console.error('Error fetching pokemon list:', error);
      }
    };
    
    fetchPokemonList();
  }, []);
  
  return pokemonList;
};

// Custom hook to fetch single Pokemon data by name
export const usePokemon = (name: string | null) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!name) return;
    
    // Fetch detailed Pokemon data from API
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await response.json();
        setPokemon(data);
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

// Enhanced search hook with fuzzy matching for typo tolerance
export const useSearchPokemon = (query: string) => {
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const pokemonList = usePokemonList();
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    // Implement fuzzy search with typo tolerance
    const searchPokemon = async () => {
      setLoading(true);
      
      // Configure Fuse.js for fuzzy search with typo tolerance
      const fuse = new Fuse(pokemonList, {
        threshold: 0.4, // Allow for typos and partial matches
        distance: 100,
        minMatchCharLength: 1,
        includeScore: true,
        keys: ['']
      });
      
      // Get fuzzy search results
      const fuzzyResults = fuse.search(query.toLowerCase());
      const matchedNames = fuzzyResults
        .slice(0, 12) // Limit to 12 results for performance
        .map(result => result.item);
      
      try {
        // Fetch detailed data for matched Pokemon
        const pokemonPromises = matchedNames.map(async (name) => {
          const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name}`);
          return response.json();
        });
        
        const pokemonData = await Promise.all(pokemonPromises);
        setResults(pokemonData);
      } catch (error) {
        console.error('Error searching pokemon:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search to avoid too many API calls
    const debounceTimer = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, pokemonList]);
  
  return { results, loading };
};

// Hook for search suggestions with fuzzy matching
export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const pokemonList = usePokemonList();
  
  useEffect(() => {
    if (!query.trim() || pokemonList.length === 0) {
      setSuggestions([]);
      return;
    }
    
    // Generate search suggestions with fuzzy matching
    const fuse = new Fuse(pokemonList, {
      threshold: 0.3, // Stricter threshold for suggestions
      distance: 50,
      minMatchCharLength: 1,
      keys: ['']
    });
    
    const fuzzyResults = fuse.search(query.toLowerCase());
    const matchedNames = fuzzyResults
      .slice(0, 8) // Show top 8 suggestions
      .map(result => result.item);
    
    setSuggestions(matchedNames);
  }, [query, pokemonList]);
  
  return suggestions;
};