import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scenika.css'
import Scenika from './Scenika.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scenika />
  </StrictMode>,
)

// Заставка уходит после первого отрисованного кадра. Небольшая минимальная
// задержка спасает от вспышки, когда бандл уже в кэше и React монтируется
// почти мгновенно.
const MIN_LOADER_MS = 400
const bootStart = performance.now()
const hideLoader = () => {
  const el = document.getElementById('sc-loader')
  if (!el) return
  const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - bootStart))
  setTimeout(() => {
    el.classList.add('sc-loader--out')
    setTimeout(() => el.remove(), 320) // совпадает с длительностью перехода в CSS
  }, wait)
}
requestAnimationFrame(() => requestAnimationFrame(hideLoader))
