/*
  # Create user Pokemon collection table

  1. New Tables
    - `user_pokemon`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `pokemon_id` (integer, Pokemon API ID)
      - `pokemon_name` (text, Pokemon name for quick lookup)
      - `pokemon_data` (jsonb, complete Pokemon data from API)
      - `is_favorite` (boolean, whether Pokemon is favorited)
      - `is_in_library` (boolean, whether Pokemon is in library)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_pokemon` table
    - Add policies for authenticated users to manage their own Pokemon
    - Users can only access their own Pokemon data

  3. Indexes
    - Index on user_id for fast user queries
    - Index on pokemon_id for duplicate checking
    - Composite index on user_id + pokemon_id for unique constraints
*/

-- Create user_pokemon table for storing user's Pokemon collections
CREATE TABLE IF NOT EXISTS user_pokemon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pokemon_id integer NOT NULL,
  pokemon_name text NOT NULL,
  pokemon_data jsonb NOT NULL,
  is_favorite boolean DEFAULT false,
  is_in_library boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_pokemon ENABLE ROW LEVEL SECURITY;

-- Create policies for user_pokemon table
CREATE POLICY "Users can view own Pokemon"
  ON user_pokemon
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Pokemon"
  ON user_pokemon
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Pokemon"
  ON user_pokemon
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own Pokemon"
  ON user_pokemon
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pokemon_user_id ON user_pokemon(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pokemon_pokemon_id ON user_pokemon(pokemon_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_pokemon_unique ON user_pokemon(user_id, pokemon_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_pokemon_updated_at
  BEFORE UPDATE ON user_pokemon
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();