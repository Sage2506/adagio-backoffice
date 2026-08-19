// src/hooks/useScrollTracking.ts
import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/analytics';

export const useScrollTracking = (
    sectionId: string,
    sectionName: string,
    threshold: number = 0.5 // 50% visible para considerar "visto"
) => {
    const sectionRef = useRef<HTMLElement>(null);
    const hasBeenTracked = useRef(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Cuando la sección es visible y no se ha trackeado antes
                    if (entry.isIntersecting && !hasBeenTracked.current) {
                        hasBeenTracked.current = true;

                        // Enviar evento a Google Analytics
                        trackEvent('Scroll', 'Sección visible', sectionName);

                        // Opcional: También puedes enviar un evento a tu backend
                        // para análisis más profundos
                        console.log(`📊 Sección "${sectionName}" visible en el viewport`);
                    }
                });
            },
            { threshold } // 0.5 = 50% visible
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [sectionId, sectionName, threshold]);

    return sectionRef;
};