import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let whereClause = { isActive: true };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      select: {
        id: true,
        category: true,
        question: true,
        options: true,
        answer: true,
        explanation: true,
        source: true,
        difficulty: true
      }
    });

    return NextResponse.json({
      questions,
      count: questions.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { category, question, options, answer, explanation, source, difficulty } = await request.json();

    const newQuestion = await prisma.question.create({
      data: {
        category,
        question,
        options,
        answer,
        explanation,
        source,
        difficulty: difficulty || 'normal'
      }
    });

    return NextResponse.json({
      message: 'Question créée avec succès',
      question: newQuestion
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la question:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
