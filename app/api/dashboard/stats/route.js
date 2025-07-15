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

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
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
      acc[result.category].average = (acc[result.category].correct / (acc[result.category].total * 4)) * 100; // Assumant 4 questions par catégorie
      return acc;
    }, {});

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      stats: user.stats,
      recentResults: user.quizResults,
      categoryStats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
