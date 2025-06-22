// src/hooks/useUserStats.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useUserStats = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [libraryCount, setLibraryCount] = useState<number>(0);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Общее количество пользователей
      const { count: userCountRes, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Все строки user_pokemon = библиотека
      const { count: libraryCountRes, error: libError } = await supabase
        .from('user_pokemon')
        .select('*', { count: 'exact', head: true });

      // Все строки, где is_favorite = true
      const { count: favCountRes, error: favError } = await supabase
        .from('user_pokemon')
        .select('*', { count: 'exact', head: true })
        .eq('is_favorite', true);

      if (userError) console.error('User error:', userError.message);
      if (libError) console.error('Library error:', libError.message);
      if (favError) console.error('Favorites error:', favError.message);

      setUserCount(userCountRes || 0);
      setLibraryCount(libraryCountRes || 0);
      setFavoritesCount(favCountRes || 0);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return {
    userCount,
    libraryCount,
    favoritesCount,
    loading,
  };
};
