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

  return (
    <div style={{ background: paper, color: ink850, overflowX: 'hidden' }}>
      <MapleNav onLead={openLead} />

      {/* ── hero ── */}
      <div style={{ background: ink900, color: ink100, position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -140,
            top: -180,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('violet500', 0.5)}, ${alpha('violet500', 0)} 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ ...chromeCol, padding: `clamp(26px,4vw,40px) ${chromePad} 0`, position: 'relative', zIndex: 1 }}>
          <a href="/cases" className="mm-case-back" style={{ color: ink400, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
            ← Все кейсы
          </a>
        </div>
        <div
          className="mm-case-hero"
          style={{ ...chromeCol, padding: `clamp(28px,4vw,44px) ${chromePad} clamp(48px,6vw,72px)`, position: 'relative', zIndex: 1 }}
        >
          <div className="mm-case-hero-copy">
            <span style={{ ...catChip }}>{story.category}</span>
            <h1 style={{ ...heading, fontSize: 'clamp(38px,6.4vw,80px)', lineHeight: 0.96, margin: '22px 0 0' }}>
              {story.title.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block', color: i === 0 ? ink100 : violet400 }}>
                  {line}
                </span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(17px,2vw,20px)', lineHeight: 1.55, color: ink400, margin: '24px 0 0', maxWidth: 560 }}>
              {story.lead}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 26 }}>
              {story.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: alpha('violet400', 0.14),
                    border: `1px solid ${alpha('violet400', 0.32)}`,
                    color: '#D9CEF0',
                    borderRadius: 999,
                    padding: '7px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="mm-case-hero-cover"
            style={{
              backgroundImage: `url('${story.cover}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 22,
            }}
          />
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

      {/* ── task ── */}
      <div style={{ background: paper }}>
        <div className="mm-case-split" style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad} clamp(28px,4vw,40px)` }}>
          <h2 style={sectionTitle}>Задача</h2>
          <p style={{ fontSize: 'clamp(18px,2.1vw,22px)', lineHeight: 1.6, color: ink700, margin: 0 }}>{story.task}</p>
        </div>
      </div>

      {/* ── what we built ── */}
      <div style={{ background: paper }}>
        <div style={{ ...chromeCol, padding: `clamp(28px,4vw,40px) ${chromePad} clamp(56px,7vw,80px)` }}>
          <h2 style={{ ...sectionTitle, marginBottom: 'clamp(28px,4vw,44px)' }}>
            Что мы <span style={{ color: violet500 }}>собрали</span>
          </h2>
          <div className="mm-case-build">
            {story.build.map((b, i) => (
              <div key={b.t} className="mm-case-build-item" style={{ background: violet50, borderRadius: 18, padding: 'clamp(24px,3vw,32px)' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: violet500, lineHeight: 1, marginBottom: 18 }}>
                  0{i + 1}
                </div>
                <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25, marginBottom: 10 }}>{b.t}</div>
                <div style={{ fontSize: 15.5, lineHeight: 1.55, color: ink600 }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── results (dark) ── */}
      <div style={{ background: ink900, color: ink100 }}>
        <div style={{ ...chromeCol, padding: `clamp(64px,8vw,96px) ${chromePad}` }}>
          <h2 style={{ ...sectionTitle, color: ink100, marginBottom: 'clamp(32px,4vw,48px)' }}>
            Результаты
          </h2>
          <div className="mm-case-results">
            {story.results.map((r) => (
              <div key={r.l} className="mm-case-result" style={{ borderTop: `2px solid ${alpha('violet400', 0.4)}`, paddingTop: 22 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(40px,6vw,72px)', fontWeight: 600, color: violet400, lineHeight: 0.95 }}>
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

      {/* ── team on the project ── */}
      {relevant.length > 0 && (
        <div style={{ background: ink900, color: ink100 }}>
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
                  <div style={{ fontSize: 14, lineHeight: 1.45, color: ink500 }}>{m.role}</div>
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
