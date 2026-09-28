"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import FloatingBackground from "@/components/FloatingBackground";
import WelcomeStep from "@/components/WelcomeStep";
import LoveQuestionStep from "@/components/LoveQuestionStep";
import CountdownStep from "@/components/CountdownStep";
import StoryStep from "@/components/StoryStep";
import FinaleStep from "@/components/FinaleStep";
import { config } from "@/lib/config";
import { music } from "@/lib/music";

type Step = "welcome" | "question" | "countdown" | "story" | "finale";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const unlock = useCallback(() => {
    // called inside the tap/submit gesture so iOS allows the audio to start
    music.start(config.musicSrc);
    setMusicOn(true);
    setTimeout(() => setStep("question"), 900);
  }, []);

  const toCountdown = useCallback(() => setStep("countdown"), []);
  const toStory = useCallback(() => setStep("story"), []);
  const toFinale = useCallback(() => setStep("finale"), []);
  const replay = useCallback(() => setStep("countdown"), []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    music.setMuted(next);
  };

  return (
    <main className="app">
      <FloatingBackground count={step === "story" ? 10 : 16} />

      <AnimatePresence mode="wait">
        {step === "welcome" && <WelcomeStep key="welcome" onUnlock={unlock} />}
        {step === "question" && <LoveQuestionStep key="question" onYes={toCountdown} />}
        {step === "countdown" && <CountdownStep key="countdown" onDone={toStory} />}
        {step === "story" && <StoryStep key="story" onDone={toFinale} />}
        {step === "finale" && <FinaleStep key="finale" onReplay={replay} />}
      </AnimatePresence>

      <AnimatePresence>
        {musicOn && (
          <motion.button
            className="mute-btn"
            aria-label={muted ? "Music on" : "Music off"}
            onClick={toggleMute}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: muted ? 0 : [0, -10, 10, 0] }}
            transition={muted ? {} : { rotate: { duration: 2, repeat: Infinity } }}
          >
            {muted ? "🔇" : "🎵"}
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
