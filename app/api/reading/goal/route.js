import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Mettre à jour l'objectif de lecture quotidien
export async function PUT(request) {
  try {
    const { dailyGoal } = await request.json();
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token manquant' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validation de l'objectif
    if (!dailyGoal || dailyGoal < 1 || dailyGoal > 100) {
      return NextResponse.json({ 
        message: 'L\'objectif doit être entre 1 et 100 versets par jour' 
      }, { status: 400 });
    }

    // Mettre à jour ou créer les statistiques utilisateur
    const userStats = await prisma.userStats.upsert({
      where: { userId: decoded.userId },
      update: { dailyGoal: parseInt(dailyGoal) },
      create: { 
        userId: decoded.userId,
        dailyGoal: parseInt(dailyGoal)
      }
    });

    return NextResponse.json({ 
      message: 'Objectif mis à jour avec succès',
      userStats 
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'objectif:', error);
    return NextResponse.json({ 
      message: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}
