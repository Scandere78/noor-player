import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

// ✅ AJOUTER CETTE LIGNE - Force le rendu dynamique
export const dynamic = "force-dynamic"

// Middleware pour vérifier le token
async function verifyToken(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!userData) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const { name, email, currentPassword, newPassword } = await request.json()

    // Validation des champs
    if (!name || !email) {
      return NextResponse.json(
        {
          message: "Le nom et l'email sont requis",
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

    // Récupérer l'utilisateur actuel
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })
      if (emailExists) {
        return NextResponse.json(
          {
            message: "Cet email est déjà utilisé",
          },
          { status: 400 },
        )
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {
      name,
      email,
      updatedAt: new Date(),
    }

    // Si changement de mot de passe
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            message: "Le mot de passe actuel est requis",
          },
          { status: 400 },
        )
      }

      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(currentPassword, existingUser.password)
      if (!isValidPassword) {
        return NextResponse.json(
          {
            message: "Mot de passe actuel incorrect",
          },
          { status: 401 },
        )
      }

      // Validation du nouveau mot de passe
      if (newPassword.length < 6) {
        return NextResponse.json(
          {
            message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
          },
          { status: 400 },
        )
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
