import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Enregistrer le progrès de lecture
export async function POST(request) {
  try {
    const { surahNumber, verseNumber, surahName, readingTime } = await request.json();
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si ce verset a déjà été lu aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingProgress = await prisma.readingProgress.findUnique({
      where: {
        userId_surahNumber_verseNumber: {
          userId: decoded.userId,
          surahNumber: parseInt(surahNumber),
          verseNumber: parseInt(verseNumber)
        }
      }
    });

    let progress;
    if (existingProgress) {
      // Mettre à jour le progrès existant
      progress = await prisma.readingProgress.update({
        where: { id: existingProgress.id },
        data: {
          readAt: new Date(),
          readingTime: readingTime || existingProgress.readingTime
        }
      });
    } else {
      // Créer un nouveau progrès
      progress = await prisma.readingProgress.create({
        data: {
          userId: decoded.userId,
          surahNumber: parseInt(surahNumber),
          verseNumber: parseInt(verseNumber),
          surahName,
          readingTime: readingTime || 0
        }
      });
    }

    // Mettre à jour les statistiques utilisateur
    await updateUserReadingStats(decoded.userId, surahNumber, verseNumber);

    return NextResponse.json({ 
      message: 'Progrès enregistré avec succès',
      progress 
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du progrès:', error);
    return NextResponse.json({ 
      message: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}

// Récupérer le progrès de lecture d'un utilisateur
export async function GET(request) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer les statistiques de l'utilisateur
    let userStats = await prisma.userStats.findUnique({
      where: { userId: decoded.userId }
    });

    if (!userStats) {
      // Créer des stats par défaut si elles n'existent pas
      userStats = await prisma.userStats.create({
        data: { userId: decoded.userId }
      });
    }

    // Récupérer les progrès récents (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProgress = await prisma.readingProgress.findMany({
      where: {
        userId: decoded.userId,
        readAt: { gte: thirtyDaysAgo }
      },
      orderBy: { readAt: 'desc' },
      take: 50
    });

    // Calculer les statistiques quotidiennes
    const dailyStats = calculateDailyReadingStats(recentProgress);

    return NextResponse.json({
      userStats,
      recentProgress,
      dailyStats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du progrès:', error);
    return NextResponse.json({ 
      message: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}

// Fonction helper pour mettre à jour les stats utilisateur
async function updateUserReadingStats(userId, surahNumber, verseNumber) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let userStats = await prisma.userStats.findUnique({
      where: { userId }
    });    if (!userStats) {
      userStats = await prisma.userStats.create({
        data: {
          userId,
          totalQuizzes: 0,
          totalPoints: 0,
          averageScore: 0,
          totalVersesRead: 0,
          readingStreak: 0,
          dailyGoal: 10
        }
      });
    }

    // Compter les versets lus aujourd'hui
    const versesToday = await prisma.readingProgress.count({
      where: {
        userId,
        readAt: { gte: today }
      }
    });

    // Calculer la série de lecture
    let readingStreak = userStats.readingStreak;
    const lastReadDate = userStats.lastReadDate;
    
    if (lastReadDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (lastReadDate >= yesterday && lastReadDate < today) {
        readingStreak += 1;
      } else if (lastReadDate < yesterday) {
        readingStreak = 1; // Recommencer la série
      }
    } else {
      readingStreak = 1;
    }

    // Mettre à jour les statistiques
    await prisma.userStats.update({
      where: { userId },
      data: {
        totalVersesRead: { increment: 1 },
        currentSurah: parseInt(surahNumber),
        currentVerse: parseInt(verseNumber),
        readingStreak,
        lastReadDate: new Date()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des stats:', error);
  }
}

// Fonction helper pour calculer les statistiques quotidiennes
function calculateDailyReadingStats(progressData) {
  const dailyStats = {};
  
  progressData.forEach(progress => {
    const date = progress.readAt.toISOString().split('T')[0];
    if (!dailyStats[date]) {
      dailyStats[date] = 0;
    }
    dailyStats[date]++;
  });

  return dailyStats;
}
