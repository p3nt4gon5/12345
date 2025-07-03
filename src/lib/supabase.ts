import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для работы с базой данных
export interface UserPokemon {
  id: string;
  user_id: string;
  pokemon_id: number;
  pokemon_name: string;
  pokemon_data: any;
  is_favorite: boolean;
  added_at: string;
  updated_at: string;
  pokemon_image?: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  is_public: boolean;
  role?: string;
  created_at: string;
  updated_at?: string;
}