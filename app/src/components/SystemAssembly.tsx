import { useEffect, useRef } from 'react';
import { DISPLAY, services } from '../data';
import { alpha, ink500, paper, violet400, violet500 } from '../tokens';

// Spark burst core color — appears only inside this component.
const sparkCore = '#EBE3FF';

const NARROW_THRESHOLD = 640;
const WIDE_W = 1056;
const WIDE_H = 590;

/** Build a circular outline overlay for the core — sits inside the core box
 *  with `inset: -8px` so its stroke lands slightly past the box's own edge. */
const makeOutlineRing = (): HTMLDivElement => {
  const ring = document.createElement('div');
  ring.style.cssText = `position:absolute;inset:-8px;border-radius:50%;border:1.5px solid ${alpha('violet400', 0.55)};opacity:0;transform:scale(.85);transition:opacity .5s ease, transform .55s cubic-bezier(.34,1.56,.64,1);pointer-events:none;`;
  return ring;
};

/**
 * Gamified "assemble the system" block: six service cards fly into place around
 * a glowing "МЭПЛ" core, connector lines draw in, checks pop, and a spark burst
 * fires on full assembly (then the core glow breathes).
 *
 * Wide viewports get the original two-column radial layout. Narrow viewports
 * rebuild into a vertical stack — core on top, six cards descending, a central
 * rail with short spurs connecting each — so copy stays readable on phones.
 */
export default function SystemAssembly() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const data = services;
    const disp = DISPLAY;

    // ── shared chrome: button (doubles as progress bar) / status ───────────
    const ctl = document.createElement('div');
    ctl.style.cssText =
      'display:flex;align-items:center;gap:20px;margin-bottom:30px;flex-wrap:wrap;';
    const btn = document.createElement('button');
    btn.style.cssText = `position:relative;overflow:hidden;cursor:pointer;font-family:${disp};font-weight:600;font-size:15px;letter-spacing:.02em;text-transform:uppercase;color:${paper};background:transparent;border:1.5px solid ${violet400};padding:14px 28px;border-radius:10px;box-shadow:0 10px 26px -10px ${alpha('violet400', 0.8)};isolation:isolate;`;
    // Fill overlay grows left→right as each service card locks in. Behind the
    // label (isolation + z-index) so the text stays legible over both filled
    // and empty regions — darker violet keeps enough contrast against white.
    const btnFill = document.createElement('span');
    btnFill.style.cssText = `position:absolute;left:0;top:0;bottom:0;width:0%;background:${violet500};transition:width .35s ease;z-index:-1;pointer-events:none;`;
    const btnLabel = document.createElement('span');
    btnLabel.style.cssText = 'position:relative;z-index:1;';
    btnLabel.textContent = 'Собрать систему';
    btn.appendChild(btnFill);
    btn.appendChild(btnLabel);
    ctl.appendChild(btn);

    const stageWrap = document.createElement('div');
    stageWrap.style.cssText = 'position:relative;width:100%;overflow:hidden;margin:0 auto;';

    const status = document.createElement('p');
    status.style.cssText = `font-family:${disp};font-size:22px;font-weight:200;text-align:center;color:${violet400};margin:40px 0 0;transition:opacity .6s ease;opacity:.9;`;
    status.textContent =
      'Нажмите «Собрать систему» — и направления соберутся в одну систему';

    mount.appendChild(ctl);
    mount.appendChild(stageWrap);
    mount.appendChild(status);

    // ── per-layout stage (rebuilt when we cross the breakpoint) ────────────
    type Stage = {
      root: HTMLDivElement;
      core: HTMLDivElement;
      glow: HTMLDivElement;
      cards: HTMLDivElement[];
      checks: HTMLDivElement[];
      lines: SVGLineElement[];
      lineLen: number[];
      arranged: string[];
      scattered: string[];
      sparkOrigin: { left: number; top: number };
      applyScale: () => void;
      /** Base transform (without scale) applied to core. Wide uses
       *  `translate(-50%,-50%)` to center an absolutely-positioned core;
       *  narrow's core is a flex-item and needs no translate. */
      coreTransformBase: string;
      /** Circular outline around the core. Hidden until final assembly,
       *  faded out on disassemble. */
      outlineRing: HTMLDivElement;
      /** Called after the stage is inserted into the DOM — used by the narrow
       *  layout to measure natural card positions before drawing rail
       *  segments. Optional; wide layout has fully pre-computed geometry. */
      postMount?: () => void;
    };

    let stage: Stage | null = null;
    let mode: 'wide' | 'narrow' | null = null;
    let on = false; // assembled?
    let busy = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };

    const buildWide = (): Stage => {
      const NS = 'http://www.w3.org/2000/svg';
      const root = document.createElement('div');
      root.style.cssText = `position:relative;width:${WIDE_W}px;height:${WIDE_H}px;transform-origin:top left;`;

      const arranged = [
        'translate(0px,0px)',
        'translate(0px,200px)',
        'translate(0px,400px)',
        'translate(756px,0px)',
        'translate(756px,200px)',
        'translate(756px,400px)',
      ];
      const scattered = [
        'translate(-26px,-16px) rotate(-8deg) scale(0.9)',
        'translate(-40px,207px) rotate(6deg) scale(0.9)',
        'translate(-14px,414px) rotate(-5deg) scale(0.9)',
        'translate(780px,-20px) rotate(7deg) scale(0.9)',
        'translate(792px,191px) rotate(-7deg) scale(0.9)',
        'translate(764px,416px) rotate(9deg) scale(0.9)',
      ];

      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 1056 590');
      svg.setAttribute('width', '1056');
      svg.setAttribute('height', '590');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', violet400);
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.style.cssText = 'position:absolute;inset:0;z-index:1;overflow:visible;';
      const g = document.createElementNS(NS, 'g');
      // Radius used to terminate the connector lines on the core's visual
      // edge (matches the outlineRing overlay added to the core box below —
      // core width 170 + 8px inset on each side ≈ 93px radius).
      const CORE_CX = 528;
      const CORE_CY = 292;
      const CORE_R = 92;

      const lineEnds: [number, number][] = [
        [300, 92], [300, 292], [300, 492],
        [756, 92], [756, 292], [756, 492],
      ];
      const lines: SVGLineElement[] = [];
      const lineLen: number[] = [];
      lineEnds.forEach((e) => {
        const ln = document.createElementNS(NS, 'line');
        // Line starts on the outline's edge (unit vector from core center to
        // the card) so the whole radial "spoke" ends at the ring, not inside.
        const dx = e[0] - CORE_CX;
        const dy = e[1] - CORE_CY;
        const dist = Math.hypot(dx, dy) || 1;
        const startX = CORE_CX + (dx / dist) * CORE_R;
        const startY = CORE_CY + (dy / dist) * CORE_R;
        ln.setAttribute('x1', String(startX));
        ln.setAttribute('y1', String(startY));
        ln.setAttribute('x2', String(e[0]));
        ln.setAttribute('y2', String(e[1]));
        const len = Math.hypot(e[0] - startX, e[1] - startY);
        ln.setAttribute('stroke-dasharray', String(len));
        ln.style.strokeDashoffset = String(len);
        ln.style.opacity = '0';
        ln.style.transition = 'stroke-dashoffset .7s ease, opacity .5s ease';
        g.appendChild(ln);
        lines.push(ln);
        lineLen.push(len);
      });
      svg.appendChild(g);
      root.appendChild(svg);

      const core = document.createElement('div');
      core.style.cssText =
        'position:absolute;left:528px;top:292px;transform:translate(-50%,-50%);width:170px;height:170px;display:flex;align-items:center;justify-content:center;z-index:2;transition:transform .4s cubic-bezier(.34,1.56,.64,1);';
      const glow = document.createElement('div');
      glow.style.cssText = `position:absolute;inset:-12px;border-radius:50%;background:radial-gradient(circle,${alpha('violet500', 0.85)},${alpha('violet500', 0.04)} 70%);transform:scale(.82);opacity:.32;transition:transform .8s ease, opacity .8s ease;`;
      const outlineRing = makeOutlineRing();
      const word = document.createElement('div');
      word.style.cssText = `position:relative;font-family:${disp};font-weight:600;font-size:30px;color:${paper};letter-spacing:.02em;z-index:1;`;
      word.textContent = 'МЭПЛ';
      core.appendChild(glow);
      core.appendChild(outlineRing);
      core.appendChild(word);
      root.appendChild(core);

      const cards: HTMLDivElement[] = [];
      const checks: HTMLDivElement[] = [];
      data.forEach((d, i) => {
        const c = document.createElement('div');
        c.style.cssText = `position:absolute;left:0;top:0;width:300px;box-sizing:border-box;background:${alpha('violet400', 0.12)};border:1px solid ${alpha('violet400', 0.26)};border-radius:16px;padding:22px 22px 24px;z-index:3;transform:${scattered[i]};opacity:.78;transition:transform 1s cubic-bezier(.22,1,.36,1), opacity .7s ease, background .4s ease, border-color .4s ease;`;
        c.innerHTML =
          '<div style="font-size:20px;font-weight:800;line-height:1.15;margin-bottom:8px;padding-right:28px;">' +
          d.t +
          `</div><div style="font-size:14px;line-height:1.5;color:${ink500};">` +
          d.d +
          '</div>';
        const chk = document.createElement('div');
        chk.style.cssText = `position:absolute;top:18px;right:18px;width:24px;height:24px;border-radius:50%;background:${violet500};box-shadow:0 0 0 4px ${alpha('violet500', 0.22)};display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.4);transition:opacity .4s ease,transform .45s cubic-bezier(.34,1.56,.64,1);`;
        chk.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="${paper}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        c.appendChild(chk);
        root.appendChild(c);
        cards.push(c);
        checks.push(chk);
      });

      const applyScale = () => {
        const w = stageWrap.clientWidth;
        if (!w) return;
        const k = Math.min(1, w / WIDE_W);
        root.style.transform = `scale(${k})`;
        stageWrap.style.height = `${WIDE_H * k}px`;
      };

      return {
        root, core, glow, cards, checks, lines, lineLen,
        arranged, scattered,
        // Core box is 170×170 — center is the spark origin (core-relative).
        sparkOrigin: { left: 85, top: 85 },
        applyScale,
        coreTransformBase: 'translate(-50%,-50%) ',
        outlineRing,
      };
    };

    const buildNarrow = (): Stage => {
      const NS = 'http://www.w3.org/2000/svg';
      // Fluid width. Uses the full wrapper — cards are full-bleed so the layout
      // reads as a vertical conveyor from services down to the core.
      const W = Math.max(stageWrap.clientWidth || 320, 280);
      const CORE_D = 108;
      const CARD_GAP = 14; // room for the connector segment between cards
      const CORE_MARGIN_TOP = 22; // extra space before the trailing core

      // Flex column: cards flow naturally, core sits at the bottom.
      const root = document.createElement('div');
      root.style.cssText = `position:relative;width:${W}px;margin:0 auto;padding:12px 0;display:flex;flex-direction:column;gap:${CARD_GAP}px;box-sizing:border-box;transform-origin:top left;`;

      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', violet400);
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;z-index:1;overflow:visible;pointer-events:none;';
      const g = document.createElementNS(NS, 'g');
      svg.appendChild(g);
      root.appendChild(svg);

      const arranged: string[] = [];
      const scattered: string[] = [];
      const cards: HTMLDivElement[] = [];
      const checks: HTMLDivElement[] = [];
      data.forEach((d) => {
        const c = document.createElement('div');
        c.style.cssText = `position:relative;width:100%;box-sizing:border-box;background:${alpha('violet400', 0.12)};border:1px solid ${alpha('violet400', 0.26)};border-radius:16px;padding:16px 18px;z-index:3;transform:translate(0,22px) scale(0.97);opacity:.78;transition:transform .7s cubic-bezier(.22,1,.36,1), opacity .5s ease, background .4s ease, border-color .4s ease;`;
        c.innerHTML =
          '<div style="font-size:16px;font-weight:800;line-height:1.2;margin-bottom:6px;padding-right:34px;">' +
          d.t +
          `</div><div style="font-size:13px;line-height:1.45;color:${ink500};">` +
          d.d +
          '</div>';
        const chk = document.createElement('div');
        chk.style.cssText = `position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;background:${violet500};box-shadow:0 0 0 3px ${alpha('violet500', 0.22)};display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.4);transition:opacity .4s ease,transform .45s cubic-bezier(.34,1.56,.64,1);`;
        chk.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="${paper}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        c.appendChild(chk);
        root.appendChild(c);
        cards.push(c);
        checks.push(chk);
        // Transforms are position-agnostic — cards ride the flex flow.
        arranged.push('translate(0,0) scale(1)');
        scattered.push('translate(0,22px) scale(0.97)');
      });

      // Core is a flex-item too, centered on the cross axis, sitting at the
      // bottom of the stack.
      const core = document.createElement('div');
      core.style.cssText = `position:relative;align-self:center;width:${CORE_D}px;height:${CORE_D}px;margin-top:${CORE_MARGIN_TOP}px;display:flex;align-items:center;justify-content:center;z-index:2;transition:transform .4s cubic-bezier(.34,1.56,.64,1);`;
      const glow = document.createElement('div');
      glow.style.cssText = `position:absolute;inset:-56px;border-radius:50%;background:radial-gradient(circle,${alpha('violet500', 0.75)},${alpha('violet500', 0)} 62%);transform:scale(.82);opacity:.32;transition:transform .8s ease, opacity .8s ease;pointer-events:none;`;
      const outlineRing = makeOutlineRing();
      const word = document.createElement('div');
      word.style.cssText = `position:relative;font-family:${disp};font-weight:600;font-size:22px;color:${paper};letter-spacing:.02em;z-index:1;`;
      word.textContent = 'МЭПЛ';
      core.appendChild(glow);
      core.appendChild(outlineRing);
      core.appendChild(word);
      root.appendChild(core);

      const lines: SVGLineElement[] = [];
      const lineLen: number[] = [];
      // Sparks live inside the core box now — origin is the box center and
      // no longer depends on where the core lands vertically in the flex flow.
      const sparkOrigin = { left: CORE_D / 2, top: CORE_D / 2 };

      // Build rail segments once the flex flow has resolved positions. Each
      // segment i sits BELOW card i, connecting it to the next flex-item
      // (card i+1 for i<last, core for i=last). Called from postMount.
      const rebuildRail = () => {
        const totalH = root.offsetHeight;
        if (!totalH) return;
        const centerX = W / 2;
        svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
        svg.setAttribute('width', String(W));
        svg.setAttribute('height', String(totalH));
        // Remember which segments are already visible so we can restore state.
        const wasVisible = lines.map((ln) => ln.style.opacity === '.7');
        g.innerHTML = '';
        lines.length = 0;
        lineLen.length = 0;
        // Outline ring extends 8px past the core box (inset:-8), so the last
        // rail segment terminates on the ring's top edge, not the core box.
        const RING_INSET = 8;
        const ringTopY = core.offsetTop - RING_INSET;
        for (let i = 0; i < cards.length; i++) {
          const cardEl = cards[i];
          const segTop = cardEl.offsetTop + cardEl.offsetHeight;
          const nextTop = i < cards.length - 1
            ? cards[i + 1].offsetTop
            : ringTopY;
          const len = Math.max(1, nextTop - segTop);
          const ln = document.createElementNS(NS, 'line');
          ln.setAttribute('x1', String(centerX));
          ln.setAttribute('y1', String(segTop));
          ln.setAttribute('x2', String(centerX));
          ln.setAttribute('y2', String(nextTop));
          ln.setAttribute('stroke-dasharray', String(len));
          const visible = wasVisible[i] ?? false;
          ln.style.strokeDashoffset = visible ? '0' : String(len);
          ln.style.opacity = visible ? '.7' : '0';
          ln.style.transition = 'stroke-dashoffset .5s ease, opacity .4s ease';
          g.appendChild(ln);
          lines.push(ln);
          lineLen.push(len);
        }
      };

      const applyScale = () => {
        // Fit-to-wrap when the wrapper is narrower than the intrinsic width.
        const w = stageWrap.clientWidth;
        if (!w) return;
        const k = w >= W ? 1 : w / W;
        root.style.transform = `scale(${k})`;
        // Height depends on the (measured) natural stack — keep in sync.
        const h = root.offsetHeight || 0;
        if (h) stageWrap.style.height = `${h * k}px`;
      };

      const postMount = () => {
        rebuildRail();
        applyScale();
      };

      return {
        root, core, glow, cards, checks, lines, lineLen,
        arranged, scattered,
        // Same object reference — rebuildRail mutates left/top after layout,
        // so sparkBurst() picks up the current position without needing a
        // stage handle round-trip.
        sparkOrigin,
        applyScale,
        // Flex-item core is already centered — no translate baseline needed.
        coreTransformBase: '',
        outlineRing,
        postMount,
      };
    };

    // ── state → DOM ────────────────────────────────────────────────────────
    const setCoreProgress = (s: Stage, k: number) => {
      s.glow.style.transform = 'scale(' + (0.82 + 0.05 * k).toFixed(3) + ')';
      s.glow.style.opacity = String(Math.min(1, 0.32 + 0.11 * k));
      s.core.style.transform =
        s.coreTransformBase + 'scale(' + (0.9 + 0.017 * k).toFixed(3) + ')';
    };
    const setCardVisual = (s: Stage, i: number, a: boolean) => {
      s.cards[i].style.transform = a ? s.arranged[i] : s.scattered[i];
      s.cards[i].style.opacity = a ? '1' : '.78';
      s.cards[i].style.background = a ? alpha('violet400', 0.2) : alpha('violet400', 0.12);
      s.cards[i].style.borderColor = a ? alpha('violet400', 0.55) : alpha('violet400', 0.26);
      s.lines[i].style.strokeDashoffset = a ? '0' : String(s.lineLen[i]);
      s.lines[i].style.opacity = a ? '.7' : '0';
      s.checks[i].style.opacity = a ? '1' : '0';
      s.checks[i].style.transform = a ? 'scale(1)' : 'scale(.4)';
    };

    const sparkBurst = (count: number) => {
      if (!stage) return;
      const s = stage;
      for (let n = 0; n < count; n++) {
        const sp = document.createElement('div');
        const size = 3 + Math.random() * 5;
        const ang = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 130;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        const dur = 1100 + Math.random() * 900;
        const delay = Math.random() * 500;
        // Sparks live inside `core` (not root) — z-index:0 keeps them behind
        // the wordmark (z-index:1) while still above the glow and outline
        // ring (both z-auto). Coordinates are core-relative: origin is the
        // core box center.
        sp.style.cssText = `position:absolute;left:${s.sparkOrigin.left}px;top:${s.sparkOrigin.top}px;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;border-radius:50%;background:${sparkCore};box-shadow:0 0 8px 2px ${alpha('violet400', 0.9)};z-index:0;pointer-events:none;--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;animation:mm-spark ${dur}ms ease-out ${delay.toFixed(0)}ms forwards;`;
        s.core.appendChild(sp);
        setTimeout(() => sp.remove(), dur + delay + 60);
      }
    };

    const setProgress = (k: number) => {
      btnFill.style.width = Math.min(100, (k / 6) * 100) + '%';
      if (stage) setCoreProgress(stage, k);
    };

    const showOutlineRing = (s: Stage, on: boolean) => {
      s.outlineRing.style.opacity = on ? '1' : '0';
      s.outlineRing.style.transform = `scale(${on ? 1 : 0.85})`;
    };

    const showAssembled = (instant: boolean) => {
      if (!stage) return;
      const s = stage;
      if (instant) {
        for (let i = 0; i < s.cards.length; i++) setCardVisual(s, i, true);
        setProgress(6);
        s.glow.style.animation = 'mm-core-breathe 4.5s ease-in-out infinite';
        showOutlineRing(s, true);
      }
    };

    const order = [0, 3, 1, 4, 2, 5];
    const orderNarrow = [0, 1, 2, 3, 4, 5];

    // Ring animates in first (~450 ms), then the connector spokes reach out
    // from its edge one by one — hence the delay before the first card lock.
    const RING_LEAD_MS = 550;

    const runAssemble = () => {
      if (!stage) return;
      const s = stage;
      const seq = mode === 'narrow' ? orderNarrow : order;
      seq.forEach((ci, step) => {
        timers.push(
          setTimeout(() => {
            setCardVisual(s, ci, true);
            setProgress(step + 1);
            if (step === seq.length - 1) {
              busy = false;
              btnLabel.textContent = 'Разобрать';
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.cursor = 'pointer';
              status.textContent = 'Если это не помогает росту, то мы это не делаем';
              sparkBurst(26);
              timers.push(setTimeout(() => sparkBurst(18), 900));
              timers.push(
                setTimeout(() => {
                  s.glow.style.animation = 'mm-core-breathe 4.5s ease-in-out infinite';
                }, 1400)
              );
            }
          }, RING_LEAD_MS + step * 260)
        );
      });
    };

    const assemble = () => {
      if (on || !stage) return;
      on = true;
      busy = true;
      btnLabel.textContent = 'Собираем…';
      btn.disabled = true;
      btn.style.opacity = '.65';
      btn.style.cursor = 'default';
      status.style.opacity = '1';
      status.textContent = 'Соединяем направления в одну систему…';
      // Ring appears immediately so lines look like they originate from it.
      showOutlineRing(stage, true);
      runAssemble();
    };

    const disassemble = () => {
      if (busy) return;
      on = false;
      clearTimers();
      if (stage) {
        stage.glow.style.animation = '';
        showOutlineRing(stage, false);
        for (let i = 0; i < stage.cards.length; i++) setCardVisual(stage, i, false);
      }
      setProgress(0);
      btnLabel.textContent = 'Собрать систему';
      status.textContent = 'Нажмите «Собрать систему» — и направления соберутся в одну систему';
    };

    btn.addEventListener('click', () => {
      if (busy) return;
      if (on) disassemble();
      else assemble();
    });

    const pickMode = (): 'wide' | 'narrow' =>
      stageWrap.clientWidth < NARROW_THRESHOLD ? 'narrow' : 'wide';

    const rebuild = (nextMode: 'wide' | 'narrow') => {
      stageWrap.innerHTML = '';
      stage = nextMode === 'wide' ? buildWide() : buildNarrow();
      mode = nextMode;
      // Neither mode clips: wide's scattered cards translate to negative X
      // outside the stage box; narrow's glow needs a soft fade past the box.
      // The outer dark-card already owns the visible bounds.
      stageWrap.style.overflow = 'visible';
      stageWrap.appendChild(stage.root);
      // Narrow measures natural card positions here, then draws rail segments.
      stage.postMount?.();
      stage.applyScale();
      if (on) {
        // Preserve assembled state across layout swap.
        showAssembled(true);
      } else {
        setProgress(0);
      }
    };

    rebuild(pickMode());

    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !on) {
            assemble();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(stageWrap);

    const ro = new ResizeObserver(() => {
      const next = pickMode();
      if (next !== mode) {
        clearTimers();
        busy = false;
        rebuild(next);
      } else {
        // In narrow, card widths and heights change with the wrapper, so the
        // rail must be recomputed before applying scale (which reads
        // root.offsetHeight).
        stage?.postMount?.();
        stage?.applyScale();
      }
    });
    ro.observe(stageWrap);

    return () => {
      clearTimers();
      io.disconnect();
      ro.disconnect();
      mount.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'relative', zIndex: 1 }} />;
}
