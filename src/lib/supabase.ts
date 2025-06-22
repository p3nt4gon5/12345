import { createClient } from '@supabase/supabase-js';

// Конфигурация Supabase - эти переменные будут установлены при подключении к Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Создаем клиент Supabase для аутентификации и операций с базой данных
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы базы данных для поддержки TypeScript
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserPokemon {
  id: string;
  user_id: string;
  pokemon_id: number;
  pokemon_name: string;
  pokemon_data: any; // JSON данные из Pokemon API
  is_favorite: boolean;
  added_at: string;
  created_at: string;
  updated_at: string;
}