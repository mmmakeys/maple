import { StrictMode, Suspense, lazy, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const CasesIndex = lazy(() => import('./components/CasesIndex.tsx'))
const CaseStory = lazy(() => import('./components/CaseStory.tsx'))

const path = window.location.pathname.replace(/\/+$/, '') || '/'

let Page: ReactNode
if (path === '/cases') {
  Page = <Suspense fallback={null}><CasesIndex /></Suspense>
} else if (path.startsWith('/cases/')) {
  Page = <Suspense fallback={null}><CaseStory slug={path.slice('/cases/'.length)} /></Suspense>
} else {
  Page = <App />
}

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
    // Совпадает с CSS-переходом (.3s). Выход системы должен быть быстрым:
    // держать пустой экран, когда контент уже готов, — налог на первое впечатление.
    setTimeout(() => el.remove(), 320);
  }, wait);
};
// Wait for two frames — the first one is React's initial paint, the second
// gives the browser a chance to run layout for the hero content.
requestAnimationFrame(() => requestAnimationFrame(hideLoader));
