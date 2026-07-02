import { useState } from 'react';
import { DISPLAY, budgetOpts } from '../data';
import {
  alpha,
  ink600,
  ink800,
  ink850,
  ink900,
  paper,
  violet25,
  violet75,
  violet100,
  violet400,
  violet500,
  violet700,
} from '../tokens';

// One-off input border tint — appears only inside this component.
const inputBorder = '#E4DCF3';

type Lead = {
  name: string;
  email: string;
  phone: string;
  site: string;
  social: string;
  brief: string;
  budget: string;
};

const emptyLead: Lead = {
  name: '',
  email: '',
  phone: '',
  site: '',
  social: '',
  brief: '',
  budget: '',
};

const inputStyle: React.CSSProperties = {
  fontSize: 16,
  padding: '13px 15px',
  border: `1.5px solid ${inputBorder}`,
  borderRadius: 11,
  background: violet25,
  color: ink850,
  outline: 'none',
  fontFamily: 'inherit',
  fontWeight: 500,
};

const fieldLabel: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.02em',
  color: ink800,
};

const primaryBtn: React.CSSProperties = {
  cursor: 'pointer',
  fontFamily: DISPLAY,
  fontWeight: 600,
  fontSize: 16,
  textTransform: 'uppercase',
  color: paper,
  background: violet500,
  border: 'none',
  padding: 16,
  borderRadius: 11,
};

export default function LeadModal({ onClose }: { onClose: () => void }) {
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Lead) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLead((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: alpha('ink900', 0.72),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 40px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          background: paper,
          color: ink850,
          borderRadius: 20,
          padding: 'clamp(22px, 5vw, 40px) clamp(20px, 5vw, 40px)',
          boxShadow: `0 40px 100px -30px ${alpha('ink900', 0.6)}`,
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
          <div>
            <h3
              style={{
                fontFamily: DISPLAY,
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.05,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}
            >
              Тут оставляют заявки
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.5, color: ink600, margin: '12px 0 0' }}>
              Никаких прайс-листов – только индивидуальный подход
            </p>
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
              background: violet75,
              color: ink600,
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div style={{ marginTop: 34, textAlign: 'center', padding: '20px 0 8px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: violet100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 22px',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke={violet500}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 12.5 10 18 20 6"></polyline>
              </svg>
            </div>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 24,
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Заявка отправлена
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: ink600, margin: '0 auto', maxWidth: 380 }}>
              Свяжемся с вами в ближайшее время и предложим индивидуальное решение.
            </p>
            <button
              onClick={onClose}
              style={{
                cursor: 'pointer',
                marginTop: 28,
                fontFamily: DISPLAY,
                fontWeight: 600,
                fontSize: 15,
                textTransform: 'uppercase',
                color: ink900,
                background: violet400,
                border: 'none',
                padding: '15px 30px',
                borderRadius: 10,
              }}
            >
              Готово
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, margin: '28px 0 24px' }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: violet500 }} />
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: step === 2 ? violet500 : violet100,
                }}
              />
            </div>

            {step === 1 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={fieldLabel}>
                    Имя
                    <input
                      type="text"
                      value={lead.name}
                      onChange={set('name')}
                      placeholder="Как к вам обращаться"
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    Email
                    <input
                      type="email"
                      value={lead.email}
                      onChange={set('email')}
                      placeholder="you@company.com"
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    Телефон
                    <input
                      type="tel"
                      value={lead.phone}
                      onChange={set('phone')}
                      placeholder="+7 900 000-00-00"
                      style={inputStyle}
                    />
                  </label>
                </div>
                <button
                  onClick={() => setStep(2)}
                  style={{ ...primaryBtn, width: '100%', marginTop: 26 }}
                >
                  Далее →
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <label style={fieldLabel}>
                    Сайт
                    <input
                      type="text"
                      value={lead.site}
                      onChange={set('site')}
                      placeholder="mysite.ru"
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    Соцсети
                    <input
                      type="text"
                      value={lead.social}
                      onChange={set('social')}
                      placeholder="Telegram, VK, Instagram…"
                      style={inputStyle}
                    />
                  </label>
                  <label style={fieldLabel}>
                    Бриф
                    <textarea
                      value={lead.brief}
                      onChange={set('brief')}
                      rows={3}
                      placeholder="Коротко о задаче и целях"
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.02em', color: ink800 }}>
                      Бюджет
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {budgetOpts.map((label) => {
                        const active = lead.budget === label;
                        return (
                          <button
                            key={label}
                            onClick={() => setLead((s) => ({ ...s, budget: label }))}
                            style={{
                              cursor: 'pointer',
                              fontSize: 14,
                              fontWeight: 600,
                              padding: '9px 15px',
                              borderRadius: 999,
                              border: `1.5px solid ${active ? violet500 : inputBorder}`,
                              background: active ? violet500 : violet25,
                              color: active ? paper : violet700,
                              fontFamily: 'inherit',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      cursor: 'pointer',
                      flex: '0 0 auto',
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      color: ink900,
                      background: violet75,
                      border: 'none',
                      padding: '16px 24px',
                      borderRadius: 11,
                    }}
                  >
                    ← Назад
                  </button>
                  <button onClick={() => setSent(true)} style={{ ...primaryBtn, flex: 1 }}>
                    Отправить заявку
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
