// import React, { useState, useEffect } from 'react';
// import { Search, Loader2 } from 'lucide-react';
// import { useSearchPokemon, useSearchSuggestions } from '../hooks/usePokemon';
// import { useAuth } from '../context/AuthContext';
// import PokemonCard from './PokemonCard';
// import AuthModal from './AuthModal';

// // Main search page component with live search and suggestions
// const SearchPage: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
  
//   const { user } = useAuth();
//   const { results, loading } = useSearchPokemon(query); // Live search without Enter key
//   const suggestions = useSearchSuggestions(query);

//   // Handle suggestion selection
//   const handleSuggestionClick = (suggestion: string) => {
//     setQuery(suggestion);
//     setShowSuggestions(false);
//   };

//   // Handle input focus and blur for suggestions
//   const handleInputFocus = () => {
//     if (suggestions.length > 0) {
//       setShowSuggestions(true);
//     }
//   };

//   const handleInputBlur = () => {
//     // Delay hiding suggestions to allow clicking
//     setTimeout(() => setShowSuggestions(false), 200);
//   };

//   // Show suggestions when query changes
//   useEffect(() => {
//     setShowSuggestions(suggestions.length > 0 && query.trim().length > 0);
//   }, [suggestions, query]);

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//               Discover Pokémon
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Search and explore the amazing world of Pokémon with typo-tolerant search
//             </p>
            
//             <div className="relative max-w-2xl mx-auto">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   onFocus={handleInputFocus}
//                   onBlur={handleInputBlur}
//                   placeholder="Search for a Pokémon... (e.g., pikachu, charizard, pikchu - typos work!)"
//                   className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none shadow-lg transition-all duration-300"
//                 />
//                 <div className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-full">
//                   <Search size={24} />
//                 </div>
//               </div>
              
//               {showSuggestions && suggestions.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10 max-h-60 overflow-y-auto">
//                   {suggestions.map((suggestion) => (
//                     <button
//                       key={suggestion}
//                       onClick={() => handleSuggestionClick(suggestion)}
//                       className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors capitalize"
//                     >
//                       {suggestion}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {!user && (
//               <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
//                 <p className="text-yellow-800">
//                   <strong>Sign in</strong> to save Pokémon to your library and favorites!
//                 </p>
//                 <button
//                   onClick={() => setShowAuthModal(true)}
//                   className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
//                 >
//                   Sign In / Sign Up
//                 </button>
//               </div>
//             )}
//           </div>

//           {loading && (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="animate-spin text-blue-500" size={48} />
//               <span className="ml-4 text-xl text-gray-600">Searching for Pokémon...</span>
//             </div>
//           )}

//           {results.length > 0 && (
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//                 Search Results ({results.length})
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {results.map((pokemon, index) => (
//                   <div
//                     key={pokemon.id}
//                     className="animate-fade-in"
//                     style={{ animationDelay: `${index * 0.1}s` }}
//                   >
//                     <PokemonCard pokemon={pokemon} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {query && !loading && results.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-6xl mb-4">😢</div>
//               <h3 className="text-2xl font-bold text-gray-600 mb-2">No Pokémon Found</h3>
//               <p className="text-gray-500">
//                 Try a different search term. Our fuzzy search handles typos, but some spellings might be too different.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//       />
//     </>
//   );
// };

// export default SearchPage;






import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useSearchPokemon, useSearchSuggestions } from '../hooks/usePokemon';
import { useAuth } from '../context/AuthContext';
import PokemonCard from './PokemonCard';
import AuthModal from './AuthModal';
import Toast from './Toast'; 

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { user } = useAuth();
  const { results, loading } = useSearchPokemon(query);
  const suggestions = useSearchSuggestions(query);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && query.trim().length > 0);
  }, [suggestions, query]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover Pokémon
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search and explore the amazing world of Pokémon with typo-tolerant search
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Search for a Pokémon... (e.g., pikachu, charizard)"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none shadow-lg transition-all duration-300"
                />
                <div className="absolute right-2 top-2 p-2 bg-blue-500 text-white rounded-full">
                  <Search size={24} />
                </div>
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors capitalize"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!user && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-yellow-800">
                  <strong>Sign in</strong> to save Pokémon to your library and favorites!
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Sign In / Sign Up
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={48} />
              <span className="ml-4 text-xl text-gray-600">Searching for Pokémon...</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Search Results ({results.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((pokemon, index) => (
                  <div
                    key={pokemon.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PokemonCard pokemon={pokemon} showToast={showToast} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && !loading && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Pokémon Found</h3>
              <p className="text-gray-500">
                Try a different search term. Our fuzzy search handles typos, but some spellings might be too different.
              </p>
            </div>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
};

export default SearchPage;
