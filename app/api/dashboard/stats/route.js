import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    console.log('Dashboard API - Recherche utilisateur avec ID:', userId);

    // Récupérer l'utilisateur avec ses stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        stats: true,
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    console.log('Dashboard API - Utilisateur trouvé:', user ? 'Oui' : 'Non');

    if (!user) {
      console.log('Dashboard API - Utilisateur non trouvé pour ID:', userId);
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Créer les UserStats si elles n'existent pas
    if (!user.stats) {
      user.stats = await prisma.userStats.create({
        data: {
          userId: userId,
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          totalVersesRead: 0,
          readingStreak: 0,
          dailyGoal: 10
        }
      });
    }

    // Récupérer les données de lecture séparément
    let recentReadingProgress = [];
    try {
      recentReadingProgress = await prisma.readingProgress.findMany({
        where: { userId },
        orderBy: { readAt: 'desc' },
        take: 20
      });
    } catch (error) {
      console.log('ReadingProgress non disponible:', error.message);
    }

    // Calculer les stats par catégorie
    const allResults = await prisma.quizResult.findMany({
      where: { userId }
    });

    const categoryStats = allResults.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = {
          total: 0,
          correct: 0,
          average: 0,
          totalScore: 0
        };
      }
      acc[result.category].total++;
      acc[result.category].correct += result.correctAnswers;
      acc[result.category].totalScore += result.score;
      acc[result.category].average = (acc[result.category].correct / (acc[result.category].total * 4)) * 100;
      return acc;
    }, {});

    // Calculer les stats de lecture
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayProgress = 0;
    let weekProgress = 0;
    
    try {
      // Compter les versets lus aujourd'hui
      todayProgress = await prisma.readingProgress.count({
        where: {
          userId,
          readAt: { gte: today }
        }
      });

      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      
      // Compter les versets lus cette semaine
      weekProgress = await prisma.readingProgress.count({
        where: {
          userId,
          readAt: { gte: thisWeek }
        }
      });

      console.log(`Dashboard API - Stats lecture pour utilisateur ${userId}:`, {
        todayProgress,
        weekProgress,
        totalVersesRead: user.stats?.totalVersesRead || 0
      });
      
    } catch (error) {
      console.log('Dashboard API - Erreur calcul stats lecture:', error.message);
    }

    const readingStats = {
      todayVerses: todayProgress,
      weekVerses: weekProgress,
      totalVerses: user.stats?.totalVersesRead || 0,
      currentPosition: {
        surah: user.stats?.currentSurah || 1,
        verse: user.stats?.currentVerse || 1
      },
      streak: user.stats?.readingStreak || 0,
      dailyGoal: user.stats?.dailyGoal || 10,
      goalProgress: Math.min((todayProgress / (user.stats?.dailyGoal || 10)) * 100, 100)
    };

    console.log('Dashboard API - Données retournées:', {
      userId: user.id,
      readingStats,
      hasStats: !!user.stats
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      stats: user.stats,
      recentResults: user.quizResults,
      categoryStats,
      readingStats,
      recentReadingProgress
    });
  } catch (error) {
    console.error('Dashboard API - Erreur lors de la récupération:', error);
    
    // Si erreur JWT (token invalide), retourner 401
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }
    
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
