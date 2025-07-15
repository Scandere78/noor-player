'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Target, BookOpen, TrendingUp, Star, Clock, Award, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { user, getDashboardStats, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (percentage >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 navbar-safe">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
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
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Se déconnecter
          </Button>
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
        </div>

        {/* Performance par Catégorie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              </CardHeader>
              <CardContent>
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
      </div>
    </div>
  );
}
