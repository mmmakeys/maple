import { useEffect, useRef } from 'react';
import { DISPLAY, services } from '../data';

/**
 * Gamified "assemble the system" block: six scattered service cards fly into a
 * grid around a glowing "МЭПЛ" core, connector lines draw in, checks pop, and a
 * spark burst fires on full assembly (then the core glow breathes).
 * Ported from the Claude Design prototype's `_buildSystem`.
 */
export default function SystemAssembly() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || mount.dataset.built === '1') return;
    mount.dataset.built = '1';

    const NS = 'http://www.w3.org/2000/svg';
    const data = services;
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
    const disp = DISPLAY;

    const ctl = document.createElement('div');
    ctl.style.cssText =
      'display:flex;align-items:center;gap:20px;margin-bottom:30px;flex-wrap:wrap;';
    const btn = document.createElement('button');
    btn.style.cssText =
      'cursor:pointer;font-family:' +
      disp +
      ';font-weight:600;font-size:15px;letter-spacing:.02em;text-transform:uppercase;color:#161020;background:#A78BFA;border:none;padding:15px 28px;border-radius:10px;box-shadow:0 10px 26px -10px rgba(167,139,250,.8);';
    btn.textContent = 'Собрать систему';
    const cnt = document.createElement('span');
    cnt.style.cssText = 'font-size:15px;font-weight:200;color:#A78BFA;';
    cnt.textContent = '0/6 направлений собрано';
    ctl.appendChild(btn);
    ctl.appendChild(cnt);

    const stage = document.createElement('div');
    stage.style.cssText =
      'position:relative;width:1056px;max-width:100%;height:590px;margin:0 auto;';

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1056 590');
    svg.setAttribute('width', '1056');
    svg.setAttribute('height', '590');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#A78BFA');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.style.cssText = 'position:absolute;inset:0;z-index:1;overflow:visible;';
    const lineEnds = [
      [300, 92],
      [300, 292],
      [300, 492],
      [756, 92],
      [756, 292],
      [756, 492],
    ];
    const g = document.createElementNS(NS, 'g');
    const lines: SVGLineElement[] = [];
    const lineLen: number[] = [];
    lineEnds.forEach((e) => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', '528');
      ln.setAttribute('y1', '292');
      ln.setAttribute('x2', String(e[0]));
      ln.setAttribute('y2', String(e[1]));
      const len = Math.hypot(e[0] - 528, e[1] - 292);
      ln.setAttribute('stroke-dasharray', String(len));
      ln.style.strokeDashoffset = String(len);
      ln.style.opacity = '0';
      ln.style.transition = 'stroke-dashoffset .7s ease, opacity .5s ease';
      g.appendChild(ln);
      lines.push(ln);
      lineLen.push(len);
    });
    svg.appendChild(g);
    stage.appendChild(svg);

    const core = document.createElement('div');
    core.style.cssText =
      'position:absolute;left:528px;top:292px;transform:translate(-50%,-50%);width:170px;height:170px;display:flex;align-items:center;justify-content:center;z-index:2;';
    const glow = document.createElement('div');
    glow.style.cssText =
      'position:absolute;inset:-12px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.85),rgba(139,92,246,.04) 70%);transform:scale(.82);opacity:.32;';
    const word = document.createElement('div');
    word.style.cssText =
      'position:relative;font-family:' +
      disp +
      ';font-weight:600;font-size:30px;color:#fff;letter-spacing:.02em;';
    word.textContent = 'МЭПЛ';
    core.appendChild(glow);
    core.appendChild(word);
    stage.appendChild(core);

    const cards: HTMLDivElement[] = [];
    const checks: HTMLDivElement[] = [];
    data.forEach((d, i) => {
      const c = document.createElement('div');
      c.style.cssText =
        'position:absolute;left:0;top:0;width:300px;box-sizing:border-box;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.26);border-radius:16px;padding:22px 22px 24px;z-index:3;';
      c.style.transform = scattered[i];
      c.style.opacity = '.78';
      c.innerHTML =
        '<div style="font-size:20px;font-weight:800;line-height:1.15;margin-bottom:8px;padding-right:28px;">' +
        d.t +
        '</div>' +
        '<div style="font-size:14px;line-height:1.5;color:#BDB3D4;">' +
        d.d +
        '</div>';
      const chk = document.createElement('div');
      chk.style.cssText =
        'position:absolute;top:18px;right:18px;width:24px;height:24px;border-radius:50%;background:#8B5CF6;box-shadow:0 0 0 4px rgba(139,92,246,.22);display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.4);transition:opacity .4s ease,transform .45s cubic-bezier(.34,1.56,.64,1);';
      chk.innerHTML =
        '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      c.appendChild(chk);
      stage.appendChild(c);
      cards.push(c);
      checks.push(chk);
    });

    const status = document.createElement('p');
    status.style.cssText =
      'font-family:' +
      disp +
      ';font-size:22px;font-weight:200;text-align:center;color:#A78BFA;margin:40px 0 0;transition:opacity .6s ease;opacity:.9;';
    status.textContent =
      'Нажмите «Собрать систему» — и направления соберутся в одну систему';

    mount.appendChild(ctl);
    mount.appendChild(stage);
    mount.appendChild(status);

    // enable transitions only after first paint so the scatter doesn't animate
    requestAnimationFrame(() => {
      cards.forEach((c) => {
        c.style.transition =
          'transform 1s cubic-bezier(.22,1,.36,1), opacity .7s ease';
      });
      g.style.transition = 'stroke-dashoffset 1.05s ease, opacity .8s ease';
      glow.style.transition = 'transform .8s ease, opacity .8s ease';
    });

    let on = false;
    let busy = false;
    const order = [0, 3, 1, 4, 2, 5];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };
    const setProgress = (k: number) => {
      cnt.textContent = k + '/6 направлений собрано';
      glow.style.transform = 'scale(' + (0.82 + 0.05 * k).toFixed(3) + ')';
      glow.style.opacity = String(Math.min(1, 0.32 + 0.11 * k));
      core.style.transform =
        'translate(-50%,-50%) scale(' + (0.9 + 0.017 * k).toFixed(3) + ')';
    };
    core.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    const sparkBurst = (count: number) => {
      for (let s = 0; s < count; s++) {
        const sp = document.createElement('div');
        const size = 3 + Math.random() * 5;
        const ang = Math.random() * Math.PI * 2;
        const dist = 70 + Math.random() * 150;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        const dur = 1100 + Math.random() * 900;
        const delay = Math.random() * 500;
        sp.style.cssText =
          'position:absolute;left:528px;top:292px;width:' +
          size.toFixed(1) +
          'px;height:' +
          size.toFixed(1) +
          'px;border-radius:50%;background:#EBE3FF;box-shadow:0 0 8px 2px rgba(167,139,250,.9);z-index:4;pointer-events:none;--dx:' +
          dx.toFixed(0) +
          'px;--dy:' +
          dy.toFixed(0) +
          'px;animation:mm-spark ' +
          dur +
          'ms ease-out ' +
          delay.toFixed(0) +
          'ms forwards;';
        stage.appendChild(sp);
        setTimeout(() => sp.remove(), dur + delay + 60);
      }
    };
    const setCard = (i: number, a: boolean) => {
      cards[i].style.transform = a ? arranged[i] : scattered[i];
      cards[i].style.opacity = a ? '1' : '.78';
      cards[i].style.background = a
        ? 'rgba(167,139,250,.2)'
        : 'rgba(167,139,250,.12)';
      cards[i].style.borderColor = a
        ? 'rgba(167,139,250,.55)'
        : 'rgba(167,139,250,.26)';
      lines[i].style.strokeDashoffset = a ? '0' : String(lineLen[i]);
      lines[i].style.opacity = a ? '.7' : '0';
      checks[i].style.opacity = a ? '1' : '0';
      checks[i].style.transform = a ? 'scale(1)' : 'scale(.4)';
    };
    const assemble = () => {
      if (on) return;
      on = true;
      busy = true;
      btn.textContent = 'Собираем…';
      btn.disabled = true;
      btn.style.opacity = '.65';
      btn.style.cursor = 'default';
      status.style.opacity = '1';
      status.textContent = 'Соединяем направления в одну систему…';
      order.forEach((ci, step) => {
        timers.push(
          setTimeout(
            () => {
              setCard(ci, true);
              setProgress(step + 1);
              if (step === order.length - 1) {
                busy = false;
                btn.textContent = 'Разобрать';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                status.textContent =
                  'Если это не помогает росту, то мы это не делаем';
                sparkBurst(26);
                timers.push(setTimeout(() => sparkBurst(18), 900));
                timers.push(
                  setTimeout(() => {
                    glow.style.animation =
                      'mm-core-breathe 4.5s ease-in-out infinite';
                  }, 1400)
                );
              }
            },
            180 + step * 260
          )
        );
      });
    };
    const disassemble = () => {
      if (busy) return;
      on = false;
      clearTimers();
      glow.style.animation = '';
      cards.forEach((_, i) => setCard(i, false));
      setProgress(0);
      btn.textContent = 'Собрать систему';
      status.textContent =
        'Нажмите «Собрать систему» — и направления соберутся в одну систему';
    };
    btn.addEventListener('click', () => {
      if (busy) return;
      on ? disassemble() : assemble();
    });

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
    io.observe(stage);

    return () => {
      clearTimers();
      io.disconnect();
      mount.innerHTML = '';
      delete mount.dataset.built;
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'relative', zIndex: 1 }} />;
}
