'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au démarrage
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // Vérifier si le token est encore valide
        const isValid = await checkTokenValidity();
        if (isValid) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };  const register = async (email, name, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Erreur d\'inscription' };
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fonction pour vérifier si le token est valide
  const checkTokenValidity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404 || response.status === 401) {
        // Token invalide ou utilisateur n'existe plus
        console.log('Token invalide détecté, déconnexion automatique');
        logout();
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  };

  // Fonction helper pour faire des requêtes avec gestion automatique des erreurs d'authentification
  const authenticatedFetch = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (response.status === 404 || response.status === 401) {
        console.log('Authentification échouée, déconnexion automatique');
        logout();
        return null;
      }

      return response;
    } catch (error) {
      console.error('Erreur lors de la requête authentifiée:', error);
      return null;
    }
  };

  const saveQuizResult = async (result) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  };  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };  const getDashboardStats = async () => {
    try {
      const response = await authenticatedFetch('/api/dashboard/stats');
      
      if (response && response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  };

  // Nouvelles fonctions pour le suivi de lecture
  const recordReadingProgress = async (surahNumber, verseNumber, surahName, readingTime = 0) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reading/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          surahNumber,
          verseNumber,
          surahName,
          readingTime
        }),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du progrès:', error);
      return null;
    }
  };
  const getReadingProgress = async () => {
    try {
      const response = await authenticatedFetch('/api/reading/progress');
      
      if (response && response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du progrès:', error);
      return null;
    }
  };

  const updateReadingGoal = async (dailyGoal) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reading/goal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ dailyGoal }),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'objectif:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    saveQuizResult,
    getDashboardStats,
    recordReadingProgress,
    getReadingProgress,
    updateReadingGoal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
