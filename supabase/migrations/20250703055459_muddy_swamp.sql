/*
  # Добавление роли в таблицу profiles

  1. Изменения
    - Добавляем поле role в таблицу profiles
    - Устанавливаем значение по умолчанию 'user'
    - Обновляем политики для работы с ролями
*/

-- Добавляем поле role если его нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Обновляем роль для админа
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'kekdanik715@gmail.com';