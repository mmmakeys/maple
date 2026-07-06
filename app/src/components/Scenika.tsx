import { useEffect, useRef, useState } from 'react';

const DISPLAY = "'Onest', sans-serif";
const RED = '#A31621';
const INK = '#111111';
const PAPER = '#FFFFFF';
const CREAM_LIGHT = '#F5F5F3';
const CREAM_LINE = '#D8D5CE';
const BORDER = '#E8E8E8';
const BLACK = '#0C0C0C';
const NEAR_BLACK = '#1C1C1C';
const MUTED = '#555';
const MUTED_DEEP = '#333';
const MUTED_DARK = '#9A9A9A';
const MUTED_LINE = '#3A3A3A';

const PAD_X = 'clamp(20px, 5vw, 64px)';

export default function Scenika() {
  useEffect(() => {
    document.title = 'Сценика — концертное агентство полного цикла';
  }, []);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: INK, background: PAPER }}>
      <ScenikaNav />
      <ScenikaHero />
      <FirstCall />
      <SecondCall />
      <MapleBridge />
      <ThirdCall />
      <AfterConcert />
      <Cases />
      <Numbers />
      <WhyStay />
      <FinalCta />
      <ScenikaFooter />
    </div>
  );
}

function ScenikaNav() {
  return (
    <div
      className="sc-nav"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `28px ${PAD_X}`,
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 20, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
        Сценика
      </div>
      <div className="sc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 14, letterSpacing: '0.04em' }}>
        <a href="#path" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Путь</a>
        <a href="#mechanism" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Механизм</a>
        <a href="#sold-out" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Sold Out</a>
        <a href="#cases" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Кейсы</a>
        <a href="#numbers" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Цифры</a>
        <a href="#contact" style={{ color: INK, textDecoration: 'none', border: `1px solid ${INK}`, padding: '10px 22px' }}>
          Обсудить тур
        </a>
      </div>
    </div>
  );
}

function ScenikaHero() {
  const beamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = beamRef.current;
    if (!el) return;
    let x = 50, y = 45, tx = 50, ty = 45, vx = 0, vy = 0, sincePick = 0;
    let raf = 0;
    const pick = () => { tx = 12 + Math.random() * 76; ty = 14 + Math.random() * 72; };
    const tick = () => {
      sincePick += 1;
      const dx = tx - x, dy = ty - y;
      if (Math.hypot(dx, dy) < 2.5 || sincePick > 900) { pick(); sincePick = 0; }
      vx = vx * 0.975 + dx * 0.0006 + (Math.random() - 0.5) * 0.02;
      vy = vy * 0.975 + dy * 0.0006 + (Math.random() - 0.5) * 0.02;
      x = Math.max(6, Math.min(94, x + vx));
      y = Math.max(8, Math.min(92, y + vy));
      el.style.background = `radial-gradient(circle 150px at ${x.toFixed(2)}% ${y.toFixed(2)}%, #ffffff 0, #ffffff 46%, rgba(255,255,255,0) 78%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `80px ${PAD_X} 100px`,
        background: INK,
        color: PAPER,
      }}
    >
      <div className="sc-mesh" aria-hidden>
        <div className="sc-mesh-blob sc-mesh-a" />
        <div className="sc-mesh-blob sc-mesh-b" />
        <div className="sc-mesh-blob sc-mesh-c" />
      </div>
      <div
        ref={beamRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          zIndex: 5,
          background: 'radial-gradient(circle 150px at 50% 45%, #ffffff 0, #ffffff 46%, rgba(255,255,255,0) 78%)',
        }}
      />
      <div className="sc-hero-bells" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 56, marginBottom: 48 }}>
        <span style={{ width: 10, height: 56, background: RED, transformOrigin: 'bottom', animation: 'sc-bell 2.4s ease-in-out infinite' }} />
        <span style={{ width: 10, height: 56, background: RED, transformOrigin: 'bottom', animation: 'sc-bell 2.4s ease-in-out 0.3s infinite' }} />
        <span style={{ width: 10, height: 56, background: RED, transformOrigin: 'bottom', animation: 'sc-bell 2.4s ease-in-out 0.6s infinite' }} />
      </div>
      <h1
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 'clamp(56px, 10vw, 148px)',
          lineHeight: 0.98,
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Сценика
      </h1>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 500,
          fontSize: 'clamp(22px, 3.4vw, 48px)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginTop: 28,
        }}
      >
        3 звонка до солдаута
      </div>
      <p style={{ fontSize: 19, lineHeight: 1.6, color: MUTED_DARK, maxWidth: 520, margin: '32px 0 0' }}>
        Концертное агентство полного цикла. Полностью организуем концертные туры — от первой идеи до полного зала.
      </p>
      <div style={{ marginTop: 48 }}>
        <a
          href="#contact"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            fontFamily: DISPLAY,
            fontWeight: 500,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: INK,
            background: PAPER,
            padding: '20px 44px',
          }}
        >
          Обсудить тур
        </a>
      </div>
    </div>
  );
}

const CALL_LABEL: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: RED,
};

const SECTION_H2: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  fontSize: 'clamp(32px, 5vw, 72px)',
  lineHeight: 1.05,
  textTransform: 'uppercase',
  margin: 0,
};

const FIRST_QUESTIONS = [
  'В какие города действительно стоит ехать?',
  'Какая площадка соберёт максимум зрителей?',
  'Сколько должен стоить билет?',
  'Когда лучше объявить тур?',
  'Где будет точка безубыточности?',
];

function QuestionTyper() {
  const [text, setText] = useState('');
  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'erasing'>('typing');

  useEffect(() => {
    const q = FIRST_QUESTIONS[qIdx];
    let timer = 0;
    if (phase === 'typing') {
      if (text.length < q.length) {
        timer = window.setTimeout(() => setText(q.slice(0, text.length + 1)), 55);
      } else {
        timer = window.setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      timer = window.setTimeout(() => setPhase('erasing'), 4000);
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(text.slice(0, -1)), 22);
      } else {
        timer = window.setTimeout(() => {
          setQIdx((qIdx + 1) % FIRST_QUESTIONS.length);
          setPhase('typing');
        }, 400);
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, qIdx]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 18px',
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        height: 52,
        fontSize: 'clamp(14px, 1.4vw, 17px)',
        lineHeight: 1.5,
        color: INK,
        background: PAPER,
        overflow: 'hidden',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
        <circle cx="11" cy="11" r="7" />
        <line x1="20" y1="20" x2="16" y2="16" />
      </svg>
      <span style={{ whiteSpace: 'nowrap', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {text}
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 2,
            height: '1em',
            background: INK,
            marginLeft: 1,
            verticalAlign: 'text-bottom',
            animation: 'sc-caret 1s steps(1) infinite',
          }}
        />
      </span>
    </div>
  );
}

function FirstCall() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const distance = Math.max(1, rect.height * 0.9);
      const scrolled = vh - rect.top;
      const raw = Math.max(0, Math.min(1, scrolled / distance));
      // Ease-out cubic — тяжёлая ткань уверенно доходит до центра
      const inv = 1 - raw;
      setProgress(1 - inv * inv * inv);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id="path"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: INK,
        padding: `120px ${PAD_X}`,
        scrollMarginTop: 24,
      }}
    >
      {(() => {
        // складки колышутся во время движения (несколько полу-волн за путь),
        // передний край постепенно теряет тень к моменту смыкания
        const swayL = Math.sin(progress * Math.PI * 3) * 10;
        const swayR = Math.sin(progress * Math.PI * 3 + 0.7) * 10;
        const edge = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.3);
        return (
          <>
            <div
              aria-hidden
              className="sc-curtain sc-curtain-l"
              style={{
                transform: `translateX(${-100 + progress * 100}%)`,
                backgroundPosition: `0px ${swayL}px`,
                ['--sc-curtain-edge' as string]: String(edge),
                ['--sc-curtain-mask-y' as string]: `${swayL}px`,
              } as React.CSSProperties}
            />
            <div
              aria-hidden
              className="sc-curtain sc-curtain-r"
              style={{
                transform: `translateX(${100 - progress * 100}%)`,
                backgroundPosition: `0px ${swayR}px`,
                ['--sc-curtain-edge' as string]: String(edge),
                ['--sc-curtain-mask-y' as string]: `${swayR}px`,
              } as React.CSSProperties}
            />
          </>
        );
      })()}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <div style={CALL_LABEL}>Первый звонок</div>
        <div style={{ flex: 1, height: 1, background: BORDER }} />
      </div>
      <h2 style={{ ...SECTION_H2, margin: '36px 0 0', maxWidth: 900 }}>
        До сцены начинается главное
      </h2>
      <div className="sc-first-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 64, alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED_DEEP, margin: 0 }}>
            Полный зал не появляется сам. Мы начинаем с вопросов, которые редко задают:
          </p>
          <div style={{ marginTop: 36 }}>
            <QuestionTyper />
          </div>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED_DEEP, margin: '36px 0 0' }}>
            Мы строим тур ещё до того, как появляются афиши.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { t: 'Аналитика', c: INK },
            { t: 'Экономика', c: '#C9C9C9' },
            { t: 'Маршрут', c: INK },
            { t: 'Площадки', c: '#C9C9C9' },
            { t: 'Спрос', c: INK },
            { t: 'Стратегия', c: RED },
          ].map((w) => (
            <div
              key={w.t}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 'clamp(28px, 3.6vw, 54px)',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                color: w.c,
              }}
            >
              {w.t}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function SecondCall() {
  const [activated, setActivated] = useState<Set<number>>(new Set());
  const [hovered, setHovered] = useState<number>(-1);

  const activate = (i: number) =>
    setActivated((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  const reset = () => setActivated(new Set());

  const cx = 500, cy = 285, rx = 320, ry = 220, N = 8;
  const nodeSpec: Array<{ label: string; desc: string; icon: string }> = [
    { label: 'Площадки', desc: 'Выбираем города, даты и залы под реальный спрос', icon: 'M4 20V10L12 4L20 10V20H4Z M9 20V15H15V20' },
    { label: 'Билеты', desc: 'Заводим билетный стол и контролируем продажи', icon: 'M3 8H21V16H3Z M9 8V10 M9 12V14 M14 8V10 M14 12V14' },
    { label: 'Договоры', desc: 'Закрываем юридический и финансовый контур', icon: 'M6 4H14L18 8V20H6Z M14 4V8H18 M9 12H15 M9 15H13' },
    { label: 'Реклама', desc: 'Запускаем digital, наружку и локальные кампании', icon: 'M3 12L15 6V18Z M15 10V14 M18 8V16' },
    { label: 'PR и медиа', desc: 'Подключаем СМИ, радио и инфопартнёров', icon: 'M9 4H15V13H9Z M6 12A6 6 0 0018 12 M12 18V21' },
    { label: 'Райдеры', desc: 'Собираем технические и бытовые требования', icon: 'M6 5H18V20H6Z M10 3H14V6H10Z M9 11H15 M9 14H14' },
    { label: 'Логистика', desc: 'Планируем перемещения, тайминги и сопровождение', icon: 'M2 8H13V16H2Z M13 12H17L20 15V16H13Z M6 20A2 2 0 106 16 A2 2 0 106 20 Z M18 20A2 2 0 1018 16 A2 2 0 1018 20 Z' },
    { label: 'Турменеджмент', desc: 'Контролируем день события и работу на площадке', icon: 'M12 3A6 6 0 0118 9C18 13 12 21 12 21C12 21 6 13 6 9A6 6 0 0112 3Z M12 7A2 2 0 1012 11 A2 2 0 1012 7 Z' },
  ];
  const pts = nodeSpec.map(({ label, desc, icon }, i) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    return { label, desc, icon, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  const bezierPath = (x1: number, y1: number, x2: number, y2: number, bend = 34) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const perpX = -dy / len, perpY = dx / len;
    const cpx = mx + perpX * bend, cpy = my + perpY * bend;
    return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  };
  const allDone = activated.size === N;
  const anyActive = activated.size > 0;

  return (
    <div id="mechanism" style={{ background: '#F8F8F8', color: INK, padding: `120px ${PAD_X}`, scrollMarginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <div style={CALL_LABEL}>Второй звонок</div>
        <div style={{ flex: 1, height: 1, background: CREAM_LINE }} />
      </div>
      <h2 style={{ ...SECTION_H2, margin: '36px 0 0', maxWidth: 900 }}>Запускаем механизм полного зала</h2>
      <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED, maxWidth: 720, margin: '28px 0 0' }}>
        Пока артист готовит шоу, мы собираем всё, что должно сработать за кулисами. Продюсирование мероприятий «под ключ»: работа с артистами и их командами, маркетинг и продвижение, управление билетным столом.
      </p>
      <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED, maxWidth: 720, margin: '20px 0 0' }}>
        Площадки, билеты, договоры, реклама, PR, медиа, райдеры, логистика — каждая часть должна включиться вовремя.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 44, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <svg
            viewBox="0 0 100 100"
            width="42"
            height="42"
            fill="none"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              transformOrigin: '50% 50%',
              animation: anyActive ? 'sc-gear-cw 3.2s linear infinite' : undefined,
            }}
          >
            <circle cx="50" cy="50" r="26" />
            <circle cx="50" cy="50" r="7" fill={INK} stroke="none" />
            {gearTeeth}
          </svg>
          <svg
            viewBox="0 0 100 100"
            width="30"
            height="30"
            fill="none"
            stroke={RED}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              transformOrigin: '50% 50%',
              marginLeft: -6,
              animation: anyActive ? 'sc-gear-ccw 2.1s linear infinite' : undefined,
            }}
          >
            <circle cx="50" cy="50" r="26" />
            <circle cx="50" cy="50" r="7" fill={RED} stroke="none" />
            {gearTeeth}
          </svg>
        </div>
        <span style={{ fontSize: 16, color: allDone ? RED : '#8A8A8A', letterSpacing: '0.02em', fontWeight: allDone ? 700 : 400 }}>
          {allDone ? 'Механизм запущен.' : anyActive ? `Собрано ${activated.size} из ${N}` : 'Наведи или нажми на элемент'}
        </span>
        {anyActive && (
          <button
            onClick={reset}
            style={{
              cursor: 'pointer',
              fontSize: 14,
              background: 'transparent',
              border: 'none',
              color: MUTED,
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            сбросить
          </button>
        )}
      </div>

      <div style={{ marginTop: 32, position: 'relative', maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
        <svg viewBox="0 0 1000 570" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          {/* Bezier connectors from activated nodes to hub */}
          <g fill="none" strokeLinecap="round">
            {pts.map((pt, i) => {
              if (!activated.has(i)) return null;
              const d = bezierPath(pt.x, pt.y, cx, cy);
              return (
                <g key={i}>
                  <path d={d} stroke={RED} strokeWidth="2" opacity="0.85" />
                  <path
                    d={d}
                    stroke="#FF6B6B"
                    strokeWidth="4"
                    pathLength="100"
                    strokeDasharray="6 94"
                    style={{
                      animation: 'sc-pulse-flow 1.8s linear infinite',
                      animationDelay: `${(i * 0.15).toFixed(2)}s`,
                    }}
                  />
                </g>
              );
            })}
          </g>
          {/* Culmination — expanding rings when all activated */}
          {allDone && (
            <g fill="none" stroke={RED} strokeWidth="2">
              <circle cx={cx} cy={cy} r="48" opacity="0">
                <animate attributeName="r" from="48" to="150" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="48" opacity="0">
                <animate attributeName="r" from="48" to="150" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
          {/* Nodes — badges with icons */}
          {pts.map((pt, i) => {
            const lit = activated.has(i) || hovered === i;
            return (
              <g key={i}>
                <circle
                  cx={pt.x.toFixed(1)}
                  cy={pt.y.toFixed(1)}
                  r="20"
                  fill={lit ? RED : PAPER}
                  stroke={lit ? RED : '#C7C3BB'}
                  strokeWidth="2.4"
                  style={{ transition: 'fill 240ms ease, stroke 240ms ease' }}
                />
                <g
                  transform={`translate(${(pt.x - 12).toFixed(1)}, ${(pt.y - 12).toFixed(1)})`}
                  fill="none"
                  stroke={lit ? PAPER : INK}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'stroke 240ms ease' }}
                >
                  <path d={pt.icon} />
                </g>
              </g>
            );
          })}
          {/* Hub */}
          <circle
            cx={cx}
            cy={cy}
            r="52"
            fill={allDone ? RED : PAPER}
            stroke={RED}
            strokeWidth="3"
            style={{ transition: 'fill 400ms ease' }}
          />
          <text
            x={cx}
            y={cy + 11}
            fill={allDone ? PAPER : RED}
            fontFamily={DISPLAY}
            fontSize="30"
            textAnchor="middle"
            letterSpacing="2"
            style={{ transition: 'fill 400ms ease' }}
          >
            ШОУ
          </text>
        </svg>
        <div style={{ position: 'absolute', inset: '16px 12px' }}>
          {pts.map((pt, i) => {
            const lit = activated.has(i) || hovered === i;
            const nxp = (pt.x / 1000) * 100;
            const nyp = (pt.y / 570) * 100;
            const isUpper = pt.y < cy;
            // Side classification — horizontal-dominant nodes anchor the label
            // by their outer edge so the description grows outward, not into
            // the SVG center.
            const HORIZ_TOLERANCE = 80;
            const isRight = pt.x - cx > HORIZ_TOLERANCE;
            const isLeft = cx - pt.x > HORIZ_TOLERANCE;
            const horizAnchor: 'left' | 'right' | 'center' = isRight ? 'left' : isLeft ? 'right' : 'center';
            // Nudge the label away from the node by a fixed viewBox offset.
            const OFFSET = 52;
            const labelX = isRight ? pt.x + OFFSET : isLeft ? pt.x - OFFSET : pt.x;
            const lxp = (labelX / 1000) * 100;
            const labelY = horizAnchor === 'center'
              ? (isUpper ? pt.y - 40 : pt.y + 40)
              : pt.y;
            const lyp = (labelY / 570) * 100;
            const translateX =
              horizAnchor === 'left' ? '0' : horizAnchor === 'right' ? '-100%' : '-50%';
            const translateY =
              horizAnchor === 'center'
                ? (isUpper ? '-100%' : '0')
                : '-50%';
            const flexDir =
              horizAnchor === 'center'
                ? (isUpper ? 'column-reverse' : 'column')
                : 'column';
            const alignItems =
              horizAnchor === 'left'
                ? 'flex-start'
                : horizAnchor === 'right'
                ? 'flex-end'
                : 'center';
            const textAlign: React.CSSProperties['textAlign'] =
              horizAnchor === 'left'
                ? 'left'
                : horizAnchor === 'right'
                ? 'right'
                : 'center';
            return (
              <div key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${lxp.toFixed(2)}%`,
                    top: `${lyp.toFixed(2)}%`,
                    transform: `translate(${translateX}, ${translateY})`,
                    display: 'flex',
                    flexDirection: flexDir,
                    alignItems,
                    gap: 4,
                    width: 180,
                    textAlign,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: '0.01em',
                      color: lit ? RED : '#8A857C',
                      whiteSpace: 'nowrap',
                      transition: 'color 200ms ease',
                    }}
                  >
                    {pt.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: 12,
                      lineHeight: 1.35,
                      color: MUTED,
                      maxWidth: 180,
                      opacity: lit ? 1 : 0,
                      transform: `translateY(${lit ? '0' : horizAnchor === 'center' && isUpper ? '4px' : '-4px'})`,
                      transition: 'opacity 220ms ease, transform 220ms ease',
                    }}
                  >
                    {pt.desc}
                  </div>
                </div>
                <button
                  aria-label={pt.label}
                  onMouseEnter={() => { setHovered(i); activate(i); }}
                  onMouseLeave={() => setHovered(-1)}
                  onFocus={() => { setHovered(i); activate(i); }}
                  onBlur={() => setHovered(-1)}
                  onClick={() => activate(i)}
                  style={{
                    position: 'absolute',
                    left: `${nxp.toFixed(2)}%`,
                    top: `${nyp.toFixed(2)}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 120,
                    height: 90,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: 18, color: MUTED, margin: '40px 0 0', maxWidth: 720 }}>
        Мы не ведём концерт по списку задач. Мы собираем систему, в которой тур начинает продаваться, двигаться и расти.
      </p>
    </div>
  );
}

const MAPLE_VIOLET_400 = '#B8A6F5';
const MAPLE_VIOLET_500 = '#8B5CF6';
const MAPLE_INK_900 = '#161020';
const MAPLE_INK_100 = '#F4F0FB';
const MAPLE_INK_400 = '#9B92B0';

function MapleBridge() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

  const headerAppear = range(progress, 0, 0.12);
  const linesProgress = easeOut(range(progress, 0.22, 0.62));
  const centerAppear = easeOut(range(progress, 0.55, 0.82));
  const bottomAppear = range(progress, 0.78, 0.95);

  const LINE_LEN = 260;

  return (
    <div
      id="maple"
      ref={rootRef}
      style={{ background: MAPLE_INK_900, color: MAPLE_INK_100, position: 'relative', height: '280vh', scrollMarginTop: 24 }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: `72px ${PAD_X}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${MAPLE_VIOLET_500}55, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            opacity: headerAppear,
            transform: `translateY(${(1 - headerAppear) * 12}px)`,
            transition: 'opacity 200ms ease, transform 200ms ease',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: MAPLE_VIOLET_400,
              border: `1px solid ${MAPLE_VIOLET_400}`,
              padding: '8px 16px',
              borderRadius: 999,
            }}
          >
            Сценика × Мэпл
          </span>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: 'clamp(34px, 5.4vw, 76px)',
              lineHeight: 1.02,
              letterSpacing: '0.03em',
              margin: '28px 0 0',
              maxWidth: 900,
            }}
          >
            Один механизм.<br />
            <span style={{ color: MAPLE_VIOLET_400 }}>Два контура.</span>
          </h2>
        </div>

        <div style={{ flex: 1, position: 'relative', marginTop: 32, minHeight: 260 }}>
          <svg
            viewBox="0 0 1000 420"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <line
              x1="260"
              y1="180"
              x2="500"
              y2="180"
              stroke={MAPLE_VIOLET_400}
              strokeWidth="3"
              strokeDasharray={LINE_LEN}
              strokeDashoffset={LINE_LEN * (1 - linesProgress)}
              strokeLinecap="round"
            />
            <line
              x1="740"
              y1="180"
              x2="500"
              y2="180"
              stroke={RED}
              strokeWidth="3"
              strokeDasharray={LINE_LEN}
              strokeDashoffset={LINE_LEN * (1 - linesProgress)}
              strokeLinecap="round"
            />

            <g transform="translate(180, 148) scale(1.6)">
              <path
                d="M 37.80 14.47 C 38.73 17.75, 36.04 22.40, 33.85 25.78 C 31.66 29.15, 28.32 33.93, 24.68 34.72 C 21.03 35.51, 15.68 32.54, 11.96 30.50 C 8.25 28.46, 3.41 25.74, 2.37 22.49 C 1.32 19.24, 3.56 14.41, 5.70 10.99 C 7.85 7.57, 11.47 2.79, 15.24 1.98 C 19.00 1.17, 24.54 4.02, 28.30 6.10 C 32.06 8.18, 36.88 11.19, 37.80 14.47 Z"
                fill={MAPLE_VIOLET_500}
              />
              <path
                d="M 8.5 28.5 C 9.50 26.08, 12.42 15.17, 14.50 14.00 C 16.58 12.83, 18.33 22.42, 21.00 21.50 C 23.67 20.58, 28.92 10.67, 30.50 8.50"
                fill="none"
                stroke={MAPLE_INK_900}
                strokeWidth="4.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
            <text
              x="212"
              y="272"
              fill={MAPLE_INK_100}
              fontFamily={DISPLAY}
              fontSize="24"
              textAnchor="middle"
              letterSpacing="2"
            >
              МЭПЛ
            </text>
            <text
              x="212"
              y="302"
              fill={MAPLE_INK_400}
              fontFamily="'Manrope', sans-serif"
              fontSize="14"
              textAnchor="middle"
            >
              собирает систему
            </text>

            <g transform="translate(768, 148)">
              <rect x="0" y="0" width="10" height="64" fill={RED} />
              <rect x="20" y="0" width="10" height="64" fill={RED} />
              <rect x="40" y="0" width="10" height="64" fill={RED} />
            </g>
            <text
              x="793"
              y="272"
              fill={MAPLE_INK_100}
              fontFamily={DISPLAY}
              fontSize="24"
              textAnchor="middle"
              letterSpacing="2"
            >
              СЦЕНИКА
            </text>
            <text
              x="793"
              y="302"
              fill={MAPLE_INK_400}
              fontFamily="'Manrope', sans-serif"
              fontSize="14"
              textAnchor="middle"
            >
              собирает тур
            </text>

            <circle cx="500" cy="180" r="9" fill={MAPLE_INK_100} opacity={centerAppear} />
            <circle
              cx="500"
              cy="180"
              r="26"
              fill="none"
              stroke={MAPLE_INK_100}
              strokeWidth="1.5"
              opacity={centerAppear * 0.4}
            />
            <text
              x="500"
              y="248"
              fill={MAPLE_INK_100}
              fontFamily={DISPLAY}
              fontSize="30"
              textAnchor="middle"
              letterSpacing="4"
              opacity={centerAppear}
            >
              ПОЛНЫЙ ЗАЛ
            </text>
          </svg>
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 32,
            flexWrap: 'wrap',
            opacity: bottomAppear,
            transform: `translateY(${(1 - bottomAppear) * 10}px)`,
            transition: 'opacity 200ms ease, transform 200ms ease',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.65,
              color: MAPLE_INK_400,
              maxWidth: 620,
            }}
          >
            МЭПЛ собирает систему. СЦЕНИКА собирает тур.{' '}
            <span style={{ color: MAPLE_INK_100, fontWeight: 800 }}>Вместе собираем зал.</span>
          </p>
          <a
            href="/"
            style={{
              textDecoration: 'none',
              background: MAPLE_VIOLET_500,
              color: MAPLE_INK_100,
              fontWeight: 800,
              fontSize: 15,
              padding: '14px 26px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            Открыть страницу МЭПЛ →
          </a>
        </div>
      </div>
    </div>
  );
}

const gearTeeth = (
  <>
    <line x1="76" y1="50" x2="88" y2="50" />
    <line x1="68.4" y1="68.4" x2="76.9" y2="76.9" />
    <line x1="50" y1="76" x2="50" y2="88" />
    <line x1="31.6" y1="68.4" x2="23.1" y2="76.9" />
    <line x1="24" y1="50" x2="12" y2="50" />
    <line x1="31.6" y1="31.6" x2="23.1" y2="23.1" />
    <line x1="50" y1="24" x2="50" y2="12" />
    <line x1="68.4" y1="31.6" x2="76.9" y2="23.1" />
  </>
);

function ThirdCall() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(1, rect.height - vh);
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
      setVw(window.innerWidth);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

  const bigFS = Math.max(44, Math.min(96, vw * 0.062));
  const smallFS = 20;

  const texts = [
    { label: 'Двери закрываются.',       appear: [0.02, 0.10] as const, settle: [0.12, 0.20] as const, settleTop: 30 },
    { label: 'Зал заполнен.',            appear: [0.22, 0.30] as const, settle: [0.32, 0.40] as const, settleTop: 37 },
    { label: 'Артист выходит на сцену.', appear: [0.42, 0.50] as const, settle: [0.52, 0.60] as const, settleTop: 44 },
  ];

  const soldOutAppear = easeOut(range(progress, 0.62, 0.74));
  const descAppear = range(progress, 0.76, 0.86);
  const beamOpacity = easeOut(range(progress, 0.66, 0.96));

  return (
    <div
      id="sold-out"
      ref={rootRef}
      style={{
        background: BLACK,
        color: '#F5F5F3',
        position: 'relative',
        height: '520vh',
        scrollMarginTop: 24,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-20%',
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 42% 68% at 50% 28%, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 75%)',
            filter: 'blur(40px)',
            opacity: beamOpacity,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            top: '14vh',
            ...CALL_LABEL,
          }}
        >
          Третий звонок
        </div>

        {texts.map((t, i) => {
          const appear = range(progress, t.appear[0], t.appear[1]);
          const settle = easeOut(range(progress, t.settle[0], t.settle[1]));
          const fontSize = lerp(bigFS, smallFS, settle);
          const top = lerp(50, t.settleTop, settle);
          const ty = lerp(-50, 0, settle);
          const color = settle > 0.85 ? MUTED_DARK : '#F5F5F3';
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: PAD_X,
                top: `${top}%`,
                transform: `translate(0, ${ty}%)`,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 300,
                fontSize: `${fontSize}px`,
                letterSpacing: '-0.005em',
                lineHeight: 1.15,
                opacity: appear,
                color,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                transition: 'color 300ms ease',
              }}
            >
              {t.label}
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            top: '58vh',
            transformOrigin: 'left top',
            transform: `scale(${lerp(0.72, 1, soldOutAppear)}) translateY(${lerp(24, 0, soldOutAppear)}px)`,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 'clamp(64px, 12vw, 184px)',
            textTransform: 'uppercase',
            color: RED,
            letterSpacing: '0.04em',
            lineHeight: 0.98,
            opacity: soldOutAppear,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Sold Out
        </div>

        <p
          style={{
            position: 'absolute',
            left: PAD_X,
            bottom: '12vh',
            margin: 0,
            transform: `translateY(${lerp(24, 0, descAppear)}px)`,
            fontSize: 18,
            lineHeight: 1.65,
            color: MUTED_DARK,
            maxWidth: 460,
            opacity: descAppear,
            pointerEvents: 'none',
          }}
        >
          Это единственная часть работы, которую видит зритель. Всё остальное уже произошло.
        </p>
      </div>
    </div>
  );
}

function AfterConcert() {
  const items = [
    { t: 'логистика', hi: false },
    { t: 'отчёты', hi: false },
    { t: 'закрывающие документы', hi: false },
    { t: 'финансы', hi: false },
    { t: 'следующий город', hi: true },
    { t: 'следующий концерт', hi: true },
    { t: 'следующий солдаут', hi: true },
  ];
  return (
    <div style={{ background: NEAR_BLACK, color: '#F5F5F3', padding: `120px ${PAD_X}` }}>
      <h2 style={{ ...SECTION_H2, fontSize: 'clamp(28px, 4.4vw, 64px)', lineHeight: 1.08, maxWidth: 880 }}>
        Пока зритель смотрит шоу, мы продолжаем работать
      </h2>
      <p style={{ fontSize: 19, color: MUTED_DARK, margin: '28px 0 0' }}>
        Концерт не заканчивается аплодисментами. После него начинается:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 44, maxWidth: 900 }}>
        {items.map((it) => (
          <div
            key={it.t}
            style={{
              border: `1px solid ${it.hi ? RED : MUTED_LINE}`,
              background: it.hi ? RED : 'transparent',
              color: it.hi ? PAPER : '#F5F5F3',
              padding: '14px 24px',
              fontSize: 17,
            }}
          >
            {it.t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cases() {
  const rows = [
    { name: 'Павел Воля', meta: 'организация туров' },
    { name: 'Ляйсан Утяшева', meta: 'Bolero, Carmen P.S.' },
    { name: 'Егор Дружинин', meta: 'театральные постановки и мюзиклы' },
    { name: 'Nelson, Максим Свобода, Кристина Кошелева', meta: 'и многие другие' },
  ];
  return (
    <div id="cases" style={{ padding: `120px ${PAD_X}`, scrollMarginTop: 24 }}>
      <h2 style={{ ...SECTION_H2 }}>Мы уже проходили этот путь</h2>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 64 }}>
        {rows.map((r, i, arr) => (
          <div
            key={r.name}
            className="sc-case-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 24,
              alignItems: 'baseline',
              padding: '30px 0',
              borderTop: `1px solid ${BORDER}`,
              borderBottom: i === arr.length - 1 ? `1px solid ${BORDER}` : undefined,
            }}
          >
            <div style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(22px, 3vw, 44px)', textTransform: 'uppercase' }}>
              {r.name}
            </div>
            <div style={{ fontSize: 16, color: '#777' }}>{r.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Numbers() {
  const stats = [
    { value: 300, suffix: '+', label: 'мероприятий' },
    { value: 50, suffix: '+', label: 'городов' },
    { value: 3000000, suffix: '+', label: 'зрителей' },
    { value: 400000, suffix: '+', label: 'проданных билетов' },
    { value: 23000, suffix: '', label: 'зрителей на одной площадке' },
    { value: 95, suffix: '%', label: 'средняя заполняемость', hi: true },
  ];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let triggered = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!triggered && entries[0].isIntersecting) {
          triggered = true;
          const t0 = performance.now();
          const DUR = 1800;
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / DUR);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(eased);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const format = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <div
      id="numbers"
      ref={rootRef}
      style={{ padding: `100px ${PAD_X} 120px`, borderTop: `1px solid ${BORDER}`, scrollMarginTop: 24 }}
    >
      <div className="sc-numbers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '56px 40px' }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 'clamp(36px, 4.6vw, 68px)',
                lineHeight: 1,
                color: s.hi ? RED : INK,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {format(s.value * progress)}
              {s.suffix}
            </div>
            <div style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyStay() {
  return (
    <div style={{ background: CREAM_LIGHT, padding: `120px ${PAD_X}` }}>
      <h2 style={{ ...SECTION_H2, maxWidth: 920 }}>Почему артисты остаются с нами</h2>
      <div className="sc-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 56, alignItems: 'start' }}>
        <p style={{ fontSize: 20, lineHeight: 1.65, color: MUTED_DEEP, margin: 0 }}>
          Не потому что мы делаем концерты. Потому что мы снимаем с них всё, кроме сцены.
        </p>
        <div>
          <p style={{ fontSize: 17, color: '#777', margin: '0 0 20px' }}>Мы не просим артиста думать:</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {['о билетах', 'о договорах', 'о рекламе', 'о райдере'].map((t, i, arr) => (
              <div
                key={t}
                style={{
                  padding: '14px 0',
                  borderTop: '1px solid #DDD',
                  borderBottom: i === arr.length - 1 ? '1px solid #DDD' : undefined,
                  fontSize: 18,
                  color: '#999',
                  textDecoration: 'line-through',
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, color: INK, margin: '28px 0 0' }}>
            Мы просим только выйти на сцену.
          </p>
        </div>
      </div>
    </div>
  );
}

function FinalCta() {
  return (
    <div id="contact" style={{ background: BLACK, color: '#F5F5F3', padding: `140px ${PAD_X}`, scrollMarginTop: 24 }}>
      <h2
        style={{
          ...SECTION_H2,
          fontSize: 'clamp(36px, 6vw, 88px)',
          lineHeight: 1.02,
          maxWidth: 1000,
        }}
      >
        Давайте соберём следующий полный зал
      </h2>
      <p style={{ fontSize: 19, color: MUTED_DARK, margin: '32px 0 0' }}>Расскажите о вашем шоу.</p>
      <div style={{ marginTop: 48 }}>
        <a
          href="mailto:hello@scenika.ru"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            fontFamily: DISPLAY,
            fontWeight: 500,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: BLACK,
            background: '#F5F5F3',
            padding: '20px 44px',
          }}
        >
          Обсудить тур
        </a>
      </div>
    </div>
  );
}

function ScenikaFooter() {
  return (
    <div
      className="sc-footer"
      style={{
        background: BLACK,
        color: '#666',
        padding: `32px ${PAD_X}`,
        borderTop: '1px solid #222',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F5F5F3' }}>
        Сценика
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>Концертное агентство полного цикла</span>
        <a href="/" style={{ color: '#666', textDecoration: 'none' }}>Мэпл — digital →</a>
      </div>
    </div>
  );
}
