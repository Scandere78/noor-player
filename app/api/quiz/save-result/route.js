import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { score, category, difficulty, correctAnswers, totalQuestions, timeSpent, hintsUsed } = await request.json();
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Calculer le pourcentage
    const percentage = (correctAnswers / totalQuestions) * 100;

    // Enregistrer le résultat du quiz
    const result = await prisma.quizResult.create({
      data: {
        userId,
        score,
        category,
        difficulty,
        correctAnswers,
        totalQuestions,
        percentage,
        timeSpent: timeSpent || 0,
        hintsUsed: hintsUsed || 0
      }
    });

    // Mettre à jour les stats de l'utilisateur
    const userStats = await prisma.userStats.findUnique({
      where: { userId }
    });

    if (userStats) {
      const newTotalQuizzes = userStats.totalQuizzes + 1;
      const newTotalPoints = userStats.totalPoints + score;
      const newAverageScore = newTotalPoints / newTotalQuizzes;

      // Calculer la catégorie favorite
      const userResults = await prisma.quizResult.findMany({
        where: { userId },
        select: { category: true }
      });

      const categoryCount = userResults.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {});

      const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
        categoryCount[a] > categoryCount[b] ? a : b
      );

      await prisma.userStats.update({
        where: { userId },
        data: {
          totalQuizzes: newTotalQuizzes,
          totalPoints: newTotalPoints,
          averageScore: newAverageScore,
          favoriteCategory,
          streakRecord: Math.max(userStats.streakRecord, correctAnswers)
        }
      });
    }

    return NextResponse.json({
      message: 'Résultat enregistré avec succès',
      result
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
