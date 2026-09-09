import { useEffect, useRef, useState } from 'react';
import { typo } from '../../../shared/typo';

/** Ссылка на сайт агентства: «Сценика» живёт на своём домене. */
const MAPLE_HOME = 'https://maple-media.ru/';

const DISPLAY = "'Onest', sans-serif";
/**
 * Единственный фирменный красный: oklch(0.556 0.216 20.8).
 *
 * Раньше их было три — свой для светлого фона, свой для тёмного и свой для
 * полосы, и это читалось как три разных красных. Этот подобран так, чтобы
 * работать везде: белый на нём 4.96, он же текстом на белом 4.96 и на
 * кремовом 4.55 — везде AA. На тёмных поверхностях даёт 3.43, поэтому
 * текстом там идёт только от 18.66px при жирном начертании, где порог 3:1.
 */
const RED = '#DC1A2E';
const INK = '#111111';
const PAPER = '#FFFFFF';
const CREAM_LIGHT = '#F5F5F3';
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
    document.title = 'Сценика. Концертное агентство полного цикла';
  }, []);

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", color: INK, background: PAPER, overflowX: 'clip' }}>
      <ScenikaNav />
      <Stage />
      <SecondCall />
      <ThirdCall />
      <PartnershipStrap />
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
          {typo('Обсудить тур')}
        </a>
      </div>
    </div>
  );
}

/**
 * Закреплённая сцена: герой и «Первый звонок» занимают один экран.
 *
 * Прокрутка не уводит страницу, а двигает шторы: они сходятся над героем,
 * в момент полного смыкания за ними меняется содержимое, и расходятся уже
 * над «Первым звонком». Так второй блок появляется ровно на месте первого,
 * а зритель управляет темпом и может отмотать назад.
 *
 * При включённом «уменьшении движения» закрепление выключается целиком:
 * оба блока идут обычным потоком, как раньше.
 */
function Stage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      setP(Math.max(0, Math.min(1, -rect.top / travel)));
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
  }, [reduced]);

  if (reduced) {
    return (
      <>
        <ScenikaHero />
        <FirstCall />
      </>
    );
  }

  // Смыкание идёт до середины пути, расхождение — после. Кривая
  // симметричная (smoothstep): ткань мягко трогается, идёт ровно и мягко
  // приходит. Ease-out здесь не годится — он съедал первую четверть пути,
  // и герой скрывался раньше, чем зритель успевал его рассмотреть.
  const half = p < 0.5 ? p * 2 : (1 - p) * 2;
  const cover = half * half * (3 - 2 * half);
  const shown = p >= 0.5;

  const swayL = Math.sin(cover * Math.PI * 3) * 10;
  const swayR = Math.sin(cover * Math.PI * 3 + 0.7) * 10;
  const edge = cover < 0.6 ? 1 : Math.max(0, 1 - (cover - 0.6) / 0.3);

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '240svh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {/* Слои держим смонтированными и переключаем видимость: пересборка
            в момент смыкания сбрасывала бы луч прожектора и набор текста. */}
        <div style={{ position: 'absolute', inset: 0, visibility: shown ? 'hidden' : 'visible' }} aria-hidden={shown}>
          <ScenikaHero />
        </div>
        <div style={{ position: 'absolute', inset: 0, visibility: shown ? 'visible' : 'hidden' }} aria-hidden={!shown}>
          <FirstCall />
        </div>

        <div
          aria-hidden
          className="sc-curtain sc-curtain-l"
          style={{
            transform: `translateX(${-100 + cover * 100}%)`,
            backgroundPosition: `0px ${swayL}px`,
            ['--sc-curtain-edge' as string]: String(edge),
            ['--sc-curtain-mask-y' as string]: `${swayL}px`,
            zIndex: 2,
          } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="sc-curtain sc-curtain-r"
          style={{
            transform: `translateX(${100 - cover * 100}%)`,
            backgroundPosition: `0px ${swayR}px`,
            ['--sc-curtain-edge' as string]: String(edge),
            ['--sc-curtain-mask-y' as string]: `${swayR}px`,
            zIndex: 2,
          } as React.CSSProperties}
        />
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
      el.style.background = `radial-gradient(circle 240px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(255,255,255,0.95) 0, rgba(255,255,255,0.58) 20%, rgba(255,255,255,0.17) 46%, rgba(255,255,255,0.04) 68%, rgba(255,255,255,0) 84%)`;
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
        height: '100%',
        minHeight: '88svh',
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
      </div>
      <div
        ref={beamRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          zIndex: 5,
          filter: 'blur(5px)',
          background: 'radial-gradient(circle 240px at 50% 45%, rgba(255,255,255,0.95) 0, rgba(255,255,255,0.58) 20%, rgba(255,255,255,0.17) 46%, rgba(255,255,255,0.04) 68%, rgba(255,255,255,0) 84%)',
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
        {typo("3 звонка до солдаута")}
      </div>
      <p style={{ fontSize: 19, lineHeight: 1.6, color: MUTED_DARK, maxWidth: 520, margin: '32px 0 0' }}>
        {typo("Концертное агентство полного цикла. Организуем концертные туры целиком: замысел, подготовка, полный зал.")}
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
          {typo('Обсудить тур')}
        </a>
      </div>
    </div>
  );
}

const CALL_LABEL: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 800,
  // 19px при весе 800 попадает в «крупный текст», где достаточно 3:1 —
  // именно это позволяет держать один красный и на тёмных секциях
  fontSize: 19,
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
  typo('В какие города действительно стоит ехать?'),
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
  return (
    <div
      id="path"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: INK,
        padding: `72px ${PAD_X}`,
        scrollMarginTop: 24,
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={CALL_LABEL}>{typo('Первый звонок')}</div>
      <h2 style={{ ...SECTION_H2, margin: '36px 0 0', maxWidth: 900 }}>
        {typo("До сцены начинается главное")}
      </h2>
      <div className="sc-first-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 64, alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED_DEEP, margin: 0 }}>
            {typo("Полный зал не появляется сам. Мы начинаем с вопросов, которые редко задают:")}
          </p>
          <div style={{ marginTop: 36 }}>
            <QuestionTyper />
          </div>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: MUTED_DEEP, margin: '36px 0 0' }}>
            {typo("Мы строим тур ещё до того, как появляются афиши.")}
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

type MechNode = { label: string; desc: string; icon: string };

const MECH_NODES: MechNode[] = [
  { label: 'Площадки', desc: typo('Выбираем города, даты и залы под реальный спрос'), icon: 'M4 20V10L12 4L20 10V20H4Z M9 20V15H15V20' },
  { label: 'Билеты', desc: typo('Заводим билетный стол и контролируем продажи'), icon: 'M3 8H21V16H3Z M9 8V10 M9 12V14 M14 8V10 M14 12V14' },
  { label: 'Договоры', desc: typo('Закрываем юридический и финансовый контур'), icon: 'M6 4H14L18 8V20H6Z M14 4V8H18 M9 12H15 M9 15H13' },
  { label: 'Реклама', desc: typo('Запускаем digital, наружку и локальные кампании'), icon: 'M3 12L15 6V18Z M15 10V14 M18 8V16' },
  { label: typo('PR и медиа'), desc: typo('Подключаем СМИ, радио и инфопартнёров'), icon: 'M9 4H15V13H9Z M6 12A6 6 0 0018 12 M12 18V21' },
  { label: 'Райдеры', desc: typo('Собираем технические и бытовые требования'), icon: 'M6 5H18V20H6Z M10 3H14V6H10Z M9 11H15 M9 14H14' },
  { label: 'Логистика', desc: typo('Планируем перемещения, тайминги и сопровождение'), icon: 'M2 8H13V16H2Z M13 12H17L20 15V16H13Z M6 20A2 2 0 106 16 A2 2 0 106 20 Z M18 20A2 2 0 1018 16 A2 2 0 1018 20 Z' },
  { label: 'Турменеджмент', desc: typo('Контролируем день события и работу на площадке'), icon: 'M12 3A6 6 0 0118 9C18 13 12 21 12 21C12 21 6 13 6 9A6 6 0 0112 3Z M12 7A2 2 0 1012 11 A2 2 0 1012 7 Z' },
];

function SecondCall() {
  const N = MECH_NODES.length;
  const [done, setDone] = useState<boolean[]>(() => Array(N).fill(false));
  const count = done.filter(Boolean).length;
  const all = count === N;
  // Готовность шоу к встрече зрителей: пока закрыты не все пункты, двери
  // открывать рано, поэтому шкала считается по доле закрытых, а не по
  // остатку — остаток говорит о работе, доля говорит о результате.
  const readiness = Math.round((count / N) * 100);

  const boardRef = useRef<HTMLUListElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);

  const toggle = (i: number) => setDone((prev) => prev.map((v, j) => (j === i ? !v : v)));
  const toggleAll = () => setDone(Array(N).fill(!all));

  // Вектор от каждой карточки к папке пишем в CSS-переменные, а движение
  // отдаём переходу: сбор и разбор работают в обе стороны и прерываются
  // на полпути. Считаем по offset-координатам — getBoundingClientRect уже
  // включает собственный transform карточки.
  useEffect(() => {
    const measure = () => {
      const folder = folderRef.current;
      if (!folder) return;
      const fx = folder.offsetLeft + folder.offsetWidth / 2;
      const fy = folder.offsetTop + folder.offsetHeight / 2;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.setProperty('--dx', `${Math.round(fx - (el.offsetLeft + el.offsetWidth / 2))}px`);
        el.style.setProperty('--dy', `${Math.round(fy - (el.offsetTop + el.offsetHeight / 2))}px`);
      });
    };
    measure();
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="mechanism"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: CREAM_LIGHT,
        color: INK,
        padding: `96px ${PAD_X}`,
        scrollMarginTop: 24,
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ ...CALL_LABEL, color: RED }}>{typo('Второй звонок')}</div>
        <h2 style={{ ...SECTION_H2, margin: '20px 0 0', maxWidth: 900, color: INK }}>{typo('Запускаем механизм полного зала')}</h2>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: MUTED, maxWidth: 720, margin: '18px 0 0' }}>
          {typo("Площадки, билеты, договоры, реклама, PR, райдеры, логистика. Каждая часть должна включиться вовремя. Собираем «под ключ», пока артист готовит шоу.")}
        </p>

        <div className="sc-plan">
          <div className="sc-plan-head">
            <div>
              <div className="sc-plan-title">{typo('Чек-лист тура')}</div>
              <div className="sc-plan-sub">{typo('Каждый пункт закрываем сами или вместе с вами')}</div>
            </div>
            <div className="sc-plan-right">
              <span className="sc-plan-count" aria-live="polite">{count}<span className="sc-plan-total">/{N}</span></span>
              <button
                type="button"
                role="switch"
                aria-checked={all}
                aria-label={all ? 'Открыть все пункты заново' : 'Закрыть все пункты'}
                className="sc-switch"
                onClick={toggleAll}
              >
                <span className="sc-switch-knob" />
              </button>
            </div>
          </div>

          {/* Полоса заполнения: единственный индикатор прогресса на длинном списке */}
          <div className="sc-plan-bar" aria-hidden>
            <span style={{ transform: `scaleX(${count / N})` }} />
          </div>

          <ul className="sc-plan-grid" ref={boardRef} data-all={all || undefined}>
            {MECH_NODES.map((node, i) => (
              <li
                key={node.label}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="sc-card"
                data-done={done[i] || undefined}
                style={{ '--i': i } as React.CSSProperties}
              >
                <button type="button" className="sc-card-btn" aria-pressed={done[i]} onClick={() => toggle(i)}>
                  <span className="sc-card-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={node.icon} />
                    </svg>
                  </span>
                  <span className="sc-card-text">
                    <span className="sc-card-label">{node.label}</span>
                    <span className="sc-card-desc">{node.desc}</span>
                  </span>
                  <span className="sc-card-check" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5 L10 17.5 L19 7" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}

            <div className="sc-folder" ref={folderRef} data-open={all || undefined}>
              <span className="sc-folder-word">ШОУ</span>
              <span className="sc-folder-meta" aria-live="polite">
                {all
                  ? typo('Готовность 100%. Можно открывать двери')
                  : typo(`Готовность ${readiness}%`)}
              </span>
            </div>
          </ul>
        </div>

      </div>
    </section>
  );
}

/** Партнёрская полоса: одна строка на фирменном красном. */

function PartnershipStrap() {
  return (
    <div style={{ background: RED, color: PAPER }}>
      <div
        className="sc-strap"
        style={{
          padding: `22px ${PAD_X}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', minWidth: 0 }}>
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {typo('Один механизм. Два контура.')}
          </span>
          <span style={{ fontSize: 15.5, lineHeight: 1.4, color: PAPER }}>
            {typo('МЭПЛ собирает систему, Сценика собирает тур.')}
          </span>
        </div>
        <a
          href={MAPLE_HOME}
          style={{
            flex: 'none',
            textDecoration: 'none',
            background: PAPER,
            color: RED,
            fontWeight: 800,
            fontSize: 14.5,
            padding: '11px 20px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            fontFamily: "'Manrope', sans-serif",
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 44,
          }}
        >
          {typo('Открыть страницу МЭПЛ ')}<span className="mm-arrow" aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

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
    { label: typo('Артист выходит на сцену.'), appear: [0.42, 0.50] as const, settle: [0.52, 0.60] as const, settleTop: 44 },
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
            // секция постоянно чёрная, брендовый красный тут даёт 2.51
            color: RED,
          }}
        >
          {typo('Третий звонок')}
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
          {typo("Это единственная часть работы, которую видит зритель. Всё остальное уже произошло.")}
        </p>
      </div>
    </div>
  );
}

function AfterConcert() {
  // Три сплошные красные плашки подряд читались как масса, а не как акцент.
  // Нарастание сохраняем, но выражаем ступенями: обычное — обведённое —
  // залитое, и залита только кульминация.
  const items = [
    { t: 'логистика', rank: 0 },
    { t: 'отчёты', rank: 0 },
    { t: 'закрывающие документы', rank: 0 },
    { t: 'финансы', rank: 0 },
    { t: 'следующий город', rank: 1 },
    { t: 'следующий концерт', rank: 1 },
    { t: 'следующий солдаут', rank: 2 },
    { t: 'следующий тур', rank: 2 },
  ];
  // Цикл замыкается: те же задачи начинаются заново и тают. Повтор
  // декоративный и скрыт от скринридеров — эти слова уже прочитаны выше,
  // читать их второй раз затухающим списком незачем.
  const loop = ['логистика', 'отчёты', 'закрывающие документы', 'финансы', 'следующий город'];
  return (
    <div style={{ background: NEAR_BLACK, color: '#F5F5F3', padding: `120px ${PAD_X}` }}>
      <h2 style={{ ...SECTION_H2, fontSize: 'clamp(28px, 4.4vw, 64px)', lineHeight: 1.08, maxWidth: 880 }}>
        {typo("Пока зритель смотрит шоу, мы продолжаем работать")}
      </h2>
      <p style={{ fontSize: 19, color: MUTED_DARK, margin: '28px 0 0' }}>
        {typo("Концерт не заканчивается аплодисментами. После него начинается:")}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 44, maxWidth: 900 }}>
        {items.map((it) => (
          <div
            key={it.t}
            style={{
              // Ступени нарастания: обычное, обведённое красным, залитое.
              // Текст остаётся светлым — красным по тёмному мелкий кегль
              // не читается, а обводка держит тот же акцент.
              border: `1px solid ${it.rank === 0 ? MUTED_LINE : RED}`,
              background: it.rank === 2 ? RED : 'transparent',
              color: it.rank === 2 ? PAPER : '#F5F5F3',
              padding: '14px 24px',
              fontSize: 17,
            }}
          >
            {it.t}
          </div>
        ))}
        {loop.map((t, i) => (
          <div
            key={`loop-${t}`}
            aria-hidden
            style={{
              border: `1px solid ${MUTED_LINE}`,
              color: '#F5F5F3',
              padding: '14px 24px',
              fontSize: 17,
              opacity: Math.max(0.05, 0.5 - i * 0.11),
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cases() {
  const rows: Array<{ name: string; meta: string; note?: string }> = [
    { name: 'Павел Воля', meta: 'организация туров' },
    { name: 'Ляйсан Утяшева', meta: 'Bolero, Carmen P.S.' },
    { name: 'Егор Дружинин', meta: typo('театральные постановки и мюзиклы') },
    // Последняя строка собирает нескольких артистов сразу, поэтому имена
    // набираются мельче остальных, а под ними идёт ещё более мелкая приписка
    // о жанрах: иначе строка спорит по весу с сольными именами выше.
    { name: 'Максим Свобода, Кристина Кошелева', note: typo('концерты, шоу и постановки'), meta: typo('и многие другие') },
  ];
  return (
    <div id="cases" style={{ padding: `120px ${PAD_X}`, scrollMarginTop: 24 }}>
      <h2 style={{ ...SECTION_H2 }}>{typo('Мы уже проходили этот путь')}</h2>
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
            <div>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 500,
                  fontSize: r.note ? 'clamp(18px, 2.1vw, 30px)' : 'clamp(22px, 3vw, 44px)',
                  textTransform: 'uppercase',
                }}
              >
                {r.name}
              </div>
              {r.note && (
                <div style={{ fontSize: 15, color: '#6F6F6F', marginTop: 8 }}>{r.note}</div>
              )}
            </div>
            <div style={{ fontSize: 16, color: '#6F6F6F' }}>{r.meta}</div>
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
    { value: 23000, suffix: '', label: typo('зрителей на одной площадке') },
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
            <div style={{ fontSize: 16, color: '#6F6F6F', marginTop: 10 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyStay() {
  return (
    <div style={{ background: CREAM_LIGHT, padding: `120px ${PAD_X}` }}>
      <h2 style={{ ...SECTION_H2, maxWidth: 920 }}>{typo("Почему артисты остаются с нами")}</h2>
      <div className="sc-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 56, alignItems: 'start' }}>
        <p style={{ fontSize: 20, lineHeight: 1.65, color: MUTED_DEEP, margin: 0 }}>
          {typo("Не потому что мы делаем концерты. Потому что мы снимаем с них всё, кроме сцены.")}
        </p>
        <div>
          <p style={{ fontSize: 17, color: '#6F6F6F', margin: '0 0 20px' }}>{typo("Мы не просим артиста думать:")}</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[typo('о билетах'), typo('о договорах'), typo('о рекламе'), typo('о райдере')].map((t, i, arr) => (
              <div
                key={t}
                style={{
                  padding: '14px 0',
                  borderTop: '1px solid #DDD',
                  borderBottom: i === arr.length - 1 ? '1px solid #DDD' : undefined,
                  fontSize: 18,
                  color: '#6F6F6F',
                  textDecoration: 'line-through',
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, color: INK, margin: '28px 0 0' }}>
            {typo("Мы просим только выйти на сцену.")}
          </p>
        </div>
      </div>
    </div>
  );
}

function FinalCta() {
  return (
    <div
      id="contact"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: BLACK,
        color: '#F5F5F3',
        padding: `140px ${PAD_X}`,
        scrollMarginTop: 24,
      }}
    >
      {/* Снимок реального зала, который собирали. Он ниже первого экрана,
          поэтому грузится лениво и декоративен — alt пустой. */}
      <img
        className="sc-cta-photo"
        src="/uploads/scenika/hall.webp"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
      />
      <div className="sc-cta-scrim" aria-hidden />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <h2
        style={{
          ...SECTION_H2,
          fontSize: 'clamp(36px, 6vw, 88px)',
          lineHeight: 1.02,
          maxWidth: 1000,
        }}
      >
        {typo('Давайте соберём следующий полный зал')}
      </h2>
      {/* Поверх снимка приглушённый серый выцветает и не проходит по контрасту:
          над меняющимся фоном текст держат яркостью и весом, а не оттенком. */}
      <p style={{ fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: '32px 0 0' }}>
        {typo("Расскажите о вашем шоу.")}
      </p>
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
          {typo('Обсудить тур')}
        </a>
      </div>
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
        color: '#7B7B7B',
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
        <span>{typo('Концертное агентство полного цикла')}</span>
        <a href={MAPLE_HOME} style={{ color: '#7B7B7B', textDecoration: 'none' }}>{typo('Мэпл · digital ')}→</a>
      </div>
    </div>
  );
}
