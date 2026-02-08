"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateRomanticContent } from "./actions";

const MEMORIES = [
  { date: "The First Meet", text: "When I first saw you, I knew you were special. ✨" },
  { date: "First Date", text: "The way you laughed made my whole day. ❤️" },
  { date: "Today", text: "I'm still as crazy about you as day one. 💖" },
];

const REASONS = [
  "Your smile lights up my entire world. 🌟",
  "You're the kindest soul I've ever met. ✨",
  "The way you care for everyone around you. 💓",
  "Your laugh is my favorite song. 🎵",
  "You make even the simplest moments feel magical. ✨",
];

const Starfield = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
            "--duration": `${star.duration}s`,
          } as any}
        />
      ))}
    </div>
  );
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          className="heart"
          initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
          animate={{ 
            y: "-20vh", 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8],
            x: [0, (Math.random() - 0.5) * 100, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          style={{ left: `${Math.random() * 100}%` }}
        >
          {["💖", "💗", "💓", "💝", "❤️"][Math.floor(Math.random() * 5)]}
        </motion.span>
      ))}
    </div>
  );
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: "-10%", 
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0 
          }}
          animate={{ 
            top: "110%",
            left: `${(Math.random() * 100)}%`,
            rotate: 360 * 2
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear"
          }}
          className="absolute w-3 h-3"
          style={{ 
            backgroundColor: ["#ff2d55", "#ff8fab", "#ffb3c6", "#ffffff", "#ff0000"][Math.floor(Math.random() * 5)],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px"
          }}
        />
      ))}
    </div>
  );
};

const BloomingRose = () => {
  return (
    <motion.div 
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 12, stiffness: 100 }}
      className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-8"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d="M50 95 Q50 70 50 50"
          stroke="#2d5a27"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M50 70 Q30 65 20 75"
          stroke="#2d5a27"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.circle
          cx="50" cy="40" r="20"
          fill="#ff2d55"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.path
          d="M50 40 Q70 20 50 10 Q30 20 50 40"
          fill="#ff4d6d"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />
      </svg>
    </motion.div>
  );
};

export default function ValentinePage() {
  const [mounted, setMounted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [currentReason, setCurrentReason] = useState(0);
  const [aiPoem, setAiPoem] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const noPosition = useMemo(() => ({
    x: noCount === 0 ? 0 : (Math.random() - 0.5) * (mounted && typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 400),
    y: noCount === 0 ? 0 : (Math.random() - 0.5) * (mounted && typeof window !== 'undefined' && window.innerWidth < 768 ? 150 : 300),
  }), [noCount, mounted]);

  if (!mounted) return null;

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const startMusic = () => {
    if (!musicStarted && audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
        setMusicStarted(true);
      }).catch(e => console.log("Audio play failed", e));
    }
  };

  const handleAiPoem = async () => {
    setLoadingAi(true);
    const poem = await generateRomanticContent("Write a very short, beautiful 4-line romantic poem for Bhoomi on Valentine's Day.");
    setAiPoem(poem);
    setLoadingAi(false);
  };

  const yesScale = Math.min(1 + noCount * 0.4, 8);

  const noTexts = [
    "No 😶",
    "Are you sure? 😳",
    "Think again 🥺",
    "That hurts 💔",
    "Last chance 😭",
    "You're breaking my heart 🥀",
    "Bhoomi please... 🧸",
    "I'll be very sad 😿",
  ];

  const handleYes = () => {
    startMusic();
    setAccepted(true);
  };

  const handleNo = () => {
    startMusic();
    setNoCount((c) => c + 1);
  };

  return (
    <div className="screen">
      <Starfield />
      <audio ref={audioRef} loop src="/love.mp3" />
      <FloatingHearts />

      {/* Music Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
      >
        {isMusicPlaying ? "🎵" : "🔇"}
      </motion.button>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center z-10"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3N2Z3N2Z3N2Z3N2Z3N2Z3N2Z3N2Z3N2Z3N2Z3N2Z3JpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/cLS1cfxvGOPVpf9g3y/giphy.gif" 
                alt="Cute Cat"
                className="w-48 h-48 mb-8"
              />
            </motion.div>

            <motion.h1
              className="text-center font-serif"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Bhoomi,
              <br />
              <span className="text-pink-400">will you be my Valentine?</span> 💘
            </motion.h1>

            <div className="button-area mt-8">
              <motion.button
                layout
                className="yes"
                style={{ scale: yesScale }}
                animate={{ 
                  boxShadow: [
                    "0 10px 40px rgba(255, 45, 85, 0.4)",
                    "0 10px 70px rgba(255, 45, 85, 0.7)",
                    "0 10px 40px rgba(255, 45, 85, 0.4)"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: yesScale + 0.1 }}
                whileTap={{ scale: yesScale - 0.1 }}
                onClick={handleYes}
              >
                Yes 💖
              </motion.button>

              <motion.button
                layout
                className="no"
                onClick={handleNo}
                animate={noPosition}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {noTexts[Math.min(noCount, noTexts.length - 1)]}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            className="final flex flex-col items-center z-10 w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Confetti />
            <BloomingRose />
            
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-center"
            >
              <h1>💖 My World is Yours 💖</h1>
              <p className="text-pink-200 text-xl italic">
                Bhoomi, you've made me the happiest person alive.
              </p>
            </motion.div>

            <div className="mt-16 w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-3 gap-6 px-4">
              {/* Timeline Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card"
              >
                <h2 className="text-2xl font-bold mb-6 text-pink-300">Our Story ✨</h2>
                <div className="timeline">
                  {MEMORIES.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                      className="timeline-item"
                    >
                      <h3 className="font-bold text-lg text-pink-200">{m.date}</h3>
                      <p className="text-pink-100/80 text-sm">{m.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Reasons Why Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card flex flex-col items-center justify-center min-h-[250px]"
              >
                <h2 className="text-2xl font-bold mb-6 text-pink-300">Why I Love You ❤️</h2>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReason}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="text-center text-lg text-pink-100 italic px-4"
                  >
                    "{REASONS[currentReason]}"
                  </motion.div>
                </AnimatePresence>
                <button 
                  onClick={() => setCurrentReason((prev) => (prev + 1) % REASONS.length)}
                  className="mt-6 text-pink-400 hover:text-pink-300 underline underline-offset-4 text-sm"
                >
                  Next Reason ✨
                </button>
              </motion.div>

              {/* AI Romantic Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card flex flex-col items-center justify-between min-h-[250px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">🤖</div>
                <h2 className="text-2xl font-bold mb-4 text-pink-300">AI Love Poem 🪄</h2>
                
                <div className="flex-1 flex items-center justify-center italic text-pink-100 text-center px-2">
                  {loadingAi ? (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Writing something special for you...
                    </motion.div>
                  ) : (
                    aiPoem || "Click the button to generate a unique poem for Bhoomi"
                  )}
                </div>

                <button
                  onClick={handleAiPoem}
                  disabled={loadingAi}
                  className="mt-6 bg-pink-500/20 hover:bg-pink-500/40 px-6 py-2 rounded-full border border-pink-500/50 transition-all text-sm disabled:opacity-50"
                >
                  {aiPoem ? "Write Another ✨" : "Generate Poem ✨"}
                </button>
              </motion.div>
            </div>

            <div className="mt-12 flex flex-col items-center w-full max-w-2xl">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => setShowLetter(!showLetter)}
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full border border-white/20 transition-all mb-8 shadow-lg backdrop-blur-md"
              >
                {showLetter ? "Close Letter 💌" : "Read My Letter 💌"}
              </motion.button>

              <AnimatePresence>
                {showLetter && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="glass-card italic text-lg leading-relaxed text-pink-100 w-full relative"
                  >
                    <div className="absolute top-4 right-6 text-4xl opacity-20 rotate-12">❤️</div>
                    "To my dearest Bhoomi,<br/><br/>
                    Every moment with you feels like a dream I never want to wake up from. 
                    You're the most beautiful person I know, inside and out. 
                    Your presence is a gift, and your love is my greatest treasure.<br/><br/>
                    Thank you for being you and for making my life so much brighter than I ever thought possible. 
                    I promise to cherish you, support you, and love you more with each passing day.<br/><br/>
                    Forever yours,<br/>
                    ❤️"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
