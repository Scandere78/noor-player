'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Medal, Flame, Lightbulb, Check, X, ArrowRight, User, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import Image from 'next/image';

function QuizPageContent() {
  const { user, saveQuizResult } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Base de données des questions
  const quizzes = {
    "Piliers de l'Islam": [
      { 
        question: "Quel est le premier pilier de l'Islam ?", 
        options: ["La prière", "Le jeûne", "La Shahada"], 
        answer: "La Shahada", 
        source: "Sahih Muslim 1",
        explanation: "La Shahada, la déclaration de foi musulmane (« Il n'y a pas de divinité en dehors de Dieu et Muhammad est son prophète »), est le premier des cinq piliers de l'islam."
      },
      { 
        question: "Combien de rakats y a-t-il dans la prière du Fajr ?", 
        options: ["2", "4", "3"], 
        answer: "2", 
        source: "Sahih Bukhari 1099",
        explanation: "La prière du Fajr (l'aube) est composée de 2 rakats obligatoires, contrairement à d'autres prières qui peuvent en avoir 3 ou 4."
      },
      { 
        question: "Combien y a-t-il de piliers de l'Islam ?", 
        options: ["3", "5", "7"], 
        answer: "5", 
        source: "Sahih Bukhari 8",
        explanation: "Les cinq piliers de l'Islam sont: la Shahada (profession de foi), la Salat (prière), la Zakat (aumône), le Sawm (jeûne du Ramadan) et le Hajj (pèlerinage à La Mecque)."
      },
      { 
        question: "Quel est le troisième pilier de l'Islam ?", 
        options: ["Le jeûne", "La zakat", "Le pèlerinage"], 
        answer: "La zakat", 
        source: "Sahih Bukhari 24",
        explanation: "La Zakat (aumône obligatoire) est le troisième pilier de l'Islam, après la Shahada et la Salat (prière)."
      }
    ],
    "Ramadan": [
      { 
        question: "Quel mois est sacré pour le jeûne ?", 
        options: ["Rajab", "Shawwal", "Ramadan"], 
        answer: "Ramadan", 
        source: "Coran 2:185",
        explanation: "Le Ramadan est le neuvième mois du calendrier musulman durant lequel les musulmans pratiquent le jeûne du lever au coucher du soleil."
      },
      { 
        question: "À quelle heure doit-on rompre le jeûne ?", 
        options: ["Aube", "Coucher du soleil", "Minuit"], 
        answer: "Coucher du soleil", 
        source: "Sahih Bukhari 1954",
        explanation: "Le jeûne est rompu au moment du coucher du soleil (maghrib), généralement avec des dattes et de l'eau selon la tradition prophétique."
      },
      { 
        question: "Quel est le repas pris avant l'aube pendant le Ramadan ?", 
        options: ["Iftar", "Suhur", "Taraweeh"], 
        answer: "Suhur", 
        source: "Sahih Muslim 1095",
        explanation: "Le Suhur est le repas pris avant l'aube pendant le Ramadan, tandis que l'Iftar est le repas pris au coucher du soleil pour rompre le jeûne."
      },
      { 
        question: "Quelle nuit est meilleure que 1000 mois ?", 
        options: ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Bara'ah"], 
        answer: "Laylat al-Qadr", 
        source: "Coran 97:3",
        explanation: "Laylat al-Qadr (La Nuit du Destin) est décrite dans le Coran comme meilleure que mille mois. Elle se situe durant les 10 derniers jours du Ramadan."
      }
    ],
    "Prophètes": [
      { 
        question: "Qui est le dernier prophète de l'Islam ?", 
        options: ["Moussa", "Issa", "Muhammad"], 
        answer: "Muhammad", 
        source: "Sahih Bukhari 33",
        explanation: "Le Prophète Muhammad (que la paix soit sur lui) est considéré comme le dernier prophète (Khatam an-Nabiyyin) dans l'Islam."
      },
      { 
        question: "Quel prophète a construit l'arche ?", 
        options: ["Ibrahim", "Nuh", "Yusuf"], 
        answer: "Nuh", 
        source: "Coran 11:37",
        explanation: "Le prophète Nuh (Noé) a construit l'arche sur ordre d'Allah pour sauver les croyants et les animaux du déluge."
      },
      { 
        question: "Quel prophète a parlé dans son berceau ?", 
        options: ["Issa", "Moussa", "Ibrahim"], 
        answer: "Issa", 
        source: "Coran 19:29-30",
        explanation: "Le prophète Issa (Jésus) a parlé dans son berceau pour défendre sa mère Maryam (Marie) des accusations portées contre elle."
      }
    ],
    "Tajweed": [
      { 
        question: "Quel est le nom de la règle qui allonge la prononciation d'une lettre ?", 
        options: ["Idgham", "Madd", "Qalqala"], 
        answer: "Madd", 
        source: "Règles du Tajweed",
        explanation: "Le Madd est la règle de tajweed qui consiste à allonger la prononciation d'une lettre, généralement les lettres de prolongation (alif, waw, ya)."
      },
      { 
        question: "Quelle lettre n'est jamais prononcée dans la basmala ?", 
        options: ["Alif", "Lam", "Nun"], 
        answer: "Alif", 
        source: "Règles du Tajweed",
        explanation: "Dans la Basmala (Bismillah), l'alif après le lam de 'Allah' n'est pas prononcé, c'est ce qu'on appelle 'alif wasla'."
      },
      { 
        question: "Combien de types de Qalqala existe-t-il ?", 
        options: ["2", "3", "5"], 
        answer: "2", 
        source: "Règles du Tajweed",
        explanation: "Il existe 2 types de Qalqala : la Qalqala Sughra (mineure) et la Qalqala Kubra (majeure), selon la position des lettres de Qalqala."
      }
    ],
    "Aqida": [
      { 
        question: "Combien de noms d'Allah sont mentionnés comme Asma'ul Husna ?", 
        options: ["99", "100", "50"], 
        answer: "99", 
        source: "Sahih Bukhari 2736",
        explanation: "Selon la tradition, Allah a 99 noms (Asma'ul Husna) qui décrivent Ses attributs, bien qu'Il possède d'autres noms connus uniquement de Lui."
      },
      { 
        question: "Quel est le premier devoir de chaque musulman ?", 
        options: ["Apprendre le Coran", "Comprendre le Tawhid", "Prier 5 fois par jour"], 
        answer: "Comprendre le Tawhid", 
        source: "Coran 47:19",
        explanation: "Le Tawhid (l'unicité d'Allah) est le concept fondamental de l'Islam et comprendre cette unicité est considéré comme le premier devoir du musulman."
      }
    ],
    "Coran": [
      { 
        question: "Combien y a-t-il de sourates dans le Coran ?", 
        options: ["100", "114", "120"], 
        answer: "114", 
        source: "Coran",
        explanation: "Le Saint Coran contient 114 sourates (chapitres) de longueurs différentes, allant de la plus courte (Al-Kawthar) à la plus longue (Al-Baqara)."
      },
      { 
        question: "Quelle est la plus longue sourate du Coran ?", 
        options: ["Al-Fatiha", "Al-Baqara", "Al-Ikhlas"], 
        answer: "Al-Baqara", 
        source: "Coran 2:1",
        explanation: "Al-Baqara (La Vache) est la plus longue sourate du Coran avec 286 versets. Elle est également la première sourate révélée à Médine."
      },
      { 
        question: "Quelle sourate est appelée 'Le cœur du Coran' ?", 
        options: ["Al-Baqara", "Ya-Sin", "Al-Kahf"], 
        answer: "Ya-Sin", 
        source: "Sahih Tirmidhi 2887",
        explanation: "Ya-Sin est souvent appelée 'le cœur du Coran' en raison de son importance et des bénédictions associées à sa récitation."
      }
    ],
    "Histoire de l'Islam": [
      { 
        question: "Dans quelle ville est né le Prophète Muhammad ?", 
        options: ["Médine", "La Mecque", "Damas"], 
        answer: "La Mecque", 
        source: "Biographie du Prophète",
        explanation: "Le Prophète Muhammad (que la paix soit sur lui) est né à La Mecque, en Arabie, vers l'an 570 de l'ère chrétienne."
      },
      { 
        question: "Quelle année marque le début du calendrier islamique ?", 
        options: ["570", "622", "632"], 
        answer: "622", 
        source: "Hégire",
        explanation: "L'année 622 marque l'Hégire, la migration du Prophète Muhammad de La Mecque à Médine, qui est devenue le point de départ du calendrier islamique."
      }
    ]
  };

  // États
  const [selectedTheme, setSelectedTheme] = useState(Object.keys(quizzes)[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [highScores, setHighScores] = useState({});
  const [userName, setUserName] = useState("");
  const [difficulty, setDifficulty] = useState("normal");
  const [animations, setAnimations] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  // Effets
  useEffect(() => {
    // Charger les scores précédents du localStorage
    const savedScores = localStorage.getItem('quizHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Définir le temps en fonction de la difficulté
  useEffect(() => {
    if (difficulty === "easy") setTimeLeft(45);
    else if (difficulty === "normal") setTimeLeft(30);
    else if (difficulty === "hard") setTimeLeft(15);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (!quizStarted || showExplanation || showResults) return;
    
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    
    if (timeLeft === 0) {
      handleAnswer(null);
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, showExplanation, showResults]);
  // Passer à la question suivante après l'explication
  useEffect(() => {
    if (showExplanation) {
      const timer = setTimeout(async () => {
        setShowExplanation(false);
        setShowCorrectAnswer(false);
        
        if (currentQuestionIndex < quizzes[selectedTheme].length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTimeLeft(difficulty === "easy" ? 45 : difficulty === "normal" ? 30 : 15);
          setUsedHint(false);
        } else {
          setShowResults(true);
          // Sauvegarder le résultat si l'utilisateur est connecté
          if (user) {
            await saveQuizResult({
              score,
              category: selectedTheme,
              difficulty,
              correctAnswers: totalCorrectAnswers,
              totalQuestions: quizzes[selectedTheme].length
            });
          }
          // Sauvegarder le score si c'est un record
          if (score > (highScores[selectedTheme] || 0)) {
            const newHighScores = {...highScores, [selectedTheme]: score};
            setHighScores(newHighScores);
            localStorage.setItem('quizHighScores', JSON.stringify(newHighScores));
            launchConfetti();
          }
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showExplanation, currentQuestionIndex, selectedTheme, difficulty, score, highScores, user, saveQuizResult, totalCorrectAnswers]);

  // Fonctions
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setShowResults(false);
    setTimeLeft(difficulty === "easy" ? 45 : difficulty === "normal" ? 30 : 15);
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    const currentQuestion = quizzes[selectedTheme][currentQuestionIndex];
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    setShowCorrectAnswer(true);
      if (correct) {
      // Calculer les points en fonction du temps restant et de la difficulté
      const timeBonus = Math.floor(timeLeft / 3);
      const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "normal" ? 1.5 : 2;
      const hintPenalty = usedHint ? 0.5 : 1;
      const pointsEarned = Math.ceil((10 + timeBonus) * difficultyMultiplier * hintPenalty);
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setTotalCorrectAnswers(prev => prev + 1);
      
      // Animation pour points
      setAnimations(prev => [...prev, {
        id: Date.now(),
        text: `+${pointsEarned}`,
        type: 'points'
      }]);
      
      if ((streak + 1) % 3 === 0) {
        setAnimations(prev => [...prev, {
          id: Date.now() + 1,
          text: `Série de ${streak + 1}! 🔥`,
          type: 'streak'
        }]);
      }
    } else {
      setStreak(0);
    }
    
    setShowExplanation(true);
  };

  const useHint = () => {
    if (usedHint) return;
    
    const currentQuestion = quizzes[selectedTheme][currentQuestionIndex];
    const wrongOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
    const randomWrongOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    
    setAnimations(prev => [...prev, {
      id: Date.now(),
      text: `Indice: Ce n'est pas "${randomWrongOption}"`,
      type: 'hint'
    }]);
    
    setUsedHint(true);
  };

  const launchConfetti = () => {
    try {
      // Dynamically import confetti only when needed
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });
    } catch (error) {
      console.error("Confetti error:", error);
    }
  };
  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResults(false);
    setShowExplanation(false);
    setStreak(0);
    setUsedHint(false);
    setShowCorrectAnswer(false);
    setTotalCorrectAnswers(0);
  };

  const getScoreMessage = () => {
    const totalQuestions = quizzes[selectedTheme].length;
    const percentage = (score / (totalQuestions * 20)) * 100;
    
    if (percentage >= 90) return "Extraordinaire ! Vous êtes un véritable savant !";
    if (percentage >= 80) return "Excellent travail ! Votre connaissance est impressionnante !";
    if (percentage >= 70) return "Très bien ! Vous avez une bonne maîtrise du sujet !";
    if (percentage >= 60) return "Bien ! Continuez à apprendre et à vous améliorer !";
    if (percentage >= 50) return "Pas mal ! Vous êtes sur la bonne voie !";
    return "Continuez à étudier, vous vous améliorerez !";
  };  // Rendu UI
  return (
    <div className='page-container navbar-safe px-6 flex flex-col items-center relative overflow-hidden'>
      {/* Header avec authentification */}
      <div className="absolute top-4 right-4 z-20">
        {user ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-green-600 text-white text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-300">Bienvenue, {user.name}</span>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAuthModal(true)}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        )}
      </div>

      {/* Animations flottantes */}
      <AnimatePresence>
        {animations.map(animation => (
          <motion.div
            key={animation.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1.5 }}
            onAnimationComplete={() => setAnimations(prev => prev.filter(a => a.id !== animation.id))}
            className={`absolute z-10 text-xl font-bold ${
              animation.type === 'points' ? 'text-yellow-400' : 
              animation.type === 'streak' ? 'text-orange-500' : 'text-blue-400'
            }`}
          >
            {animation.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='text-4xl font-extrabold text-green-500 text-center mb-4'
      >
        🎯 Quiz Islamique Interactif
      </motion.h1>

      {/* Page d'accueil du quiz */}
      {!quizStarted && !showResults && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-2xl'
        >
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400">Choisissez votre thème</CardTitle>
              <CardDescription className="text-gray-400">
                Testez vos connaissances islamiques dans différents domaines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className='grid grid-cols-2 gap-4'>
                {Object.keys(quizzes).map((theme) => (
                  <motion.div key={theme} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setSelectedTheme(theme)}
                      variant={selectedTheme === theme ? "default" : "outline"}
                      className={`w-full h-auto p-4 text-left ${
                        selectedTheme === theme 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{theme}</span>
                        {highScores[theme] && (
                          <div className='flex items-center mt-2 text-yellow-300'>
                            <Trophy className='h-4 w-4 mr-1' /> {highScores[theme]}
                          </div>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div>
                <Label className="text-green-400 mb-2 block">Niveau de difficulté</Label>
                <div className='flex space-x-4'>
                  {['easy', 'normal', 'hard'].map((level) => (
                    <Button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      variant={difficulty === level ? "default" : "outline"}
                      className={`flex-1 ${
                        difficulty === level 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {level === 'easy' ? 'Facile' : level === 'normal' ? 'Normal' : 'Difficile'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="userName" className="text-green-400 mb-2 block">
                  Votre nom (pour le tableau des scores)
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder='Entrez votre nom'
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button
                onClick={startQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-bold"
              >
                Commencer le Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}      {/* Quiz en cours */}
      {quizStarted && !showResults && (
        <motion.div 
          key={`question-${currentQuestionIndex}`}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-2xl'
        >
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              {/* Barre de progression */}
              <div className='mb-4'>
                <div className='flex justify-between mb-2'>
                  <span className="text-sm text-gray-400">Progression</span>
                  <span className="text-sm text-gray-400">{currentQuestionIndex + 1}/{quizzes[selectedTheme].length}</span>
                </div>
                <Progress 
                  value={((currentQuestionIndex + 1) / quizzes[selectedTheme].length) * 100} 
                  className="h-2 bg-gray-700"
                />
              </div>

              {/* Timer et score */}
              <div className='flex justify-between items-center mb-4'>
                <div className='flex items-center space-x-2'>
                  <Clock className='h-5 w-5 text-yellow-400' />
                  <span className={`font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
                
                <div className='flex items-center space-x-2'>
                  <span className='font-bold text-green-400'>{score} pts</span>
                </div>
                
                <div className='flex items-center space-x-2'>
                  <Flame className='h-5 w-5 text-orange-500' />
                  <span className='font-bold text-orange-500'>{streak}</span>
                </div>
              </div>

              <CardTitle className='text-xl font-bold text-center'>
                {quizzes[selectedTheme][currentQuestionIndex].question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Options */}
              <div className='space-y-3'>
                {quizzes[selectedTheme][currentQuestionIndex].options.map((option, idx) => (
                  <motion.div key={idx} whileHover={{ scale: showExplanation ? 1 : 1.02 }} whileTap={{ scale: showExplanation ? 1 : 0.98 }}>
                    <Button
                      disabled={showExplanation}
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className={`w-full text-left p-4 h-auto border-2 transition-all ${
                        showCorrectAnswer
                          ? option === quizzes[selectedTheme][currentQuestionIndex].answer
                            ? 'bg-green-600 border-green-500 text-white hover:bg-green-600'
                            : selectedAnswer === option
                            ? 'bg-red-600 border-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-700 border-gray-600 text-gray-300'
                          : selectedAnswer === option
                          ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{option}</span>
                        {showCorrectAnswer && (
                          option === quizzes[selectedTheme][currentQuestionIndex].answer ? 
                            <Check className="h-5 w-5 text-white" /> : 
                            (selectedAnswer === option ? <X className="h-5 w-5 text-white" /> : null)
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Bouton pour l'indice */}
              {!showExplanation && (
                <Button
                  onClick={useHint}
                  disabled={usedHint}
                  variant="outline"
                  className={`w-full border-2 ${
                    usedHint 
                      ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-600 border-yellow-500 text-white hover:bg-yellow-700'
                  }`}
                >
                  <Lightbulb className="h-4 w-4 mr-2" /> 
                  {usedHint ? "Indice déjà utilisé" : "Utiliser un indice (-50% points)"}
                </Button>
              )}

              {/* Explication */}
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-4'
                >
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? '✅ Correct !' : '❌ Incorrect !'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='text-white mb-2'>{quizzes[selectedTheme][currentQuestionIndex].explanation}</p>
                      <p className='text-sm text-gray-400 mb-4'>Source: {quizzes[selectedTheme][currentQuestionIndex].source}</p>
                      
                      <div className='flex justify-between items-center'>
                        <span className="text-sm">
                          {isCorrect ? (
                            <span className='text-green-400'>
                              {usedHint ? '+Points (réduits: indice utilisé)' : '+Points pour réponse correcte'}
                            </span>
                          ) : (
                            <span className='text-red-400'>Aucun point</span>
                          )}
                        </span>
                        
                        <div className='flex items-center space-x-2'>
                          <span className="text-sm text-gray-400">Question suivante</span>
                          <ArrowRight className='h-4 w-4 animate-pulse' />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}      {/* Résultats du quiz */}
      {showResults && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className='w-full max-w-2xl'
        >
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-400">
                Quiz Terminé!
              </CardTitle>
              <CardDescription className="text-gray-400">
                {getScoreMessage()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className='flex justify-center items-center space-x-6'>
                <div className='text-center'>
                  <div className='text-5xl font-bold text-yellow-400'>{score}</div>
                  <div className='text-sm text-gray-300'>points</div>
                </div>
                
                {score > (highScores[selectedTheme] || 0) && (
                  <div className='flex flex-col items-center'>
                    <Trophy className='h-12 w-12 text-yellow-300 mb-1' />
                    <span className='text-green-400 text-sm'>Nouveau Record!</span>
                  </div>
                )}
              </div>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg text-green-400">Votre performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className='flex justify-between'>
                      <span>Thème:</span>
                      <span className='font-semibold'>{selectedTheme}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Difficulté:</span>
                      <span className='font-semibold capitalize'>{difficulty}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Bonnes réponses:</span>
                      <span className='font-semibold'>{totalCorrectAnswers}/{quizzes[selectedTheme].length}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Meilleure série:</span>
                      <span className='font-semibold'>{streak} <Flame className='inline h-4 w-4 text-orange-500' /></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className='flex space-x-4'>
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Retour au menu
                </Button>
                
                <Button
                  onClick={() => {
                    setShowResults(false);
                    startQuiz();
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Rejouer
                </Button>
              </div>

              {!user && (
                <Card className="bg-blue-900 border-blue-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 font-medium">Sauvegardez vos progrès !</p>
                        <p className="text-blue-200 text-sm">Créez un compte pour suivre vos statistiques</p>
                      </div>
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        S'inscrire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />    </div>
  );
}

export default function QuizPage() {
  return (
    <AuthProvider>
      <QuizPageContent />
    </AuthProvider>
  );
}