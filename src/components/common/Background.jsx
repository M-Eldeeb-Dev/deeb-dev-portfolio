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
    let width = container.clientWidth || window.innerWidth || 800;
    let height = container.clientHeight || Math.max(window.innerHeight * 0.9, 600);

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

    const initParticles = (w, h) => {
      const count = w < 768 ? 24 : 50;
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.6 + 1.0,
      }));
    };

    let particles = initParticles(width, height);

    const resize = () => {
      const newWidth = container.clientWidth || window.innerWidth || 800;
      const newHeight = container.clientHeight || Math.max(window.innerHeight * 0.9, 600);

      if (width === 0 || height === 0 || Math.abs(newWidth - width) > 100 || Math.abs(newHeight - height) > 100) {
        particles = initParticles(newWidth, newHeight);
      }

      width = newWidth;
      height = newHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const maxDistance = width < 768 ? 100 : 140;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.85;
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
        ctx.fillStyle = "rgba(34, 211, 238, 0.75)";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(34, 211, 238, 0.4)";
        ctx.fill();

        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) {
            p.x = 0;
            p.vx *= -1;
          } else if (p.x > width) {
            p.x = width;
            p.vx *= -1;
          }

          if (p.y < 0) {
            p.y = 0;
            p.vy *= -1;
          } else if (p.y > height) {
            p.y = height;
            p.vy *= -1;
          }
        }
      }

      if (!reducedMotion && isVisible && document.visibilityState === "visible") {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    // Draw frame
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
      { threshold: 0.01 }
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
