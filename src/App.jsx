import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  Award, Package, Home, ChevronDown, Check,
  Flame, ShieldCheck, Heart, Sparkles, Users,
} from 'lucide-react';

import ScrollCharacter from './components/ScrollCharacter';
import RegistrationForm from './components/RegistrationForm';

gsap.registerPlugin(ScrollTrigger);

/* ── Scroll‑synced gradient colours per phase ─────────────────────────── */
const phaseGradients = [
  'from-[#041020]/0 via-[#041020]/0 to-[#041020]/0',     // Hero – fully transparent
  'from-[#041525]/70 via-[#041525]/50 to-transparent',   // Phase 1
  'from-[#041525]/75 via-[#051928]/55 to-transparent',   // Phase 2
  'from-[#030e1c]/80 via-[#030e1c]/55 to-transparent',   // Phase 3
  'from-[#020b15]/85 via-[#020b15]/60 to-transparent',   // Phase 4
];

export default function App() {
  const appRef = useRef(null);

  /* ── Lenis smooth scroll + GSAP sync ──────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration:      1.6,
      easing:        (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:   true,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, []);

  /* ── GSAP scroll animations for text panels ───────────────────────── */
  useGSAP(() => {
    /* Stagger‑reveal inside every narrative panel */
    gsap.utils.toArray('.narrative-panel').forEach((panel) => {
      gsap.fromTo(
        panel.querySelectorAll('.reveal-item'),
        { opacity: 0, y: 48, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 72%',
            end:   'bottom 28%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });

    /* Narrative panels parallax floating */
    gsap.utils.toArray('.narrative-panel').forEach((panel) => {
      gsap.fromTo(panel,
        { y: 55 },
        {
          y: -55,
          ease: 'none',
          scrollTrigger: {
            trigger: panel.closest('section'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.0
          }
        }
      );
    });

    /* Animated caustic shimmer drift */
    gsap.to('.sc-caustic-shimmer', {
      backgroundPositionX: '+=200px',
      backgroundPositionY: '+=80px',
      duration: 14,
      repeat: -1,
      ease: 'none',
    });

    /* Hero subtitle char‑by‑char */
    gsap.fromTo('.hero-tag',
      { opacity: 0, y: -20, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
    gsap.fromTo('.hero-title',
      { opacity: 0, y: 60, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out', delay: 0.3 }
    );
    gsap.fromTo('.hero-sub',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.7 }
    );
    gsap.fromTo('.hero-cta',
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.8)', delay: 1.0 }
    );

    /* Scroll‑down arrow pulse */
    gsap.to('.scroll-arrow', {
      y: 10, opacity: 0.4, duration: 1.2,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

  }, { scope: appRef });

  const scrollToCTA = () => {
    document.getElementById('cta-final')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={appRef} className="relative w-full min-h-screen bg-[#030d18] text-white overflow-x-hidden">

      {/* ── Fixed full‑screen character layer (z‑0) ──────────────────── */}
      <ScrollCharacter />

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/[0.06] backdrop-blur-xl bg-[#030d18]/40">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏊‍♂️</span>
          <span className="font-display font-black text-xl tracking-wider text-white">
            SWIM<span className="text-sun">HOME</span>
          </span>
        </div>
        <button
          onClick={scrollToCTA}
          className="bg-sun hover:bg-yellow-300 active:scale-95 text-[#030d18] font-display font-black text-xs sm:text-sm px-5 py-2.5 rounded-full border border-white/20 shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          Aula Experimental
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          SCROLLYTELLING CONTAINER
          Each section = 100vh → triggers the ScrollCharacter phase
          ══════════════════════════════════════════════════════════ */}
      <div id="scrollytelling-container" className="relative z-10 w-full">

        {/* ── HERO (Section 0) ───────────────────────────────────────── */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
          {/* Vignette / radial fade so text pops above character */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent,rgba(3,13,24,0.55)_70%,rgba(3,13,24,0.85)_100%)] pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="hero-tag inline-flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.12] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-widest text-cyan-300 uppercase mb-7 backdrop-blur-md">
              <Sparkles size={13} className="text-sun animate-pulse" />
              Natação Infantil Premium em Casa
            </span>

            <h1 className="hero-title font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-7">
              A natação que vai<br />
              <span className="relative inline-block text-sun">
                até você
                <span className="absolute -bottom-1 left-0 w-full h-[5px] rounded bg-cyan-400/60 blur-sm" />
              </span>
            </h1>

            <p className="hero-sub text-lg sm:text-xl text-white/70 mb-10 leading-relaxed font-medium max-w-xl mx-auto">
              Aulas de natação infantil personalizadas na piscina da sua residência ou condomínio.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToCTA}
                className="bg-sun hover:bg-yellow-300 active:scale-95 text-[#030d18] font-display font-black text-base px-9 py-4 rounded-2xl shadow-2xl border-2 border-white/20 hover:-translate-y-1 transition-all duration-200"
              >
                Agendar Aula Experimental
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-arrow absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-widest">
            <ChevronDown size={22} className="text-white/50" />
            <span>Role para iniciar</span>
          </div>
        </section>

        {/* ── PHASE 1: O Mergulho ────────────────────────────────────── */}
        <section className="relative w-full min-h-screen flex items-center justify-start px-6 md:px-20 py-20">
          <div className="narrative-panel glass-immersive max-w-lg w-full">
            <PhaseTag num="01" color="text-cyan-300" />
            <h2 className="reveal-item font-display font-black text-3xl sm:text-4xl text-white mb-5 leading-tight">
              Levamos toda a estrutura de natação até você!
            </h2>
            <p className="reveal-item text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Sem trânsito, sem logística, sem mochilas. Transformamos a sua piscina em uma escola de desenvolvimento infantil.
            </p>
            <div className="space-y-5">
              {[
                { Icon: Award,   title: 'Instrutores Certificados', desc: 'Especialistas em pedagogia aquática infantil e salvamento.' },
                { Icon: Package, title: 'Equipamentos Inclusos',    desc: 'Pranchas, brinquedos e acessórios levados a cada aula.' },
                { Icon: Home,    title: 'No Conforto do Lar',       desc: 'Aulas na piscina da sua casa ou condomínio, sem estresse.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="reveal-item flex gap-4 items-start">
                  <div className="p-2.5 bg-cyan-400/10 border border-cyan-400/25 rounded-xl text-sun flex-shrink-0 mt-0.5">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-0.5">{title}</h4>
                    <p className="text-white/55 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHASE 2: Aprendizado Lúdico ───────────────────────────── */}
        <section className="relative w-full min-h-screen flex items-center justify-end px-6 md:px-20 py-20">
          <div className="narrative-panel glass-immersive max-w-lg w-full">
            <PhaseTag num="02" color="text-blue-300" />
            <h2 className="reveal-item font-display font-black text-3xl sm:text-4xl text-white mb-5 leading-tight">
              Metodologia focada na evolução real
            </h2>
            <p className="reveal-item text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Unimos ensino profissional com histórias e brincadeiras aquáticas. A criança aprende a nadar sem perceber que está sendo ensinada.
            </p>
            <div className="space-y-4">
              {[
                { n: '1', title: 'Adaptação Aquática',    desc: 'Respiração, controle e segurança desde o primeiro contato com a água.' },
                { n: '2', title: 'Autonomia e Flutuação', desc: 'Coordenação motora e equilíbrio para nadar distâncias curtas com segurança.' },
                { n: '3', title: 'Domínio dos Estilos',   desc: 'Crawl, costas, peito e borboleta com técnica e resistência crescentes.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="reveal-item flex gap-4 items-start bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
                  <div className="bg-sun text-[#030d18] font-black rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center text-sm shadow">{n}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
                    <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHASE 3: Resultados Reais ──────────────────────────────── */}
        <section className="relative w-full min-h-screen flex items-center justify-start px-6 md:px-20 py-20">
          <div className="narrative-panel glass-immersive max-w-lg w-full">
            <PhaseTag num="03" color="text-teal-300" />
            <h2 className="reveal-item font-display font-black text-3xl sm:text-4xl text-white mb-5 leading-tight">
              O orgulho de quem vê o filho evoluir
            </h2>
            <p className="reveal-item text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Mais do que natação, entregamos tranquilidade para as famílias.
            </p>
            <div className="space-y-4">
              {[
                { quote: '"Meu filho de 4 anos morria de medo de água e hoje já dá saltos e flutua sozinho. A evolução é impressionante!"', author: '— Juliana M., Mãe do Felipe' },
                { quote: '"Começou com 2 aninhos e hoje com 6 já domina a técnica. Vale cada centavo!"', author: '— Ricardo F., Pai do Theo' },
              ].map(({ quote, author }) => (
                <div key={author} className="reveal-item bg-white/[0.07] border border-white/[0.1] rounded-2xl p-5 backdrop-blur-sm">
                  <p className="italic text-white/70 text-sm leading-relaxed mb-3">{quote}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">★★★★★</span>
                    <span className="font-bold text-xs text-white/50">{author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHASE 4: Habilidade para a Vida ───────────────────────── */}
        <section className="relative w-full min-h-screen flex items-center justify-end px-6 md:px-20 py-20">
          <div className="narrative-panel glass-immersive max-w-lg w-full">
            <PhaseTag num="04" color="text-indigo-300" />
            <h2 className="reveal-item font-display font-black text-3xl sm:text-4xl text-white mb-5 leading-tight">
              Brincadeira hoje, segurança para sempre
            </h2>
            <p className="reveal-item text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Natação é uma habilidade de sobrevivência vitalícia — não apenas esporte.
            </p>
            <div className="reveal-item grid grid-cols-2 gap-3 mb-10">
              {[
                { Icon: ShieldCheck, label: 'Segurança Máxima' },
                { Icon: Heart,       label: 'Saúde e Vigor'    },
                { Icon: Users,       label: 'Confiança Pessoal'},
                { Icon: Flame,       label: 'Disciplina e Foco'},
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <div className="text-sun"><Icon size={16} /></div>
                  <span className="text-white/80 font-bold text-sm">{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={scrollToCTA}
              className="reveal-item block w-full bg-sun hover:bg-yellow-300 text-[#030d18] font-display font-black text-base py-4 rounded-2xl shadow-xl border-2 border-white/20 hover:-translate-y-1 active:scale-95 transition-all duration-200"
            >
              Quero Garantir Essa Habilidade
            </button>
          </div>
        </section>

      </div>
      {/* end scrollytelling-container */}

      {/* ── CTA FINAL + Footer ───────────────────────────────────────── */}
      <section
        id="cta-final"
        className="relative z-10 w-full bg-gradient-to-b from-[#030d18] via-[#051e34] to-[#0a3d5c] py-24 px-6 md:px-20 overflow-hidden"
      >
        {/* Background bubbles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/10 bg-white/5"
            style={{
              width:  20 + Math.random() * 40,
              height: 20 + Math.random() * 40,
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        ))}

        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

          {/* Value pitch */}
          <div className="w-full lg:w-1/2">
            <span className="inline-flex items-center gap-1.5 bg-sun/15 border border-sun/30 text-sun px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6">
              🏊‍♂️ Matrículas Abertas
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Dê ao seu filho o melhor presente para a vida toda
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed">
              Agende uma aula experimental sem compromisso. Nosso professor vai até a sua piscina e demonstra nossa metodologia lúdica em ação.
            </p>
            <div className="space-y-3">
              {['Sem taxa de matrícula inicial', 'Aulas 100% personalizadas (individuais ou em dupla)', 'Flexibilidade de dias e horários'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="bg-sun rounded-full p-1 text-[#030d18] flex-shrink-0">
                    <Check size={13} strokeWidth={4} />
                  </div>
                  <span className="font-medium text-white/80 text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-1/2">
            <RegistrationForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="relative max-w-6xl mx-auto border-t border-white/10 mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏊‍♂️</span>
            <span className="font-display font-black tracking-wider text-white/70">
              SWIM<span className="text-sun/70">HOME</span>
            </span>
          </div>
          <p className="text-xs text-center">© {new Date().getFullYear()} Swim Home. Todos os direitos reservados.</p>
          <a
            href="https://instagram.com/swimhome"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="text-sm font-bold">@swimhome</span>
          </a>
        </footer>
      </section>
    </div>
  );
}

/* ── Small inline component ──────────────────────────────────────────── */
function PhaseTag({ num, color }) {
  return (
    <div className={`reveal-item flex items-center gap-2 mb-4`}>
      <span className={`font-mono text-xs font-black ${color} opacity-60`}>{num}</span>
      <span className={`h-px flex-1 bg-current ${color} opacity-20`} />
    </div>
  );
}
