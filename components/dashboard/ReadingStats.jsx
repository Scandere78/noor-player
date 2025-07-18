'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { BookOpen, Target, Calendar, Flame, ChevronRight, Clock } from 'lucide-react';

export default function ReadingStats({ readingStats, recentProgress, onSetGoal }) {
  // Si pas de données, afficher un état vide avec encouragement
  if (!readingStats) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <BookOpen className="h-16 w-16 text-green-400 opacity-50" />
                <h3 className="text-xl font-bold text-white">Commencez votre parcours de lecture</h3>
                <p className="text-gray-400 max-w-md">
                  Utilisez le bouton de suivi sur les pages de sourates pour enregistrer votre progression et voir vos statistiques ici.
                </p>
                <Button 
                  onClick={onSetGoal}
                  className="bg-green-600 hover:bg-green-700 mt-4"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Définir mon objectif quotidien
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const getSurahName = (surahNumber) => {
    // Liste des noms de sourates (simplifié)
    const surahNames = {
      1: "Al-Fâtiha",
      2: "Al-Baqara", 
      3: "Âl-Imrân",
      4: "An-Nisâ'",
      5: "Al-Mâ'ida",
      // ... vous pouvez ajouter tous les noms de sourates
    };
    return surahNames[surahNumber] || `Sourate ${surahNumber}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Statistiques principales */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cards des stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Aujourd'hui
                </CardTitle>
                <BookOpen className="h-4 w-4 text-green-400" />
              </CardHeader>              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {readingStats.todayVerses || 0}
                </div>
                <p className="text-xs text-gray-500">
                  versets lus aujourd'hui
                </p>
                {readingStats.dailyGoal && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((readingStats.todayVerses / readingStats.dailyGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Cette semaine
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {readingStats.weekVerses}
                </div>
                <p className="text-xs text-gray-500">
                  versets cette semaine
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Série
                </CardTitle>
                <Flame className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {readingStats.streak}
                </div>
                <p className="text-xs text-gray-500">
                  jours consécutifs
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total
                </CardTitle>
                <Target className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {readingStats.totalVerses}
                </div>
                <p className="text-xs text-gray-500">
                  versets au total
                </p>
              </CardContent>
            </Card>
          </motion.div>        </div>

        {/* Position actuelle de lecture */}
        {readingStats.currentPosition && (readingStats.currentPosition.surah > 1 || readingStats.currentPosition.verse > 1) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  Position actuelle de lecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {getSurahName(readingStats.currentPosition.surah)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Verset {readingStats.currentPosition.verse}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {readingStats.currentPosition.surah}:{readingStats.currentPosition.verse}
                    </div>
                    <div className="text-xs text-gray-500">
                      Marque-page
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}        {/* Objectif quotidien */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className={`border-gray-700 ${
            readingStats.todayVerses >= readingStats.dailyGoal 
              ? 'bg-gradient-to-r from-green-800 to-green-900 border-green-600' 
              : 'bg-gray-800'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    {readingStats.todayVerses >= readingStats.dailyGoal ? (
                      <>
                        <div className="h-5 w-5 mr-2 text-green-400">🎯</div>
                        Objectif atteint !
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 mr-2 text-green-400" />
                        Objectif quotidien
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className={
                    readingStats.todayVerses >= readingStats.dailyGoal 
                      ? 'text-green-300' 
                      : 'text-gray-400'
                  }>
                    {readingStats.todayVerses} / {readingStats.dailyGoal} versets
                    {readingStats.todayVerses >= readingStats.dailyGoal && (
                      <span className="ml-2 text-yellow-400">🎉</span>
                    )}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSetGoal}
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress 
                  value={Math.min(readingStats.goalProgress, 100)} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm">
                  <span className={
                    readingStats.todayVerses >= readingStats.dailyGoal 
                      ? 'text-green-300' 
                      : 'text-gray-400'
                  }>
                    {Math.round(Math.min(readingStats.goalProgress, 100))}% complété
                  </span>
                  <span className={
                    readingStats.todayVerses >= readingStats.dailyGoal 
                      ? 'text-green-300 font-semibold' 
                      : 'text-gray-400'
                  }>
                    {readingStats.dailyGoal - readingStats.todayVerses > 0 
                      ? `${readingStats.dailyGoal - readingStats.todayVerses} versets restants`
                      : 'Félicitations ! Objectif atteint ! 🎉'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>        {/* Résumé de progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                Résumé de lecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {readingStats.currentPosition.surah}
                  </div>
                  <div className="text-sm text-gray-400">
                    Sourate actuelle
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {readingStats.currentPosition.verse}
                  </div>
                  <div className="text-sm text-gray-400">
                    Verset actuel
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {readingStats.totalVerses}
                  </div>
                  <div className="text-sm text-gray-400">
                    Total versets
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {readingStats.streak}
                  </div>
                  <div className="text-sm text-gray-400">
                    Jours de suite
                  </div>
                </div>
              </div>
              
              {readingStats.currentPosition.surah > 1 && (
                <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                  <div className="text-sm text-blue-200">
                    📖 Dernière lecture : <strong>{getSurahName(readingStats.currentPosition.surah)}, Verset {readingStats.currentPosition.verse}</strong>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentProgress && recentProgress.length > 0 ? (
                recentProgress.slice(0, 10).map((progress, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {progress.surahName}
                      </div>
                      <div className="text-xs text-gray-400">
                        Verset {progress.verseNumber}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(progress.readAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune lecture récente</p>
                  <p className="text-xs mt-1">Commencez à lire pour voir votre progrès ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
