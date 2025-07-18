'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Target, BookOpen, TrendingUp, Star, Clock, Award, BarChart3, Home, User, Settings } from 'lucide-react';
import ReadingStats from './ReadingStats';

export default function Dashboard() {
  const { user, getDashboardStats, logout, updateReadingGoal } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(10);

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        const data = await getDashboardStats();
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
  }, [user, getDashboardStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Vous devez être connecté pour accéder au dashboard</div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';    return 'D';
  };

  const handleSetGoal = async () => {
    if (newGoal && newGoal >= 1 && newGoal <= 100) {
      const result = await updateReadingGoal(newGoal);
      if (result) {
        setShowGoalModal(false);
        // Recharger les stats
        const updatedStats = await getDashboardStats();
        setStats(updatedStats);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 navbar-safe">
      <div className="max-w-7xl mx-auto">        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Version Desktop */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-green-600 text-white text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-green-400">
                  Bienvenue, {user.name}!
                </h1>
                <p className="text-gray-400">Tableau de bord de vos performances</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Se déconnecter
              </Button>
            </div>
          </div>

          {/* Version Mobile */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-green-600 text-white text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-green-400">
                    Bienvenue, {user.name}!
                  </h1>
                  <p className="text-sm text-gray-400">Tableau de bord</p>
                </div>
              </div>
            </div>
            
            {/* Boutons mobiles en grille */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Retour au site
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mon Profil
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Quiz Terminés
                </CardTitle>
                <BookOpen className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {stats?.stats?.totalQuizzes || 0}
                </div>
                <p className="text-xs text-gray-500">
                  Au total
                </p>
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
                  Points Total
                </CardTitle>
                <Trophy className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {stats?.stats?.totalPoints || 0}
                </div>
                <p className="text-xs text-gray-500">
                  Points accumulés
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
                  Score Moyen
                </CardTitle>
                <Target className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(stats?.stats?.averageScore || 0)}
                </div>
                <p className="text-xs text-gray-500">
                  Points par quiz
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
                  Série Record
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {stats?.stats?.streakRecord || 0}
                </div>
                <p className="text-xs text-gray-500">
                  Bonnes réponses consécutives
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>        {/* Onglets pour Quiz et Lecture */}
        <Tabs defaultValue="reading" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="reading" className="text-white data-[state=active]:bg-green-600">
              📖 Lecture du Coran
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-blue-600">
              🧠 Quiz & Tests
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reading" className="space-y-6">
            <ReadingStats 
              readingStats={stats?.readingStats}
              recentProgress={stats?.recentReadingProgress}
              onSetGoal={() => setShowGoalModal(true)}
            />
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            {/* Performance par Catégorie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <BarChart3 className="mr-2" />
                      Performance par Catégorie
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Vos résultats dans chaque thème
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.categoryStats && Object.entries(stats.categoryStats).map(([category, data]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category}</span>
                            <span className={`text-sm font-bold ${getGradeColor(data.average)}`}>
                              {getGradeLetter(data.average)} ({Math.round(data.average)}%)
                            </span>
                          </div>
                          <Progress value={data.average} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {data.total} quiz terminés
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <Clock className="mr-2" />
                      Résultats Récents
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Vos 10 derniers quiz
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats?.recentResults && stats.recentResults.slice(0, 5).map((result, index) => (
                        <div key={result.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              result.percentage >= 80 ? 'bg-green-600' : 
                              result.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {result.percentage >= 80 ? <Award className="h-4 w-4" /> : 
                               result.percentage >= 60 ? <Star className="h-4 w-4" /> : 
                               <Target className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="font-medium">{result.category}</div>
                              <div className="text-sm text-gray-400">
                                {result.correctAnswers}/{result.totalQuestions} correct
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400">{result.score}pts</div>
                            <div className={`text-sm ${getGradeColor(result.percentage)}`}>
                              {Math.round(result.percentage)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Catégorie Favorite */}
        {stats?.stats?.favoriteCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2" />
                  Catégorie Favorite
                </CardTitle>
              </CardHeader>              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.stats.favoriteCategory}
                </div>
                <p className="text-green-100">
                  Votre thème de prédilection basé sur vos performances
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modal pour définir l'objectif */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Définir votre objectif quotidien</h3>
              <p className="text-gray-400 mb-6">
                Combien de versets souhaitez-vous lire par jour ?
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de versets par jour
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newGoal}
                    onChange={(e) => setNewGoal(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSetGoal}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
