import { DISPLAY, type Member } from '../data';

const tgIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#A78BFA">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

const label: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#8B5CF6',
  marginBottom: 14,
};

export default function CVModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(16,12,24,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 600,
          maxWidth: '100%',
          maxHeight: '84vh',
          overflow: 'auto',
          background: '#FFFFFF',
          color: '#181226',
          borderRadius: 20,
          padding: '40px 42px 44px',
          boxShadow: '0 40px 100px -30px rgba(16,12,24,0.6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              role="img"
              aria-label={member.name}
              style={{
                flex: '0 0 auto',
                width: 64,
                height: 64,
                borderRadius: 14,
                backgroundImage: `url('${member.photo}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 28,
                  fontWeight: 200,
                  lineHeight: 1.05,
                }}
              >
                {member.name}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: '#6B6577',
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {member.role}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              cursor: 'pointer',
              flex: '0 0 auto',
              width: 38,
              height: 38,
              borderRadius: 10,
              border: 'none',
              background: '#F1ECFA',
              color: '#6B6577',
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: '#3B3646',
            margin: '26px 0 28px',
          }}
        >
          {member.cv.about}
        </p>

        <div style={label}>Опыт</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 11,
            marginBottom: 30,
          }}
        >
          {member.cv.exp.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span
                style={{
                  flex: '0 0 auto',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#8B5CF6',
                  marginTop: 8,
                }}
              />
              <span style={{ fontSize: 15, lineHeight: 1.5, color: '#3B3646' }}>{e}</span>
            </div>
          ))}
        </div>

        {member.cv.cases && (
          <>
            <div style={label}>Ключевые кейсы</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 30,
              }}
            >
              {member.cv.cases.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    background: '#F7F3FE',
                    border: '1px solid rgba(139,92,246,0.16)',
                    borderRadius: 12,
                    padding: '13px 16px',
                  }}
                >
                  <span style={{ flex: '0 0 auto', color: '#8B5CF6', fontSize: 16, lineHeight: 1.4 }}>
                    ★
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1.5, color: '#3B3646' }}>{c}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={label}>Компетенции</div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 32,
          }}
        >
          {member.cv.skills.map((sk, i) => (
            <span
              key={i}
              style={{
                background: '#F3EEFC',
                border: '1px solid rgba(139,92,246,0.24)',
                color: '#5B4A79',
                borderRadius: 999,
                padding: '7px 14px',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {sk}
            </span>
          ))}
        </div>

        <a
          href={member.tg}
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            background: '#161020',
            color: '#F4F0FB',
            fontWeight: 800,
            fontSize: 15,
            padding: '15px 26px',
            borderRadius: 11,
          }}
        >
          {tgIcon}
          Написать в Telegram
        </a>
      </div>
    </div>
  );
}
