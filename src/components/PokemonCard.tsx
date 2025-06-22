// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Library, Plus, Check } from 'lucide-react';
// import { Pokemon } from '../types/pokemon';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';

// interface PokemonCardProps {
//   pokemon: Pokemon;
// }

// // Type colors mapping for Pokemon types
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

// // Pokemon card component with visual feedback for library/favorites status
// const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
//   const { addToLibrary, addToFavorites, isInLibrary, isInFavorites } = useLibrary();
//   const { user } = useAuth();
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [actionFeedback, setActionFeedback] = useState<'library' | 'favorites' | null>(null);

//   // Handle adding to library with visual feedback
//   const handleAddToLibrary = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     if (!isInLibrary(pokemon.id)) {
//       await addToLibrary(pokemon);
//       setActionFeedback('library');
//       setTimeout(() => setActionFeedback(null), 2000);
//     }
//   };

//   // Handle adding to favorites with visual feedback
//   const handleAddToFavorites = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     if (!isInFavorites(pokemon.id)) {
//       await addToFavorites(pokemon);
//       setActionFeedback('favorites');
//       setTimeout(() => setActionFeedback(null), 2000);
//     }
//   };

//   return (
//     <>
//       <Link to={`/pokemon/${pokemon.name}`} state={{ from: location.pathname }}>
//         <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group relative">
//           {/* Action feedback overlay */}
//           {actionFeedback && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
//               <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
//                 <Check className="text-green-500" size={20} />
//                 <span className="font-medium">
//                   {actionFeedback === 'library' ? 'Added to Library!' : 'Added to Favorites!'}
//                 </span>
//               </div>
//             </div>
//           )}

//           <div className="relative">
//             <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex justify-center">
//               <img
//                 src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
//                 alt={pokemon.name}
//                 className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300"
//               />
//             </div>
            
//             <div className="absolute top-4 right-4 flex space-x-2">
//               <button
//                 onClick={handleAddToLibrary}
//                 className={`p-2 rounded-full transition-all transform hover:scale-110 ${
//                   isInLibrary(pokemon.id)
//                     ? 'bg-green-500 text-white shadow-lg'
//                     : 'bg-white/80 hover:bg-green-500 hover:text-white text-green-600 shadow-md'
//                 }`}
//                 title={isInLibrary(pokemon.id) ? 'In Library' : 'Add to Library'}
//               >
//                 {isInLibrary(pokemon.id) ? <Library size={16} /> : <Plus size={16} />}
//               </button>
//               <button
//                 onClick={handleAddToFavorites}
//                 className={`p-2 rounded-full transition-all transform hover:scale-110 ${
//                   isInFavorites(pokemon.id)
//                     ? 'bg-red-500 text-white shadow-lg'
//                     : 'bg-white/80 hover:bg-red-500 hover:text-white text-red-600 shadow-md'
//                 }`}
//                 title={isInFavorites(pokemon.id) ? 'In Favorites' : 'Add to Favorites'}
//               >
//                 <Heart size={16} fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'} />
//               </button>
//             </div>

//             {/* Visual indicators for library/favorites status */}
//             <div className="absolute top-4 left-4 flex space-x-1">
//               {isInLibrary(pokemon.id) && (
//                 <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
//                   <Library size={12} />
//                 </div>
//               )}
//               {isInFavorites(pokemon.id) && (
//                 <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
//                   <Heart size={12} fill="currentColor" />
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-xl font-bold text-gray-800 capitalize">{pokemon.name}</h3>
//               <span className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
//             </div>
            
//             <div className="flex flex-wrap gap-2 mb-4">
//               {pokemon.types.map((type) => (
//                 <span
//                   key={type.type.name}
//                   className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
//                     typeColors[type.type.name] || 'bg-gray-500'
//                   }`}
//                 >
//                   {type.type.name}
//                 </span>
//               ))}
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
//               <div>
//                 <span className="font-medium">Height:</span> {pokemon.height / 10}m
//               </div>
//               <div>
//                 <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>

//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//       />
//     </>
//   );
// };

// export default PokemonCard;




// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, Library, Plus, Check } from 'lucide-react';
// import { Pokemon } from '../types/pokemon';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';
// import AuthModal from './AuthModal';

// interface PokemonCardProps {
//   pokemon: Pokemon;
// }

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

// const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
//   const {
//     addToLibrary,
//     removeFromLibrary,
//     addToFavorites,
//     removeFromFavorites,
//     isInLibrary,
//     isInFavorites,
//   } = useLibrary();
//   const { user } = useAuth();
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [actionFeedback, setActionFeedback] = useState<'library' | 'favorites' | null>(null);

//   const handleToggleLibrary = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     if (isInLibrary(pokemon.id)) {
//       await removeFromLibrary(pokemon.id);
//     } else {
//       await addToLibrary(pokemon);
//     }

//     setActionFeedback('library');
//     setTimeout(() => setActionFeedback(null), 2000);
//   };

//   const handleToggleFavorites = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!user) {
//       setShowAuthModal(true);
//       return;
//     }

//     if (isInFavorites(pokemon.id)) {
//       await removeFromFavorites(pokemon.id);
//     } else {
//       await addToFavorites(pokemon);
//     }

//     setActionFeedback('favorites');
//     setTimeout(() => setActionFeedback(null), 2000);
//   };

//   return (
//     <>
//       <Link to={`/pokemon/${pokemon.name}`} state={{ from: location.pathname }}>
//         <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group relative">
//           {actionFeedback && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
//               <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
//                 <Check className="text-green-500" size={20} />
//                 <span className="font-medium">
//                   {actionFeedback === 'library' ? 'Updated Library!' : 'Updated Favorites!'}
//                 </span>
//               </div>
//             </div>
//           )}

//           <div className="relative">
//             <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex justify-center">
//               <img
//                 src={
//                   pokemon.sprites.other['official-artwork'].front_default ||
//                   pokemon.sprites.front_default
//                 }
//                 alt={pokemon.name}
//                 className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300"
//               />
//             </div>

//             <div className="absolute top-4 right-4 flex space-x-2">
//               <button
//                 onClick={handleToggleLibrary}
//                 className={`p-2 rounded-full transition-all transform hover:scale-110 ${
//                   isInLibrary(pokemon.id)
//                     ? 'bg-green-500 text-white shadow-lg'
//                     : 'bg-white/80 hover:bg-green-500 hover:text-white text-green-600 shadow-md'
//                 }`}
//                 title={isInLibrary(pokemon.id) ? 'Remove from Library' : 'Add to Library'}
//               >
//                 <Library size={16} />
//               </button>
//               <button
//                 onClick={handleToggleFavorites}
//                 className={`p-2 rounded-full transition-all transform hover:scale-110 ${
//                   isInFavorites(pokemon.id)
//                     ? 'bg-red-500 text-white shadow-lg'
//                     : 'bg-white/80 hover:bg-red-500 hover:text-white text-red-600 shadow-md'
//                 }`}
//                 title={isInFavorites(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
//               >
//                 <Heart size={16} fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'} />
//               </button>
//             </div>

//             <div className="absolute top-4 left-4 flex space-x-1">
//               {isInLibrary(pokemon.id) && (
//                 <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
//                   <Library size={12} />
//                 </div>
//               )}
//               {isInFavorites(pokemon.id) && (
//                 <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
//                   <Heart size={12} fill="currentColor" />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-xl font-bold text-gray-800 capitalize">{pokemon.name}</h3>
//               <span className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
//             </div>

//             <div className="flex flex-wrap gap-2 mb-4">
//               {pokemon.types.map((type) => (
//                 <span
//                   key={type.type.name}
//                   className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
//                     typeColors[type.type.name] || 'bg-gray-500'
//                   }`}
//                 >
//                   {type.type.name}
//                 </span>
//               ))}
//             </div>

//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
//               <div>
//                 <span className="font-medium">Height:</span> {pokemon.height / 10}m
//               </div>
//               <div>
//                 <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>

//       <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
//     </>
//   );
// };

// export default PokemonCard;





import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Library, Plus, Check } from 'lucide-react';
import { Pokemon } from '../types/pokemon';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface PokemonCardProps {
  pokemon: Pokemon;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

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

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, showToast }) => {
  const {
    addToLibrary,
    removeFromLibrary,
    addToFavorites,
    removeFromFavorites,
    isInLibrary,
    isInFavorites,
  } = useLibrary();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<'library' | 'favorites' | null>(null);

  const handleToggleLibrary = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isInLibrary(pokemon.id)) {
      await removeFromLibrary(pokemon.id);
      showToast?.(`${pokemon.name} removed from library`, 'info');
    } else {
      await addToLibrary(pokemon);
      showToast?.(`${pokemon.name} added to library`, 'success');
    }

    setActionFeedback('library');
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleToggleFavorites = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isInFavorites(pokemon.id)) {
      await removeFromFavorites(pokemon.id);
      showToast?.(`${pokemon.name} removed from favorites`, 'info');
    } else {
      await addToFavorites(pokemon);
      showToast?.(`${pokemon.name} added to favorites`, 'success');
    }

    setActionFeedback('favorites');
    setTimeout(() => setActionFeedback(null), 2000);
  };

  return (
    <>
      <Link to={`/pokemon/${pokemon.name}`} state={{ from: location.pathname }}>
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group relative">
          {actionFeedback && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
              <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
                <Check className="text-green-500" size={20} />
                <span className="font-medium">
                  {actionFeedback === 'library' ? 'Updated Library!' : 'Updated Favorites!'}
                </span>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex justify-center">
              <img
                src={
                  pokemon.sprites.other['official-artwork'].front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleToggleLibrary}
                className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                  isInLibrary(pokemon.id)
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/80 hover:bg-green-500 hover:text-white text-green-600 shadow-md'
                }`}
                title={isInLibrary(pokemon.id) ? 'Remove from Library' : 'Add to Library'}
              >
                <Library size={16} />
              </button>
              <button
                onClick={handleToggleFavorites}
                className={`p-2 rounded-full transition-all transform hover:scale-110 ${
                  isInFavorites(pokemon.id)
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white/80 hover:bg-red-500 hover:text-white text-red-600 shadow-md'
                }`}
                title={isInFavorites(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart size={16} fill={isInFavorites(pokemon.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="absolute top-4 left-4 flex space-x-1">
              {isInLibrary(pokemon.id) && (
                <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                  <Library size={12} />
                </div>
              )}
              {isInFavorites(pokemon.id) && (
                <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
                  <Heart size={12} fill="currentColor" />
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800 capitalize">{pokemon.name}</h3>
              <span className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    typeColors[type.type.name] || 'bg-gray-500'
                  }`}
                >
                  {type.type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Height:</span> {pokemon.height / 10}m
              </div>
              <div>
                <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
              </div>
            </div>
          </div>
        </div>
      </Link>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default PokemonCard;
