/*
  # Создание таблицы external_pokemon для хранения покемонов

  1. Новые таблицы
    - `external_pokemon`
      - `id` (integer, primary key, Pokemon API ID)
      - `name` (text, имя покемона)
      - `height` (integer, рост)
      - `weight` (integer, вес)
      - `types` (jsonb, типы покемона)
      - `abilities` (jsonb, способности)
      - `stats` (jsonb, характеристики)
      - `sprites` (jsonb, изображения)
      - `species_url` (text, ссылка на виды)
      - `is_active` (boolean, активен ли покемон)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `external_pokemon`
    - Добавить политики для чтения всем пользователям
    - Только админы могут добавлять/изменять покемонов

  3. Индексы
    - Индекс по имени для быстрого поиска
    - Индекс по активности
*/

-- Создаем таблицу external_pokemon
CREATE TABLE IF NOT EXISTS external_pokemon (
  id integer PRIMARY KEY,
  name text NOT NULL UNIQUE,
  height integer NOT NULL,
  weight integer NOT NULL,
  types jsonb NOT NULL DEFAULT '[]',
  abilities jsonb NOT NULL DEFAULT '[]',
  stats jsonb NOT NULL DEFAULT '[]',
  sprites jsonb NOT NULL DEFAULT '{}',
  species_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE external_pokemon ENABLE ROW LEVEL SECURITY;

-- Политики безопасности
CREATE POLICY "Все могут читать активных покемонов"
  ON external_pokemon
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Админы могут читать всех покемонов"
  ON external_pokemon
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Админы могут добавлять покемонов"
  ON external_pokemon
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Админы могут обновлять покемонов"
  ON external_pokemon
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Создаем индексы
CREATE INDEX IF NOT EXISTS external_pokemon_name_idx ON external_pokemon(name);
CREATE INDEX IF NOT EXISTS external_pokemon_active_idx ON external_pokemon(is_active);
CREATE INDEX IF NOT EXISTS external_pokemon_created_idx ON external_pokemon(created_at);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_external_pokemon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для обновления updated_at
CREATE TRIGGER update_external_pokemon_updated_at
  BEFORE UPDATE ON external_pokemon
  FOR EACH ROW
  EXECUTE FUNCTION update_external_pokemon_updated_at();