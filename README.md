# 💜 Baby B'day

ආදරවන්තියගේ උපන්දිනයට හදපු පුංචි surprise website එකක් (Next.js + Framer Motion).
සුදු + නිල් හුරු දම් (lavender-blue) theme, iPhone එකට ගැලපෙන්න හදලා තියෙන්නේ.

## Flow එක
1. **Welcome** – රහස් මුරපදේ දාන්න ඕනෙ (ඉඟි 3ක් තියෙනවා). හරි වුණාම music පටන් ගන්නවා.
2. **ඔයා මට ආදරෙයි ද බබෝ?** – ඔව් / නෑ. "නෑ" එබුවොත් දුක මූණක් pop-up වෙලා තත්පර 3න් close වෙනවා (ඔව් button එක ලොකු වෙනවා 😉).
3. **Intro + 1, 2, 3** countdown.
4. **Story** – දෙපැත්තේ memories උඩට scroll වෙනවා, මැදින් කතාව type වෙවී උඩට යනවා.
5. **Finale** – "මං ඔයාට ගොඩක් ආදරෙයි බබා" message එක confetti එක්ක.

## වෙනස් කරන්න ඕනෙ දේවල්
සියල්ලම `lib/config.ts` එකේ:
- `passwords` – රහස් මුරපදය (දැනට `babo`)
- `hints` – ඉඟි
- `story` – මැදින් type වෙන කතාව
- `memories` – photos (`public/memories/1.jpg` … `8.jpg` දාන්න; නැත්නම් emoji placeholder පෙන්නනවා)
- `finalTitle`, `finalMessage`

**Music:** `public/music.mp3` එකක් දැම්මොත් ඒක loop වෙනවා. නැත්නම් music-box Happy Birthday එකක් auto play වෙනවා.
(iPhone එකේ silent switch එක on නම් music-box එක ඇහෙන්නේ නැති වෙන්න පුළුවන් — mp3 එකක් දාන එක හොඳයි.)

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Vercel එකට deploy කරලා link එක එයාට යවන්න පුළුවන්.
