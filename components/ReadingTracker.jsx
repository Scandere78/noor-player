'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Play, Pause, Target } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useReadingTracker } from '../hooks/useReadingTracker';

export default function ReadingTracker({ surahNumber, surahName, onVerseRead }) {
  const { user, getReadingProgress } = useAuth();
  const { isTracking, startReading, stopReading, recordVerse } = useReadingTracker();
  const [currentVerse, setCurrentVerse] = useState(1);
  const [todayGoal, setTodayGoal] = useState(null);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastBookmark, setLastBookmark] = useState(null);
  const [showBookmark, setShowBookmark] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        const progress = await getReadingProgress();
        if (progress?.userStats) {
          setTodayGoal(progress.userStats.dailyGoal || 10);
          setTodayProgress(progress.dailyStats[new Date().toISOString().split('T')[0]] || 0);
          
          // Récupérer le dernier marque-page pour cette sourate
          if (progress.recentProgress) {
            const bookmark = progress.recentProgress.find(p => p.surahNumber === surahNumber);
            if (bookmark) {
              setLastBookmark(bookmark);
              setShowBookmark(true);
            }
          }
        }
      }
    };

    fetchProgress();
  }, [user, getReadingProgress, surahNumber]);
  const handleVerseComplete = async (verseNumber) => {
    if (!user) return;

    setCurrentVerse(verseNumber);
    await recordVerse(surahNumber, verseNumber, surahName);
    
    // Mettre à jour le progrès local
    const newProgress = todayProgress + 1;
    setTodayProgress(newProgress);
    
    // Mettre à jour le marque-page local
    setLastBookmark({
      surahNumber,
      verseNumber,
      surahName,
      readAt: new Date()
    });
    
    // Vérifier si l'objectif est atteint
    if (todayGoal && newProgress >= todayGoal) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    // Callback optionnel pour la page parent
    if (onVerseRead) {
      onVerseRead(verseNumber);
    }
  };

  const handleContinueFromBookmark = () => {
    if (lastBookmark) {
      setCurrentVerse(lastBookmark.verseNumber);
      setShowBookmark(false);
      startReading();
    }
  };

  const handleStartStop = () => {
    if (isTracking) {
      stopReading();
    } else {
      startReading();
    }
  };

  if (!user) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Notification du marque-page */}
      <AnimatePresence>
        {showBookmark && lastBookmark && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-blue-600 rounded-lg p-4 shadow-xl border border-blue-500 min-w-64 mb-2"
          >
            <div className="text-center mb-3">
              <h3 className="text-white font-semibold flex items-center justify-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Marque-page trouvé
              </h3>
              <p className="text-blue-100 text-sm">
                Vous étiez au verset {lastBookmark.verseNumber}
              </p>
              <p className="text-blue-200 text-xs">
                {new Date(lastBookmark.readAt).toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleContinueFromBookmark}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
              >
                Continuer
              </Button>
              <Button
                onClick={() => setShowBookmark(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-sm"
              >
                Commencer au début
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        <Button
          onClick={handleStartStop}
          className={`w-16 h-16 rounded-full shadow-lg ${
            isTracking 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isTracking ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>        {/* Indicateur de progression avec marque-page */}
        {todayGoal && (
          <div className="absolute -top-2 -right-2 bg-gray-800 rounded-full px-2 py-1 text-xs text-white border border-gray-600">
            {todayProgress}/{todayGoal}
            {lastBookmark && (
              <div className="text-green-400 mt-1">📖 {lastBookmark.verseNumber}</div>
            )}
          </div>
        )}      </motion.div>

      {/* Notification du marque-page */}
      <AnimatePresence>
        {showBookmark && lastBookmark && !isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-blue-600 rounded-lg p-4 shadow-xl border border-blue-500 min-w-64 mb-2"
          >
            <div className="text-center mb-3">
              <h4 className="text-white font-semibold">📖 Reprendre la lecture</h4>
              <p className="text-blue-200 text-sm">
                Vous étiez au verset {lastBookmark.verseNumber} dans {lastBookmark.surahName}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleContinueFromBookmark}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
              >
                Continuer
              </Button>
              <Button
                onClick={() => setShowBookmark(false)}
                variant="outline"
                className="flex-1 text-sm"
              >
                Ignorer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de contrôle étendu */}
      <AnimatePresence>
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 min-w-64"
          >            <div className="text-center mb-3">
              <h3 className="text-white font-semibold">{surahName}</h3>
              <p className="text-gray-400 text-sm">Verset actuel: {currentVerse}</p>
              {lastBookmark && (
                <p className="text-blue-400 text-xs">
                  📖 Dernier marque-page: verset {lastBookmark.verseNumber}
                </p>
              )}
            </div>

            {/* Progrès du jour */}
            {todayGoal && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Objectif du jour</span>
                  <span className="text-green-400">{todayProgress}/{todayGoal}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((todayProgress / todayGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Bouton pour marquer un verset comme lu */}
            <Button
              onClick={() => handleVerseComplete(currentVerse + 1)}
              className="w-full bg-green-600 hover:bg-green-700 text-sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verset lu
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation de célébration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: [0, 10, -10, 0],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              <span className="font-semibold">Objectif atteint ! 🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
