import { supabase } from '../lib/supabase';
import { Pokemon } from '../types/pokemon';

export interface DatabasePokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: any[];
  abilities: any[];
  stats: any[];
  sprites: any;
  species_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  // Получить всех покемонов из базы данных
  static async getAllPokemon(): Promise<DatabasePokemon[]> {
    try {
      const { data, error } = await supabase
        .from('external_pokemon')
        .select('*')
        .eq('is_active', true)
        .order('id');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching pokemon from database:', error);
      throw error;
    }
  }

  // Проверить, есть ли покемон в базе данных
  static async isPokemonInDatabase(pokemonId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('external_pokemon')
        .select('id')
        .eq('id', pokemonId)
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error);
        throw error;
      }
      return !!data;
    } catch (error) {
      console.error('Error checking pokemon in database:', error);
      return false;
    }
  }

  // Получить список ID покемонов в базе данных
  static async getPokemonIdsInDatabase(): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('external_pokemon')
        .select('id')
        .eq('is_active', true);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data?.map(p => p.id) || [];
    } catch (error) {
      console.error('Error fetching pokemon IDs from database:', error);
      return [];
    }
  }

  // Добавить покемона в базу данных
  static async addPokemonToDatabase(pokemon: Pokemon): Promise<DatabasePokemon> {
    try {
      console.log('Adding pokemon to database:', pokemon.name, pokemon.id);
      
      const pokemonData = {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        abilities: pokemon.abilities,
        stats: pokemon.stats,
        sprites: pokemon.sprites,
        species_url: pokemon.species?.url || null,
        is_active: true
      };

      console.log('Pokemon data to insert:', pokemonData);

      const { data, error } = await supabase
        .from('external_pokemon')
        .insert(pokemonData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Successfully added pokemon:', data);
      return data;
    } catch (error) {
      console.error('Error adding pokemon to database:', error);
      throw error;
    }
  }

  // Удалить покемона из базы данных (мягкое удаление)
  static async removePokemonFromDatabase(pokemonId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('external_pokemon')
        .update({ is_active: false })
        .eq('id', pokemonId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error removing pokemon from database:', error);
      throw error;
    }
  }

  // Поиск покемонов в базе данных
  static async searchPokemonInDatabase(query: string): Promise<DatabasePokemon[]> {
    try {
      const { data, error } = await supabase
        .from('external_pokemon')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .order('id')
        .limit(20);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error searching pokemon in database:', error);
      return [];
    }
  }

  // Получить покемона по ID из базы данных
  static async getPokemonById(id: number): Promise<DatabasePokemon | null> {
    try {
      const { data, error } = await supabase
        .from('external_pokemon')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error);
        throw error;
      }
      return data || null;
    } catch (error) {
      console.error('Error fetching pokemon by ID from database:', error);
      return null;
    }
  }

  // Импорт покемонов в базу данных (для админов)
  static async importPokemonBatch(pokemonList: Pokemon[]): Promise<void> {
    try {
      console.log('Importing pokemon batch:', pokemonList.length);
      
      const pokemonData = pokemonList.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        abilities: pokemon.abilities,
        stats: pokemon.stats,
        sprites: pokemon.sprites,
        species_url: pokemon.species?.url || null,
        is_active: true
      }));

      const { error } = await supabase
        .from('external_pokemon')
        .upsert(pokemonData, { onConflict: 'id' });

      if (error) {
        console.error('Supabase batch import error:', error);
        throw error;
      }

      console.log('Successfully imported pokemon batch');
    } catch (error) {
      console.error('Error importing pokemon batch:', error);
      throw error;
    }
  }

  // Проверить права администратора
  static async checkAdminRights(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin rights:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin rights:', error);
      return false;
    }
  }
}