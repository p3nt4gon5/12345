import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import Header from './components/Header';
import SearchPage from './components/SearchPage';
import PokemonDetail from './components/PokemonDetail';
import LibraryPage from './components/LibraryPage';
import FavoritesPage from './components/FavoritesPage';
import UserProfile from './components/UserProfile';







// Main App component with authentication and library context providers
function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/pokemon/:name" element={<PokemonDetail />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </div>
        </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}


export default App;