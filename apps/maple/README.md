# Maple Media — landing page

Production implementation of the **Maple Media — Главная** design exported from
Claude Design (see `../project/` and `../chats/`). Built with **React + Vite +
TypeScript**.

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Structure

- `src/App.tsx` — full single-page layout (nav, hero, marquee, why, services,
  process, cases, team, Сценика CTA, footer). Fixed 1280 px design canvas,
  centered on the warm-grey backdrop, exactly as in the prototype.
- `src/data.ts` — all copy/content: services, process steps, specialist roles,
  team members + their CV data, budget options, marquee text.
- `src/components/`
  - `MapleLeaf.tsx` — WebGL (three.js) volumetric maple leaf: gentle sway
    (≤65° per axis), leaf ↔ circle morph rebuilt per frame from the interpolated
    outline, violet sparkles while morphing.
  - `SystemAssembly.tsx` — gamified "Собрать систему" block: six scattered
    service cards fly into a grid around a glowing **МЭПЛ** core, connectors draw
    in, checks pop, a spark burst fires on full assembly, then the core breathes.
    Auto-assembles when scrolled into view.
  - `ProcessPuzzle.tsx` — four interlocking puzzle pieces with alternating
    tab/notch seams that fly together on scroll.
  - `CVModal.tsx` — résumé modal (photo, about, experience, key cases, skills,
    Telegram link).
  - `LeadModal.tsx` — two-step lead form ("Тут оставляют заявки") with a success
    screen.
- `src/index.css` — base styles + keyframes (marquee, leaf float, breathing
  gradients, sparks, core breathe).
- `public/uploads/` — tinted team photos and the Павел Воля concert case image.

Fonts (**Manrope** body + **Russo One** display) load from Google Fonts, matching
the prototype.
