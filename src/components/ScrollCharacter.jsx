import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { label: 'O Nascimento (Potencial)',     phase: '01', image: '/shark_stage_1.jpg' }, // Crystal Egg
  { label: 'Primeiro Contato (Adaptação)', phase: '02', image: '/shark_stage_2.jpg' }, // Tiny blue fish
  { label: 'Desenvolvimento (Autonomia)',  phase: '03', image: '/shark_stage_3.jpg' }, // Medium fish
  { label: 'Técnica e Domínio (Avanço)',   phase: '04', image: '/shark_stage_2.jpg' }, // Transition/grow
  { label: 'Tubarão Soberano (Habilidade)', phase: '05', image: '/shark_stage_5.jpg' }, // Sovereign Apex Shark
];

const phaseColors = [
  { from: '#7dd4f0', to: '#1A7FA8', glow: 'rgba(125,212,240,0.5)',  glowHex: '#7dd4f0' },
  { from: '#50c8e8', to: '#0e5c80', glow: 'rgba(80,200,232,0.45)', glowHex: '#50c8e8' },
  { from: '#29b6d8', to: '#0a3d5c', glow: 'rgba(41,182,216,0.4)',   glowHex: '#29b6d8' },
  { from: '#1A7FA8', to: '#07263a', glow: 'rgba(26,127,168,0.4)',   glowHex: '#1A7FA8' },
  { from: '#0e4b73', to: '#040e18', glow: 'rgba(14,75,115,0.5)',    glowHex: '#0e4b73' },
];

export default function ScrollCharacter() {
  const wrapperRef      = useRef(null);
  const mirrorRef       = useRef(null);
  const flexRef         = useRef(null);
  const floatRef        = useRef(null);
  const displacRef      = useRef(null);
  const turbuRef        = useRef(null);
  const portalRef       = useRef(null);

  // Separate image refs for cross-fading
  const imgRefs = useRef([]);

  const frameRef        = useRef(0);
  const morphScaleRef   = useRef(0);
  const maxFlexRef      = useRef(3);
  const velocityFactorRef = useRef(0.4);

  const [activeFrame, setActiveFrame] = useState(0);

  useGSAP(() => {
    // ── 1. Idle float (on floatRef only) ──────────────────────
    gsap.to(floatRef.current, {
      y: '+=10', duration: 4.0, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 2. Portal pulse ───────────────────────────────────────
    gsap.to(portalRef.current, {
      scale: 1.05, opacity: 0.85, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
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

    // ── 4. Infinite dynamic swimming deformation loop ────────
    const kickObj = { phase: 0 };
    const tickHandler = (time, deltaTime) => {
      try {
        const speedScale = 0.5 + (Number(velocityFactorRef.current) || 0) * 1.5;
        // Wiggle cycle
        kickObj.phase += 0.016 * 10.0 * speedScale;
        const phase = kickObj.phase;

        const wavyAmp = maxFlexRef.current * 0.95;
        const dispVal = morphScaleRef.current + Math.sin(phase) * wavyAmp * 0.55;

        // Drive SVG displacement filter to physically distort the image texture like liquid
        if (displacRef.current) {
          displacRef.current.setAttribute('scale', String(Math.max(0, dispVal)));
        }

        // Flex, skew, and compress the character container in sync with the waves!
        if (flexRef.current) {
          gsap.set(flexRef.current, {
            skewX:  Math.sin(phase) * wavyAmp * 0.1,
            scaleX: 1 - Math.abs(dispVal) * 0.0005,
            scaleY: 1 + Math.abs(dispVal) * 0.001,
          });
        }
      } catch (err) {
        console.error('Procedural swim tick error:', err);
      }
    };
    gsap.ticker.add(tickHandler);

    // ── 5. X/Y swim path timeline (master, scrubbed) ──────────
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
      .to(wrapperRef.current,   { x: 220,  y: -45,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: -220, y:  0,   ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: 220,  y:  45,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: -200, y:  90,  ease: 'sine.inOut', duration: 1 })
      .to(wrapperRef.current,   { x: 0,    y:  120, ease: 'sine.inOut', duration: 1 });

    // ── 6. Age-evolution + orientation ScrollTrigger ──────────
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
        const normVel = gsap.utils.clamp(0, 1, Math.abs(velocity) / 2200) || 0;

        const thresholds = [0.18, 0.38, 0.58, 0.78];
        const newIdx     = thresholds.findIndex((t) => progress < t);
        const idx        = newIdx === -1 ? 4 : newIdx;

        if (idx !== frameRef.current) {
          const oldIdx = frameRef.current;
          frameRef.current = idx;
          setActiveFrame(idx);

          // Smoothly cross-fade image layers
          imgRefs.current.forEach((img, i) => {
            if (img) {
              gsap.to(img, {
                opacity: i === idx ? 1 : 0,
                scale: i === idx ? 1 : 0.88,
                filter: i === idx ? 'blur(0px)' : 'blur(8px)',
                duration: 0.75,
                ease: 'power2.out',
                overwrite: 'auto'
              });
            }
          });

          // Displacement spike for liquid age-morph effect
          gsap.timeline()
            .to(morphScaleRef, { current: 75, duration: 0.28, ease: 'power2.out' })
            .to(morphScaleRef, { current: 0,   duration: 0.75, ease: 'elastic.out(1, 0.55)' });

          // Turbulence frequency spike
          if (turbuRef.current) {
            gsap.timeline()
              .to(turbuRef.current, { attr: { baseFrequency: '0.042 0.088' }, duration: 0.25, ease: 'power2.out' })
              .to(turbuRef.current, { attr: { baseFrequency: '0.012 0.024' }, duration: 0.60, ease: 'power2.inOut' });
          }

          // Splash scatter particles
          const cx = gsap.getProperty(wrapperRef.current, 'x');
          const cy = gsap.getProperty(wrapperRef.current, 'y');
          gsap.fromTo(
            '.sc-splash',
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

        // Speed + amplitude reactive to scroll speed
        velocityFactorRef.current = normVel;
        gsap.to(maxFlexRef, {
          current: 3 + normVel * 18,
          duration: 0.28,
          overwrite: 'auto',
        });

        // Auto-orientation: pitch + horizontal flip
        const cx = gsap.getProperty(wrapperRef.current, 'x');
        const cy = gsap.getProperty(wrapperRef.current, 'y');
        const dX = cx - prevX;
        const dY = cy - prevY;
        prevX = cx;
        prevY = cy;

        const moving = Math.abs(dX) > 0.05 || Math.abs(dY) > 0.05;
        if (moving) {
          const pitch = gsap.utils.clamp(-28, 28, (dY / (Math.abs(dX) + 0.01)) * 20);

          if (dX > 0.1) {
            gsap.to(mirrorRef.current, { scaleX: 1,  duration: 0.45, overwrite: 'auto' });
            gsap.to(wrapperRef.current, { rotation:  pitch, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
          } else if (dX < -0.1) {
            gsap.to(mirrorRef.current, { scaleX: -1, duration: 0.45, overwrite: 'auto' });
            gsap.to(wrapperRef.current, { rotation: -pitch, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
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

      {/* ── SVG Filter Definitions ─────────────────────────────── */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="sc-water-morph" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              ref={turbuRef}
              type="fractalNoise"
              baseFrequency="0.012 0.024"
              numOctaves="3"
              seed="7"
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

      {/* ── Background layers ──────────────────────────────────── */}
      <div className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, #020c16 0%, #031525 40%, #041e35 100%)' }}
      />
      <div className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 62% 55% at 50% 50%, rgba(13,53,88,0.6), transparent)' }}
      />

      {/* Pool grid / Sun rays */}
      <div className="pool-floor-grid pointer-events-none" />
      <div className="pool-sun-rays pointer-events-none" />

      {/* Moving caustic shimmer */}
      <div className="sc-caustic-shimmer absolute inset-0 -z-10 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 200px 65px at 28% 18%, rgba(125,212,240,1), transparent)',
            'radial-gradient(ellipse 130px 55px at 72% 58%, rgba(125,212,240,1), transparent)',
            'radial-gradient(ellipse 220px 85px at 50% 82%, rgba(125,212,240,1), transparent)',
          ].join(','),
          animation: 'causticDrift 10s ease-in-out infinite alternate',
        }}
      />

      {/* ── Portal glow ─────────────────── */}
      <div
        ref={portalRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width:      'min(68vw, 68vh)',
          height:     'min(68vw, 68vh)',
          background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
          boxShadow:  `0 0 130px 50px ${color.glow}`,
          transition: 'background 0.9s ease, box-shadow 0.9s ease',
        }}
      />

      {/* ── Ambient bubbles ────────────────────────────────────── */}
      {Array.from({ length: 26 }).map((_, i) => {
        const size = 4 + Math.random() * 16;
        const left = 2 + Math.random() * 96;
        const bot  = -30 + Math.random() * 40;
        return (
          <div
            key={i}
            className="sc-bubble absolute rounded-full border border-white/25 pointer-events-none"
            style={{
              width: size, height: size,
              left: `${left}%`, bottom: bot,
              background: 'rgba(255,255,255,0.07)',
            }}
          />
        );
      })}

      {/* ── Splash burst particles ─────────────────────────────── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="sc-splash absolute w-4 h-4 rounded-full pointer-events-none opacity-0"
          style={{ background: `radial-gradient(circle, ${color.glowHex}cc, transparent)` }}
        />
      ))}

      {/* ══════════════════════════════════════════════════════════
          ANIME HIERARCHY
         ══════════════════════════════════════════════════════════ */}
      <div
        ref={wrapperRef}
        className="absolute"
        style={{ width: 'min(42vw, 42vh)', height: 'min(42vw, 42vh)', transformOrigin: 'center center', willChange: 'transform' }}
      >
        <div ref={mirrorRef} className="w-full h-full" style={{ transformOrigin: 'center center' }}>
          <div
            ref={flexRef}
            className="w-full h-full"
            style={{ filter: 'url(#sc-water-morph)', transformOrigin: 'center center' }}
          >
            <div ref={floatRef} className="w-full h-full relative" style={{ transformOrigin: 'center center' }}>

              {/* Render 5 overlapping image frames for perfect cross-fade morphing */}
              {frames.map((frame, idx) => (
                <div
                  key={frame.label}
                  ref={el => imgRefs.current[idx] = el}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? 'scale(1)' : 'scale(0.88)',
                    filter: idx === 0 ? 'blur(0px)' : 'blur(8px)',
                    willChange: 'opacity, transform, filter'
                  }}
                >
                  <img
                    src={frame.image}
                    alt={frame.label}
                    className="w-full h-full object-contain rounded-[2.5rem] border border-white/10 shadow-2xl filter drop-shadow-[0_0_35px_rgba(125,212,240,0.65)]"
                    style={{
                      // Blend mode overlay to merge image with glowing portal background perfectly
                      mixBlendMode: 'screen',
                    }}
                  />
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* ── Phase label — fixed to bottom center ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <div
          key={activeFrame}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/40 shadow-2xl backdrop-blur-md"
          style={{
            background: `linear-gradient(90deg, ${color.from}cc, ${color.to}cc)`,
            color: '#fff',
            animation: 'labelPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
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
