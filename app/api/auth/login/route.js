import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Trouver l'utilisateur
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
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
