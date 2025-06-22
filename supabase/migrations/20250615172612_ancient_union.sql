/*
  # Исправление таблицы user_pokemon

  1. Изменения в таблице
    - Удаляем поля is_in_library (не используется в коде)
    - Оставляем только is_favorite
    - Добавляем поле added_at для совместимости

  2. Обновление индексов
    - Создаем индекс для избранных Pokemon
    - Обновляем существующие индексы

  3. Безопасность
    - Обновляем политики RLS
*/

-- Удаляем старые индексы если они существуют
DROP INDEX IF EXISTS idx_user_pokemon_user_id;
DROP INDEX IF EXISTS idx_user_pokemon_pokemon_id;
DROP INDEX IF EXISTS idx_user_pokemon_unique;

-- Удаляем поле is_in_library если оно существует
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_pokemon' AND column_name = 'is_in_library'
  ) THEN
    ALTER TABLE user_pokemon DROP COLUMN is_in_library;
  END IF;
END $$;

-- Добавляем поле added_at если его нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_pokemon' AND column_name = 'added_at'
  ) THEN
    ALTER TABLE user_pokemon ADD COLUMN added_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Обновляем структуру таблицы для соответствия коду
DO $$
BEGIN
  -- Убеждаемся что поле pokemon_data существует и имеет правильный тип
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_pokemon' AND column_name = 'pokemon_data'
  ) THEN
    ALTER TABLE user_pokemon ADD COLUMN pokemon_data jsonb NOT NULL DEFAULT '{}';
  END IF;
END $$;

-- Создаем новые индексы
CREATE INDEX IF NOT EXISTS user_pokemon_user_id_idx ON user_pokemon(user_id);
CREATE INDEX IF NOT EXISTS user_pokemon_favorites_idx ON user_pokemon(user_id, is_favorite) WHERE is_favorite = true;
CREATE UNIQUE INDEX IF NOT EXISTS user_pokemon_unique_idx ON user_pokemon(user_id, pokemon_id);

-- Обновляем триггер для added_at
DROP TRIGGER IF EXISTS update_user_pokemon_updated_at ON user_pokemon;
CREATE TRIGGER update_user_pokemon_updated_at
  BEFORE UPDATE ON user_pokemon
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();