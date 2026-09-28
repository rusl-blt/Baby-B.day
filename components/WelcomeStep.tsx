"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { config } from "@/lib/config";

const WRONG_MSGS = [
  "අයියෝ වැරදියි බබෝ 🙈 ආයෙ try කරන්න",
  "ම්හ්ම්... තව ටිකක් හිතන්න 🤭",
  "නෑ නෑ 😝 ඉඟියක් බලන්නකෝ",
];

const normalize = (s: string) => s.trim().toLowerCase().normalize("NFC");

export default function WelcomeStep({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [hintIdx, setHintIdx] = useState(-1);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const shake = useAnimationControls();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlocked) return;
    const ok = config.passwords.some((p) => normalize(p) === normalize(value));
    if (ok) {
      setError("");
      setUnlocked(true);
      (document.activeElement as HTMLElement | null)?.blur();
      onUnlock();
      return;
    }
    setError(WRONG_MSGS[tries % WRONG_MSGS.length]);
    setTries((t) => t + 1);
    shake.start({ x: [0, -14, 14, -10, 10, -4, 4, 0], transition: { duration: 0.5 } });
  };

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="card"
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
      >
        <motion.div animate={shake}>
          <motion.span
            className="big-emoji"
            animate={unlocked ? { rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] } : { y: [0, -8, 0] }}
            transition={unlocked ? { duration: 0.6 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {unlocked ? "🔓" : "💌"}
          </motion.span>

          <p className="eyebrow">Hello my love</p>
          <h1 className="title">හායි {config.herName} 💜</h1>
          <p className="text">
            ඔයාට මං පුංචි surprise එකක් හංගලා තියෙනවා 🤫
            <br />
            ඒත් ඒක බලන්න නම් ඉස්සෙල්ලා <b>රහස් මුරපදේ</b> හොයාගන්න ඕනෙ 🔐
          </p>

          <form onSubmit={submit}>
            <input
              className="input"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="රහස් මුරපදේ..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <motion.button
              type="submit"
              className="btn full"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
            >
              {unlocked ? "හරි 💜" : "Unlock කරන්න ✨"}
            </motion.button>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={error}
                className="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {hintIdx >= 0 && (
              <motion.div
                key={hintIdx}
                className="hint"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                💡 {config.hints[hintIdx]}
              </motion.div>
            )}
          </AnimatePresence>

          {hintIdx < config.hints.length - 1 && (
            <button type="button" className="link-btn" onClick={() => setHintIdx((h) => h + 1)}>
              {hintIdx < 0 ? "ඉඟියක් ඕනෙද? 🤔" : "තව ඉඟියක් 🙏"}
            </button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
