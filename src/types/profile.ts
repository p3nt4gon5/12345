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
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  is_public?: boolean;
}