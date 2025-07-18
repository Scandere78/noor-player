'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useReadingTracker = () => {
  const { recordReadingProgress, user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const startReading = () => {
    if (user) {
      setIsTracking(true);
      setStartTime(Date.now());
    }
  };

  const stopReading = () => {
    setIsTracking(false);
    setStartTime(null);
  };

  const recordVerse = async (surahNumber, verseNumber, surahName) => {
    if (!user) return;

    const readingTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    try {
      await recordReadingProgress(surahNumber, verseNumber, surahName, readingTime);
      
      // Feedback visuel optionnel
      if (typeof window !== 'undefined') {
        // Vous pouvez ajouter ici une notification toast ou autre feedback
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du verset:', error);
    }
  };

  return {
    isTracking,
    startReading,
    stopReading,
    recordVerse
  };
};
