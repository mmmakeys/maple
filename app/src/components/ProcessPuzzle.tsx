import { useEffect, useRef } from 'react';
import { processSteps } from '../data';

/**
 * Interlocking puzzle pieces for "Как это происходит": four pieces with
 * alternating tab/notch seams that fly together on scroll.
 * Ported from the Claude Design prototype's `_buildProcess` / `_puzzlePath`.
 */
function puzzlePath(
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

export default function ProcessPuzzle() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || mount.dataset.built === '1') return;
    mount.dataset.built = '1';

    const data = processSteps;
    const U = 292;
    const H = 288;
    const r = 19;
    const cr = 14;
    const seamTy = [44, H - 44, 44]; // tail alternates: top, bottom, top
    const fill = '#F3EEFC';
    const stroke = 'rgba(139,92,246,0.4)';
    const startX = [-46, -16, 16, 46];
    const pieces: HTMLDivElement[] = [];
    data.forEach((d, i) => {
      const hasNotch = i > 0;
      const hasTab = i < data.length - 1;
      const tabTy = hasTab ? seamTy[i] : null;
      const notchTy = hasNotch ? seamTy[i - 1] : null;
      const Wb = U + (hasTab ? r : 0);
      const path = puzzlePath(U, H, r, cr, notchTy, tabTy);
      const leftInset = hasNotch ? r + 22 : 30;
      const rightInset = hasTab ? r + 26 : 30;
      const el = document.createElement('div');
      el.style.cssText =
        'position:absolute;top:0;left:' +
        i * U +
        'px;width:' +
        Wb +
        'px;height:' +
        H +
        'px;z-index:' +
        (10 - i) +
        ';opacity:0;transform:translateX(' +
        startX[i] +
        'px);transition:opacity .6s ease, transform .85s cubic-bezier(.22,1,.36,1);';
      el.innerHTML =
        '<svg width="' +
        Wb +
        '" height="' +
        H +
        '" viewBox="0 0 ' +
        Wb +
        ' ' +
        H +
        '" style="position:absolute;inset:0;display:block;overflow:visible;"><path d="' +
        path +
        '" fill="' +
        fill +
        '" stroke="' +
        stroke +
        '" stroke-width="1.5"/></svg>' +
        '<div style="position:absolute;left:' +
        leftInset +
        'px;right:' +
        rightInset +
        'px;top:48px;">' +
        '<div style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:13px;background:#EAE1FA;margin-bottom:20px;">' +
        '<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="#8B5CF6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
        d.icon +
        '</svg>' +
        '</div>' +
        '<div style="font-size:20px;font-weight:800;line-height:1.2;margin-bottom:10px;color:#181226;">' +
        d.t +
        '</div>' +
        '<div style="font-size:15px;line-height:1.55;color:#6B6577;">' +
        d.d +
        '</div>' +
        '</div>';
      mount.appendChild(el);
      pieces.push(el);
    });

    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            pieces.forEach((p, i) => {
              setTimeout(() => {
                p.style.opacity = '1';
                p.style.transform = 'translateX(0)';
              }, i * 140);
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(mount);

    return () => {
      io.disconnect();
      mount.innerHTML = '';
      delete mount.dataset.built;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'relative', width: 1168, height: 288 }}
    />
  );
}
