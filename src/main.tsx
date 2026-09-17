import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initGA } from './lib/analytics.ts';

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

initGA();

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const root = document.getElementById('root')!;
const isPrerenderedRoute = window.location.pathname === '/';

if (root.hasChildNodes() && isPrerenderedRoute) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
