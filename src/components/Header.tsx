import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Library, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import AuthModal from './AuthModal';

// Header component with navigation and authentication controls
const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition-colors">
              ⚡ PokéSearch
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/')
                    ? 'bg-white/20 text-yellow-300'
                    : 'hover:bg-white/10'
                }`}
              >
                <Search size={20} />
                <span className="hidden sm:inline">Search</span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/library"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive('/library')
                        ? 'bg-white/20 text-yellow-300'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Library size={20} />
                    <span className="hidden sm:inline">Library</span>
                  </Link>
                  
                  <Link
                    to="/favorites"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive('/favorites')
                        ? 'bg-white/20 text-yellow-300'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Heart size={20} />
                    <span className="hidden sm:inline">Favorites</span>
                  </Link>
                </>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="hidden sm:inline">
                      {profile?.full_name || profile?.username || user.email}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 min-w-48 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="font-medium truncate">
                          {profile?.full_name || profile?.username || user.email}
                        </p>
                        {profile?.username && (
                          <p className="text-sm text-gray-500">@{profile.username}</p>
                        )}
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
