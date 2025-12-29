import { useEffect, useMemo, useRef, useState } from "react";
import siteInfo from "../info.json";
import loadingGif from "./assets/loading.gif";
import profileImg from "./assets/me.png";
import contactGif from "./assets/contact.gif";
import aboutGif from "./assets/about-me.gif";
import imgSecurity from "./assets/Security-Website.webp";
import imgAdvanced from "./assets/Advanced-Dashbaord.webp";
import imgModern from "./assets/Modern-Porfolio.webp";
import imgAuto from "./assets/Auto-Parts.webp";
import imgWeather from "./assets/Weather-Dashboard.webp";
import imgElevvo from "./assets/Elevvo.webp";
import logoImg from "../public/logo.svg";

import "./App.css";
import SecureContactForm from "./components/SecureContactForm";

const GradientBackground = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
    <div
      className="absolute inset-0"
      style={{
        background:
          "var(--site-background-gradient, linear-gradient(135deg, #0b1220 0%, #0a1628 40%, #0a1e33 100%))",
      }}
    />
    {/* Subtle grid pattern */}
    <svg
      className="absolute inset-0 opacity-20"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#444"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Glowing geometric accents */}
    <div
      className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(circle at center, rgba(56,189,248,0.18), transparent 60%)",
      }}
    />
    <div
      className="absolute bottom-0 right-0 h-72 w-72 rotate-12"
      style={{
        background:
          "conic-gradient(from 0deg, rgba(56,189,248,0.18), transparent 60%)",
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
      }}
    />
  </div>
);

const ParticleWeb = ({
  particleCount = 80,
  speed = 0.6,
  maxConnectionDistance = 140,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const settings = useMemo(
    () => ({
      particleCount,
      maxConnectionDistance,
      particleColor: "rgba(56,189,248,0.9)",
      lineColor: "rgba(56,189,248,0.22)",
      mouseAttraction: 0.05,
      speed,
    }),
    [particleCount, speed, maxConnectionDistance]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (min, max) => Math.random() * (max - min) + min;
    particlesRef.current = Array.from({ length: settings.particleCount }).map(
      () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-settings.speed, settings.speed),
        vy: rand(-settings.speed, settings.speed),
        r: rand(1.2, 2.2),
      })
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // update and draw particles
      for (const p of particlesRef.current) {
        // attraction to mouse
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        p.vx += dx * settings.mouseAttraction * 0.0005;
        p.vy += dy * settings.mouseAttraction * 0.0005;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = settings.particleColor;
        ctx.fill();
      }

      // draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < settings.maxConnectionDistance) {
            const alpha = 1 - dist / settings.maxConnectionDistance;
            ctx.strokeStyle = settings.lineColor;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [settings]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const navItems = [
    { id: 1, label: "Home" },
    { id: 2, label: "About" },
    { id: 3, label: "Certificates" },
    { id: 4, label: "Portfolio" },
    { id: 5, label: "Services" },
    { id: 6, label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#home"
            className="text-white flex gap-2 font-montserrat font-semibold tracking-widest uppercase"
          >
            <span><img src={logoImg} width={25} height={25} alt="Deeb's Logo" title="Deeb's Logo" /></span>  Deeb
          </a>
          <nav className="hidden md:flex items-center justify-center text-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.label}`}
                className="text-white/80 nav-hover transition-colors uppercase tracking-wider text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="md:hidden text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-3 bg-black/80">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.label}`}
                onClick={() => setOpen(false)}
                className="text-white/90 text-center hover:text-accent uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = ({ profileSrc = profileImg }) => {
  return (
    <section id="Home" className="pt-24 md:pt-32 reveal">
      {/* Full-width typing banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full mx-auto mb-8">
          <img
            className="w-full h-auto"
            src="https://readme-typing-svg.herokuapp.com?lines=Full+Stack+Web+Developer;Backend+%26+Frontend+Specialist;Laravel+%7C+React+%7C+Node+Js;Clean+Code+%7C+SOLID+%7C+Design+Patterns;Always+Learning+New+Technologies&center=true&vCenter=true&size=48&width=1400&height=180"
            alt="Typing animation of skills"
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 items-center gap-12">
        <div className="text-white">
          <h1 className="font-montserrat font-bold tracking-wider uppercase text-4xl sm:text-5xl md:text-6xl">
            Mohamed Eldeeb
          </h1>
          <p className="mt-6 text-white/70 font-roboto text-lg leading-relaxed">
            <span className="block">
              I craft high-performance web applications with a focus on clean design, solid architecture, and scalability and yes, I do have a soft spot for potatoes 🥔.
            </span>
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="https://drive.google.com/file/d/1hrlK5OTNudz0aqzufFoY8pglejhe1rko/view?usp=sharing"
              target="_blank"
              className="px-6 py-3 border text-center hero-btn border-white/10 rounded-xl  uppercase tracking-wider transition-colors"
            >
              View Resume
            </a>
            <a
              href="#Contact"
              className="px-6 py-3 border text-center hero-btn border-white/10 rounded-xl uppercase tracking-wider  transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>
        <ProfileVisual src={profileSrc} />
      </div>
    </section>
  );
};

const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24 py-24 md:py-32 reveal">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-white font-montserrat font-bold uppercase tracking-widest text-2xl sm:text-3xl mb-8">
        {title}
      </h2>
      {children}
    </div>
  </section>
);

const About = () => {
  const [showAllTech, setShowAllTech] = useState(false);
  const techBadges = [
    { icon: "devicon-javascript-plain", label: "JavaScript" },
    { icon: "devicon-typescript-plain", label: "TypeScript" },
    { icon: "devicon-react-original", label: "React" },
    { icon: "devicon-nodejs-plain", label: "Node.js" },
    { icon: "devicon-tailwindcss-plain", label: "Tailwind" },
    { icon: "devicon-laravel-plain", label: "Laravel" },
    { icon: "devicon-python-plain", label: "Python" },
    { icon: "devicon-mysql-plain", label: "MySQL" },
    { icon: "devicon-nextjs-plain", label: "Next.js" },
    { icon: "devicon-mongodb-plain", label: "MongoDB" },
    { icon: "devicon-git-plain", label: "Git" },
    { icon: "devicon-docker-plain", label: "Docker" },
    { icon: "devicon-figma-plain", label: "Figma" },
    { icon: "devicon-graphql-plain", label: "GraphQL" },
    { icon: "devicon-express-original", label: "Expess" },
  ];
  const visibleTech = showAllTech ? techBadges : techBadges.slice(0, 6);

  return (
    <Section id="About" title="About">
      <div className="grid md:grid-cols-3 items-center gap-10 text-white/80 font-roboto">
        <div className="md:col-span-2 order-2 md:order-1">
          <p className="leading-relaxed text-base sm:text-lg">
            An aspiring Full-Stack Web Developer currently pursuing a junior. I
            spent a long time learning Full-Stack Web development, Git and
            Python in general, as well as basic networking, hardware and
            algorithms. Now I’m focused on performance, accessibility, and
            polished UX. Background in full-stack development, systems design,
            and developer experience.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visibleTech.map((t) => (
              <TechBadge key={t.label} iconClass={t.icon} label={t.label} />
            ))}
          </div>
          {techBadges.length > visibleTech.length && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAllTech(true)}
                className="btn-primary px-6 py-3 rounded-full cursor uppercase tracking-wider transition-colors text-base"
              >
                Show more
              </button>
            </div>
          )}
          {showAllTech && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAllTech(false)}
                className="btn-primary px-6 py-3 rounded-full cursor uppercase tracking-wider transition-colors text-base"
              >
                Show less
              </button>
            </div>
          )}
        </div>
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <img
            src={aboutGif}
            alt="About me"
            className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
             
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>
    </Section>
  );
};

const TechBadge = ({ iconClass, label }) => (
  <div className="card-hover flex justify-center items-center gap-2 border border-white/10 rounded-2xl p-5 text-sm tracking-wider text-white/90">
    <i className={`${iconClass} text-2xl colored`}></i>
    <span>{label}</span>
  </div>
);

const ProfileVisual = ({ src = profileImg }) => {
  return (
    <div className="relative flex justify-center md:justify-end">
      <div className="relative h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96 rounded-full overflow-hidden border border-accent shadow-[0_0_60px_rgba(159,0,255,0.35)]">
        <img
          src={src}
          decoding="async"
          fetchpriority="high"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1581276879432-15a89a5d16b6?q=80&w=1600&auto=format&fit=crop";
          }}
          alt="Profile"
          className="h-full w-full object-cover grayscale"
        />
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 0 2px rgba(56,189,248,0.45)" }}
        />
      </div>
      <div
        className="absolute -bottom-6 -left-6 h-16 w-16 rotate-12"
        style={{
          background:
            "linear-gradient(135deg, rgba(56,189,248,0.6), rgba(56,189,248,0.1))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />
    </div>
  );
};

const Portfolio = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const projects = [
    {
      id: 1,
      title: "Berimbolo Security Website",
      desc: "Responsive multi-section security services site with modern animations.",
      img: imgSecurity,
      demo: "https://M-Eldeeb-Dev.github.io/Berimbolo-Security-Website/",
      repo: "https://github.com/M-Eldeeb-Dev/Berimbolo-Security-Website",
    },
    {
      id: 2,
      title: "Advanced Admin Dashboard",
      desc: "Data-rich dashboard UI with charts, tables, and dark theme.",
      img: imgAdvanced,
      demo: "https://M-Eldeeb-Dev.github.io/Advanced_DashBoard/",
      repo: "https://github.com/M-Eldeeb-Dev/Advanced_DashBoard",
    },
    {
      id: 3,
      title: "Modern Personal Portfolio",
      desc: "Futuristic portfolio with smooth scroll, animations, and contact form.",
      img: imgModern,
      demo: "https://M-Eldeeb-Dev.github.io/Modern-Portfolio/",
      repo: "https://github.com/M-Eldeeb-Dev/Modern-Portfolio",
    },
    {
      id: 4,
      title: "Auto Parts Landing",
      desc: "Landing page for auto parts store with product highlights.",
      img: imgAuto,
      demo: "https://M-Eldeeb-Dev.github.io/Auto-Parts-Project/",
      repo: "https://github.com/M-Eldeeb-Dev/Auto-Parts-Project",
    },
    {
      id: 5,
      title: "Weather App Dashboard",
      desc: "Weather insights dashboard with cards and city search.",
      img: imgWeather,
      demo: "https://M-Eldeeb-Dev.github.io/Weather-App-Dashboard/",
      repo: "https://github.com/M-Eldeeb-Dev/Weather-App-Dashboard",
    },
    {
      id: 6,
      title: "Elevvo Internship Frontend",
      desc: "Internship work: React pages, API integration, and UI polishing.",
      img: imgElevvo,
      repo: "https://github.com/M-Eldeeb-Dev/Elevvo-Internship-Frontend",
    },
  ];

  const visibleProjects = showAllProjects ? projects : projects.slice(0, 3);

  return (
    <Section id="Portfolio" title="Portfolio">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.map((p) => (
          <div
            key={p.id}
            className="group relative border glass border-white/10 rounded-2xl overflow-hidden card-hover"
          >
            <img
              src={p.img}
              alt={p.title}
               
              decoding="async"
              fetchpriority="low"
              className="w-full h-56 sm:h-64 md:h-72 lg:h-60 mb-5 object-cover border border-white/10 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white mt-3 font-montserrat uppercase tracking-wider text-base sm:text-lg">
                {p.title}
              </h3>
              <p className="text-white/70 text-xl font-roboto">{p.desc}</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border border-white/10 rounded-lg text-white/90 text-xs uppercase tracking-wider cursor-pointer hover:border-accent hover:text-accent hover:bg-white/5 transition-colors"
                  >
                    Live Demo
                  </a>
                )}
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border border-white/10 rounded-lg text-white/90 text-xs uppercase tracking-wider cursor-pointer hover:border-accent hover:text-accent hover:bg-white/5 transition-colors"
                  >
                    GitHub Repo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length > visibleProjects.length && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAllProjects(true)}
            className="btn-primary px-6 py-3 rounded-full cursor uppercase tracking-wider transition-colors text-base"
          >
            Show more
          </button>
        </div>
      )}
      {showAllProjects && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAllProjects(false)}
            className="btn-primary px-6 py-3 rounded-full cursor uppercase tracking-wider transition-colors text-base"
          >
            Show less
          </button>
        </div>
      )}
    </Section>
  );
};

const Services = () => (
  <Section id="Services" title="Services">
    <div className="grid md:grid-cols-3 gap-6">
      {[
        {
          title: "Web Development 🌐",
          desc: "Fast, accessible, and SEO-ready websites.",
        },
        {
          title: "Applications 📱",
          desc: "Cross-platform apps with native feel.",
        },
        {
          title: "UI/UX Design 🎨",
          desc: "Modern interfaces with thoughtful interactions.",
        },
      ].map((card) => (
        <div
          key={card.title}
          className="border glass border-white/10 rounded-2xl p-6 text-white/80 card-hover"
        >
          <h3 className="text-white font-montserrat uppercase tracking-wider mb-2">
            {card.title}
          </h3>
          <p className="font-roboto">{card.desc}</p>
        </div>
      ))}
    </div>
  </Section>
);

const Certificates = () => {
  const items = [
    {
      title: "Front-End Development Course – Microsoft Global Learning Alpha",
      subtitle: "HTML, CSS, JS, Git Essentials To Advanced",
      year: "2024",
      desc: "Built solid & interactive websites and best practices.",
      link: "https://drive.google.com/file/d/1MDglZvcUATlTyebxCk5O5ggpZDv_wo1s/view?usp=sharing",
    },
    {
      title: "Python Developer Certification - SoloLearn",
      subtitle: "Python From Beginner To Advanced",
      year: "2025",
      desc: "Build complex Applications with scalable patterns.",
      link: "https://drive.google.com/file/d/1ExzATfR9BFAd3qjYq0mZO0X-ADiFhp9m/view?usp=sharing",
    },
    {
      title:
        "Full-Stack Web Development Course – Microsoft Global Learning Alpha",
      subtitle: "React, Laravel, PHP, Express, REST API, SQL",
      year: "2025",
      desc: "Built a secure backend Server-Side, deployed production APIs and fetch it on Client-Side",
      link: "https://drive.google.com/file/d/1RUljvbgEt2CIdQpOXa_lK8_zss5t2oR1/view?usp=sharing",
    },
    {
      title: "Elevvo Pathways Internship",
      subtitle: "Front-End Internship Focused On Reactjs and APIs",
      year: "2025",
      desc: "Automated pipelines and containerized apps.",
      link: "https://drive.google.com/file/d/1LIcV6Kxtl-ti5J_zntJRw6BnkPJhbkc6/view?usp=sharing",
    },
  ];
  return (
    <Section id="Certificates" title="Certificates">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />
        <ol className="space-y-5">
          {items.map((c, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <li key={c.title} className="reveal">
                <div className={`grid md:grid-cols-2 md:gap-10 items-start`}>
                  {/* Left side slot */}
                  <div className={`${isLeft ? "" : "md:col-start-1"}`}>
                    {isLeft && (
                      <div className="relative border border-white/10 rounded-2xl p-5 card-hover glass">
                        <span className="hidden md:block absolute -right-[7px] top-6 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_rgba(56,189,248,0.6)]" />
                        <h3 className="text-white font-montserrat uppercase tracking-wider">
                          {c.title}
                        </h3>
                        <p className="text-white/70 text-sm">{c.subtitle}</p>
                        <div className="text-white/60 text-xs uppercase tracking-wider mt-2">
                          {c.year}
                        </div>
                        <p className="text-white/80 font-roboto mt-2">
                          {c.desc}
                        </p>
                        {c.link && (
                          <div className="m-5">
                            <a
                              href={c.link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3  bg-certificate cursor uppercase border border-white/10 rounded-lg text-white/90 text-xs uppercase tracking-wider cursor-pointer hover:border-accent hover:text-accent hover:bg-white/5 transition-colors"
                            >
                              Show Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Right side slot */}
                  <div className="md:col-start-2">
                    {!isLeft && (
                      <div className="relative border border-white/10 rounded-2xl p-5 card-hover glass">
                        <span className="hidden md:block absolute -left-[7px] top-6 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_rgba(56,189,248,0.6)]" />
                        <h3 className="text-white font-montserrat uppercase tracking-wider">
                          {c.title}
                        </h3>
                        <p className="text-white/70 text-sm">{c.subtitle}</p>
                        <div className="text-white/60 text-xs uppercase tracking-wider mt-2">
                          {c.year}
                        </div>
                        <p className="text-white/80 font-roboto mt-2">
                          {c.desc}
                        </p>
                        {c.link && (
                          <div className="mt-4">
                            <a
                              href={c.link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 bg-certificate cursor uppercase border border-white/10 rounded-lg text-white/90 text-xs uppercase tracking-wider cursor-pointer hover:border-accent hover:text-accent hover:bg-white/5 transition-colors"
                            >
                              Show Certificate
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
};

const Contact = () => {
  return (
    <Section id="Contact" title="Contact">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="order-2 md:order-1 glass p-6 card-hover border border-white/10 rounded-2xl">
            <p className="text-white/80 font-roboto mb-6">
              Have a project in mind? Let’s build something exceptional together.
            </p>
          <SecureContactForm />
        </div>
        <div className="order-1 flex justify-between items-center md:order-2 glass h-100 p-6 text-white/80 card-hover border border-white/10 rounded-2xl">
          <div className="links">
            <h3
              style={{ fontSize: "1.8rem" }}
              className="text-white font-montserrat uppercase tracking-wider mb-2"
            >
              Connect With
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <i className="devicon-github-original text-2xl icon-contrast" />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/M-Eldeeb-Dev"
                  className="hover:text-accent"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i className="devicon-linkedin-plain colored text-2xl" />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="www.linkedin.com/in/mh-deeb"
                  className="hover:text-accent"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-accent"
                >
                  <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 20.25 19.5H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75Zm2.727-.75a.75.75 0 0 0-.477 1.33l7.5 6a.75.75 0 0 0 .96 0l7.5-6a.75.75 0 0 0-.96-1.16L12 11.96 4.704 6a.75.75 0 0 0-.477-.25Z" />
                </svg>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="mailto:mo6942853@gmail.com"
                  className="hover:text-accent"
                >
                  mo6942853@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <img
              src={contactGif}
              alt="Contact"
               
              decoding="async"
              fetchpriority="low"
              className="query-img w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain rounded-full"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default function App() {
  // Tweak these to tune density/speed and reveal timing globally
  const PROFILE_IMAGE = profileImg;
  const PARTICLE_SETTINGS = { count: 100, speed: 0.7, distance: 150 };
  const REVEAL_THRESHOLD = 0.12; // lower = earlier reveal
  const [showLoader, setShowLoader] = useState(true);
  const [isFadingLoader, setIsFadingLoader] = useState(false);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tw-font-roboto",
      "Roboto, sans-serif"
    );
    // Use gradient from info.json for body background
    const rawGradient =
      siteInfo?.style_guide?.color_palette?.background_gradient || "";
    const sanitized =
      typeof rawGradient === "string" ? rawGradient.replace(/;+\s*$/, "") : "";
    if (sanitized) {
      document.documentElement.style.setProperty(
        "--site-background-gradient",
        sanitized
      );
    }
    // keep card hover gradient as previously set
    document.documentElement.style.setProperty(
      "--card-hover-gradient",
      "linear-gradient(110.6deg, rgb(156, 116, 129) -18.3%, rgb(67, 54, 74) 16.4%, rgb(47, 48, 67) 68.2%, rgb(27, 23, 36) 99.1%)"
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsFadingLoader(true);
      const t2 = setTimeout(() => setShowLoader(false), 700);
      return () => clearTimeout(t2);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: REVEAL_THRESHOLD }
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen font-roboto text-white">
      {showLoader && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-700 ${isFadingLoader ? "opacity-0" : "opacity-100"
            }`}
          aria-hidden="true"
        >
          <div className="relative">
            <img
              src={loadingGif}
              alt="Loading"
              decoding="async"
              fetchpriority="high"
              className="h-24 rounded-2xl w-24 object-contain"
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl ring-2 border-accent animate-pulse"
              style={{ boxShadow: "0 0 28px rgba(56,189,248,0.35)" }}
            />
          </div>
        </div>
      )}
      <GradientBackground />
      <ParticleWeb
        particleCount={PARTICLE_SETTINGS.count}
        speed={PARTICLE_SETTINGS.speed}
        maxConnectionDistance={PARTICLE_SETTINGS.distance}
      />
      <Header />
      <main>
        <Hero profileSrc={PROFILE_IMAGE} />
        <About />
        <Certificates />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <footer className="border-t border-white/20 py-6 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} Deeb — Built with passion
      </footer>
    </div>
  );
}
