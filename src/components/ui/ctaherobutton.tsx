import { useEffect, useRef, useState } from "react";
import type { MouseEventHandler } from "react";

import { motion } from "framer-motion";

const CYCLES_PER_LETTER = 3;
const SHUFFLE_TIME = 30;
const CHARS = "!@#$%^&*():{};|,.<>/?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DEFAULT_TEXT = "KONTAKT";

interface CTAHeroButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  label?: string;
}

const CTAHeroButton = ({
  onClick,
  className = "",
  label = DEFAULT_TEXT,
}: CTAHeroButtonProps) => {
  const targetText = label;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [text, setText] = useState(targetText);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setText(targetText);
    }
  }, [targetText, isHovered]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const scramble = () => {
    let pos = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const scrambled = targetText
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          return CHARS[randomCharIndex];
        })
        .join("");

      setText(scrambled);
      pos += 1;

      if (pos >= targetText.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setText(targetText);
  };

  const baseClasses =
    "relative group overflow-hidden rounded-2xl bg-black/80 backdrop-blur-sm border border-purple-500/30 px-8 py-4 shadow-2xl transition-all duration-300";
  const combinedClassName = `${baseClasses}${className ? ` ${className}` : ""}`;

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
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-75"
        animate={{
          background: isHovered
            ? "linear-gradient(45deg, #e879f9, #ec4899, #8b5cf6, #818cf8, #e879f9)"
            : "linear-gradient(45deg, #1e1b4b, #312e81, #4c1d95, #1e1b4b)",
        }}
        transition={{ duration: 0.6 }}
        style={{ backgroundSize: "300% 300%" }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={combinedClassName}
        style={{
          boxShadow: isHovered
            ? "0 0 60px rgba(236, 72, 153, 0.5), 0 0 100px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
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
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-full h-full bg-black/90 rounded-2xl" />
        </motion.div>

        <div className="relative z-10 flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotateY: isHovered ? 180 : 0 }}
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

        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isHovered
              ? "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 70%)"
              : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
            style={{ boxShadow: "0 0 20px rgba(236, 72, 153, 0.8)" }}
            animate={{
              y: isHovered ? [0, 80, 0] : 0,
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.button>

      {isHovered &&
        [...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${20 + index * 10}%`,
              top: `${30 + (index % 3) * 20}%`,
              background: index % 2 === 0 ? "#ec4899" : "#818cf8",
              boxShadow:
                index % 2 === 0
                  ? "0 0 10px rgba(236, 72, 153, 0.8)"
                  : "0 0 10px rgba(129, 140, 248, 0.8)",
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
          />
        ))}
    </div>
  );
};

export default CTAHeroButton;
