import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && data) setRole(data.role);
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
};
