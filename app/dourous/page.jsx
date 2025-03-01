'use client';

import { useState } from 'react';

export default function QuizPage() {
  const quizzes = {
    "Piliers de l'Islam": [
      { question: "Quel est le premier pilier de l'Islam ?", options: ["La prière", "Le jeûne", "La Shahada"], answer: "La Shahada", source: "Sahih Muslim 1" },
      { question: "Combien de rakats y a-t-il dans la prière du Fajr ?", options: ["2", "4", "3"], answer: "2", source: "Sahih Bukhari 1099" },
      { question: "Combien y a-t-il de piliers de l'Islam ?", options: ["3", "5", "7"], answer: "5", source: "Sahih Bukhari 8" }
    ],
    "Ramadan": [
      { question: "Quel mois est sacré pour le jeûne ?", options: ["Rajab", "Shawwal", "Ramadan"], answer: "Ramadan", source: "Coran 2:185" },
      { question: "À quelle heure doit-on rompre le jeûne ?", options: ["Aube", "Coucher du soleil", "Minuit"], answer: "Coucher du soleil", source: "Sahih Bukhari 1954" },
      { question: "Quel est le repas pris avant l'aube pendant le Ramadan ?", options: ["Iftar", "Suhur", "Taraweeh"], answer: "Suhur", source: "Sahih Muslim 1095" }
    ],
    "Prophètes": [
      { question: "Qui est le dernier prophète de l'Islam ?", options: ["Moussa", "Issa", "Muhammad"], answer: "Muhammad", source: "Sahih Bukhari 33" },
      { question: "Quel prophète a construit l'arche ?", options: ["Ibrahim", "Nuh", "Yusuf"], answer: "Nuh", source: "Coran 11:37" }
    ],
    "Tajweed": [
      { question: "Quel est le nom de la règle qui allonge la prononciation d'une lettre ?", options: ["Idgham", "Madd", "Qalqala"], answer: "Madd", source: "Règles du Tajweed" },
      { question: "Quelle lettre n'est jamais prononcée dans la basmala ?", options: ["Alif", "Lam", "Nun"], answer: "Alif", source: "Règles du Tajweed" }
    ],
    "Aqida": [
      { question: "Combien de noms d'Allah sont mentionnés comme Asma'ul Husna ?", options: ["99", "100", "50"], answer: "99", source: "Sahih Bukhari 2736" },
      { question: "Quel est le premier devoir de chaque musulman ?", options: ["Apprendre le Coran", "Comprendre le Tawhid", "Prier 5 fois par jour"], answer: "Comprendre le Tawhid", source: "Coran 47:19" }
    ]
  };

  const [selectedTheme, setSelectedTheme] = useState(Object.keys(quizzes)[0]);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizzes[selectedTheme].length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index, option) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = option;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    const newScore = quizzes[selectedTheme].reduce((acc, q, index) => {
      return acc + (selectedAnswers[index] === q.answer ? 1 : 0);
    }, 0);
    setScore(newScore);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers(Array(quizzes[selectedTheme].length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white py-10 px-6 flex flex-col items-center'>
      <h1 className='text-4xl font-extrabold text-green-500 text-center mb-4'>🎯 Quiz interactif</h1>
      <p className='text-center text-gray-300 mb-6'>Testez vos connaissances sur différents thèmes</p>
      
      <div className='flex flex-wrap justify-center gap-4 mb-6'>
        {Object.keys(quizzes).map((theme) => (
          <button
            key={theme}
            onClick={() => {
              setSelectedTheme(theme);
              setSelectedAnswers(Array(quizzes[theme].length).fill(null));
              setShowResults(false);
            }}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition-all ${selectedTheme === theme ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {theme}
          </button>
        ))}
      </div>
      
      <div className='w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg'>
        {quizzes[selectedTheme].map((q, index) => (
          <div key={index} className='mb-4'>
            <p className='text-lg font-semibold mb-2'>{q.question}</p>
            <div className='space-y-2'>
              {q.options.map((option, optIndex) => (
                <button 
                  key={optIndex} 
                  onClick={() => handleAnswer(index, option)}
                  className={`block w-full text-left px-4 py-2 rounded-lg cursor-pointer transition-all ${selectedAnswers[index] === option ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button 
          onClick={calculateScore}
          className='bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full text-center hover:bg-blue-600 transition-all'
        >
          Vérifier les réponses
        </button>
        {showResults && (
          <div className='mt-4 text-lg text-center'>
            <p className='text-green-400 font-bold text-xl mb-2'>Score: {score} / {quizzes[selectedTheme].length}</p>
            {quizzes[selectedTheme].map((q, index) => (
              <p key={index} className={`${selectedAnswers[index] === q.answer ? 'text-green-400' : 'text-red-400'}`}>
                {q.question}: {selectedAnswers[index] === q.answer ? '✅ Correct' : `❌ Faux (Réponse: ${q.answer})`} - <span className='text-gray-400'>{q.source}</span>
              </p>
            ))}
            <button 
              onClick={resetQuiz}
              className='bg-red-500 text-white py-2 px-4 rounded mt-4 hover:bg-red-600 transition-all'
            >
              Recommencer le quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
