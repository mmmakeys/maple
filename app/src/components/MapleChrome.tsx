/**
 * Shared МЭПЛ nav + footer for standalone subpages (/cases, /cases/*).
 * Mirrors the home-page chrome so the brand reads continuous across routes.
 * The primary CTA calls back into the host page, which owns the LeadModal.
 */
import { DISPLAY } from '../data';
import { ink100, ink400, ink850, ink900, paper, violet400, violet500 } from '../tokens';

const mark = (
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
);

const PAGE_MAX = 1280;
const col: React.CSSProperties = {
  width: '100%',
  maxWidth: PAGE_MAX,
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
};

export function MapleNav({ onLead }: { onLead: (e: React.MouseEvent) => void }) {
  return (
    <div style={{ background: ink900, color: ink100 }}>
      <div
        style={{
          ...col,
          padding: '22px clamp(20px,4vw,56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: ink100 }}>
          {mark}
          <span style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 600, letterSpacing: '0.02em' }}>МЭПЛ</span>
        </a>
        <div className="mm-nav-links">
          <a className="mm-nav-anchor" href="/#services" style={{ color: ink400, textDecoration: 'none' }}>
            Услуги
          </a>
          <a className="mm-nav-anchor" href="/cases" style={{ color: ink100, textDecoration: 'none' }}>
            Кейсы
          </a>
          <a className="mm-nav-anchor" href="/#team" style={{ color: ink400, textDecoration: 'none' }}>
            Команда
          </a>
          <a
            href="#"
            onClick={onLead}
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
  );
}

export function MapleFooter() {
  return (
    <div style={{ background: ink850, color: 'rgba(244,240,251,0.6)' }}>
      <div
        className="mm-footer-row"
        style={{ ...col, padding: '32px clamp(20px,4vw,56px)' }}
      >
        <a href="/" style={{ fontFamily: DISPLAY, fontSize: 16, color: ink100, fontWeight: 200, textDecoration: 'none' }}>
          МЭПЛ
        </a>
        <span>© 2026 · Растим проекты, а не отчёты</span>
      </div>
    </div>
  );
}

export const chromeCol = col;
export const chromePad = 'clamp(20px,4vw,56px)';
export { paper };
