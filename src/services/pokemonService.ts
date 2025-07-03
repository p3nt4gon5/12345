import { Pokemon } from '../types/pokemon';

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export class PokemonService {
  // Получить список покемонов с пагинацией
  static async getPokemonList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
    try {
      const response = await fetch(`${POKEMON_API_BASE}/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pokemon list');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pokemon list:', error);
      throw error;
    }
  }

  // Получить детальную информацию о покемоне
  static async getPokemonDetails(nameOrId: string | number): Promise<Pokemon> {
    try {
      const response = await fetch(`${POKEMON_API_BASE}/pokemon/${nameOrId}`);
      if (!response.ok) {
        throw new Error(`Pokemon ${nameOrId} not found`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching pokemon ${nameOrId}:`, error);
      throw error;
    }
  }

  // Получить несколько покемонов одновременно
  static async getPokemonBatch(names: string[]): Promise<Pokemon[]> {
    try {
      const promises = names.map(name => this.getPokemonDetails(name));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching pokemon batch:', error);
      throw error;
    }
  }

  // Получить покемонов по диапазону ID
  static async getPokemonRange(start: number, end: number): Promise<Pokemon[]> {
    try {
      const promises = [];
      for (let i = start; i <= end; i++) {
        promises.push(this.getPokemonDetails(i));
      }
      return await Promise.all(promises);
    } catch (error) {
      console.error(`Error fetching pokemon range ${start}-${end}:`, error);
      throw error;
    }
  }

  // Поиск покемонов по имени (используется для автокомплита)
  static async searchPokemon(query: string, limit: number = 1000): Promise<string[]> {
    try {
      const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pokemon for search');
      }
      const data: PokemonListResponse = await response.json();
      
      return data.results
        .map(p => p.name)
        .filter(name => name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 20);
    } catch (error) {
      console.error('Error searching pokemon:', error);
      return [];
    }
  }
}