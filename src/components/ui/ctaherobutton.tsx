//@ts-nocheck
import { useRef, useState } from "react";

import { motion } from "framer-motion";

const Component = () => {
  return (
    <div>
      <EncryptButton />
    </div>
  );
};

const TARGET_TEXT = "KONTAKT";
const CYCLES_PER_LETTER = 3;
const SHUFFLE_TIME = 30;
const CHARS = "!@#$%^&*():{};|,.<>/?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const EncryptButton = () => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(TARGET_TEXT);
  const [isHovered, setIsHovered] = useState(false);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];
          return randomChar;
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scramble();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopScramble();
  };

  return (
    <div className="relative">
      {/* Glow effect background */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-75"
        animate={{
          background: isHovered
            ? "linear-gradient(45deg, #e879f9, #ec4899, #8b5cf6, #818cf8, #e879f9)"
            : "linear-gradient(45deg, #1e1b4b, #312e81, #4c1d95, #1e1b4b)",
        }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundSize: "300% 300%",
        }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group overflow-hidden rounded-2xl bg-black/80 backdrop-blur-sm border border-purple-500/30 px-8 py-4 shadow-2xl transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? "0 0 60px rgba(236, 72, 153, 0.5), 0 0 100px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(45deg, #e879f9, #ec4899, #8b5cf6, #818cf8, #06b6d4)",
            backgroundSize: "300% 300%",
            padding: "2px",
          }}
          animate={{
            backgroundPosition: isHovered ? "0% 0%" : "100% 100%",
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-full h-full bg-black/90 rounded-2xl" />
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          {/* Lock icon with animation */}
          <motion.div
            animate={{
              rotateY: isHovered ? 180 : 0,
            }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-colors duration-300 ${
                isHovered
                  ? "text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                  : "text-purple-300"
              }`}
            >
              <path
                d="M6 10V8C6 5.79 7.79 4 10 4H14C16.21 4 18 5.79 18 8V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 10H19C20.1 10 21 10.9 21 12V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 12V12C3 10.9 3.9 10 5 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="15"
                r="2"
                fill="currentColor"
                className={`transition-all duration-300 ${
                  isHovered ? "opacity-100" : "opacity-60"
                }`}
              />
            </svg>
          </motion.div>

          {/* Text with improved typography */}
          <span
            className={`font-mono text-lg font-bold tracking-wider transition-all duration-300 ${
              isHovered
                ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                : "text-purple-200"
            }`}
            style={{
              fontFamily: "JetBrains Mono, Consolas, monospace",
              textShadow: isHovered
                ? "0 0 20px rgba(236, 72, 153, 0.8)"
                : "none",
            }}
          >
            {text}
          </span>
        </div>

        {/* Particle effect overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isHovered
              ? "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 70%)"
              : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
            style={{
              boxShadow: "0 0 20px rgba(236, 72, 153, 0.8)",
            }}
            animate={{
              y: isHovered ? [0, 80, 0] : 0,
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.button>

      {/* Additional glow particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full opacity-0"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
            background: i % 2 === 0 ? "#ec4899" : "#818cf8",
            boxShadow:
              i % 2 === 0
                ? "0 0 10px rgba(236, 72, 153, 0.8)"
                : "0 0 10px rgba(129, 140, 248, 0.8)",
          }}
          animate={{
            opacity: isHovered ? [0, 1, 0] : 0,
            scale: isHovered ? [0, 1.5, 0] : 0,
            y: isHovered ? [0, -20, 0] : 0,
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default Component;