import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { label: 'Bebê Peixinho (Nascimento)',      phase: '01', image: '/nb_baby_fish.png',      duration: '0.5s' },
  { label: 'Peixinho Dourado (Crescimento)',  phase: '02', image: '/nb_junior_fish.png',    duration: '0.7s' },
  { label: 'Peixe-Palhaço (Autonomia)',       phase: '03', image: '/nb_clown_fish.png',     duration: '0.9s' },
  { label: 'Tubarãozinho Aprendiz (Técnica)',  phase: '04', image: '/nb_young_shark.png',    duration: '1.1s' },
  { label: 'Tubarão Soberano (Domínio)',      phase: '05', image: '/nb_sovereign_shark.png', duration: '1.4s' },
];

const phaseColors = [
  { from: '#ffd200', to: '#ff6a00', glow: 'rgba(255,210,0,0.55)',  glowHex: '#ffd200' },
  { from: '#ff5e62', to: '#ff9966', glow: 'rgba(255,94,98,0.5)',   glowHex: '#ff5e62' },
  { from: '#ff4b2b', to: '#ff416c', glow: 'rgba(255,75,43,0.45)',  glowHex: '#ff4b2b' },
  { from: '#00f2fe', to: '#4facfe', glow: 'rgba(0,242,254,0.45)',  glowHex: '#00f2fe' },
  { from: '#2575fc', to: '#1a2a6c', glow: 'rgba(37,117,252,0.55)', glowHex: '#2575fc' },
];

export default function ScrollCharacter() {
  const wrapperRef    = useRef(null);
  const mirrorRef     = useRef(null);
  const bodyWiggleRef = useRef(null);
  const floatRef      = useRef(null);
  const portalRef     = useRef(null);
  const displacRef    = useRef(null);
  const turbuRef      = useRef(null);
  const charRefs      = useRef([]);

  const frameRef          = useRef(0);
  const morphScaleRef     = useRef(0);
  const velocityFactorRef = useRef(0);

  const [activeFrame, setActiveFrame] = useState(0);

  useGSAP(() => {
    // ── 1. Idle float ──────────────────────────────────────────
    gsap.to(floatRef.current, {
      y: '+=10', duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 2. Portal pulse ───────────────────────────────────────
    gsap.to(portalRef.current, {
      scale: 1.05, opacity: 0.85, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 3. Ambient bubble rise ────────────────────────────────
    gsap.utils.toArray('.sc-bubble').forEach((el) => {
      gsap.to(el, {
        y: -(window.innerHeight + 100),
        duration: gsap.utils.random(6, 13),
        repeat: -1,
        delay: gsap.utils.random(0, 8),
        ease: 'none',
      });
    });

    // ── 4. Liquid water-morph displacement ticker ─────────────
    const kickObj = { phase: 0 };
    const tickHandler = () => {
      try {
        kickObj.phase += 0.016 * 8;
        const phase = kickObj.phase;
        const vel = Number(velocityFactorRef.current) || 0;
        // Mild wave scale so it has fluid organic water refraction shimmer
        const dispAmp = 4 + vel * 20;
        const dispVal = morphScaleRef.current + Math.sin(phase) * dispAmp;

        if (displacRef.current) {
          displacRef.current.setAttribute('scale', String(Math.max(0, dispVal)));
        }
      } catch (_) {}
    };
    gsap.ticker.add(tickHandler);

    // ── 5. X/Y swim path timeline ─────────────────────────────
    const swimTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#scrollytelling-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    });

    swimTimeline
      .set(wrapperRef.current,  { x: 0,    y: -90 })
      .to(wrapperRef.current,   { x: 200,  y: -45,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: -200, y:  0,   ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: 200,  y:  45,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: -180, y:  90,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: 0,    y:  120, ease: 'sine.inOut', duration: 1 });

    // ── 6. Phase evolution + orientation ──────────────────────
    let prevX = 0;
    let prevY = -90;

    ScrollTrigger.create({
      trigger: '#scrollytelling-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate(self) {
        const { progress } = self;
        const velocity = self.getVelocity() || 0;
        const normVel = gsap.utils.clamp(0, 1, Math.abs(velocity) / 2000);
        velocityFactorRef.current = normVel;

        const thresholds = [0.18, 0.38, 0.58, 0.78];
        const newIdx = thresholds.findIndex((t) => progress < t);
        const idx = newIdx === -1 ? 4 : newIdx;

        if (idx !== frameRef.current) {
          frameRef.current = idx;
          setActiveFrame(idx);

          // Cross-fade image graphics
          charRefs.current.forEach((charWrap, i) => {
            if (!charWrap) return;
            gsap.to(charWrap, {
              opacity: i === idx ? 1 : 0,
              scale: i === idx ? 1 : 0.82,
              duration: 0.75,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          });

          // Morph liquid burst
          gsap.timeline()
            .to(morphScaleRef, { current: 40, duration: 0.25, ease: 'power2.out' })
            .to(morphScaleRef, { current: 0,   duration: 0.6,  ease: 'elastic.out(1,0.5)' });

          if (turbuRef.current) {
            gsap.timeline()
              .to(turbuRef.current, { attr: { baseFrequency: '0.04 0.08' }, duration: 0.25 })
              .to(turbuRef.current, { attr: { baseFrequency: '0.012 0.024' }, duration: 0.5 });
          }

          // Splash particles
          const cx = gsap.getProperty(wrapperRef.current, 'x');
          const cy = gsap.getProperty(wrapperRef.current, 'y');
          gsap.fromTo('.sc-splash',
            { x: cx, y: cy, scale: 0.4, opacity: 0.9 },
            {
              x: () => cx + gsap.utils.random(-140, 140),
              y: () => cy + gsap.utils.random(-140, 140),
              scale: () => gsap.utils.random(0.4, 2.0),
              opacity: 0,
              duration: 1.1,
              stagger: 0.03,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        }

        // Auto-orientation flip + pitch
        const cx = gsap.getProperty(wrapperRef.current, 'x');
        const cy = gsap.getProperty(wrapperRef.current, 'y');
        const dX = cx - prevX;
        const dY = cy - prevY;
        prevX = cx;
        prevY = cy;

        if (Math.abs(dX) > 0.05 || Math.abs(dY) > 0.05) {
          const pitch = gsap.utils.clamp(-20, 20, (dY / (Math.abs(dX) + 0.01)) * 18);
          if (dX > 0.1) {
            gsap.to(mirrorRef.current, { scaleX: 1,  duration: 0.4, overwrite: 'auto' });
            gsap.to(wrapperRef.current, { rotation: pitch, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
          } else if (dX < -0.1) {
            gsap.to(mirrorRef.current, { scaleX: -1, duration: 0.4, overwrite: 'auto' });
            gsap.to(wrapperRef.current, { rotation: -pitch, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
          }
        }
      },
    });

    return () => {
      gsap.ticker.remove(tickHandler);
    };
  }, []);

  const color = phaseColors[activeFrame];

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      
      {/* ── CSS Keyframe animations for continuous natural fish movement ── */}
      <style>{`
        @keyframes scImageSwim {
          0% { transform: rotate(-5deg) skewX(-3deg) scaleY(0.98); }
          100% { transform: rotate(5deg) skewX(3deg) scaleY(1.02); }
        }
        @keyframes scLabelPop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── SVG Displacement Filter ─── */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="sc-water-morph" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              ref={turbuRef}
              type="fractalNoise"
              baseFrequency="0.012 0.024"
              numOctaves="3"
              seed="9"
              result="noise"
            />
            <feDisplacementMap
              ref={displacRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Background ────────────────────────────────── */}
      <div className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg,#020c16 0%,#031525 40%,#041e35 100%)' }}
      />
      <div className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 62% 55% at 50% 50%,rgba(13,53,88,0.6),transparent)' }}
      />
      <div className="pool-floor-grid pointer-events-none" />
      <div className="pool-sun-rays pointer-events-none" />
      <div className="sc-caustic-shimmer absolute inset-0 -z-10 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 200px 65px at 28% 18%,rgba(125,212,240,1),transparent)',
            'radial-gradient(ellipse 130px 55px at 72% 58%,rgba(125,212,240,1),transparent)',
            'radial-gradient(ellipse 220px 85px at 50% 82%,rgba(125,212,240,1),transparent)',
          ].join(','),
          animation: 'causticDrift 10s ease-in-out infinite alternate',
        }}
      />

      {/* ── Portal glow ──────────────────────────────── */}
      <div ref={portalRef} className="absolute rounded-full pointer-events-none"
        style={{
          width:      'min(64vw,64vh)',
          height:     'min(64vw,64vh)',
          background: `radial-gradient(circle,${color.glow} 0%,transparent 70%)`,
          boxShadow:  `0 0 120px 45px ${color.glow}`,
          transition: 'background 0.9s ease,box-shadow 0.9s ease',
        }}
      />

      {/* ── Ambient bubbles ──────────────────────────── */}
      {Array.from({ length: 26 }).map((_, i) => {
        const size = 4 + Math.random() * 16;
        return (
          <div key={i} className="sc-bubble absolute rounded-full border border-white/25 pointer-events-none"
            style={{
              width: size, height: size,
              left: `${2 + Math.random() * 96}%`,
              bottom: -30 + Math.random() * 40,
              background: 'rgba(255,255,255,0.07)',
            }}
          />
        );
      })}

      {/* ── Splash particles ─────────────────────────── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="sc-splash absolute w-4 h-4 rounded-full pointer-events-none opacity-0"
          style={{ background: `radial-gradient(circle,${color.glowHex}cc,transparent)` }}
        />
      ))}

      {/* ══════════════════════════════════════════════
          HIERARCHY:
          wrapperRef  → X/Y path + pitch rotation
            mirrorRef → horizontal flip
              floatRef → idle vertical float
                bodyWiggleRef → displacement morph & styling
                  [Images] → Nanobanana transparent images with natural wiggle
         ══════════════════════════════════════════════ */}
      <div
        ref={wrapperRef}
        className="absolute"
        style={{
          width: 'min(44vw,44vh)',
          height: 'min(44vw,44vh)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <div ref={mirrorRef} className="w-full h-full" style={{ transformOrigin: 'center center' }}>
          <div ref={floatRef} className="w-full h-full" style={{ transformOrigin: 'center center' }}>
            <div
              ref={bodyWiggleRef}
              className="w-full h-full relative"
              style={{
                transformOrigin: '75% 50%',
                filter: 'url(#sc-water-morph)',
              }}
            >
              {/* NO solid black background overlay box!
                  This enables mix-blend-mode screen to render with absolute transparency. */}
              {frames.map((frame, idx) => (
                <div
                  key={idx}
                  ref={el => charRefs.current[idx] = el}
                  className="absolute inset-0"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? 'scale(1)' : 'scale(0.82)',
                    willChange: 'opacity,transform',
                  }}
                >
                  <img
                    src={frame.image}
                    alt={frame.label}
                    draggable={false}
                    className="w-full h-full object-contain"
                    style={{
                      // Clean screen blend: black is keyed out, making the asset 100% transparent
                      mixBlendMode: 'screen',
                      filter: `drop-shadow(0 0 28px ${phaseColors[idx].glowHex})`,
                      userSelect: 'none',
                      // Pivot at the snout (right-center) so tail swings organically
                      transformOrigin: '75% 50%',
                      animation: `scImageSwim ${frame.duration} ease-in-out infinite alternate`,
                    }}
                  />
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* ── Phase badge — always fixed ──────────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div
          key={activeFrame}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/40 shadow-2xl backdrop-blur-md"
          style={{
            background: `linear-gradient(90deg,${color.from}cc,${color.to}cc)`,
            color: '#fff',
            animation: 'scLabelPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
            boxShadow: `0 6px 28px ${color.glow}`,
          }}
        >
          <span className="opacity-60 font-mono text-[10px]">{frames[activeFrame].phase}</span>
          🌊 {frames[activeFrame].label}
        </div>
      </div>
    </div>
  );
}
