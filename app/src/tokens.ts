/**
 * Design tokens — single source of truth for the landing palette.
 *
 * Semantic names (violet500, ink900, paper) beat literal hex codes because
 * every callsite gets renamed when the brand shifts. `alpha(color, a)` composes
 * the same colors at any opacity without spawning a dozen rgba(...) literals.
 */

// Raw RGB triples — used by `alpha()` to compose semi-transparent variants.
const rgb = {
  violet500: '139,92,246',
  violet400: '167,139,250',
  ink900: '16,12,24',
} as const;

type RgbKey = keyof typeof rgb;

export const alpha = (key: RgbKey, a: number): string =>
  `rgba(${rgb[key]},${a})`;

// Brand violet.
export const violet500 = '#8B5CF6'; // primary brand accent
export const violet400 = '#A78BFA'; // secondary/highlight accent
export const violet25 = '#FBF9FE'; // faintest tint (input backgrounds)
export const violet50 = '#F3EEFC'; // card backgrounds
export const violet75 = '#F1ECFA'; // subtle modal chrome
export const violet100 = '#EAE1FA'; // icon tiles
export const violet700 = '#5B4A79'; // deep violet text

// Ink — dark surfaces & text scale.
export const ink900 = '#161020'; // nav / hero background
export const ink850 = '#181226'; // page text / dark surface
export const ink800 = '#3B3646'; // secondary text on light
export const ink700 = '#56505F'; // description text
export const ink600 = '#6B6577'; // muted text
export const ink500 = '#BDB3D4'; // muted text on dark
export const ink400 = '#CFC6E2'; // subdued text on dark
export const ink100 = '#F4F0FB'; // text on dark surfaces

// Paper.
export const paper = '#FFFFFF';

// Three.js — hex integers for MeshStandardMaterial / Color.
export const threeColors = {
  violet500: 0x8b5cf6,
  violet400: 0xb78bff,
  violetDeep: 0x3a1a8a,
  violetLight: 0xc4a6ff,
  violetAmbient: 0x9b7fe0,
  paper: 0xffffff,
} as const;
