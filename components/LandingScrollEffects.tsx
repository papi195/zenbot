'use client';

import { useEffect } from 'react';

export default function LandingScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const animatedItems = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));

    root.classList.add('scroll-effects-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -14% 0px',
        threshold: 0.18,
      }
    );

    animatedItems.forEach((item) => observer.observe(item));

    return () => {
      root.classList.remove('scroll-effects-ready');
      observer.disconnect();
    };
  }, []);

  return null;
}
