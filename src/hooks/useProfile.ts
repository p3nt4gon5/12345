import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, ProfileUpdateData } from '../types/profile';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [pokemons, setPokemons] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
          });

        if (insertError) throw insertError;

        return fetchProfile();
      }

      setProfile(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdateData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const existingColumns = [
        'username',
        'email',
        'birth_date',
        'location',
        'phone',
        'avatar_url',
        'banner_url',
        'bio',
      ];

      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key]) =>
          existingColumns.includes(key)
        )
      );

      const { data, error } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      return { data: null, error: err.message };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      return { url: null, error: err.message };
    }
  };

  const uploadBanner = async (file: File) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, banner_url: data.publicUrl } : null);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      console.error('Error uploading banner:', err);
      return { url: null, error: err.message };
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error changing password:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchPokemons = async () => {
    if (!user) return;

    try {
      // Пользовательские покемоны
      const { data: userPokemons, error: userError } = await supabase
        .from('user_pokemon')
        .select('id, pokemon_name, pokemon_image')
        .eq('user_id', user.id);

      if (userError) throw userError;

      // Админ-покемоны
      const isAdmin = user.email === 'kekdanik715@gmail.com';

      const { data: adminPokemons, error: adminError } = await supabase
        .from('admin_pokemon')
        .select('id, pokemon_name, pokemon_image, hidden');

      if (adminError) throw adminError;

      const visibleAdminPokemons = isAdmin
        ? adminPokemons
        : (adminPokemons || []).filter(p => p.hidden === false);

      setPokemons([...(userPokemons || []), ...(visibleAdminPokemons || [])]);
    } catch (err) {
      console.error('Error loading pokemons:', err);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    uploadBanner,
    refetch: fetchProfile,
    changePassword,
    pokemons,
  };
};
