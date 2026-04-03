import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      if (cursor) {
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    const onEnter = () => cursor?.classList.add("expanded");
    const onLeave = () => cursor?.classList.remove("expanded");

    document.addEventListener("mousemove", onMove);
    for (const el of document.querySelectorAll("a, button")) {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }

    animId = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block" />;
}
