"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SAD_LINES = [
  "අනේ... එහෙම කියන්න එපා බබෝ 🥺",
  "මගෙ හිත රිදුණා නේද... 💔",
  "ආයෙ හිතලා බලන්නකෝ 😢",
];

function SadPopup({ line, onClose }: { line: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="popup"
        initial={{ scale: 0.4, y: 60, rotate: -6 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.6, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <motion.div
            style={{ fontSize: 86, lineHeight: 1 }}
            animate={{ rotate: [0, -6, 6, -6, 0], y: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            🥺
          </motion.div>
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="tear"
              style={{ left: i ? 58 : 20, top: 52 }}
              animate={{ y: [0, 40], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.5, ease: "easeIn" }}
            />
          ))}
        </div>
        <p className="title" style={{ fontSize: 19, marginTop: 14 }}>
          {line}
        </p>
        <motion.div
          className="popup-bar"
          style={{ width: "100%" }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function LoveQuestionStep({ onYes }: { onYes: () => void }) {
  const [noCount, setNoCount] = useState(0);
  const [sad, setSad] = useState<string | null>(null);
  const [saidYes, setSaidYes] = useState(false);
  const closeSad = useRef(() => setSad(null)).current;

  const handleNo = () => {
    setSad(SAD_LINES[noCount % SAD_LINES.length]);
    setNoCount((n) => n + 1);
  };

  const handleYes = () => {
    if (saidYes) return;
    setSaidYes(true);
    setTimeout(onYes, 1400);
  };

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 13 }}
      >
        <motion.div
          style={{ fontSize: 70, lineHeight: 1, marginBottom: 10, display: "inline-block" }}
          animate={saidYes ? { scale: [1, 1.5, 1.2], rotate: [0, 10, 0] } : { scale: [1, 1.15, 1, 1.15, 1] }}
          transition={saidYes ? { duration: 0.8 } : { duration: 1.6, repeat: Infinity }}
        >
          {saidYes ? "🥰" : "💜"}
        </motion.div>

        <p className="eyebrow">just one little question...</p>

        <AnimatePresence mode="wait">
          {saidYes ? (
            <motion.div key="yay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="title">මමත් ඔයාට ගොඩාක් ආදරෙයි 💜</h2>
              <p className="text">මං දැනගෙන හිටියා 🙈✨</p>
            </motion.div>
          ) : (
            <motion.div key="ask" exit={{ opacity: 0, y: -10 }}>
              <h2 className="title">
                මේ හැම හුස්මකින්ම මං ඔයාට ආදරෙයි...
                <br />
                ඔයා මට ආදරෙයි ද බබෝ? 🥺
              </h2>
              <p className="text">ඇත්තම කියන්න ඕනෙ හොඳේ 🤭</p>

              <div className="btn-row">
                <motion.button
                  className="btn"
                  onClick={handleYes}
                  animate={{ scale: 1 + Math.min(noCount, 5) * 0.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  ඔව් 💜
                </motion.button>
                <motion.button
                  className="btn ghost"
                  onClick={handleNo}
                  animate={{ scale: Math.max(1 - noCount * 0.1, 0.6) }}
                  whileTap={{ scale: 0.9 }}
                >
                  නෑ 🙄
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{sad && <SadPopup key={noCount} line={sad} onClose={closeSad} />}</AnimatePresence>
    </motion.div>
  );
}
