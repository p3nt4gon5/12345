// import React from 'react';
// import { useLibrary } from '../context/LibraryContext';
// import { useAuth } from '../context/AuthContext';
// import PokemonCard from './PokemonCard';
// import AuthModal from './AuthModal';
// import Toast from './Toast';


// // Library page component showing user's collected Pokemon
// const LibraryPage: React.FC = () => {
//   const { library, loading } = useLibrary();
//   const { user } = useAuth();
//   const [showAuthModal, setShowAuthModal] = React.useState(false);

//   if (!user) {
//     return (
//       <>
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-6xl mb-4">🔒</div>
//             <h2 className="text-3xl font-bold text-gray-600 mb-4">Sign In Required</h2>
//             <p className="text-gray-500 mb-8">
//               Please sign in to access your Pokemon library
//             </p>
//             <button
//               onClick={() => setShowAuthModal(true)}
//               className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
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
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-xl text-gray-600">Loading your library...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
//             My Pokémon Library
//           </h1>
//           <p className="text-xl text-gray-600">
//             Your collected Pokémon collection ({library.length} Pokémon)
//           </p>
//         </div>

//         {library.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📚</div>
//             <h3 className="text-2xl font-bold text-gray-600 mb-2">Your Library is Empty</h3>
//             <p className="text-gray-500">
//               Start exploring and add Pokémon to your library!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {library.map((pokemon, index) => (
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

// export default LibraryPage;






import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import PokemonCard from './PokemonCard';
import AuthModal from './AuthModal';
import Toast from './Toast';

const LibraryPage: React.FC = () => {
  const { library, loading } = useLibrary();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-gray-600 mb-4">Sign In Required</h2>
            <p className="text-gray-500 mb-8">
              Please sign in to access your Pokemon library
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            My Pokémon Library
          </h1>
          <p className="text-xl text-gray-600">
            Your collected Pokémon collection ({library.length} Pokémon)
          </p>
        </div>

        {library.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Your Library is Empty</h3>
            <p className="text-gray-500">
              Start exploring and add Pokémon to your library!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {library.map((pokemon, index) => (
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

      
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default LibraryPage;
