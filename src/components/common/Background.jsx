import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Hero-scoped Canvas Particle Field.
 * Automatically throttles DPR to 2, scales particle density to viewport width,
 * pauses when out of view or tab is hidden, and renders a single static frame under reduced motion.
 */
export function HeroParticles() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();

    // Scale particle count to screen size: ~20 on mobile, ~45 on desktop
    const particleCount = width < 768 ? 20 : 45;
    const maxDistance = width < 768 ? 90 : 130;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.4 + 0.8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.65)";
        ctx.fill();

        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      if (!reducedMotion && isVisible && document.visibilityState === "visible") {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    // Draw single frame if reduced motion
    if (reducedMotion) {
      draw();
      return;
    }

    // Visibility observer to pause canvas rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(draw);
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      } else if (!document.hidden && isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const handleResize = () => {
      resize();
      if (!animationFrameId && isVisible) {
        draw();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

/**
 * Page-wide static background:
 * Layered radial gradients + subtle inline SVG noise overlay.
 */
export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    >
      {/* Base Obsidian gradient fill */}
      <div className="absolute inset-0 bg-surface-0" />

      {/* Ambient Top Glow: Restrained Violet */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full blur-[140px] opacity-25"
        style={{
          background:
            "radial-gradient(circle at center, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%)",
        }}
      />

      {/* Ambient Bottom Glow: Restrained Cyan */}
      <div
        className="absolute bottom-1/4 left-0 w-[500px] h-[450px] rounded-full blur-[130px] opacity-15"
        style={{
          background:
            "radial-gradient(circle at center, #06b6d4 0%, rgba(6, 182, 212, 0) 70%)",
        }}
      />

      {/* SVG Micro-Noise Layer */}
      <div className="absolute inset-0 bg-noise opacity-40" />
    </div>
  );
}
