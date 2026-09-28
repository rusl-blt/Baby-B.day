"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const INTRO_MS = 4200;
const COUNT_MS = 1100;

export default function CountdownStep({ onDone }: { onDone: () => void }) {
  // 0 = intro text, 1..3 = numbers
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), INTRO_MS),
      setTimeout(() => setPhase(2), INTRO_MS + COUNT_MS),
      setTimeout(() => setPhase(3), INTRO_MS + COUNT_MS * 2),
      setTimeout(onDone, INTRO_MS + COUNT_MS * 3),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div
            key="intro"
            className="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              style={{ fontSize: 60, lineHeight: 1, marginBottom: 12, display: "inline-block" }}
              animate={{ rotate: [0, -8, 8, 0], y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <h2 className="title">
              {"එහෙනම් මං මගෙ මුතු කැටේට හදපු පුංචිම පුංචි උපන්දින සුභ පැතුම පෙන්නන්නයි යන්නේ..."
                .split(" ")
                .map((w, i) => (
                  <motion.span
                    key={i}
                    style={{ display: "inline-block", marginRight: 6 }}
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.3 + i * 0.18, duration: 0.5 }}
                  >
                    {w}
                  </motion.span>
                ))}
            </h2>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6 }}
            >
              ready baby? 💜
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key={phase}
            className="count-num"
            initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 2.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            {phase}
          </motion.div>
        )}
      </AnimatePresence>

      {phase > 0 && (
        <motion.div
          key={`ring-${phase}`}
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "3px solid #a7a9f5",
          }}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}
    </motion.div>
  );
}
