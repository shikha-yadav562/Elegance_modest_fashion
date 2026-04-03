import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of elements) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  });
}
