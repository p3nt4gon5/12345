/*
  # Пересоздание пользовательских таблиц

  1. Новые таблицы
    - `profiles` - профили пользователей
    - `user_pokemon` - коллекция покемонов пользователей

  2. Безопасность
    - RLS политики для всех таблиц
*/

-- Создаем таблицу profiles если не существует
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text,
  avatar_url text,
  created_at timestamp without time zone DEFAULT now(),
  email text,
  bio text,
  birth_date date,
  location text,
  phone text,
  username text DEFAULT 'anonymous',
  banner_url text,
  role text DEFAULT 'user',
  banned_until timestamp without time zone,
  website text,
  is_public boolean DEFAULT true
);

-- Включаем RLS для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики для profiles
CREATE POLICY "Allow read for all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Создаем таблицу user_pokemon если не существует
CREATE TABLE IF NOT EXISTS user_pokemon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_id integer NOT NULL,
  pokemon_name text NOT NULL,
  is_favorite boolean DEFAULT false,
  added_at timestamptz DEFAULT now(),
  pokemon_data jsonb,
  updated_at timestamptz DEFAULT now(),
  pokemon_image text
);

-- Включаем RLS для user_pokemon
ALTER TABLE user_pokemon ENABLE ROW LEVEL SECURITY;

-- Политики для user_pokemon
CREATE POLICY "Users can view own Pokemon" ON user_pokemon FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own Pokemon" ON user_pokemon FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own Pokemon" ON user_pokemon FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own Pokemon" ON user_pokemon FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Индексы
CREATE INDEX IF NOT EXISTS user_pokemon_user_id_idx ON user_pokemon(user_id);
CREATE INDEX IF NOT EXISTS user_pokemon_favorites_idx ON user_pokemon(user_id, is_favorite) WHERE (is_favorite = true);
CREATE UNIQUE INDEX IF NOT EXISTS user_pokemon_unique_idx ON user_pokemon(user_id, pokemon_id);

-- Обновляем роль админа
INSERT INTO profiles (id, email, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'kekdanik715@gmail.com' LIMIT 1),
  'kekdanik715@gmail.com',
  'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';