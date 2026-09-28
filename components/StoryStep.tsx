"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { config, type Memory } from "@/lib/config";

// Split into grapheme clusters so Sinhala letters (with their vowel signs)
// are typed as whole characters instead of broken glyphs.
function toGraphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (Seg) {
    return Array.from(new Seg("si", { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function MemoryCard({ m, index }: { m: Memory; index: number }) {
  const [broken, setBroken] = useState(false);
  const tilt = index % 2 ? 2.5 : -2.5;
  return (
    <div className="memory" style={{ transform: `rotate(${tilt}deg)` }}>
      {broken ? (
        <div className="memory-ph">{m.emoji}</div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="memory-img" src={m.src} alt={m.caption} onError={() => setBroken(true)} />
      )}
      <div className="memory-cap">{m.caption}</div>
    </div>
  );
}

function MemoryColumn({ items, duration, offset }: { items: Memory[]; duration: number; offset: number }) {
  // list is duplicated so the loop is seamless
  const list = [...items, ...items];
  return (
    <motion.div
      className="memory-col"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 + offset }}
    >
      <motion.div
        className="memory-track"
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {list.map((m, i) => (
          <MemoryCard key={i} m={m} index={i + (offset ? 1 : 0)} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function StoryStep({ onDone }: { onDone: () => void }) {
  const graphemes = useMemo(() => toGraphemes(config.story), []);
  const [count, setCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userTouching = useRef(false);
  const done = count >= graphemes.length;

  const left = useMemo(() => config.memories.filter((_, i) => i % 2 === 0), []);
  const right = useMemo(() => config.memories.filter((_, i) => i % 2 === 1), []);

  // typewriter
  useEffect(() => {
    if (done) {
      const t = setTimeout(onDone, 3500);
      return () => clearTimeout(t);
    }
    const ch = graphemes[count - 1] ?? "";
    let delay = 55;
    if (ch === "\n") delay = 380;
    else if (/[.!?,]/.test(ch)) delay = 320;
    else if (ch === " ") delay = 70;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 1400 : delay);
    return () => clearTimeout(t);
  }, [count, done, graphemes, onDone]);

  // smooth auto-scroll so the story keeps rolling upwards
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = scrollRef.current;
      if (el && !userTouching.current) {
        const target = el.scrollHeight - el.clientHeight;
        const diff = target - el.scrollTop;
        if (Math.abs(diff) > 0.5) el.scrollTop += diff * 0.06;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const releaseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onTouchStart = () => {
    clearTimeout(releaseTimer.current);
    userTouching.current = true;
  };
  const onTouchEnd = () => {
    releaseTimer.current = setTimeout(() => (userTouching.current = false), 2500);
  };

  return (
    <motion.div
      className="story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.9 }}
    >
      <MemoryColumn items={left} duration={26} offset={0} />

      <motion.div
        className="story-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1 }}
      >
        <div
          className="story-scroll"
          ref={scrollRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <p className="story-text">
            {graphemes.slice(0, count).join("")}
            {!done && <span className="caret" />}
          </p>
        </div>
      </motion.div>

      <MemoryColumn items={right} duration={30} offset={0.4} />
    </motion.div>
  );
}
