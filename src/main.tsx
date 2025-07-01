import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router'
import { Router } from './routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Router />
    </BrowserRouter>
  </StrictMode>
)
