import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// ✅ AJOUTER CETTE LIGNE - Force le rendu dynamique
export const dynamic = "force-dynamic"

export async function POST(request) {
  try {
    const { email, name, password } = await request.json()

    // Validation des champs
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          message: "Tous les champs sont requis",
        },
        { status: 400 },
      )
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Format email invalide",
        },
        { status: 400 },
      )
    }

    // Validation mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Le mot de passe doit contenir au moins 6 caractères",
        },
        { status: 400 },
      )
    }

    // Vérifier si l'email existe déjà
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          message: "Cet email est déjà utilisé",
        },
        { status: 400 },
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

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
            streakRecord: 0,
          },
        },
      },
      include: {
        stats: true,
      },
    })

    // Ne pas retourner le token JWT, juste les infos utilisateur
    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erreur lors de la création:", error)

    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2010") {
      return NextResponse.json(
        {
          message: "Erreur de connexion à la base de données",
          error: "Service temporairement indisponible",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        message: "Erreur serveur",
        error: process.env.NODE_ENV === "development" ? error.message : "Erreur interne",
      },
      { status: 500 },
    )
  }
}
