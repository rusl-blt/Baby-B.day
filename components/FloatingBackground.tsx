"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SYMBOLS = ["💜", "🤍", "✨", "💙", "🫧", "🤍", "💜", "⭐"];

type Item = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  symbol: string;
};

export default function FloatingBackground({ count = 16 }: { count?: number }) {
  const [items, setItems] = useState<Item[]>([]);

  // random values only on the client to avoid hydration mismatches
  useEffect(() => {
    setItems(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 18,
        duration: 9 + Math.random() * 9,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 80,
        symbol: SYMBOLS[i % SYMBOLS.length],
      })),
    );
  }, [count]);

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
      <motion.div
        className="bg-blob"
        style={{ width: 320, height: 320, background: "#c9cbff", top: -80, left: -90 }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-blob"
        style={{ width: 280, height: 280, background: "#a7a9f5", bottom: -60, right: -80 }}
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-blob"
        style={{ width: 200, height: 200, background: "#ffffff", top: "40%", left: "30%" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {items.map((it) => (
        <motion.span
          key={it.id}
          className="bg-float"
          style={{ left: `${it.left}%`, fontSize: it.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-110vh",
            x: [0, it.drift, 0],
            opacity: [0, 0.85, 0.85, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: it.duration,
            delay: it.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {it.symbol}
        </motion.span>
      ))}
    </div>
  );
}
