"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Gamepad2 } from "lucide-react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

    useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let newProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 100);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Particle generation
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, delay: number, duration: number}[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
      }))
    );
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background ambient glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]" />
      </motion.div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [`${p.y}vh`, `${p.y - 20}vh`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute z-0 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,165,0,0.8)]"
          style={{ width: p.size, height: p.size }}
        />
      ))}

      {/* Logo Container */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 1.2,
          delay: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="z-10 flex flex-col items-center relative w-[90%] max-w-sm"
      >
        <img 
          src="/aviator-splash.jpg" 
          alt="Premium Casino Game" 
          className="w-full h-auto rounded-3xl drop-shadow-[0_0_30px_rgba(255,165,0,0.5)] border border-orange-500/20"
        />
      </motion.div>

      {/* Loading bar at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-16 w-64 z-10 flex flex-col items-center"
      >
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#ff0b0b] shadow-[0_0_10px_rgba(255,11,11,1)]"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <div className="mt-3 text-neutral-500 text-xs font-mono">
          LOADING RESOURCES... {Math.round(progress)}%
        </div>
      </motion.div>
    </div>
  );
}


