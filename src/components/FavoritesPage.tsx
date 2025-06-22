// import React from 'react';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';
// import PokemonCard from './PokemonCard';
// import AuthModal from './AuthModal';

// // Favorites page component showing user's favorite Pokemon
// const FavoritesPage: React.FC = () => {
//   const { favorites, loading } = useLibrary();
//   const { user } = useAuth();
//   const [showAuthModal, setShowAuthModal] = React.useState(false);

//   if (!user) {
//     return (
//       <>
//         <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-6xl mb-4">🔒</div>
//             <h2 className="text-3xl font-bold text-gray-600 mb-4">Sign In Required</h2>
//             <p className="text-gray-500 mb-8">
//               Please sign in to access your favorite Pokemon
//             </p>
//             <button
//               onClick={() => setShowAuthModal(true)}
//               className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//         <AuthModal
//           isOpen={showAuthModal}
//           onClose={() => setShowAuthModal(false)}
//         />
//       </>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading your favorites...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
//             Favorite Pokémon
//           </h1>
//           <p className="text-xl text-gray-600">
//             Your most beloved Pokémon partners ({favorites.length} Pokémon)
//           </p>
//         </div>

//         {favorites.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">💖</div>
//             <h3 className="text-2xl font-bold text-gray-600 mb-2">No Favorite Pokémon Yet</h3>
//             <p className="text-gray-500">
//               Mark Pokémon as favorites to see them here!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {favorites.map((pokemon, index) => (
//               <div
//                 key={pokemon.id}
//                 className="animate-fade-in"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <PokemonCard pokemon={pokemon} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FavoritesPage;




import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import PokemonCard from './PokemonCard';
import AuthModal from './AuthModal';
import Toast from './Toast';

const FavoritesPage: React.FC = () => {
  const { favorites, loading } = useLibrary();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-gray-600 mb-4">Sign In Required</h2>
            <p className="text-gray-500 mb-8">
              Please sign in to access your favorite Pokemon
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Favorite Pokémon
          </h1>
          <p className="text-xl text-gray-600">
            Your most beloved Pokémon partners ({favorites.length} Pokémon)
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💖</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Favorite Pokémon Yet</h3>
            <p className="text-gray-500">
              Mark Pokémon as favorites to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((pokemon, index) => (
              <div
                key={pokemon.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PokemonCard pokemon={pokemon} showToast={showToast} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Render toast if active */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default FavoritesPage;
