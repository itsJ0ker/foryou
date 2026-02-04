"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ValentinePage() {
  const [mounted, setMounted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const yesScale = Math.min(1 + noCount * 0.35, 6);

  const noTexts = [
    "No 😶",
    "Are you sure? 😳",
    "Think again 🥺",
    "That hurts 💔",
    "Last chance 😭",
  ];

  const startMusic = () => {
    if (!musicStarted && audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play();
      setMusicStarted(true);
    }
  };

  const handleYes = () => {
    startMusic();
    setAccepted(true);
  };

  const handleNo = () => {
    startMusic();
    setNoCount((c) => c + 1);
  };

  // ❌ No button ALWAYS far from Yes
  const noPosition = {
    x: noCount % 2 === 0 ? -170 : 170,
    y: -100 + (noCount % 4) * 70,
  };

  return (
    <div className="screen">
      {/* 🎵 Background Music */}
      <audio ref={audioRef} loop src="/love.mp3" />

      {/* 💓 Floating Hearts */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="heart"
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: 1 }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{ left: `${Math.random() * 100}%` }}
        >
          💖
        </motion.span>
      ))}

      {!accepted ? (
        <>
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Bhoomi,
            <br />
            will you be my Valentine? 💘
          </motion.h1>

          <div className="button-area">
            <motion.button
              className="yes"
              style={{ scale: yesScale }}
              whileHover={{ scale: yesScale + 0.15 }}
              onClick={handleYes}
            >
              Yes 💖
            </motion.button>

            <motion.button
              className="no"
              onClick={handleNo}
              animate={noPosition}
              transition={{ type: "spring", stiffness: 220 }}
            >
              {noTexts[Math.min(noCount, noTexts.length - 1)]}
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          className="final"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1>💖 She Said YES 💖</h1>
          <p>
            Bhoomi, my heart is officially yours.
            <br />
            Happy Valentine’s Day 🥰
          </p>
        </motion.div>
      )}
    </div>
  );
}
