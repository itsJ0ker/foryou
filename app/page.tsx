"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateRomanticContent } from "./actions";

const PHOTOS = [
  { url: "https://i.ibb.co/4gV06x5Z/PHOTO1.webp", caption: "Forever Together", memory: "The moment I knew you were special" },
  { url: "https://i.ibb.co/k2FFFdNm/PHOTO2.webp", caption: "My Everything", memory: "Your smile makes my world brighter" },
  { url: "https://i.ibb.co/1tYfKBQT/PHOTO3.webp", caption: "Pure Love", memory: "Every second with you is precious" },
  { url: "https://i.ibb.co/Q3zG37QD/PHOTO4.webp", caption: "Always & Forever", memory: "You're my best decision" },
  { url: "https://i.ibb.co/0jqjQctS/photo5.webp", caption: "My Heart", memory: "You complete me" },
  { url: "https://i.ibb.co/3YBXK0b8/photo6.webp", caption: "Our World", memory: "Together is my favorite place" },
];

const LOVE_QUESTIONS = [
  { question: "What's my favorite thing about you?", answer: "Everything! But especially your smile 😊" },
  { question: "When did I know you were special?", answer: "The first time we talked, I just knew ✨" },
  { question: "What do I love most?", answer: "How you make me feel like I'm home 🏡" },
  { question: "My wish for us?", answer: "To create a lifetime of beautiful memories together 💕" },
];

const HEART_EMOJIS = ["💖", "💝", "💗", "💓", "❤️", "💕"];

const LOVE_WORDS = [
  { scrambled: "VEOL", answer: "LOVE" },
  { scrambled: "TEHAR", answer: "HEART" },
  { scrambled: "SIKS", answer: "KISS" },
  { scrambled: "GUHH", answer: "HUGH" },
];

export default function ValentinePage() {
  const [stage, setStage] = useState(0); // 0: penguin, 1: heart fill, 2: memory game, 3: word puzzle, 4: catch hearts, 5: quiz, 6: photos, 7: final
  const [noCount, setNoCount] = useState(0);
  const [penguinArm, setPenguinArm] = useState<"left" | "right" | "center">("center");
  const [heartFill, setHeartFill] = useState(0);
  
  // Memory Game
  const [memoryCards, setMemoryCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  
  // Word Puzzle
  const [currentWord, setCurrentWord] = useState(0);
  const [wordInput, setWordInput] = useState("");
  const [wordScore, setWordScore] = useState(0);
  
  // Catch Hearts Game
  const [fallingHearts, setFallingHearts] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([]);
  const [caughtHearts, setCaughtHearts] = useState(0);
  const [gameTime, setGameTime] = useState(15);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revealedPhotos, setRevealedPhotos] = useState<number[]>([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const yesScale = Math.min(1 + noCount * 0.4, 6);

  const noTexts = [
    "No 😶",
    "Are you sure? 🥺",
    "Really? 💔",
    "Please? 🥹",
    "Bhoomi... 💕",
    "One more chance? 🙏",
  ];

  // Initialize Memory Game
  useEffect(() => {
    if (stage === 2 && memoryCards.length === 0) {
      const emojis = [...HEART_EMOJIS, ...HEART_EMOJIS];
      const shuffled = emojis.sort(() => Math.random() - 0.5);
      setMemoryCards(shuffled);
    }
  }, [stage, memoryCards.length]);

  // Heart Fill Animation
  useEffect(() => {
    if (stage === 1 && heartFill < 100) {
      const timer = setTimeout(() => {
        setHeartFill(prev => Math.min(prev + 1, 100));
      }, 50);
      return () => clearTimeout(timer);
    } else if (stage === 1 && heartFill === 100) {
      setTimeout(() => setStage(2), 1000);
    }
  }, [stage, heartFill]);

  // Catch Hearts Game Timer
  useEffect(() => {
    if (stage === 4 && gameTime > 0) {
      const timer = setTimeout(() => setGameTime(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 4 && gameTime === 0) {
      setTimeout(() => setStage(5), 2000);
    }
  }, [stage, gameTime]);

  // Spawn Falling Hearts
  useEffect(() => {
    if (stage === 4 && gameTime > 0) {
      const interval = setInterval(() => {
        const newHeart = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: -10,
          emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
        };
        setFallingHearts(prev => [...prev, newHeart]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [stage, gameTime]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  const handleYes = () => {
    setStage(1);
    if (audioRef.current && !musicPlaying) {
      audioRef.current.volume = 0.15;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
      setMusicPlaying(true);
    }
  };

  const handleNo = () => {
    setNoCount(c => c + 1);
  };

  // Memory Game Logic
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    setMemoryMoves(prev => prev + 1);
    
    if (newFlipped.length === 2) {
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === memoryCards.length) {
          setTimeout(() => setStage(3), 1000);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // Word Puzzle Logic
  const handleWordSubmit = () => {
    if (wordInput.toUpperCase() === LOVE_WORDS[currentWord].answer) {
      setWordScore(prev => prev + 1);
      setWordInput("");
      
      if (currentWord < LOVE_WORDS.length - 1) {
        setCurrentWord(prev => prev + 1);
      } else {
        setTimeout(() => setStage(4), 1000);
      }
    }
  };

  // Catch Hearts Logic
  const catchHeart = (id: number) => {
    setCaughtHearts(prev => prev + 1);
    setFallingHearts(prev => prev.filter(h => h.id !== id));
  };

  const handleQuizAnswer = () => {
    if (currentQuestion < LOVE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStage(6);
    }
  };

  const revealPhoto = (index: number) => {
    if (!revealedPhotos.includes(index)) {
      setRevealedPhotos(prev => [...prev, index]);
      if (revealedPhotos.length + 1 === PHOTOS.length) {
        setTimeout(() => setStage(7), 1000);
      }
    }
  };

  const generateMessage = async () => {
    setLoadingAi(true);
    const message = await generateRomanticContent(
      "Write a short, sweet, and deeply romantic message from Harsh to Bhoomi. 2-3 sentences max. Make it genuine and touching."
    );
    setAiMessage(message);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950 text-white relative overflow-hidden">
      <audio ref={audioRef} loop src="/love.mp3" />
      
      {/* Animated Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Hearts */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-4xl opacity-20"
            initial={{ y: "100vh", x: `${(i * 5) % 100}vw` }}
            animate={{ y: "-10vh" }}
            transition={{
              duration: 15 + (i % 5),
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear"
            }}
          >
            ❤️
          </motion.div>
        ))}
        
        {/* Sparkles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-2xl"
            initial={{ 
              opacity: 0,
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.div>
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Music Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-2xl hover:bg-white/20 transition-all shadow-lg border border-white/20"
      >
        {musicPlaying ? "🎵" : "🔇"}
      </motion.button>

      <AnimatePresence mode="wait">
        {/* STAGE 0: PENGUIN PROPOSAL */}
        {stage === 0 && (
          <motion.div
            key="penguin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <svg width="220" height="280" viewBox="0 0 220 280" className="drop-shadow-2xl">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Body */}
                <ellipse cx="110" cy="160" rx="70" ry="90" fill="#2C3E50" />
                <ellipse cx="110" cy="160" rx="50" ry="70" fill="white" />
                
                {/* Head */}
                <circle cx="110" cy="80" r="50" fill="#2C3E50" />
                
                {/* Eyes */}
                <motion.g
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <circle cx="92" cy="75" r="10" fill="white" />
                  <circle cx="128" cy="75" r="10" fill="white" />
                  <circle cx="94" cy="75" r="6" fill="black" />
                  <circle cx="130" cy="75" r="6" fill="black" />
                </motion.g>
                
                {/* Beak */}
                <path d="M 110 85 L 120 95 L 100 95 Z" fill="#FF6B6B" />
                
                {/* Blush */}
                <circle cx="70" cy="85" r="10" fill="#FF6B6B" opacity="0.4" />
                <circle cx="150" cy="85" r="10" fill="#FF6B6B" opacity="0.4" />
                
                {/* Left Arm */}
                <motion.ellipse
                  cx="50"
                  cy="150"
                  rx="18"
                  ry="45"
                  fill="#2C3E50"
                  animate={{
                    rotate: penguinArm === "left" ? -35 : 0,
                    x: penguinArm === "left" ? -8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformOrigin: "50px 130px" }}
                />
                
                {/* Right Arm */}
                <motion.ellipse
                  cx="170"
                  cy="150"
                  rx="18"
                  ry="45"
                  fill="#2C3E50"
                  animate={{
                    rotate: penguinArm === "right" ? 35 : 0,
                    x: penguinArm === "right" ? 8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformOrigin: "170px 130px" }}
                />
                
                {/* Feet */}
                <ellipse cx="90" cy="250" rx="22" ry="14" fill="#FF6B6B" />
                <ellipse cx="130" cy="250" rx="22" ry="14" fill="#FF6B6B" />
                
                {/* Floating Heart */}
                <motion.text
                  x="110"
                  y="35"
                  fontSize="35"
                  textAnchor="middle"
                  filter="url(#glow)"
                  animate={{
                    y: [35, 25, 35],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💖
                </motion.text>
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-center mb-3 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 bg-clip-text text-transparent leading-tight"
            >
              Bhoomi, Will You Be<br/>My Valentine? 💝
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-pink-200 mb-10 text-center max-w-md"
            >
              The penguin is nervously waiting for your answer! 🐧
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              <motion.button
                onMouseEnter={() => setPenguinArm("left")}
                onMouseLeave={() => setPenguinArm("center")}
                onClick={handleYes}
                style={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.08 }}
                whileTap={{ scale: yesScale * 0.95 }}
                className="relative px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full text-2xl font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Yes! 💚
                </span>
              </motion.button>

              <motion.button
                onMouseEnter={() => setPenguinArm("right")}
                onMouseLeave={() => setPenguinArm("center")}
                onClick={handleNo}
                animate={{
                  scale: Math.max(1 - noCount * 0.15, 0.3),
                  opacity: Math.max(1 - noCount * 0.1, 0.4),
                }}
                whileHover={{ scale: Math.max(1 - noCount * 0.15, 0.3) * 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full text-lg font-bold shadow-xl transition-all"
              >
                {noTexts[Math.min(noCount, noTexts.length - 1)]}
              </motion.button>
            </div>

            {noCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-pink-300 text-center text-lg"
              >
                {noCount === 1 && "The penguin looks confused... 🤔"}
                {noCount === 2 && "The penguin is getting worried... 😟"}
                {noCount === 3 && "The penguin's heart is breaking... 💔"}
                {noCount >= 4 && "The penguin is crying now... 😭"}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* STAGE 1: HEART FILLING WITH LOVE */}
        {stage === 1 && (
          <motion.div
            key="heart"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent"
            >
              Filling My Heart With Love For You... 💕
            </motion.h2>

            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Heart SVG */}
              <svg width="300" height="300" viewBox="0 0 100 100" className="absolute">
                <defs>
                  <clipPath id="heartClip">
                    <path d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z" />
                  </clipPath>
                  <linearGradient id="bloodGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#F87171" />
                  </linearGradient>
                </defs>
                
                {/* Heart Outline */}
                <path
                  d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
                  fill="none"
                  stroke="#FFF"
                  strokeWidth="2"
                  opacity="0.3"
                />
                
                {/* Filling Blood */}
                <motion.rect
                  x="0"
                  y={100 - heartFill}
                  width="100"
                  height={heartFill}
                  fill="url(#bloodGradient)"
                  clipPath="url(#heartClip)"
                  initial={{ y: 100 }}
                  animate={{ y: 100 - heartFill }}
                />
                
                {/* Heart Outline (on top) */}
                <path
                  d="M50,90 C50,90 10,60 10,40 C10,25 20,15 30,15 C40,15 45,20 50,30 C55,20 60,15 70,15 C80,15 90,25 90,40 C90,60 50,90 50,90 Z"
                  fill="none"
                  stroke="#FFF"
                  strokeWidth="2.5"
                />
              </svg>

              {/* Percentage */}
              <motion.div
                className="text-6xl font-bold text-white z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {heartFill}%
              </motion.div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 text-2xl text-pink-200 text-center"
            >
              {heartFill < 30 && "Starting to fall for you... 💕"}
              {heartFill >= 30 && heartFill < 60 && "Falling deeper... 💖"}
              {heartFill >= 60 && heartFill < 90 && "Almost completely in love... 💗"}
              {heartFill >= 90 && "My heart is full of love for you! 💝"}
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 2: MEMORY MATCHING GAME */}
        {stage === 2 && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent"
            >
              Memory Game: Find Matching Hearts! 💕
            </motion.h2>

            <p className="text-pink-200 text-center mb-8 text-lg">
              Match all the heart pairs! Moves: {memoryMoves}
            </p>

            <div className="grid grid-cols-4 gap-4 max-w-2xl w-full">
              {memoryCards.map((emoji, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                  className="aspect-square bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 flex items-center justify-center text-5xl cursor-pointer hover:bg-white/20 transition-all"
                >
                  <AnimatePresence mode="wait">
                    {(flippedCards.includes(index) || matchedCards.includes(index)) ? (
                      <motion.span
                        key="emoji"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 90 }}
                      >
                        {emoji}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="question"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        className="text-pink-300"
                      >
                        ?
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-pink-300"
            >
              {matchedCards.length / 2} / {memoryCards.length / 2} pairs found!
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 3: WORD PUZZLE GAME */}
        {stage === 3 && (
          <motion.div
            key="puzzle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent"
            >
              Love Word Puzzle! 💌
            </motion.h2>

            <p className="text-pink-200 text-center mb-12 text-lg">
              Unscramble the love words! Score: {wordScore}/{LOVE_WORDS.length}
            </p>

            <motion.div
              key={currentWord}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20"
            >
              <div className="text-center mb-8">
                <p className="text-pink-300 text-sm mb-2">Unscramble this:</p>
                <h3 className="text-6xl font-bold text-white tracking-widest mb-8">
                  {LOVE_WORDS[currentWord].scrambled}
                </h3>
              </div>

              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleWordSubmit()}
                placeholder="Type your answer..."
                className="w-full px-6 py-4 bg-white/10 border-2 border-white/30 rounded-full text-white text-center text-2xl uppercase focus:outline-none focus:border-pink-400 transition-all"
                maxLength={LOVE_WORDS[currentWord].answer.length}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWordSubmit}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-xl font-bold"
              >
                Submit Answer ✨
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* STAGE 4: CATCH THE HEARTS GAME */}
        {stage === 4 && (
          <motion.div
            key="catch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 overflow-hidden"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent"
            >
              Catch My Love! 💖
            </motion.h2>

            <div className="flex gap-8 mb-8 text-2xl font-bold">
              <p className="text-pink-300">❤️ Caught: {caughtHearts}</p>
              <p className="text-rose-300">⏱️ Time: {gameTime}s</p>
            </div>

            {/* Falling Hearts */}
            <div className="relative w-full max-w-4xl h-96 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden">
              {fallingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ x: `${heart.x}%`, y: `${heart.y}%` }}
                  animate={{ y: "110%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  onClick={() => catchHeart(heart.id)}
                  className="absolute text-5xl cursor-pointer hover:scale-125 transition-transform"
                  style={{ left: `${heart.x}%` }}
                >
                  {heart.emoji}
                </motion.div>
              ))}

              {gameTime === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-5xl mb-4">🎉</p>
                    <p className="text-3xl font-bold text-white">You caught {caughtHearts} hearts!</p>
                    <p className="text-pink-300 mt-2">Moving to next stage...</p>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-8 text-pink-200 text-center">
              Click the falling hearts to catch them! ✨
            </p>
          </motion.div>
        )}

        {/* STAGE 5: LOVE QUIZ */}
        {stage === 5 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-2xl w-full"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent">
                Let Me Tell You Something... 💭
              </h2>

              <motion.div
                key={currentQuestion}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <span className="text-6xl mb-4 block">❓</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-pink-200 mb-6">
                    {LOVE_QUESTIONS[currentQuestion].question}
                  </h3>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-2xl p-8 mb-8"
                >
                  <p className="text-xl md:text-2xl text-white text-center leading-relaxed">
                    {LOVE_QUESTIONS[currentQuestion].answer}
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuizAnswer}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-xl font-bold shadow-xl hover:shadow-pink-500/50 transition-all"
                >
                  {currentQuestion < LOVE_QUESTIONS.length - 1 ? "Next 💖" : "Show Me More! 💝"}
                </motion.button>

                <div className="flex justify-center gap-2 mt-6">
                  {LOVE_QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentQuestion ? "bg-pink-400 w-8" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* STAGE 6: PHOTO REVEAL GAME */}
        {stage === 6 && (
          <motion.div
            key="photos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-200 to-rose-200 bg-clip-text text-transparent"
            >
              Our Beautiful Memories 📸
            </motion.h2>

            <p className="text-pink-200 text-center mb-12 text-lg">
              Click on the cards to reveal our special moments!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
              {PHOTOS.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative aspect-square cursor-pointer"
                  onClick={() => revealPhoto(i)}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ rotateY: revealedPhotos.includes(i) ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front (Hidden) */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-sm rounded-2xl border-2 border-white/30 flex items-center justify-center"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl mb-2"
                        >
                          ❤️
                        </motion.div>
                        <p className="text-white font-bold">Click Me!</p>
                      </div>
                    </div>

                    {/* Back (Revealed) */}
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-lg">{photo.caption}</p>
                        <p className="text-pink-200 text-sm">{photo.memory}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-pink-300 text-center"
            >
              {revealedPhotos.length} / {PHOTOS.length} memories revealed
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 7: FINAL LOVE MESSAGE */}
        {stage === 7 && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
          >
            {/* Celebration Confetti */}
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  initial={{ y: -50, x: `${(i * 3.33)}%`, rotate: 0 }}
                  animate={{ y: "110vh", rotate: 360 }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    delay: (i % 10) * 0.2,
                    ease: "linear"
                  }}
                >
                  {["🎉", "💖", "✨", "💝", "🌟"][i % 5]}
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-9xl mb-8"
            >
              💝
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 bg-clip-text text-transparent"
            >
              You're My Everything, Bhoomi
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl mb-8"
            >
              <p className="text-xl md:text-2xl text-white leading-relaxed text-center mb-8">
                Thank you for saying yes. Thank you for being you. Thank you for making my world brighter just by existing in it. Every moment with you is a gift, and I promise to cherish every single one.
              </p>

              <div className="text-center">
                <p className="text-3xl font-bold text-pink-300 mb-2">Forever Yours,</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                  Harsh ❤️
                </p>
              </div>
            </motion.div>

            {/* AI Message Generator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl w-full"
            >
              {!aiMessage ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateMessage}
                  disabled={loadingAi}
                  className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                >
                  {loadingAi ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ✨
                      </motion.span>
                      Creating something special...
                    </span>
                  ) : (
                    "One More Special Message 💌"
                  )}
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
                >
                  <p className="text-xl text-white leading-relaxed text-center mb-6">
                    {aiMessage}
                  </p>
                  <button
                    onClick={() => setAiMessage("")}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    Generate Another 💫
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
