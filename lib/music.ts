"use client";

// Background music controller.
// Plays config.musicSrc when available; otherwise falls back to a soft
// music-box "Happy Birthday" generated with Web Audio (public domain melody).
// start() must be called from a user gesture so iOS Safari allows playback.

type Note = [number, number]; // [midi (0 = rest), beats]

const MELODY: Note[] = [
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, 0.75], [67, 0.25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, 0.75], [77, 0.25], [76, 1], [72, 1], [74, 1], [72, 2],
  [0, 2],
];
const BASS = [48, 43, 43, 48, 48, 53, 48, 43, 48, 48];
const BEAT = 0.5; // seconds per beat

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class MusicController {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private synthTimer: ReturnType<typeof setTimeout> | null = null;
  private usingSynth = false;
  private started = false;
  muted = false;

  start(src: string) {
    if (this.started) return;
    this.started = true;

    const Ctx =
      typeof window !== "undefined" &&
      (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext);
    if (Ctx) {
      this.ctx = new Ctx();
      this.ctx.resume().catch(() => {});
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.55;
    audio.preload = "auto";
    this.audio = audio;
    audio.addEventListener("error", () => this.startSynth());
    audio.play().catch(() => this.startSynth());
  }

  private startSynth() {
    if (this.usingSynth || !this.ctx) return;
    this.usingSynth = true;
    this.audio?.pause();
    this.audio = null;

    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.22;

    // tiny echo for a dreamy music-box feel
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.28;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    delay.connect(feedback).connect(delay);
    master.connect(ctx.destination);
    master.connect(delay);
    delay.connect(ctx.destination);
    this.master = master;

    const loop = () => {
      let t = ctx.currentTime + 0.1;
      let beats = 0;
      MELODY.forEach(([midi, len], i) => {
        if (midi) this.bell(midiToFreq(midi), t, len * BEAT + 0.8, 1);
        if (i < BASS.length * 3 && i % 3 === 0 && midi) {
          this.bell(midiToFreq(BASS[(i / 3) % BASS.length]), t, 1.6, 0.35);
        }
        t += len * BEAT;
        beats += len;
      });
      this.synthTimer = setTimeout(loop, beats * BEAT * 1000);
    };
    loop();
  }

  private bell(freq: number, when: number, dur: number, vol: number) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.5 * vol, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    g.connect(this.master);
    const partials: [number, number, OscillatorType][] = [
      [1, 1, "sine"],
      [2, 0.25, "sine"],
      [3, 0.08, "triangle"],
    ];
    for (const [mul, amp, type] of partials) {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type;
      o.frequency.value = freq * mul;
      og.gain.value = amp;
      o.connect(og).connect(g);
      o.start(when);
      o.stop(when + dur + 0.05);
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.audio) this.audio.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.22;
    if (this.ctx) {
      if (muted) this.ctx.suspend().catch(() => {});
      else this.ctx.resume().catch(() => {});
    }
  }

  get isStarted() {
    return this.started;
  }

  stop() {
    if (this.synthTimer) clearTimeout(this.synthTimer);
    this.audio?.pause();
    this.ctx?.close().catch(() => {});
  }
}

export const music = new MusicController();
