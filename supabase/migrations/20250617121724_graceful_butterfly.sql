/*
  # Создание таблицы профилей пользователей

  1. Новые таблицы
    - `profiles`
      - `id` (uuid, primary key, ссылается на auth.users)
      - `email` (text, email пользователя)
      - `full_name` (text, полное имя/никнейм)
      - `username` (text, уникальное имя пользователя)
      - `phone` (text, номер телефона)
      - `bio` (text, биография)
      - `avatar_url` (text, ссылка на аватар)
      - `banner_url` (text, ссылка на баннер профиля)
      - `website` (text, личный сайт)
      - `location` (text, местоположение)
      - `birth_date` (date, дата рождения)
      - `is_public` (boolean, публичный ли профиль)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `profiles`
    - Добавить политики для аутентифицированных пользователей
    - Пользователи могут читать публичные профили
    - Пользователи могут редактировать только свой профиль

  3. Триггеры
    - Автоматическое создание профиля при регистрации
    - Обновление updated_at при изменениях
*/

-- Создаем таблицу профилей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  username text UNIQUE,
  phone text,
  bio text,
  avatar_url text,
  banner_url text,
  website text,
  location text,
  birth_date date,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Публичные профили видны всем"
  ON profiles
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Пользователи видят свой профиль"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свой профиль"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Пользователи могут вставлять свой профиль"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Создаем индексы
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для создания профиля при регистрации
CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Создаем bucket для аватаров и баннеров если не существует
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Политики для storage
CREATE POLICY "Аватары доступны всем для просмотра"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Пользователи могут загружать свои аватары"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Пользователи могут обновлять свои аватары"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Баннеры доступны всем для просмотра"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Пользователи могут загружать свои баннеры"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Пользователи могут обновлять свои баннеры"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners' AND auth.uid()::text = (storage.foldername(name))[1]);