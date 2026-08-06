import { Suspense, lazy, useEffect, useState } from 'react';
import { DISPLAY, team } from '../data';
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
  violet700,
} from '../tokens';
import { caseStories } from '../cases';
import { MapleNav, MapleFooter, chromeCol, chromePad } from './MapleChrome';

const LeadModal = lazy(() => import('./LeadModal'));

const heading: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  letterSpacing: '-0.005em',
  textTransform: 'uppercase',
  margin: 0,
};

// Metric values range from "3" to "ROI >100%" — step the display size down as
// the string grows so long values don't wrap into the neighbouring column.
const metricSize = (v: string): string =>
  v.length > 11 ? 'clamp(26px,3.4vw,40px)' : v.length > 6 ? 'clamp(32px,4.6vw,54px)' : 'clamp(40px,6vw,72px)';

const sectionTitle: React.CSSProperties = {
  ...heading,
  fontSize: 'clamp(26px,4vw,40px)',
  lineHeight: 1.02,
};

export default function CaseStory({ slug }: { slug: string }) {
  const story = caseStories[slug];
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    if (story) document.title = `${story.title.replace(/\n/g, ' ')} — кейс МЭПЛ`;
    else document.title = 'Кейс не найден — МЭПЛ';
  }, [story]);

  const openLead = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeadOpen(true);
  };

  if (!story) {
    return (
      <div style={{ background: paper, color: ink850, minHeight: '100vh' }}>
        <MapleNav onLead={openLead} />
        <div style={{ ...chromeCol, padding: `clamp(80px,12vw,140px) ${chromePad}`, textAlign: 'center' }}>
          <h1 style={{ ...heading, fontSize: 'clamp(32px,6vw,60px)' }}>Кейс не найден</h1>
          <p style={{ fontSize: 18, color: ink600, margin: '18px 0 30px' }}>
            Возможно, он ещё в работе. Посмотрите остальные проекты.
          </p>
          <a
            href="/cases"
            style={{ textDecoration: 'none', background: violet500, color: paper, fontWeight: 800, fontSize: 16, padding: '16px 30px', borderRadius: 10 }}
          >
            Все кейсы →
          </a>
        </div>
        <MapleFooter />
      </div>
    );
  }

  const relevant = team.filter((m) => story.team.includes(m.name));

  // Anchor nav — only lists sections this story actually renders.
  const toc = [
    { id: 'task', label: 'Задача', on: true },
    { id: 'shift', label: 'Точка А → Б', on: Boolean(story.shift) },
    { id: 'build', label: 'Что собрали', on: true },
    { id: 'platform', label: 'Платформа', on: Boolean(story.stack) },
    { id: 'timeline', label: 'Как шёл проект', on: Boolean(story.phases) },
    { id: 'channels', label: 'Маркетплейсы', on: Boolean(story.channels) },
    { id: 'results', label: 'Результаты', on: true },
    { id: 'film', label: 'Ролик', on: Boolean(story.film) },
    { id: 'press', label: 'СМИ', on: Boolean(story.press) },
    { id: 'team', label: 'Команда', on: relevant.length > 0 },
  ].filter((t) => t.on);

  return (
    <div style={{ background: paper, color: ink850, overflowX: 'hidden' }}>
      <MapleNav onLead={openLead} />

      {/* ── hero — the cover fills the band, text sits on a scrim over it ── */}
      <div style={{ background: ink900, color: ink100, position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          className="mm-case-hero-photo"
          style={{ backgroundImage: `url('${story.cover}')` }}
        />
        <div aria-hidden className="mm-case-hero-scrim" />
        <div style={{ ...chromeCol, padding: `clamp(26px,4vw,40px) ${chromePad} 0`, position: 'relative', zIndex: 1 }}>
          <a href="/cases" className="mm-case-back" style={{ color: ink400, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
            ← Все кейсы
          </a>
        </div>
        <div
          className="mm-case-hero"
          style={{ ...chromeCol, padding: `clamp(40px,7vw,86px) ${chromePad} clamp(44px,6vw,64px)`, position: 'relative', zIndex: 1 }}
        >
          <div className="mm-case-hero-copy">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ ...catChip }}>{story.category}</span>
              {story.period && (
                <span style={{ fontSize: 14, color: ink400, letterSpacing: '0.02em' }}>{story.period}</span>
              )}
            </div>
            <h1 style={{ ...heading, fontSize: 'clamp(44px,7.6vw,104px)', lineHeight: 0.94, margin: '20px 0 0' }}>
              {story.title.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block', color: i === 0 ? ink100 : violet400 }}>
                  {line}
                </span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(17px,1.9vw,19px)', lineHeight: 1.55, color: ink400, margin: '20px 0 0', maxWidth: 500 }}>
              {story.lead}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24, maxWidth: 560 }}>
              {story.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: '#E4DCF3',
                    borderRadius: 999,
                    padding: '7px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* fact strip */}
        <div style={{ ...chromeCol, padding: `0 ${chromePad} clamp(52px,6vw,72px)`, position: 'relative', zIndex: 1 }}>
          <div className="mm-case-facts">
            {story.facts.map((f) => (
              <div key={f.l} className="mm-case-fact">
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(30px,4.4vw,52px)', fontWeight: 600, color: violet400, lineHeight: 1 }}>
                  {f.v}
                </div>
                <div style={{ fontSize: 14, color: ink500, marginTop: 8, lineHeight: 1.35 }}>{f.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── table of contents ── */}
      {toc.length > 2 && (
        <nav aria-label="Разделы кейса" style={{ background: paper, borderBottom: `1px solid ${violet50}` }}>
          <div style={{ ...chromeCol, padding: `clamp(20px,2.6vw,26px) ${chromePad}` }}>
            <div className="mm-case-toc">
              {toc.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="mm-case-toc-link">
                  {t.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* ── task ── */}
      <div id="task" style={{ background: paper, scrollMarginTop: 20 }}>
        <div style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad} clamp(28px,4vw,40px)` }}>
          <h2 style={{ ...sectionTitle, marginBottom: 18 }}>Задача</h2>
          <p style={{ fontSize: 'clamp(18px,2.1vw,22px)', lineHeight: 1.6, color: ink700, margin: 0 }}>{story.task}</p>
          {story.taskRoles && (
            <div className="mm-case-task-roles">
              {story.taskRoles.map((r) => {
                const m = team.find((t) => t.name === r.name);
                return (
                  <span key={r.name} className="mm-case-task-role">
                    <span
                      className="mm-case-task-avatar"
                      role="img"
                      aria-label={r.name}
                      style={m ? { backgroundImage: `url('${m.photo}')` } : undefined}
                    />
                    <span>
                      <b style={{ color: ink850, fontWeight: 800 }}>{r.short}</b>
                      <span style={{ color: ink600 }}> — {r.role}</span>
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── point A → point B ── */}
      {story.shift && (
        <div id="shift" style={{ background: paper, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(28px,4vw,40px) ${chromePad} clamp(56px,7vw,80px)` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 'clamp(24px,3.4vw,34px)' }}>
              Точка А → <span style={{ color: violet500 }}>точка Б</span>
            </h2>
            <div className="mm-case-shift">
              <div className="mm-case-shift-labels" aria-hidden>
                <span>{story.shift.fromLabel}</span>
                <span>{story.shift.toLabel}</span>
              </div>
              {story.shift.rows.map((r) => (
                <div key={r.to} className="mm-case-shift-row">
                  <div className="mm-case-shift-from">{r.from}</div>
                  <div className="mm-case-shift-arrow" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={violet500} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="12" x2="19" y2="12" />
                      <polyline points="13 6 19 12 13 18" />
                    </svg>
                  </div>
                  <div className="mm-case-shift-to">{r.to}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── what we built ── */}
      <div id="build" style={{ background: paper, scrollMarginTop: 20 }}>
        <div style={{ ...chromeCol, padding: `clamp(28px,4vw,40px) ${chromePad} clamp(56px,7vw,80px)` }}>
          <h2 style={{ ...sectionTitle, marginBottom: 'clamp(28px,4vw,44px)' }}>
            Что мы <span style={{ color: violet500 }}>собрали</span>
          </h2>
          <div className="mm-case-build">
            {story.build.map((b, i) => (
              <div key={b.t} className="mm-case-build-item" style={{ background: violet50, borderRadius: 18, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: violet500, lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {b.kind && <span className="mm-case-kind">{b.kind}</span>}
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>{b.t}</div>
                <div style={{ fontSize: 15.5, lineHeight: 1.55, color: ink600 }}>{b.d}</div>
                {b.was && b.now && (
                  <div className="mm-case-delta">
                    <span className="mm-case-delta-was">{b.was}</span>
                    <span className="mm-case-delta-arrow" aria-hidden>→</span>
                    <span className="mm-case-delta-now">{b.now}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── platform architecture ── */}
      {story.stack && (
        <div id="platform" style={{ background: violet50, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(56px,7vw,84px) ${chromePad}` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 14 }}>
              Как устроена <span style={{ color: violet500 }}>платформа</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: ink700, margin: '0 0 clamp(28px,4vw,40px)', maxWidth: 620 }}>
              Витрины, сервисы и учётный контур собирались параллельно и связывались через интеграционную шину.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {story.stack.map((s, i) => (
                <div key={s.layer}>
                  <div
                    className="mm-case-stack-row"
                    style={{
                      background: paper,
                      borderRadius: 18,
                      padding: 'clamp(20px,2.6vw,26px)',
                      display: 'flex',
                      gap: 'clamp(16px,3vw,32px)',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ minWidth: 150, flex: '0 0 auto' }}>
                      <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, textTransform: 'uppercase', color: ink850 }}>
                        {s.layer}
                      </div>
                      <div style={{ fontSize: 13.5, color: ink600, marginTop: 4 }}>{s.note}</div>
                    </div>
                    <div className="mm-case-stack-items" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
                      {s.items.map((it) => (
                        <span
                          key={it}
                          style={{
                            background: violet50,
                            border: `1px solid ${alpha('violet400', 0.4)}`,
                            color: violet700,
                            borderRadius: 10,
                            padding: '10px 15px',
                            fontSize: 14.5,
                            fontWeight: 700,
                          }}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < story.stack!.length - 1 && (
                    <div aria-hidden style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={violet400} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="4" x2="12" y2="19" />
                        <polyline points="6 13 12 19 18 13" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* partner credit */}
            {story.stackPartner && (
              <a
                href={story.stackPartner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mm-case-partner"
                style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px,2vw,20px)',
                  flexWrap: 'wrap',
                  textDecoration: 'none',
                  color: ink600,
                  background: paper,
                  border: `1px solid ${alpha('violet400', 0.3)}`,
                  borderRadius: 14,
                  padding: '16px clamp(18px,2.4vw,24px)',
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1.45 }}>{story.stackPartner.note}</span>
                <img
                  src={story.stackPartner.logo}
                  alt={story.stackPartner.name}
                  loading="lazy"
                  style={{ height: 24, width: 'auto', display: 'block' }}
                />
              </a>
            )}

            {/* order lifecycle */}
            {story.flow && (
              <div style={{ marginTop: 'clamp(34px,4vw,48px)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: violet500, marginBottom: 16 }}>
                  Жизненный цикл заказа
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  {story.flow.steps.map((st, i) => (
                    <span key={st} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          background: paper,
                          border: `1px solid ${alpha('violet400', 0.45)}`,
                          borderRadius: 999,
                          padding: '9px 16px',
                          fontSize: 14,
                          fontWeight: 700,
                          color: ink850,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {st}
                      </span>
                      {i < story.flow!.steps.length - 1 && <span style={{ color: violet400, fontWeight: 800 }}>→</span>}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: ink600, margin: '16px 0 0', maxWidth: 720 }}>
                  {story.flow.note}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── timeline ── */}
      {story.phases && (
        <div id="timeline" style={{ background: paper, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(56px,7vw,84px) ${chromePad}` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 'clamp(28px,4vw,44px)' }}>
              Как шёл <span style={{ color: violet500 }}>проект</span>
            </h2>
            <div className="mm-case-phases">
              {story.phases.map((p) => (
                <div key={p.t} className="mm-case-phase">
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: violet500 }}>
                    {p.when}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25, margin: '10px 0 8px' }}>{p.t}</div>
                  <div style={{ fontSize: 15.5, lineHeight: 1.55, color: ink600 }}>{p.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── marketplace channels ── */}
      {story.channels && (
        <div id="channels" style={{ background: violet50, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(56px,7vw,84px) ${chromePad}` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 14 }}>{story.channels.title}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: ink700, margin: '0 0 clamp(26px,3.4vw,36px)', maxWidth: 700 }}>
              {story.channels.note}
            </p>
            <div className="mm-case-channels">
              {story.channels.items.map((m) => (
                <div
                  key={m.name}
                  className="mm-case-channel"
                  style={{
                    background: paper,
                    borderRadius: 16,
                    padding: 'clamp(22px,3vw,30px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 92,
                  }}
                >
                  <img
                    src={m.logo}
                    alt={m.name}
                    loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: 30, width: 'auto', height: 'auto', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── results (dark) ── */}
      <div id="results" style={{ background: ink900, color: ink100, scrollMarginTop: 20 }}>
        <div style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad}` }}>
          <h2 style={{ ...sectionTitle, color: ink100, marginBottom: 'clamp(32px,4vw,48px)' }}>
            Результаты
          </h2>
          <div className="mm-case-results">
            {story.results.map((r) => (
              <div key={r.l} className="mm-case-result" style={{ borderTop: `2px solid ${alpha('violet400', 0.4)}`, paddingTop: 22 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: metricSize(r.v), fontWeight: 600, color: violet400, lineHeight: 0.95 }}>
                  {r.v}
                </div>
                <div style={{ fontSize: 16, color: ink400, marginTop: 14, lineHeight: 1.4 }}>{r.l}</div>
              </div>
            ))}
          </div>

          {/* pull quote */}
          <figure style={{ marginTop: 'clamp(48px,6vw,72px)', maxWidth: 860, marginInline: 0 }}>
            <div
              aria-hidden
              style={{
                fontFamily: DISPLAY,
                fontSize: 'clamp(64px,9vw,120px)',
                lineHeight: 0.7,
                color: alpha('violet400', 0.5),
                marginBottom: 4,
              }}
            >
              «
            </div>
            <blockquote style={{ margin: 0 }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 200, fontSize: 'clamp(22px,3.2vw,34px)', lineHeight: 1.3, color: ink100, margin: 0 }}>
                {story.quote.text}
              </p>
            </blockquote>
            <figcaption style={{ fontSize: 15, color: violet400, marginTop: 18, letterSpacing: '0.04em' }}>
              — {story.quote.author}
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ── promo film ── */}
      {story.film && (
        <div id="film" style={{ background: paper, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad} clamp(56px,7vw,80px)` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 14 }}>
              Ролик и <span style={{ color: violet500 }}>своя музыка</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: ink700, margin: '0 0 clamp(24px,3vw,34px)', maxWidth: 680 }}>
              {story.film.note}
            </p>
            {story.film.embed ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: ink900,
                }}
              >
                <iframe
                  src={story.film.embed}
                  title={story.film.title}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 20,
                  background: story.film.poster ? `url('${story.film.poster}') center/cover` : violet50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 14,
                  color: violet700,
                }}
              >
                <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={violet500} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9.5" />
                  <polygon points="10 8.5 16 12 10 15.5" fill={violet500} stroke="none" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{story.film.title}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── gallery ── */}
      {story.gallery && (
        <div style={{ background: paper }}>
          <div style={{ ...chromeCol, padding: `clamp(56px,7vw,80px) ${chromePad} clamp(56px,7vw,80px)` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 'clamp(28px,4vw,44px)' }}>
              Как это <span style={{ color: violet500 }}>выглядело</span>
            </h2>
            <div className="mm-case-gallery">
              {story.gallery.map((g) => (
                <figure key={g.src} className="mm-case-shot" style={{ margin: 0 }}>
                  <img
                    src={g.src}
                    alt={g.cap}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16, background: violet50 }}
                  />
                  <figcaption style={{ fontSize: 14.5, color: ink600, marginTop: 12, lineHeight: 1.45 }}>{g.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── highlights ── */}
      <div style={{ background: paper }}>
        <div style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad}` }}>
          <h2 style={{ ...sectionTitle, marginBottom: 'clamp(32px,4vw,48px)' }}>
            Моменты, которыми <span style={{ color: violet500 }}>гордимся</span>
          </h2>
          <div className="mm-case-highlights">
            {story.highlights.map((h) => (
              <div key={h.t} className="mm-case-highlight" style={{ borderTop: `2px solid ${violet50}`, paddingTop: 22 }}>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>{h.t}</div>
                <div style={{ fontSize: 16, lineHeight: 1.6, color: ink700 }}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── press coverage ── */}
      {story.press && (
        <div id="press" style={{ background: violet50, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(60px,7vw,88px) ${chromePad}` }}>
            <h2 style={{ ...sectionTitle, marginBottom: 14 }}>
              СМИ о <span style={{ color: violet500 }}>проекте</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: ink700, margin: '0 0 clamp(26px,3.4vw,36px)', maxWidth: 660 }}>
              Публикации об открытии магазинов и развитии сети — результат PR-работы над проектом.
            </p>
            <div className="mm-case-press">
              {story.press.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mm-case-press-item"
                  style={{
                    background: paper,
                    borderRadius: 16,
                    padding: 'clamp(20px,2.6vw,26px)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: violet500 }}>
                      {p.outlet}
                    </span>
                    <span style={{ fontSize: 12.5, color: ink600, whiteSpace: 'nowrap' }}>{p.date}</span>
                  </div>
                  <span style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.35, color: ink850 }}>{p.title}</span>
                  <span className="mm-case-press-go" style={{ fontSize: 14, fontWeight: 700, color: violet500, marginTop: 'auto' }}>
                    Читать →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── epilogue: what happened to the project ── */}
      {story.epilogue && (
        <div style={{ background: paper }}>
          <div style={{ ...chromeCol, padding: `clamp(40px,5vw,60px) ${chromePad}` }}>
            <div style={{ borderTop: `1px solid ${violet50}`, paddingTop: 'clamp(24px,3vw,32px)', maxWidth: 760 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: ink600, marginBottom: 12 }}>
                {story.epilogue.t}
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: ink600, margin: 0 }}>
                {story.epilogue.d}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── team on the project ── */}
      {relevant.length > 0 && (
        <div id="team" style={{ background: ink900, color: ink100, scrollMarginTop: 20 }}>
          <div style={{ ...chromeCol, padding: `clamp(60px,7vw,88px) ${chromePad}` }}>
            <h2 style={{ ...sectionTitle, color: ink100, marginBottom: 'clamp(28px,4vw,42px)' }}>
              Кто вёл проект
            </h2>
            <div className="mm-case-team">
              {relevant.map((m) => (
                <div key={m.name} className="mm-case-team-card">
                  <div
                    aria-label={m.name}
                    role="img"
                    style={{
                      aspectRatio: '4/5',
                      borderRadius: 16,
                      backgroundColor: alpha('violet400', 0.12),
                      backgroundImage: `url('${m.photo}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                    }}
                  />
                  <div style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 200, margin: '16px 0 6px' }}>{m.name}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.45, color: ink500 }}>{story.roles?.[m.name] ?? m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div style={{ background: ink900, color: ink100, position: 'relative', overflow: 'hidden', borderTop: `1px solid ${alpha('violet400', 0.1)}` }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: -140,
            bottom: -180,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('violet500', 0.45)}, ${alpha('violet500', 0)} 68%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          className="mm-final-cta"
          style={{
            ...chromeCol,
            padding: `clamp(72px,9vw,120px) ${chromePad}`,
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 40,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <h2 style={{ ...heading, fontSize: 'clamp(30px,5vw,52px)', lineHeight: 1.02, marginBottom: 18 }}>
              Хотите такой же
              <br />
              <span style={{ color: violet400 }}>результат?</span>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: ink400, margin: 0, maxWidth: 560 }}>
              Расскажите о задаче — соберём систему под ваш проект и доведём до роста.
            </p>
          </div>
          <a
            href="#"
            onClick={openLead}
            style={{
              textDecoration: 'none',
              background: violet500,
              color: paper,
              fontWeight: 800,
              fontSize: 17,
              padding: '18px 34px',
              borderRadius: 10,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: `0 12px 40px ${alpha('violet500', 0.36)}, inset 0 1px 0 rgba(255,255,255,0.18)`,
            }}
          >
            Обсудить проект →
          </a>
        </div>
      </div>

      <MapleFooter />

      {leadOpen && (
        <Suspense fallback={null}>
          <LeadModal onClose={() => setLeadOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

const catChip: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 13,
  fontWeight: 400,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: violet400,
  border: `1px solid ${violet400}`,
  padding: '8px 16px',
  borderRadius: 999,
};
