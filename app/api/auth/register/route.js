import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Utilisateur déjà existant' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec ses stats
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        stats: {
          create: {
            totalQuizzes: 0,
            totalPoints: 0,
            averageScore: 0,
            streakRecord: 0
          }
        }
      },
      include: {
        stats: true
      }
    });

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: { id: user.id, email: user.email, name: user.name },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
