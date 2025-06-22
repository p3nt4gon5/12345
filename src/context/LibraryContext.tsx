// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Pokemon } from '../types/pokemon';
// import { supabase, UserPokemon } from '../lib/supabase';
// import { useAuth } from './AuthContext';

// interface LibraryContextType {
//   library: Pokemon[];
//   favorites: Pokemon[];
//   addToLibrary: (pokemon: Pokemon) => Promise<void>;
//   removeFromLibrary: (pokemonId: number) => Promise<void>;
//   addToFavorites: (pokemon: Pokemon) => Promise<void>;
//   removeFromFavorites: (pokemonId: number) => Promise<void>;
//   isInLibrary: (pokemonId: number) => boolean;
//   isInFavorites: (pokemonId: number) => boolean;
//   loading: boolean;
// }

// const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// // Хук для доступа к контексту библиотеки
// export const useLibrary = () => {
//   const context = useContext(LibraryContext);
//   if (!context) {
//     throw new Error('useLibrary must be used within a LibraryProvider');
//   }
//   return context;
// };

// // Провайдер библиотеки для управления коллекцией Pokemon пользователя
// export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [library, setLibrary] = useState<Pokemon[]>([]);
//   const [favorites, setFavorites] = useState<Pokemon[]>([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();

//   // Загружаем данные Pokemon пользователя при изменении пользователя
//   useEffect(() => {
//     if (user) {
//       loadUserPokemon();
//     } else {
//       // Очищаем данные при выходе пользователя
//       setLibrary([]);
//       setFavorites([]);
//     }
//   }, [user]);

//   // Получаем коллекцию Pokemon пользователя из базы данных Supabase
//   const loadUserPokemon = async () => {
//     if (!user) return;
    
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('user_pokemon')
//         .select('*')
//         .eq('user_id', user.id);

//       if (error) throw error;

//       const libraryPokemon: Pokemon[] = [];
//       const favoritePokemon: Pokemon[] = [];

//       data?.forEach((item: UserPokemon) => {
//         const pokemon = item.pokemon_data as Pokemon;
//         // Все Pokemon в таблице считаются частью библиотеки
//         libraryPokemon.push(pokemon);
//         // Только избранные Pokemon добавляются в favorites
//         if (item.is_favorite) {
//           favoritePokemon.push(pokemon);
//         }
//       });

//       setLibrary(libraryPokemon);
//       setFavorites(favoritePokemon);
//     } catch (error) {
//       console.error('Ошибка загрузки Pokemon пользователя:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Добавляем Pokemon в библиотеку пользователя
//   const addToLibrary = async (pokemon: Pokemon) => {
//     if (!user) return;

//     try {
//       const { data: existing } = await supabase
//         .from('user_pokemon')
//         .select('*')
//         .eq('user_id', user.id)
//         .eq('pokemon_id', pokemon.id)
//         .single();

//       if (!existing) {
//         // Создаем новую запись
//         const { error } = await supabase
//           .from('user_pokemon')
//           .insert({
//             user_id: user.id,
//             pokemon_id: pokemon.id,
//             pokemon_name: pokemon.name,
//             pokemon_data: pokemon,
//             is_favorite: false
//           });

//         if (error) throw error;

//         setLibrary(prev => {
//           if (prev.find(p => p.id === pokemon.id)) return prev;
//           return [...prev, pokemon];
//         });
//       }
//     } catch (error) {
//       console.error('Ошибка добавления в библиотеку:', error);
//     }
//   };

//   // Удаляем Pokemon из библиотеки пользователя
//   const removeFromLibrary = async (pokemonId: number) => {
//     if (!user) return;

//     try {
//       const { error } = await supabase
//         .from('user_pokemon')
//         .delete()
//         .eq('user_id', user.id)
//         .eq('pokemon_id', pokemonId);

//       if (error) throw error;

//       setLibrary(prev => prev.filter(p => p.id !== pokemonId));
//       setFavorites(prev => prev.filter(p => p.id !== pokemonId));
//     } catch (error) {
//       console.error('Ошибка удаления из библиотеки:', error);
//     }
//   };

//   // Добавляем Pokemon в избранное
//   const addToFavorites = async (pokemon: Pokemon) => {
//     if (!user) return;

//     try {
//       const { data: existing } = await supabase
//         .from('user_pokemon')
//         .select('*')
//         .eq('user_id', user.id)
//         .eq('pokemon_id', pokemon.id)
//         .single();

//       if (existing) {
//         // Обновляем существующую запись
//         const { error } = await supabase
//           .from('user_pokemon')
//           .update({ 
//             is_favorite: true,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', existing.id);

//         if (error) throw error;
//       } else {
//         // Создаем новую запись
//         const { error } = await supabase
//           .from('user_pokemon')
//           .insert({
//             user_id: user.id,
//             pokemon_id: pokemon.id,
//             pokemon_name: pokemon.name,
//             pokemon_data: pokemon,
//             is_favorite: true
//           });

//         if (error) throw error;

//         // Добавляем в библиотеку тоже
//         setLibrary(prev => {
//           if (prev.find(p => p.id === pokemon.id)) return prev;
//           return [...prev, pokemon];
//         });
//       }

//       setFavorites(prev => {
//         if (prev.find(p => p.id === pokemon.id)) return prev;
//         return [...prev, pokemon];
//       });
//     } catch (error) {
//       console.error('Ошибка добавления в избранное:', error);
//     }
//   };

//   // Удаляем Pokemon из избранного
//   const removeFromFavorites = async (pokemonId: number) => {
//     if (!user) return;

//     try {
//       const { error } = await supabase
//         .from('user_pokemon')
//         .update({ 
//           is_favorite: false,
//           updated_at: new Date().toISOString()
//         })
//         .eq('user_id', user.id)
//         .eq('pokemon_id', pokemonId);

//       if (error) throw error;

//       setFavorites(prev => prev.filter(p => p.id !== pokemonId));
//     } catch (error) {
//       console.error('Ошибка удаления из избранного:', error);
//     }
//   };

//   // Проверяем, есть ли Pokemon в библиотеке
//   const isInLibrary = (pokemonId: number) => {
//     return library.some(p => p.id === pokemonId);
//   };

//   // Проверяем, есть ли Pokemon в избранном
//   const isInFavorites = (pokemonId: number) => {
//     return favorites.some(p => p.id === pokemonId);
//   };

//   return (
//     <LibraryContext.Provider value={{
//       library,
//       favorites,
//       addToLibrary,
//       removeFromLibrary,
//       addToFavorites,
//       removeFromFavorites,
//       isInLibrary,
//       isInFavorites,
//       loading,
//     }}>
//       {children}
//     </LibraryContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { supabase, UserPokemon } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface LibraryContextType {
  library: Pokemon[];
  favorites: Pokemon[];
  addToLibrary: (pokemon: Pokemon) => Promise<void>;
  removeFromLibrary: (pokemonId: number) => Promise<void>;
  addToFavorites: (pokemon: Pokemon) => Promise<void>;
  removeFromFavorites: (pokemonId: number) => Promise<void>;
  isInLibrary: (pokemonId: number) => boolean;
  isInFavorites: (pokemonId: number) => boolean;
  loading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserPokemon();
    } else {
      setLibrary([]);
      setFavorites([]);
    }
  }, [user]);

  const loadUserPokemon = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_pokemon')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const libraryPokemon: Pokemon[] = [];
      const favoritePokemon: Pokemon[] = [];

      data?.forEach((item: UserPokemon) => {
        const pokemon = item.pokemon_data as Pokemon;
        libraryPokemon.push(pokemon);
        if (item.is_favorite) {
          favoritePokemon.push(pokemon);
        }
      });

      setLibrary(libraryPokemon);
      setFavorites(favoritePokemon);
    } catch (error) {
      console.error('Ошибка загрузки Pokemon пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (pokemon: Pokemon) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('user_pokemon')
        .select('*')
        .eq('user_id', user.id)
        .eq('pokemon_id', pokemon.id)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('user_pokemon')
          .insert({
            user_id: user.id,
            pokemon_id: pokemon.id,
            pokemon_name: pokemon.name,
            pokemon_data: pokemon,
            is_favorite: false
          });

        if (error) throw error;

        setLibrary(prev => {
          if (prev.find(p => p.id === pokemon.id)) return prev;
          return [...prev, pokemon];
        });
      }
    } catch (error) {
      console.error('Ошибка добавления в библиотеку:', error);
    }
  };

  const removeFromLibrary = async (pokemonId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_pokemon')
        .delete()
        .eq('user_id', user.id)
        .eq('pokemon_id', pokemonId);

      if (error) throw error;

      setLibrary(prev => prev.filter(p => p.id !== pokemonId));
      setFavorites(prev => prev.filter(p => p.id !== pokemonId));
    } catch (error) {
      console.error('Ошибка удаления из библиотеки:', error);
    }
  };

  const addToFavorites = async (pokemon: Pokemon) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('user_pokemon')
        .select('*')
        .eq('user_id', user.id)
        .eq('pokemon_id', pokemon.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('user_pokemon')
          .update({
            is_favorite: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_pokemon')
          .insert({
            user_id: user.id,
            pokemon_id: pokemon.id,
            pokemon_name: pokemon.name,
            pokemon_data: pokemon,
            is_favorite: true
          });

        if (error) throw error;
      }

      setFavorites(prev => {
        if (prev.find(p => p.id === pokemon.id)) return prev;
        return [...prev, pokemon];
      });
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const removeFromFavorites = async (pokemonId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_pokemon')
        .update({
          is_favorite: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('pokemon_id', pokemonId);

      if (error) throw error;

      setFavorites(prev => prev.filter(p => p.id !== pokemonId));
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  const isInLibrary = (pokemonId: number) => {
    return library.some(p => p.id === pokemonId);
  };

  const isInFavorites = (pokemonId: number) => {
    return favorites.some(p => p.id === pokemonId);
  };

  return (
    <LibraryContext.Provider
      value={{
        library,
        favorites,
        addToLibrary,
        removeFromLibrary,
        addToFavorites,
        removeFromFavorites,
        isInLibrary,
        isInFavorites,
        loading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};




