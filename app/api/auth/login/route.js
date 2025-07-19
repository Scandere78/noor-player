import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Vérifier les variables d'environnement
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non défini');
      return NextResponse.json({ message: 'Configuration serveur manquante' }, { status: 500 });
    }

    if (!email || !password) {
      return NextResponse.json({ message: 'Email et mot de passe requis' }, { status: 400 });
    }

    // Chercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true }
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 401 });
    }    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        avatar: user.avatar 
      },
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    // Gestion spécifique des erreurs Prisma
    if (error.code === 'P2010') {
      return NextResponse.json({ 
        message: 'Erreur de connexion à la base de données',
        error: 'Service temporairement indisponible'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Ajouter une route GET pour tester la connectivité
export async function GET() {
  try {
    // Test simple de connexion
    await prisma.$connect();
    const result = await prisma.$runCommandRaw({ ping: 1 });
    return NextResponse.json({ 
      message: 'API login opérationnelle',
      database: 'Connecté',
      ping: result
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json({ 
      message: 'Erreur de connexion à la base de données',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    }, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}
