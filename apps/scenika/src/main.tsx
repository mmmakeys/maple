import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scenika.css'
import Scenika from './Scenika.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scenika />
  </StrictMode>,
)

