import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { DISPLAY } from '../data';
import {
  alpha,
  ink100,
  ink400,
  ink600,
  ink700,
  ink850,
  ink900,
  paper,
  violet400,
  violet50,
  violet500,
} from '../tokens';
import { caseCards, caseCategories, type CaseCard, type CaseCategory } from '../cases';
import { MapleNav, MapleFooter, chromeCol, chromePad } from './MapleChrome';

const LeadModal = lazy(() => import('./LeadModal'));

const heading: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 600,
  letterSpacing: '-0.005em',
  textTransform: 'uppercase',
  margin: 0,
};

export default function CasesIndex() {
  const [active, setActive] = useState<CaseCategory>('Все');
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    document.title = 'Кейсы — МЭПЛ';
  }, []);

  const openLead = (e: React.MouseEvent) => {
    e.preventDefault();
    setLeadOpen(true);
  };

  const shown = useMemo(
    () => (active === 'Все' ? caseCards : caseCards.filter((c) => c.category === active)),
    [active],
  );

  return (
    <div style={{ background: paper, color: ink850, overflowX: 'hidden', minHeight: '100vh' }}>
      <MapleNav onLead={openLead} />

      {/* header band */}
      <div style={{ background: ink900, color: ink100, position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -120,
            top: -160,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('violet500', 0.5)}, ${alpha('violet500', 0)} 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ ...chromeCol, padding: `clamp(56px,7vw,92px) ${chromePad} clamp(40px,5vw,60px)`, position: 'relative', zIndex: 1 }}>
          <span
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
              marginBottom: 26,
            }}
          >
            Портфолио
          </span>
          <h1 style={{ ...heading, fontSize: 'clamp(44px, 8vw, 92px)', lineHeight: 0.94 }}>
            Что мы уже
            <br />
            <span style={{ color: violet400 }}>сделали</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px,2vw,20px)', lineHeight: 1.55, color: ink400, maxWidth: 560, margin: '24px 0 0' }}>
            Проекты, где маркетинг, PR, продажи и продакшн собраны в одну систему и доведены до результата. Раздел
            пополняется — здесь только то, что уже случилось.
          </p>
        </div>
      </div>

      {/* filters + grid */}
      <div style={{ background: paper }}>
        <div style={{ ...chromeCol, padding: `clamp(28px,4vw,44px) ${chromePad} clamp(72px,9vw,110px)` }}>
          <div className="mm-case-filters" role="tablist" aria-label="Категории кейсов">
            {caseCategories.map((cat) => {
              const on = cat === active;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(cat)}
                  className="mm-case-filter"
                  style={{
                    background: on ? ink850 : violet50,
                    color: on ? ink100 : ink700,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="mm-case-grid">
            {shown.map((c) => (
              <CaseGridCard key={c.slug} c={c} />
            ))}
          </div>

          {/* still-growing note */}
          <div
            style={{
              marginTop: 28,
              border: `1.5px dashed ${alpha('violet400', 0.5)}`,
              borderRadius: 20,
              padding: 'clamp(26px,4vw,38px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(20px,3vw,26px)', fontWeight: 600, textTransform: 'uppercase', color: ink850 }}>
                Скоро тут будет больше
              </div>
              <p style={{ fontSize: 16, color: ink600, margin: '10px 0 0', maxWidth: 460, lineHeight: 1.5 }}>
                Готовим к публикации ещё несколько проектов. Хотите оказаться среди них?
              </p>
            </div>
            <a
              href="#"
              onClick={openLead}
              style={{
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                background: violet500,
                color: paper,
                fontWeight: 800,
                fontSize: 16,
                padding: '16px 30px',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Обсудить проект →
            </a>
          </div>
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

const catLabel = (color: string): React.CSSProperties => ({
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color,
});

function CaseGridCard({ c }: { c: CaseCard }) {
  const clickable = Boolean(c.href);
  const Tag = (clickable ? 'a' : 'div') as React.ElementType;
  const tagProps = clickable ? { href: c.href } : {};

  // ── featured: big cover card that spans two rows ──
  if (c.accent === 'featured') {
    return (
      <Tag
        {...tagProps}
        className="mm-case-card mm-case-card--featured"
        style={{
          background: violet500,
          borderRadius: 22,
          overflow: 'hidden',
          color: paper,
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          minHeight: 420,
        }}
      >
        <div
          className="mm-case-cover"
          style={{
            flex: 1,
            minHeight: 240,
            backgroundImage: `url('${c.cover}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ padding: 'clamp(24px,3vw,34px)' }}>
          <span style={{ ...catLabel('#E4D6FC') }}>{c.category}</span>
          <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(24px,3vw,32px)', fontWeight: 200, margin: '12px 0 10px', lineHeight: 1.05 }}>
            {c.title}
          </div>
          <div style={{ fontSize: 16, color: '#EADFFB', marginBottom: 18 }}>{c.result}</div>
          <span className="mm-case-open" style={{ fontSize: 15, fontWeight: 800, color: paper }}>
            Открыть кейс →
          </span>
        </div>
      </Tag>
    );
  }

  const dark = c.accent === 'ink';
  const bg = dark ? ink850 : c.accent === 'violet' ? violet500 : violet50;
  const fg = dark || c.accent === 'violet' ? ink100 : ink850;
  const label = dark ? violet400 : c.accent === 'violet' ? '#E4D6FC' : violet500;
  const sub = dark ? ink400 : c.accent === 'violet' ? '#EADFFB' : ink600;

  return (
    <Tag
      {...tagProps}
      className="mm-case-card"
      style={{
        background: bg,
        color: fg,
        borderRadius: 22,
        padding: 'clamp(24px,3vw,32px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 22,
        minHeight: 200,
        textDecoration: 'none',
      }}
    >
      <span style={catLabel(label)}>{c.category}</span>
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(19px,2.4vw,23px)', fontWeight: 200, lineHeight: 1.2, marginBottom: 10 }}>
          {c.title}
        </div>
        <div style={{ fontSize: 15, color: sub, lineHeight: 1.45 }}>{c.result}</div>
      </div>
    </Tag>
  );
}
