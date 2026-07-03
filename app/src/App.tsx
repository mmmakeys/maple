import { lazy, Suspense, useState } from 'react';
import { DISPLAY, marqueeText, whyCards, roles, team, type Member } from './data';
import {
  alpha,
  ink100,
  ink400,
  ink500,
  ink600,
  ink700,
  ink850,
  ink900,
  paper,
  violet400,
  violet50,
  violet500,
} from './tokens';
// three.js is the heaviest dependency (~600 KB min); split into its own chunk
// so hero text/kicker/CTA paint immediately and the WebGL leaf hydrates async.
const MapleLeaf = lazy(() => import('./components/MapleLeaf'));
// Modals only render after user interaction — no reason to bundle them into
// the initial payload.
const CVModal = lazy(() => import('./components/CVModal'));
const LeadModal = lazy(() => import('./components/LeadModal'));
import SystemAssembly from './components/SystemAssembly';
import ProcessPuzzle from './components/ProcessPuzzle';

const heading: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  letterSpacing: '-0.005em',
  textTransform: 'uppercase',
  margin: 0,
};

// Full-bleed sections: each band background spans the whole viewport width,
// while its content lives in this centered, max-width column.
const PAGE_MAX = 1280;
const col = (padding: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  width: '100%',
  maxWidth: PAGE_MAX,
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
  padding,
  ...extra,
});

const navTgIcon = (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={paper}>
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

export default function App() {
  const [cvOpen, setCvOpen] = useState<Member | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  const openLead = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeadOpen(true);
  };

  return (
    <div style={{ background: paper, color: ink850, overflowX: 'hidden' }}>
      {/* nav */}
      <div style={{ background: ink900, color: ink100 }}>
        <div style={col('26px clamp(20px,4vw,56px)', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <svg viewBox="0 0 40 40" width="30" height="30" style={{ display: 'block' }} aria-label="Maple">
              <path
                d="M 37.80 14.47 C 38.73 17.75, 36.04 22.40, 33.85 25.78 C 31.66 29.15, 28.32 33.93, 24.68 34.72 C 21.03 35.51, 15.68 32.54, 11.96 30.50 C 8.25 28.46, 3.41 25.74, 2.37 22.49 C 1.32 19.24, 3.56 14.41, 5.70 10.99 C 7.85 7.57, 11.47 2.79, 15.24 1.98 C 19.00 1.17, 24.54 4.02, 28.30 6.10 C 32.06 8.18, 36.88 11.19, 37.80 14.47 Z"
                fill={violet500}
              />
              <path
                d="M 8.5 28.5 C 9.50 26.08, 12.42 15.17, 14.50 14.00 C 16.58 12.83, 18.33 22.42, 21.00 21.50 C 23.67 20.58, 28.92 10.67, 30.50 8.50"
                fill="none"
                stroke={ink900}
                strokeWidth="4.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, letterSpacing: '0.02em' }}>
              МЭПЛ
            </span>
          </div>
          <div className="mm-nav-links">
            <a className="mm-nav-anchor" href="#services" style={{ color: ink400, textDecoration: 'none' }}>
              Услуги
            </a>
            <a className="mm-nav-anchor" href="#cases" style={{ color: ink400, textDecoration: 'none' }}>
              Кейсы
            </a>
            <a className="mm-nav-anchor" href="#team" style={{ color: ink400, textDecoration: 'none' }}>
              Команда
            </a>
            <a
              href="#"
              onClick={openLead}
              style={{
                textDecoration: 'none',
                color: ink900,
                background: violet400,
                padding: '11px 20px',
                borderRadius: 8,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Обсудить проект
            </a>
          </div>
        </div>
      </div>

      {/* hero */}
      <div style={{ background: ink900, color: ink100, position: 'relative', overflow: 'hidden' }}>
        {/* full-bleed corner glow (relative to the band, so it hugs the viewport corner) */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('violet500', 0.55)}, ${alpha('violet500', 0)} 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          className="mm-hero-band"
          style={col('clamp(48px,7vw,78px) clamp(20px,4vw,56px) clamp(48px,6vw,70px)', { position: 'relative' })}
        >
          {/* leaf sits at the right edge of the content column — .mm-hero-leaf
              handles the mobile/tablet reflow (size, position, animation). */}
          <div className="mm-hero-leaf">
            <Suspense fallback={null}>
              <MapleLeaf />
            </Suspense>
          </div>
          <div
            className="mm-hero-content"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <span
              className="mm-hero-kicker"
              style={{
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: violet400,
                border: `1px solid ${violet400}`,
                padding: '8px 16px',
                borderRadius: 999,
              }}
            >
              Диджитал-агентство полного цикла
            </span>
            <h1
              className="mm-hero-title"
              style={{
                ...heading,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Растим
              <br />
              проекты,
              <br />
              <span style={{ color: violet400 }}>А&nbsp;НЕ ОТЧЕТЫ</span>
            </h1>
            <div className="mm-hero-copy-row">
              <p
                style={{
                  fontSize: 'clamp(17px, 2vw, 22px)',
                  lineHeight: 1.5,
                  color: ink400,
                  maxWidth: 540,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Агентство, которое не бесит. Собираем диджитал в одно целое и доводим до роста.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <a
                  href="#"
                  onClick={openLead}
                  style={{
                    textDecoration: 'none',
                    background: violet500,
                    color: paper,
                    fontWeight: 800,
                    fontSize: 'clamp(15px, 4.5vw, 17px)',
                    padding: 'clamp(14px, 4vw, 18px) clamp(20px, 6vw, 34px)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Обсудить проект →
                </a>
                <a
                  href="#cases"
                  style={{
                    textDecoration: 'none',
                    color: ink100,
                    fontWeight: 200,
                    fontSize: 16,
                    borderBottom: `2px solid ${alpha('violet400', 0.6)}`,
                    paddingBottom: 3,
                  }}
                >
                  Кейсы
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* marquee (full-bleed) */}
      <div className="mm-marquee-band" style={{ background: violet500, color: paper, padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div
          className="mm-marquee-track"
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'mm-marquee 22s linear infinite',
            fontFamily: DISPLAY,
            fontWeight: 200,
            fontSize: 20,
            letterSpacing: '0.02em',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                paddingRight: 56,
                whiteSpace: 'nowrap',
              }}
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* why */}
      <div style={{ background: paper }}>
        <div style={col('84px clamp(20px,4vw,56px)')}>
          <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.0, margin: '0 0 14px' }}>
            Почему с нами
            <br />
            нормально?
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: ink700, maxWidth: 560, margin: '0 0 46px' }}>
            Потому что делаем, чтобы работало. По умолчанию будем креативными. Если нужно — будем скучными и
            эффективными.
          </p>
          <div className="mm-why-grid">
            {whyCards.map((c) => (
              <div
                key={c.n}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: violet50,
                  borderRadius: 16,
                  padding: '26px 24px 30px',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={violet500}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: 'absolute', right: 8, top: 8, width: 81, height: 81, opacity: 0.2, pointerEvents: 'none' }}
                  dangerouslySetInnerHTML={{ __html: c.icon }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 36,
                      fontWeight: 600,
                      color: violet500,
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    {c.n}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.2, marginBottom: 9 }}>{c.t}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: ink600 }}>{c.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* services */}
      <div id="services" style={{ background: paper, scrollMarginTop: 24 }}>
        <div style={col('30px clamp(20px,4vw,56px) 90px')}>
          <div
            style={{
              background: ink850,
              borderRadius: 24,
              padding: '64px clamp(20px,4vw,56px)',
              color: ink100,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-8%',
                top: '-30%',
                width: '60%',
                height: '120%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha('violet500', 0.55)}, ${alpha('violet500', 0)} 70%)`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: 0,
                animation: 'mm-breathe 9s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '-6%',
                bottom: '-34%',
                width: '58%',
                height: '120%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha('violet400', 0.42)}, ${alpha('violet400', 0)} 70%)`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: 0,
                animation: 'mm-breathe-2 11s ease-in-out infinite',
              }}
            />
            <div style={{ maxWidth: 680, marginBottom: 34, position: 'relative', zIndex: 1 }}>
              <h2 style={{ ...heading, fontSize: 'clamp(32px, 5.2vw, 50px)', lineHeight: 1.0 }}>
                Собираем диджитал
                <br />в <span style={{ color: violet400 }}>одно целое</span>
              </h2>
              <p style={{ fontSize: 19, lineHeight: 1.55, color: ink400, margin: '22px 0 0' }}>
                Мы не продаём отдельные услуги. Мы собираем систему под задачу и доводим её до результата.
              </p>
            </div>
            <SystemAssembly />
          </div>
        </div>
      </div>

      {/* process */}
      <div style={{ background: paper }}>
        <div style={col('0 clamp(20px,4vw,56px) 90px')}>
          <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)', margin: '0 0 48px' }}>
            Как это
            <br />
            происходит
          </h2>
          <ProcessPuzzle />
        </div>
      </div>

      {/* cases */}
      <div id="cases" style={{ background: paper, scrollMarginTop: 24 }}>
        <div style={col('0 clamp(20px,4vw,56px) 90px')}>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', marginBottom: 40 }}>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5.2vw, 50px)' }}>
              Что мы уже
              <br />
              сделали
            </h2>
            <a
              href="#"
              style={{
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                background: ink850,
                color: paper,
                fontWeight: 800,
                fontSize: 15,
                padding: '14px 24px',
                borderRadius: 10,
              }}
            >
              Все кейсы →
            </a>
          </div>
          <div className="mm-cases-hero">
            <div
              style={{
                background: violet500,
                borderRadius: 20,
                overflow: 'hidden',
                color: paper,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  flex: 1,
                  minHeight: 230,
                  backgroundImage: "url('/uploads/pavel-event.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              />
              <div style={{ padding: '28px 30px 32px' }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E0D2FB' }}>
                  Концерты
                </span>
                <div style={{ fontFamily: DISPLAY, fontSize: 28, fontWeight: 200, margin: '12px 0 8px', lineHeight: 1.05 }}>
                  Павел Воля. Большой стендап
                </div>
                <div style={{ fontSize: 16, color: '#EADFFB' }}>Тур по 40 городам — 38 солдаутов</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div
                style={{
                  flex: 1,
                  background: violet50,
                  borderRadius: 20,
                  padding: '28px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: violet500 }}>
                  PR
                </span>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 200, lineHeight: 1.2 }}>
                  Три награды в «Книге рекордов России» · 2025
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: ink850,
                  color: ink100,
                  borderRadius: 20,
                  padding: '28px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: violet400 }}>
                  Маркетинг
                </span>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 200, lineHeight: 1.2 }}>
                  Оптимизация кампаний iFarm
                </div>
              </div>
            </div>
          </div>
          <div className="mm-cases-pair">
            <div style={{ background: violet50, borderRadius: 20, padding: '28px 30px' }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: violet500 }}>
                E-commerce
              </span>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 200, lineHeight: 1.2, marginTop: 10 }}>
                Запуск ecom-направления «Всёгазин»
              </div>
            </div>
            <div style={{ background: violet50, borderRadius: 20, padding: '28px 30px' }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: violet500 }}>
                Туры
              </span>
              <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 200, lineHeight: 1.2, marginTop: 10 }}>
                Спектакли Егора Дружинина · 3 города
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* team (full-bleed) */}
      <div id="team" style={{ background: ink900, color: ink100, scrollMarginTop: 24 }}>
        <div style={col('84px clamp(20px,4vw,56px)')}>
          <div style={{ marginBottom: 50 }}>
            <h2 style={{ ...heading, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.0 }}>
              Небольшая команда —
              <br />
              <span style={{ color: violet400 }}>БОЛЬШАЯ ВОВЛЕЧЕННОСТЬ</span>
            </h2>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: ink400, maxWidth: 600, margin: '22px 0 0' }}>
              Мы не раздутое агентство. Над проектами работают люди, которые принимают решения, а не передают задачи
              по цепочке.
            </p>
          </div>
          <div className="mm-team-grid">
            {team.map((m) => (
              <div key={m.name} className="mm-team-card">
                <div
                  className="mm-team-avatar"
                  style={{
                    aspectRatio: '4/5',
                    borderRadius: 16,
                    overflow: 'hidden',
                    position: 'relative',
                    background: `repeating-linear-gradient(135deg,${alpha('violet400', 0.28)},${alpha('violet400', 0.28)} 10px,${alpha('violet400', 0.12)} 10px,${alpha('violet400', 0.12)} 20px)`,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 14,
                  }}
                >
                  <div
                    role="img"
                    aria-label={m.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url('${m.photo}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                    }}
                  />
                </div>
                <div className="mm-team-info">
                <div className="mm-team-name" style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 200, margin: '16px 0 6px' }}>{m.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.45, color: ink500 }}>{m.role}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <a
                    href={m.tg}
                    target="_blank"
                    rel="noopener"
                    aria-label="Telegram"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 9,
                      background: violet500,
                    }}
                  >
                    {navTgIcon}
                  </a>
                  <button
                    onClick={() => setCvOpen(m)}
                    aria-label="Резюме"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: 9,
                      background: alpha('violet400', 0.14),
                      border: `1px solid ${alpha('violet400', 0.32)}`,
                    }}
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={violet400} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 3 14 8 19 8"></polyline>
                      <line x1="8.5" y1="13" x2="15.5" y2="13"></line>
                      <line x1="8.5" y1="16.5" x2="13" y2="16.5"></line>
                    </svg>
                  </button>
                </div>
                </div>
              </div>
            ))}
            <div
              className="mm-team-more"
              style={{
                border: `1.5px solid ${alpha('violet400', 0.38)}`,
                borderRadius: 16,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div className="mm-team-more-head" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: alpha('violet400', 0.1),
                    border: `1px dashed ${alpha('violet400', 0.45)}`,
                    flex: '0 0 auto',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={violet400} strokeWidth="1.6" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 200, color: ink100, lineHeight: 1.25 }}>
                  команда специалистов
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {roles.map((r) => (
                  <span
                    key={r}
                    style={{
                      background: alpha('violet400', 0.14),
                      border: `1px solid ${alpha('violet400', 0.32)}`,
                      color: '#D9CEF0',
                      borderRadius: 999,
                      padding: '7px 13px',
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scenika cta */}
      <div style={{ background: paper }}>
        <div className="mm-scenika-row" style={col('clamp(48px,6vw,74px) clamp(20px,4vw,56px)')}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: violet500 }}>
              Сценика
            </span>
            <h3 style={{ ...heading, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 200, lineHeight: 1.02, margin: '14px 0 12px' }}>
              Концертное агентство
              <br />
              полного цикла
            </h3>
            <p style={{ fontSize: 19, color: ink700, margin: 0 }}>Концерты, туры, шоу. 3 звонка до солдаута.</p>
          </div>
          <a
            href="#"
            style={{
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              background: violet500,
              color: paper,
              fontWeight: 800,
              fontSize: 17,
              padding: '18px 34px',
              borderRadius: 10,
            }}
          >
            Перейти на Сценику →
          </a>
        </div>
      </div>

      {/* footer (full-bleed) */}
      <div style={{ background: ink850, color: 'rgba(244,240,251,0.6)' }}>
        <div className="mm-footer-row" style={col('32px clamp(20px,4vw,56px)')}>
          <span style={{ fontFamily: DISPLAY, fontSize: 16, color: ink100, fontWeight: 200 }}>МЭПЛ</span>
          <span>© 2026 · Растим проекты, а не отчёты</span>
        </div>
      </div>

      {cvOpen && (
        <Suspense fallback={null}>
          <CVModal member={cvOpen} onClose={() => setCvOpen(null)} />
        </Suspense>
      )}
      {leadOpen && (
        <Suspense fallback={null}>
          <LeadModal onClose={() => setLeadOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
