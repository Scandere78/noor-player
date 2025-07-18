// app/api/test-env/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Définie' : '❌ Non définie',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Définie' : '❌ Non définie',
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json({
      message: 'Variables d\'environnement',
      env: envVars
    });

  } catch (error) {
    console.error('Erreur lors de la vérification des variables d\'environnement:', error);
    return NextResponse.json({ 
      message: 'Erreur serveur',
      error: error.message 
    }, { status: 500 });
  }
}
