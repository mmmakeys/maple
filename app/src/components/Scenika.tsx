import { useEffect, useRef, useState } from 'react';

const DISPLAY = "'Russo One', sans-serif";
const RED = '#A31621';
const INK = '#111111';
const PAPER = '#FFFFFF';
const CREAM = '#EFEDE8';
const CREAM_LIGHT = '#F5F5F3';
const CREAM_SOFT = '#FBFAF7';
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
      <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
        Сценика
      </div>
      <div className="sc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 40, fontSize: 14, letterSpacing: '0.04em' }}>
        <a href="#path" className="sc-nav-anchor" style={{ color: MUTED, textDecoration: 'none' }}>Путь</a>
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
          fontWeight: 700,
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
  fontWeight: 600,
  fontSize: 15,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: RED,
};

const SECTION_H2: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
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
      // Ease-out quadratic: shutters close gently early, snap shut near the end
      // so that "почти полностью белый" is reached by ~90% of the way through.
      setProgress(1 - (1 - raw) * (1 - raw));
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
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: PAPER,
          transform: `translateX(${-100 + progress * 100}%)`,
          willChange: 'transform',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: PAPER,
          transform: `translateX(${100 - progress * 100}%)`,
          willChange: 'transform',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
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
                fontWeight: 600,
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
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef(0);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setProgress(0);
  };

  const start = () => {
    setRunning(true);
    const t0 = performance.now();
    const DUR = 2600;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const cx = 500, cy = 235, rx = 385, ry = 158, N = 8;
  const names = ['Площадки', 'Билетный стол', 'Договоры', 'Реклама', 'PR и СМИ', 'Радио · блогеры', 'Наружная · digital', 'Райдер'];
  const pts = names.map((label, i) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
    return { label, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  const conn: Array<[number, number, number, number]> = [];
  for (let i = 0; i < N; i++) { const b = pts[i], c = pts[(i + 1) % N]; conn.push([b.x, b.y, c.x, c.y]); }
  for (let i = 0; i < N; i++) { const b = pts[i]; conn.push([b.x, b.y, cx, cy]); }
  const M = conn.length;

  return (
    <div style={{ background: CREAM, color: INK, padding: `120px ${PAD_X}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
        <div style={CALL_LABEL}>Второй звонок</div>
        <div style={{ flex: 1, height: 1, background: CREAM_LINE }} />
      </div>
      <h2 style={{ ...SECTION_H2, margin: '36px 0 0' }}>Теперь начинается работа</h2>
      <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED, maxWidth: 560, margin: '28px 0 0' }}>
        Пока артист репетирует, мы запускаем весь механизм. Продюсирование мероприятий «под ключ»: работа с артистами и их командами, маркетинг и продвижение, управление билетным столом.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 44, flexWrap: 'wrap' }}>
        <button
          onClick={() => (running ? stop() : start())}
          style={{
            cursor: 'pointer',
            fontFamily: DISPLAY,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: PAPER,
            background: INK,
            border: 'none',
            padding: '16px 30px',
          }}
        >
          {running ? 'Сбросить' : 'Запустить механизм'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <svg
            viewBox="0 0 100 100"
            width="48"
            height="48"
            fill="none"
            stroke={INK}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              transformOrigin: '50% 50%',
              animation: running ? 'sc-gear-cw 3.2s linear infinite' : undefined,
            }}
          >
            <circle cx="50" cy="50" r="26" />
            <circle cx="50" cy="50" r="7" fill={INK} stroke="none" />
            {gearTeeth}
          </svg>
          <svg
            viewBox="0 0 100 100"
            width="34"
            height="34"
            fill="none"
            stroke={RED}
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              transformOrigin: '50% 50%',
              marginLeft: -6,
              animation: running ? 'sc-gear-ccw 2.1s linear infinite' : undefined,
            }}
          >
            <circle cx="50" cy="50" r="26" />
            <circle cx="50" cy="50" r="7" fill={RED} stroke="none" />
            {gearTeeth}
          </svg>
        </div>
        <span style={{ fontSize: 16, color: '#8A8A8A', letterSpacing: '0.02em' }}>
          {progress >= 1 ? 'Тур собран — всё соединено в одну систему' : running ? 'Соединяем маршрут…' : 'Механизм остановлен'}
        </span>
      </div>

      <div style={{ marginTop: 28, background: CREAM_SOFT, border: `1px solid ${CREAM_LINE}`, padding: '16px 12px', position: 'relative' }}>
        <svg viewBox="0 0 1000 470" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <g stroke={RED} strokeWidth="2.4" strokeLinecap="round" fill="none">
            {conn.map((c, i) => {
              const len = Math.hypot(c[2] - c[0], c[3] - c[1]);
              const local = Math.max(0, Math.min(1, progress * M - i));
              return (
                <line
                  key={i}
                  x1={c[0].toFixed(1)}
                  y1={c[1].toFixed(1)}
                  x2={c[2].toFixed(1)}
                  y2={c[3].toFixed(1)}
                  strokeDasharray={len.toFixed(1)}
                  strokeDashoffset={(len * (1 - local)).toFixed(1)}
                />
              );
            })}
          </g>
          {pts.map((pt, i) => {
            const lit = Math.max(0, Math.min(1, progress * M - (N + i))) > 0.5;
            return (
              <circle
                key={i}
                cx={pt.x.toFixed(1)}
                cy={pt.y.toFixed(1)}
                r="9"
                fill={lit ? RED : CREAM_SOFT}
                stroke={lit ? RED : '#C7C3BB'}
                strokeWidth="2.4"
              />
            );
          })}
          <circle cx={cx} cy={cy} r="48" fill={progress > 0.8 ? RED : CREAM} stroke={RED} strokeWidth="3" />
          {progress > 0.8 && (
            <text x={cx} y={cy + 10} fill={PAPER} fontFamily={DISPLAY} fontSize="30" textAnchor="middle" letterSpacing="2">
              ШОУ
            </text>
          )}
        </svg>
        <div style={{ position: 'absolute', inset: '16px 12px', pointerEvents: 'none' }}>
          {pts.map((pt, i) => {
            const lit = Math.max(0, Math.min(1, progress * M - (N + i))) > 0.5;
            const lxp = ((cx + (pt.x - cx) * 1.12) / 1000) * 100;
            const lyp = ((pt.y > cy ? pt.y + 34 : pt.y - 26) / 470) * 100;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${lxp.toFixed(2)}%`,
                  top: `${lyp.toFixed(2)}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  color: lit ? RED : '#8A857C',
                  whiteSpace: 'nowrap',
                }}
              >
                {pt.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 18, color: MUTED, margin: 0 }}>
          Всё это — одна система. И она должна работать одновременно.
        </p>
        <a
          href="/"
          style={{
            textDecoration: 'none',
            color: INK,
            fontSize: 15,
            letterSpacing: '0.06em',
            border: '1px solid #BBB',
            padding: '12px 22px',
          }}
        >
          Digital-контур ведёт Сценика × Мэпл →
        </a>
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
  return (
    <div
      style={{
        background: BLACK,
        color: '#F5F5F3',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `120px ${PAD_X}`,
      }}
    >
      <div style={CALL_LABEL}>Третий звонок</div>
      <div style={{ fontSize: 20, lineHeight: 2, color: MUTED_DARK, marginTop: 40, maxWidth: 520 }}>
        Двери закрываются.<br />
        Зал заполнен.<br />
        Артист выходит на сцену.
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 'clamp(64px, 12vw, 184px)',
          lineHeight: 0.98,
          textTransform: 'uppercase',
          color: RED,
          marginTop: 48,
          letterSpacing: '0.04em',
        }}
      >
        Sold Out
      </div>
      <p style={{ fontSize: 18, lineHeight: 1.65, color: MUTED_DARK, margin: '48px 0 0', maxWidth: 460 }}>
        Это единственная часть работы, которую видит зритель. Всё остальное уже произошло.
      </p>
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
    { n: '300+', t: 'мероприятий' },
    { n: '50+', t: 'городов' },
    { n: '3 000 000+', t: 'зрителей' },
    { n: '400 000+', t: 'проданных билетов' },
    { n: '23 000', t: 'зрителей на одной площадке' },
    { n: '95%', t: 'средняя заполняемость', hi: true },
  ];
  return (
    <div id="numbers" style={{ padding: `100px ${PAD_X} 120px`, borderTop: `1px solid ${BORDER}`, scrollMarginTop: 24 }}>
      <div className="sc-numbers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '56px 40px' }}>
        {stats.map((s) => (
          <div key={s.n}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 'clamp(36px, 4.6vw, 68px)',
                lineHeight: 1,
                color: s.hi ? RED : INK,
              }}
            >
              {s.n}
            </div>
            <div style={{ fontSize: 16, color: '#777', marginTop: 10 }}>{s.t}</div>
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
          <p style={{ fontSize: 20, fontWeight: 600, color: INK, margin: '28px 0 0' }}>
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
      <div style={{ fontFamily: DISPLAY, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F5F5F3' }}>
        Сценика
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>Концертное агентство полного цикла</span>
        <a href="/" style={{ color: '#666', textDecoration: 'none' }}>Мэпл — digital →</a>
      </div>
    </div>
  );
}
