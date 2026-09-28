"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";

const COLORS = ["#8b8ff0", "#a7a9f5", "#c9cbff", "#ffffff", "#6f73e0", "#dfe1ff"];

type Piece = { id: number; left: number; delay: number; dur: number; rot: number; color: string; round: boolean };

function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  useEffect(() => {
    setPieces(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 3 + Math.random() * 3,
        rot: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    );
  }, []);
  return (
    <>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            width: p.round ? 9 : 7,
            height: p.round ? 9 : 14,
            borderRadius: p.round ? "50%" : 2,
            background: p.color,
            boxShadow: "0 0 0 1px rgba(111,115,224,0.15)",
          }}
          initial={{ y: -30, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rot, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeIn" }}
        />
      ))}
    </>
  );
}

export default function FinaleStep({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Confetti />

      {/* soft glowing rings behind the heart */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: "22%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "2px solid rgba(139,143,240,0.5)",
          }}
          animate={{ scale: [0.6, 2.6], opacity: [0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
        />
      ))}

      <motion.div
        style={{ fontSize: 96, lineHeight: 1, filter: "drop-shadow(0 12px 24px rgba(111,115,224,0.5))" }}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: [0, 1.3, 1], rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 1.2 }}
        >
          💜
        </motion.div>
      </motion.div>

      <motion.p
        className="script-big"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9 }}
      >
        Happy Birthday
      </motion.p>

      <motion.h1
        className="final-title"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 1.8, duration: 1.1, ease: "easeOut" }}
      >
        {config.finalTitle} 💜
      </motion.h1>

      <motion.div
        className="card"
        style={{ padding: "22px 20px" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1, type: "spring", stiffness: 80, damping: 14 }}
      >
        <p className="text" style={{ margin: 0, fontFamily: "var(--font-si-serif)", fontSize: 17 }}>
          {config.finalMessage}
        </p>
        <motion.p
          className="eyebrow"
          style={{ margin: "12px 0 0" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
        >
          forever yours 🤍
        </motion.p>
      </motion.div>

      <motion.button
        className="link-btn"
        style={{ marginTop: 22 }}
        onClick={onReplay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6 }}
      >
        ආයෙ බලන්න 🔁
      </motion.button>
    </motion.div>
  );
}
