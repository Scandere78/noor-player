'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, LogOut, BarChart3, Menu, X, ChevronDown } from 'lucide-react';
import AuthModal from './auth/AuthModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!user;
  const pathname = usePathname();
  const isDashboardPage = pathname?.includes('/dashboard');
  
  const isActive = (path) => pathname === path;
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setIsMenuOpen(false);
    setShowDropdown(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/');
  };

  // Ne pas afficher la navbar sur les pages dashboard
  if (isDashboardPage) {
    return null;
  }

  const navItems = [
    { href: '/lecture', label: 'Lecture', icon: '📖' },
    { href: '/sourates', label: 'Écoute', icon: '🎵' },
    { href: '/quizz', label: 'Quizz', icon: '🧠' },
    { href: '/about', label: 'À propos', icon: 'ℹ️' },
  ];

  // Navbar normale pour les autres pages
  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 font-sans h-20 ${
        scrolled ? 'bg-gradient-to-b from-black via-black/95 to-black/85 shadow-lg' : 'bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-sm' 
      }`}>
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
          <div className="flex items-center h-full justify-between">            {/* Logo avec image et texte */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-3xl flex items-center">
                <img src="/logo.svg" alt="Noor Play" className="h-12 w-12 mr-3" />
                <span className="text-green-500">Noor</span>
                <span className="text-white ml-2">Player</span>
              </Link>
            </div>

            {/* Desktop Menu avec sections plus grandes */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-4">
                <Link href="/lecture" className="text-white hover:text-green-400 px-4 py-2.5 rounded-md transition-colors text-lg font-medium">
                  Lecture
                </Link>
                <Link href="/sourates" className="text-white hover:text-green-400 px-4 py-2.5 rounded-md transition-colors text-lg font-medium">
                  Écoute
                </Link>
                <Link href="/quizz" className="text-white hover:text-green-400 px-4 py-2.5 rounded-md transition-colors text-lg font-medium">
                  Quizz
                </Link>
                <Link href="/about" className="text-white hover:text-green-400 px-4 py-2.5 rounded-md transition-colors text-lg font-medium">
                  À propos
                </Link>
              </div>
            </div>

            {/* Bouton de connexion desktop */}
            <div className="hidden md:block ml-6">
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all border border-green-500/30 group"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full mr-2.5 border border-white/30" />
                    ) : (
                      <div className="h-8 w-8 bg-green-700 rounded-full mr-2.5 flex items-center justify-center text-white text-sm font-bold border border-white/30">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="mr-1 text-base">{user?.name || 'Profil'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1.5 z-20 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </Link>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />                        </svg>
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="relative overflow-hidden group"
                >
                  {/* Fond principal avec dégradé vert */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 rounded-full"></div>
                  
                  {/* Effet d'éclat au survol */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Bordure subtile */}
                  <div className="absolute inset-0 rounded-full border border-green-500/40"></div>
                  
                  {/* Contenu du bouton */}
                  <div className="relative z-10 flex items-center text-white px-6 py-2.5 rounded-full font-medium text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Connexion
                  </div>
                  
                  {/* Effet de lumière sur le côté */}
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-green-600/30 backdrop-blur-sm text-white hover:bg-green-500/40 focus:outline-none transition-all"
                aria-label="Menu principal"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Menu mobile redessiné et simplifié avec sections plus grandes */}
        <div 
          className={`fixed top-20 right-2 md:hidden z-50 w-64 rounded-xl shadow-xl transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="bg-gradient-to-b from-green-600 to-green-500 rounded-xl overflow-hidden">
            {/* En-tête du menu avec compte */}
            {isLoggedIn ? (
              <div className="p-4 bg-black/20 flex items-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full border border-white/30" />
                ) : (
                  <div className="h-12 w-12 bg-green-700 rounded-full flex items-center justify-center text-white text-lg font-bold border border-white/30">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-white font-medium truncate max-w-[180px]">{user?.name}</p>
                  <p className="text-green-200 text-xs truncate max-w-[180px]">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black/20 hover:bg-black/30 transition-colors">
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-white w-full"
                >
                  <div className="h-12 w-12 bg-green-700 rounded-full flex items-center justify-center mr-3 border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-lg">Se connecter</p>
                    <p className="text-sm text-green-200">Accéder à votre espace</p>
                  </div>
                </button>
              </div>
            )}
            
            {/* Navigation simplifiée avec sections plus grandes */}
            <div className="px-2 py-3">
              <div className="space-y-1">
                <Link 
                  href="/lecture" 
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive('/lecture') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-lg">Lecture</span>
                </Link>
                
                <Link 
                  href="/sourates" 
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive('/sourates') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="text-lg">Écoute</span>
                </Link>
                
                <Link 
                  href="/quizz" 
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive('/quizz') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Quizz</span>
                </Link>
                
                <Link 
                  href="/about" 
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive('/about') 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">À propos</span>
                </Link>
              </div>
            </div>
              {/* Boutons du bas pour utilisateurs connectés */}
            {isLoggedIn && (
              <div className="px-2 pb-3">
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <Link 
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-lg">Mon profil</span>
                    </div>
                  </Link>
                    <Link 
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-lg">Dashboard</span>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-3 rounded-lg text-red-300 hover:bg-red-900/30 hover:text-red-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-lg">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;
