// src/lib/analytics.ts
import ReactGA from "react-ga4";

// Solo inicializar si existe el ID y estamos en producción
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  // Solo inicializar en producción Y si hay ID configurado
  if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  } else {
    console.log('⏭️ Google Analytics desactivado (entorno no productivo)');
  }
};

export const trackPageView = (path: string) => {
  if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

export const trackExternalLink = (url: string, text?: string) => {
  if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: "External Link",
      action: "Click",
      label: text || url,
      value: 0,
    });
  }
};