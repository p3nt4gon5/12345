// import React from 'react';
// import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Heart, Library, Plus } from 'lucide-react';
// import { usePokemon } from '../hooks/usePokemon';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';

// // Type colors for Pokemon types
// const typeColors: Record<string, string> = {
//   fire: 'bg-red-500',
//   water: 'bg-blue-500',
//   grass: 'bg-green-500',
//   electric: 'bg-yellow-500',
//   psychic: 'bg-pink-500',
//   ice: 'bg-cyan-400',
//   dragon: 'bg-purple-600',
//   dark: 'bg-gray-800',
//   fairy: 'bg-pink-300',
//   fighting: 'bg-red-700',
//   poison: 'bg-purple-500',
//   ground: 'bg-yellow-600',
//   flying: 'bg-indigo-400',
//   bug: 'bg-green-400',
//   rock: 'bg-yellow-800',
//   ghost: 'bg-purple-700',
//   steel: 'bg-gray-400',
//   normal: 'bg-gray-500',
// };

// // Pokemon detail page component with navigation state preservation
// const PokemonDetail: React.FC = () => {
//   const { name } = useParams<{ name: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { pokemon, loading, error } = usePokemon(name || null);
//   const { addToLibrary, addToFavorites, isInLibrary, isInFavorites } = useLibrary();
//   const { user } = useAuth();

//   // Get the previous location from navigation state, fallback to home
//   const previousPath = location.state?.from || '/';

//   // Handle back navigation to preserve user's previous location
//   const handleGoBack = () => {
//     if (location.state?.from) {
//       navigate(previousPath);
//     } else {
//       navigate('/');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading Pokémon...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !pokemon) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😢</div>
//           <h2 className="text-3xl font-bold text-gray-600 mb-4">Pokémon Not Found</h2>
//           <p className="text-gray-500 mb-8">{error}</p>
//           <button
//             onClick={handleGoBack}
//             className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={handleGoBack}
//           className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 text-lg transition-colors"
//         >
//           <ArrowLeft size={24} className="mr-2" />
//           Back to Previous Page
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8">
//             <div className="flex flex-col lg:flex-row items-center">
//               <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
//                 <div className="flex items-center justify-center lg:justify-start mb-4">
//                   <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 capitalize mr-4">
//                     {pokemon.name}
//                   </h1>
//                   <span className="text-2xl text-gray-500">
//                     #{pokemon.id.toString().padStart(3, '0')}
//                   </span>
//                 </div>
                
//                 <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
//                   {pokemon.types.map((type) => (
//                     <span
//                       key={type.type.name}
//                       className={`px-4 py-2 rounded-full text-white font-medium ${
//                         typeColors[type.type.name] || 'bg-gray-500'
//                       }`}
//                     >
//                       {type.type.name}
//                     </span>
//                   ))}
//                 </div>
                
//                 {user && (
//                   <div className="flex justify-center lg:justify-start space-x-4">
//                     <button
//                       onClick={() => addToLibrary(pokemon)}
//                       disabled={isInLibrary(pokemon.id)}
//                       className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
//                         isInLibrary(pokemon.id)
//                           ? 'bg-green-500 text-white cursor-not-allowed'
//                           : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white'
//                       }`}
//                     >
//                       {isInLibrary(pokemon.id) ? <Library size={20} /> : <Plus size={20} />}
//                       <span className="ml-2">
//                         {isInLibrary(pokemon.id) ? 'In Library' : 'Add to Library'}
//                       </span>
//                     </button>
                    
//                     <button
//                       onClick={() => addToFavorites(pokemon)}
//                       disabled={isInFavorites(pokemon.id)}
//                       className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
//                         isInFavorites(pokemon.id)
//                           ? 'bg-red-500 text-white cursor-not-allowed'
//                           : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-500 hover:text-white'
//                       }`}
//                     >
//                       <Heart size={20} fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'} />
//                       <span className="ml-2">
//                         {isInFavorites(pokemon.id) ? 'Favorited' : 'Add to Favorites'}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//               </div>
              
//               <div className="lg:w-1/2 flex justify-center">
//                 <img
//                   src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
//                   alt={pokemon.name}
//                   className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="p-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-gray-600 font-medium">Height:</span>
//                       <p className="text-xl font-bold">{pokemon.height / 10}m</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600 font-medium">Weight:</span>
//                       <p className="text-xl font-bold">{pokemon.weight / 10}kg</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Abilities</h3>
//                 <div className="space-y-2">
//                   {pokemon.abilities.map((ability, index) => (
//                     <span
//                       key={index}
//                       className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 capitalize"
//                     >
//                       {ability.ability.name.replace('-', ' ')}
//                     </span>
//                   ))}
//                 </div>
//               </div>
              
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Base Stats</h2>
//                 <div className="space-y-4">
//                   {pokemon.stats.map((stat) => (
//                     <div key={stat.stat.name}>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-gray-600 font-medium capitalize">
//                           {stat.stat.name.replace('-', ' ')}
//                         </span>
//                         <span className="font-bold text-gray-800">{stat.base_stat}</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PokemonDetail;



// import React from 'react';
// import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Heart, Library } from 'lucide-react';
// import { usePokemon } from '../hooks/usePokemon';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';

// const typeColors: Record<string, string> = {
//   fire: 'bg-red-500',
//   water: 'bg-blue-500',
//   grass: 'bg-green-500',
//   electric: 'bg-yellow-500',
//   psychic: 'bg-pink-500',
//   ice: 'bg-cyan-400',
//   dragon: 'bg-purple-600',
//   dark: 'bg-gray-800',
//   fairy: 'bg-pink-300',
//   fighting: 'bg-red-700',
//   poison: 'bg-purple-500',
//   ground: 'bg-yellow-600',
//   flying: 'bg-indigo-400',
//   bug: 'bg-green-400',
//   rock: 'bg-yellow-800',
//   ghost: 'bg-purple-700',
//   steel: 'bg-gray-400',
//   normal: 'bg-gray-500',
// };

// const PokemonDetail: React.FC = () => {
//   const { name } = useParams<{ name: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { pokemon, loading, error } = usePokemon(name || null);
//   const {
//     addToLibrary,
//     removeFromLibrary,
//     addToFavorites,
//     removeFromFavorites,
//     isInLibrary,
//     isInFavorites,
//   } = useLibrary();
//   const { user } = useAuth();

//   const previousPath = location.state?.from || '/';

//   const handleGoBack = () => {
//     navigate(previousPath);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading Pokémon...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !pokemon) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl mb-4">😢</div>
//           <h2 className="text-3xl font-bold text-gray-600 mb-4">Pokémon Not Found</h2>
//           <p className="text-gray-500 mb-8">{error}</p>
//           <button
//             onClick={handleGoBack}
//             className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <button
//           onClick={handleGoBack}
//           className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 text-lg transition-colors"
//         >
//           <ArrowLeft size={24} className="mr-2" />
//           Back to Previous Page
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8">
//             <div className="flex flex-col lg:flex-row items-center">
//               <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
//                 <div className="flex items-center justify-center lg:justify-start mb-4">
//                   <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 capitalize mr-4">
//                     {pokemon.name}
//                   </h1>
//                   <span className="text-2xl text-gray-500">
//                     #{pokemon.id.toString().padStart(3, '0')}
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
//                   {pokemon.types.map((type) => (
//                     <span
//                       key={type.type.name}
//                       className={`px-4 py-2 rounded-full text-white font-medium ${
//                         typeColors[type.type.name] || 'bg-gray-500'
//                       }`}
//                     >
//                       {type.type.name}
//                     </span>
//                   ))}
//                 </div>

//                 {user && (
//                   <div className="flex justify-center lg:justify-start space-x-4">
//                     <button
//                       onClick={async () => {
//                         if (isInLibrary(pokemon.id)) {
//                           await removeFromLibrary(pokemon.id);
//                         } else {
//                           await addToLibrary(pokemon);
//                         }
//                       }}
//                       className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
//                         isInLibrary(pokemon.id)
//                           ? 'bg-green-500 text-white'
//                           : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white'
//                       }`}
//                     >
//                       <Library size={20} />
//                       <span className="ml-2">
//                         {isInLibrary(pokemon.id) ? 'Remove from Library' : 'Add to Library'}
//                       </span>
//                     </button>

//                     <button
//                       onClick={async () => {
//                         if (isInFavorites(pokemon.id)) {
//                           await removeFromFavorites(pokemon.id);
//                         } else {
//                           await addToFavorites(pokemon);
//                         }
//                       }}
//                       className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
//                         isInFavorites(pokemon.id)
//                           ? 'bg-red-500 text-white'
//                           : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-500 hover:text-white'
//                       }`}
//                     >
//                       <Heart
//                         size={20}
//                         fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'}
//                       />
//                       <span className="ml-2">
//                         {isInFavorites(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
//                       </span>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="lg:w-1/2 flex justify-center">
//                 <img
//                   src={
//                     pokemon.sprites.other['official-artwork'].front_default ||
//                     pokemon.sprites.front_default
//                   }
//                   alt={pokemon.name}
//                   className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
//                 <div className="bg-gray-50 rounded-lg p-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-gray-600 font-medium">Height:</span>
//                       <p className="text-xl font-bold">{pokemon.height / 10}m</p>
//                     </div>
//                     <div>
//                       <span className="text-gray-600 font-medium">Weight:</span>
//                       <p className="text-xl font-bold">{pokemon.weight / 10}kg</p>
//                     </div>
//                   </div>
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Abilities</h3>
//                 <div className="space-y-2">
//                   {pokemon.abilities.map((ability, index) => (
//                     <span
//                       key={index}
//                       className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 capitalize"
//                     >
//                       {ability.ability.name.replace('-', ' ')}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Base Stats</h2>
//                 <div className="space-y-4">
//                   {pokemon.stats.map((stat) => (
//                     <div key={stat.stat.name}>
//                       <div className="flex justify-between items-center mb-1">
//                         <span className="text-gray-600 font-medium capitalize">
//                           {stat.stat.name.replace('-', ' ')}
//                         </span>
//                         <span className="font-bold text-gray-800">{stat.base_stat}</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PokemonDetail;

import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Library } from 'lucide-react';
import { usePokemon } from '../hooks/usePokemon';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

const typeColors: Record<string, string> = {
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-500',
  psychic: 'bg-pink-500',
  ice: 'bg-cyan-400',
  dragon: 'bg-purple-600',
  dark: 'bg-gray-800',
  fairy: 'bg-pink-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  steel: 'bg-gray-400',
  normal: 'bg-gray-500',
};

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { pokemon, loading, error } = usePokemon(name || null);
  const {
    addToLibrary,
    removeFromLibrary,
    addToFavorites,
    removeFromFavorites,
    isInLibrary,
    isInFavorites,
  } = useLibrary();
  const { user } = useAuth();

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const previousPath = location.state?.from || '/';
  const handleGoBack = () => navigate(previousPath);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-3xl font-bold text-gray-600 mb-4">Pokémon Not Found</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 text-lg transition-colors"
        >
          <ArrowLeft size={24} className="mr-2" />
          Back to Previous Page
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 capitalize mr-4">
                    {pokemon.name}
                  </h1>
                  <span className="text-2xl text-gray-500">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-4 py-2 rounded-full text-white font-medium ${
                        typeColors[type.type.name] || 'bg-gray-500'
                      }`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>

                {user && (
                  <div className="flex justify-center lg:justify-start space-x-4">
                    <button
                      onClick={async () => {
                        if (isInLibrary(pokemon.id)) {
                          await removeFromLibrary(pokemon.id);
                          showToast(`${pokemon.name} removed from library`, 'info');
                        } else {
                          await addToLibrary(pokemon);
                          showToast(`${pokemon.name} added to library`, 'success');
                        }
                      }}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                        isInLibrary(pokemon.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      <Library size={20} />
                      <span className="ml-2">
                        {isInLibrary(pokemon.id) ? 'Remove from Library' : 'Add to Library'}
                      </span>
                    </button>

                    <button
                      onClick={async () => {
                        if (isInFavorites(pokemon.id)) {
                          await removeFromFavorites(pokemon.id);
                          showToast(`${pokemon.name} removed from favorites`, 'info');
                        } else {
                          await addToFavorites(pokemon);
                          showToast(`${pokemon.name} added to favorites`, 'success');
                        }
                      }}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                        isInFavorites(pokemon.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'}
                      />
                      <span className="ml-2">
                        {isInFavorites(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:w-1/2 flex justify-center">
                <img
                  src={
                    pokemon.sprites.other['official-artwork'].front_default ||
                    pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                  className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 font-medium">Height:</span>
                      <p className="text-xl font-bold">{pokemon.height / 10}m</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Weight:</span>
                      <p className="text-xl font-bold">{pokemon.weight / 10}kg</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 capitalize"
                    >
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Base Stats</h2>
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-600 font-medium capitalize">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span className="font-bold text-gray-800">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default PokemonDetail;






