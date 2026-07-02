import { useEffect, useRef } from 'react';
import { processSteps } from '../data';
import { alpha, ink600, ink850, violet50, violet100, violet500 } from '../tokens';

/**
 * Interlocking puzzle pieces for "Как это происходит": four pieces that fly
 * together on scroll. Wide viewports get the original horizontal row with
 * seams on the vertical edges; narrow viewports rebuild as a vertical stack
 * with seams on the horizontal edges so the copy stays readable.
 * Ported from the Claude Design prototype's `_buildProcess` / `_puzzlePath`.
 */

// Horizontal seam on the vertical (right/left) edge — original prototype geometry.
function puzzlePathH(
  U: number,
  H: number,
  r: number,
  cr: number,
  notchTy: number | null,
  tabTy: number | null
) {
  const p: string[] = [];
  p.push('M ' + cr + ' 0');
  p.push('H ' + (U - cr));
  p.push('Q ' + U + ' 0 ' + U + ' ' + cr);
  if (tabTy != null) {
    p.push('V ' + (tabTy - r));
    p.push('A ' + r + ' ' + r + ' 0 0 1 ' + U + ' ' + (tabTy + r));
    p.push('V ' + (H - cr));
  } else {
    p.push('V ' + (H - cr));
  }
  p.push('Q ' + U + ' ' + H + ' ' + (U - cr) + ' ' + H);
  p.push('H ' + cr);
  p.push('Q 0 ' + H + ' 0 ' + (H - cr));
  if (notchTy != null) {
    p.push('V ' + (notchTy + r));
    p.push('A ' + r + ' ' + r + ' 0 0 1 0 ' + (notchTy - r));
    p.push('V ' + cr);
  } else {
    p.push('V ' + cr);
  }
  p.push('Q 0 0 ' + cr + ' 0');
  p.push('Z');
  return p.join(' ');
}

// Vertical seam on the horizontal (top/bottom) edge — used when stacking.
// notchTx sits on the top edge (curves inward); tabTx sits on the bottom edge
// (bulges outward). Winding stays clockwise to match the horizontal path.
function puzzlePathV(
  W: number,
  H: number,
  r: number,
  cr: number,
  notchTx: number | null,
  tabTx: number | null
) {
  const p: string[] = [];
  p.push('M ' + cr + ' 0');
  if (notchTx != null) {
    p.push('H ' + (notchTx - r));
    p.push('A ' + r + ' ' + r + ' 0 0 1 ' + (notchTx + r) + ' 0');
    p.push('H ' + (W - cr));
  } else {
    p.push('H ' + (W - cr));
  }
  p.push('Q ' + W + ' 0 ' + W + ' ' + cr);
  p.push('V ' + (H - cr));
  p.push('Q ' + W + ' ' + H + ' ' + (W - cr) + ' ' + H);
  if (tabTx != null) {
    p.push('H ' + (tabTx + r));
    p.push('A ' + r + ' ' + r + ' 0 0 1 ' + (tabTx - r) + ' ' + H);
    p.push('H ' + cr);
  } else {
    p.push('H ' + cr);
  }
  p.push('Q 0 ' + H + ' 0 ' + (H - cr));
  p.push('V ' + cr);
  p.push('Q 0 0 ' + cr + ' 0');
  p.push('Z');
  return p.join(' ');
}

const H_BASE_W = 1168;
const H_BASE_H = 288;
const V_H = 190;
const VERTICAL_THRESHOLD = 640;

export default function ProcessPuzzle() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap) return;

    const data = processSteps;
    const fill = violet50;
    // Slightly more opaque stroke reads cleaner on the light card fill,
    // especially on the vertical mobile layout where the outline is the
    // primary visual separator.
    const stroke = alpha('violet500', 0.55);

    let io: IntersectionObserver | null = null;
    let assembled = false;
    let mode: 'h' | 'v' | null = null;
    let pieces: HTMLDivElement[] = [];

    const buildHorizontal = () => {
      const U = 292;
      const H = H_BASE_H;
      const r = 19;
      const cr = 14;
      const seamTy = [44, H - 44, 44];
      const startX = [-46, -16, 16, 46];
      mount.style.width = H_BASE_W + 'px';
      mount.style.height = H + 'px';
      data.forEach((d, i) => {
        const hasNotch = i > 0;
        const hasTab = i < data.length - 1;
        const tabTy = hasTab ? seamTy[i] : null;
        const notchTy = hasNotch ? seamTy[i - 1] : null;
        const Wb = U + (hasTab ? r : 0);
        const path = puzzlePathH(U, H, r, cr, notchTy, tabTy);
        const leftInset = hasNotch ? r + 22 : 30;
        const rightInset = hasTab ? r + 26 : 30;
        pieces.push(
          buildPiece({
            width: Wb,
            height: H,
            top: 0,
            left: i * U,
            zIndex: 10 - i,
            offset: `translateX(${startX[i]}px)`,
            path,
            contentInset: `left:${leftInset}px;right:${rightInset}px;top:48px;`,
            step: d,
            fill,
            stroke,
          })
        );
      });
    };

    const buildVertical = () => {
      const W = Math.max(280, wrap.clientWidth);
      const H = V_H;
      // Chunkier corner radius reads as a modern card; smaller seam radius
      // keeps the notch/tab from dominating on narrow widths.
      const r = 13;
      const cr = 20;
      // Alternating side positions so seams don't line up in a single column.
      const seamTx = [W * 0.32, W * 0.68, W * 0.32];
      const startY = [-40, -20, 20, 40];
      mount.style.width = W + 'px';
      const totalH = data.length * H;
      mount.style.height = totalH + 'px';
      data.forEach((d, i) => {
        const hasNotch = i > 0;
        const hasTab = i < data.length - 1;
        const tabTx = hasTab ? seamTx[i] : null;
        const notchTx = hasNotch ? seamTx[i - 1] : null;
        const Hb = H + (hasTab ? r : 0);
        const path = puzzlePathV(W, H, r, cr, notchTx, tabTx);
        const topInset = (hasNotch ? r : 0) + 26;
        const bottomInset = (hasTab ? r : 0) + 22;
        pieces.push(
          buildPiece({
            width: W,
            height: Hb,
            top: i * H,
            left: 0,
            zIndex: 10 - i,
            offset: `translateY(${startY[i]}px)`,
            path,
            contentInset: `left:24px;right:24px;top:${topInset}px;bottom:${bottomInset}px;`,
            step: d,
            fill,
            stroke,
          })
        );
      });
    };

    type PieceSpec = {
      width: number;
      height: number;
      top: number;
      left: number;
      zIndex: number;
      offset: string;
      path: string;
      contentInset: string;
      step: (typeof processSteps)[number];
      fill: string;
      stroke: string;
    };
    const buildPiece = (s: PieceSpec) => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;top:${s.top}px;left:${s.left}px;width:${s.width}px;height:${s.height}px;z-index:${s.zIndex};opacity:0;transform:${s.offset};transition:opacity .6s ease, transform .85s cubic-bezier(.22,1,.36,1);`;
      el.innerHTML =
        `<svg width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}" style="position:absolute;inset:0;display:block;overflow:visible;"><path d="${s.path}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.7"/></svg>` +
        `<div style="position:absolute;${s.contentInset}">` +
        `<div style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:15px;background:${violet100};margin-bottom:16px;">` +
        `<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="${violet500}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${s.step.icon}</svg>` +
        '</div>' +
        `<div style="font-size:20px;font-weight:800;line-height:1.2;margin-bottom:8px;color:${ink850};">${s.step.t}</div>` +
        `<div style="font-size:15px;line-height:1.55;color:${ink600};">${s.step.d}</div>` +
        '</div>';
      mount.appendChild(el);
      return el;
    };

    const applyScale = () => {
      if (mode !== 'h') return;
      const w = wrap.clientWidth;
      if (!w) return;
      const k = Math.min(1, w / H_BASE_W);
      mount.style.transform = `scale(${k})`;
      wrap.style.height = `${H_BASE_H * k}px`;
    };

    const revealAll = () => {
      pieces.forEach((p, i) => {
        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'translate(0, 0)';
        }, i * 140);
      });
    };

    const build = (nextMode: 'h' | 'v') => {
      mount.innerHTML = '';
      pieces = [];
      mode = nextMode;
      if (nextMode === 'h') {
        buildHorizontal();
        applyScale();
      } else {
        buildVertical();
        // Vertical layout owns its width; clear the horizontal scale.
        mount.style.transform = '';
        wrap.style.height = mount.style.height;
      }
      // Preserve the "already scrolled in" state across layout swaps so a
      // resize doesn't hide pieces the user has already seen.
      if (assembled) revealAll();
    };

    const pickMode = (): 'h' | 'v' =>
      wrap.clientWidth < VERTICAL_THRESHOLD ? 'v' : 'h';

    build(pickMode());

    io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            assembled = true;
            revealAll();
            io?.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      const next = pickMode();
      if (next !== mode) {
        build(next);
      } else if (mode === 'h') {
        applyScale();
      } else {
        // Vertical: rebuild if width changed enough to matter.
        const currentW = parseFloat(mount.style.width || '0');
        if (Math.abs(currentW - wrap.clientWidth) > 8) build('v');
      }
    });
    ro.observe(wrap);

    return () => {
      io?.disconnect();
      ro.disconnect();
      mount.innerHTML = '';
    };
  }, []);

  return (
    <div ref={wrapRef} className="mm-scale-wrap">
      <div
        ref={mountRef}
        className="mm-scale-inner"
        style={{ position: 'relative' }}
      />
    </div>
  );
}
