import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const Scenika = lazy(() => import('./components/Scenika.tsx'))

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path === '/scenika' ? (
  <Suspense fallback={null}>
    <Scenika />
  </Suspense>
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {Page}
  </StrictMode>,
)

// Fade out the boot loader once the browser has painted the first hero frame.
// A tiny minimum-visible delay avoids a jarring flash when the JS bundle is
// warm-cached and React mounts nearly instantly.
const MIN_LOADER_MS = 500;
const bootStart = performance.now();
const hideLoader = () => {
  const el = document.getElementById('mm-loader');
  if (!el) return;
  const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - bootStart));
  setTimeout(() => {
    el.classList.add('mm-loader--out');
    // Match the CSS transition (.5s) before removing from the DOM.
    setTimeout(() => el.remove(), 550);
  }, wait);
};
// Wait for two frames — the first one is React's initial paint, the second
// gives the browser a chance to run layout for the hero content.
requestAnimationFrame(() => requestAnimationFrame(hideLoader));
