import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { label: 'Bebê Peixinho (Nascimento)',   phase: '01' },
  { label: 'Peixinho Jovem (Adaptação)',   phase: '02' },
  { label: 'Peixe Predador (Autonomia)',   phase: '03' },
  { label: 'Tubarão Jovem (Técnica)',      phase: '04' },
  { label: 'Tubarão Soberano (Domínio)',   phase: '05' },
];

const phaseColors = [
  { from: '#7dd4f0', to: '#ff7eb3', glow: 'rgba(125,212,240,0.55)', glowHex: '#7dd4f0' },
  { from: '#00f2fe', to: '#4facfe', glow: 'rgba(0,242,254,0.5)',   glowHex: '#00f2fe' },
  { from: '#38f9d7', to: '#43e0aa', glow: 'rgba(56,249,215,0.45)', glowHex: '#38f9d7' },
  { from: '#8ec5fc', to: '#e0c3fc', glow: 'rgba(142,197,252,0.45)', glowHex: '#8ec5fc' },
  { from: '#2575fc', to: '#00f2fe', glow: 'rgba(37,117,252,0.55)',  glowHex: '#2575fc' },
];

// ── 1. BabyFish (Bebê Peixinho - Round, cute, big eyes) ──
const BabyFish = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="babyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd4f0" />
        <stop offset="60%" stopColor="#ff758c" />
        <stop offset="100%" stopColor="#ff7eb3" />
      </linearGradient>
      <filter id="babyGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Dorsal Fin */}
    <path d="M 105 70 Q 88 48 110 50 Q 118 60 110 70" fill="url(#babyGrad)" fillOpacity="0.4" stroke="url(#babyGrad)" strokeWidth="3" strokeLinecap="round" />
    
    {/* Tail - Pivot at (75, 100) */}
    <g style={{ transformOrigin: '75px 100px', animation: 'scTailWiggleFast 0.35s ease-in-out infinite alternate' }}>
      <path d="M 75 100 C 55 80, 40 82, 42 100 C 40 118, 55 120, 75 100 Z" fill="url(#babyGrad)" fillOpacity="0.5" stroke="url(#babyGrad)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 45 100 Q 30 92 25 96" stroke="url(#babyGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 45 100 Q 30 108 25 104" stroke="url(#babyGrad)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    
    {/* Pectoral Fin - Pivot at (105, 115) */}
    <g style={{ transformOrigin: '105px 115px', animation: 'scFinFlap 0.6s ease-in-out infinite alternate' }}>
      <path d="M 105 112 Q 92 128 84 122 Q 92 112 105 112" fill="url(#babyGrad)" fillOpacity="0.6" stroke="url(#babyGrad)" strokeWidth="2.5" />
    </g>
    
    {/* Body */}
    <ellipse cx="112" cy="100" rx="42" ry="32" fill="url(#babyGrad)" fillOpacity="0.25" stroke="url(#babyGrad)" strokeWidth="3.5" filter="url(#babyGlow)" />
    
    {/* Cute Big Eye - Pivot at (132, 90) */}
    <g style={{ transformOrigin: '132px 90px', animation: 'scEyeBlink 3.5s infinite' }}>
      <circle cx="132" cy="90" r="11" fill="white" />
      <circle cx="134" cy="90" r="6" fill="#0f2230" />
      <circle cx="132" cy="88" r="3.2" fill="white" />
      <circle cx="136" cy="93" r="1.5" fill="white" />
    </g>
    
    {/* Blush */}
    <circle cx="123" cy="103" r="5" fill="#ff758c" fillOpacity="0.6" />
    
    {/* Mouth */}
    <path d="M 143 103 Q 139 108 135 104" fill="none" stroke="#ff758c" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Bubbles */}
    <circle cx="154" cy="94" r="2.5" fill="#7dd4f0" fillOpacity="0.6" />
    <circle cx="163" cy="87" r="3.5" fill="#7dd4f0" fillOpacity="0.4" />
  </svg>
);

// ── 2. JuniorFish (Peixinho Jovem - School fish, slightly elongated) ──
const JuniorFish = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="juniorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#4facfe" />
      </linearGradient>
      <linearGradient id="juniorAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff0844" />
        <stop offset="100%" stopColor="#ffb199" />
      </linearGradient>
      <filter id="juniorGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Dorsal Fin */}
    <path d="M 105 76 Q 85 45 118 52 Q 120 70 105 76" fill="url(#juniorGrad)" fillOpacity="0.35" stroke="url(#juniorGrad)" strokeWidth="3" />
    
    {/* Tail - Pivot at (70, 100) */}
    <g style={{ transformOrigin: '70px 100px', animation: 'scTailWiggleMedium 0.45s ease-in-out infinite alternate' }}>
      <path d="M 70 100 Q 32 68 38 100 Q 32 132 70 100 Z" fill="url(#juniorGrad)" fillOpacity="0.5" stroke="url(#juniorGrad)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 45 92 Q 35 85 28 88" stroke="url(#juniorGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 45 108 Q 35 115 28 112" stroke="url(#juniorGrad)" strokeWidth="2" strokeLinecap="round" />
    </g>
    
    {/* Pectoral Fin - Pivot at (110, 115) */}
    <g style={{ transformOrigin: '110px 115px', animation: 'scFinFlap 0.7s ease-in-out infinite alternate' }}>
      <path d="M 110 114 Q 96 136 86 128 Q 98 114 110 114" fill="url(#juniorAccent)" fillOpacity="0.5" stroke="url(#juniorAccent)" strokeWidth="2.5" />
    </g>
    
    {/* Body */}
    <path d="M 70 100 C 85 73, 128 73, 153 100 C 128 127, 85 127, 70 100 Z" fill="url(#juniorGrad)" fillOpacity="0.25" stroke="url(#juniorGrad)" strokeWidth="3.5" filter="url(#juniorGlow)" />
    
    {/* Eye - Pivot at (130, 92) */}
    <g style={{ transformOrigin: '130px 92px', animation: 'scEyeBlink 4s infinite' }}>
      <circle cx="130" cy="92" r="9.5" fill="white" />
      <circle cx="132" cy="92" r="5" fill="#0f2230" />
      <circle cx="130" cy="90" r="2.5" fill="white" />
    </g>
    
    {/* Smile */}
    <path d="M 143 104 Q 138 110 133 105" fill="none" stroke="url(#juniorGrad)" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Gills */}
    <path d="M 117 92 Q 115 100 117 108" fill="none" stroke="url(#juniorGrad)" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
    <path d="M 121 94 Q 119 100 121 106" fill="none" stroke="url(#juniorGrad)" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
  </svg>
);

// ── 3. PredatorFish (Peixe Predador - Cute spiky hunter fish) ──
const PredatorFish = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="predGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38f9d7" />
        <stop offset="100%" stopColor="#43e0aa" />
      </linearGradient>
      <linearGradient id="predAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f857a6" />
        <stop offset="100%" stopColor="#ff5858" />
      </linearGradient>
      <filter id="predGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Dorsal Fin */}
    <path d="M 98 72 Q 80 40 114 46 L 126 56 Q 120 70 98 72" fill="url(#predGrad)" fillOpacity="0.35" stroke="url(#predGrad)" strokeWidth="3" />
    
    {/* Tail - Pivot at (65, 100) */}
    <g style={{ transformOrigin: '65px 100px', animation: 'scTailWiggleSlow 0.55s ease-in-out infinite alternate' }}>
      <path d="M 65 100 Q 25 60 35 100 Q 25 140 65 100 Z" fill="url(#predGrad)" fillOpacity="0.5" stroke="url(#predGrad)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 42 86 Q 30 75 22 80" stroke="url(#predGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 42 114 Q 30 125 22 120" stroke="url(#predGrad)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    
    {/* Pectoral Fin - Pivot at (112, 116) */}
    <g style={{ transformOrigin: '112px 116px', animation: 'scFinFlap 0.8s ease-in-out infinite alternate' }}>
      <path d="M 112 115 Q 98 140 85 130 Q 98 115 112 115" fill="url(#predAccent)" fillOpacity="0.5" stroke="url(#predAccent)" strokeWidth="2.5" />
    </g>
    
    {/* Body */}
    <path d="M 65 100 C 82 68, 134 68, 160 100 C 134 132, 82 132, 65 100 Z" fill="url(#predGrad)" fillOpacity="0.25" stroke="url(#predGrad)" strokeWidth="3.5" filter="url(#predGlow)" />
    
    {/* Eye - Pivot at (134, 90) */}
    <g style={{ transformOrigin: '134px 90px', animation: 'scEyeBlink 4.5s infinite' }}>
      <circle cx="134" cy="90" r="9" fill="white" />
      <circle cx="136" cy="90" r="5" fill="#0f2230" />
      <circle cx="134" cy="88" r="2.5" fill="white" />
    </g>
    
    {/* Cute Open Mouth */}
    <path d="M 148 101 Q 142 111 136 102 Z" fill="#ff5858" fillOpacity="0.6" stroke="url(#predGrad)" strokeWidth="2" />
    
    {/* Flank Stripes */}
    <path d="M 92 84 Q 96 100 92 116" fill="none" stroke="url(#predGrad)" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M 99 86 Q 103 100 99 114" fill="none" stroke="url(#predGrad)" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
  </svg>
);

// ── 4. YoungShark (Tubarão Jovem - Cute, rounded teeth, friendly shark) ──
const YoungShark = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="youngGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8ec5fc" />
        <stop offset="100%" stopColor="#e0c3fc" />
      </linearGradient>
      <linearGradient id="youngAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9a9e" />
        <stop offset="100%" stopColor="#fecfef" />
      </linearGradient>
      <filter id="youngGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Pelvic Fin */}
    <path d="M 85 120 Q 72 135 82 132" fill="url(#youngGrad)" fillOpacity="0.4" stroke="url(#youngGrad)" strokeWidth="2.5" />
    
    {/* Dorsal Fin */}
    <path d="M 96 70 Q 100 32 120 38 Q 118 64 96 70" fill="url(#youngGrad)" fillOpacity="0.4" stroke="url(#youngGrad)" strokeWidth="3.5" />
    
    {/* Tail - Pivot at (60, 100) */}
    <g style={{ transformOrigin: '60px 100px', animation: 'scTailWiggleSlow 0.6s ease-in-out infinite alternate' }}>
      <path d="M 60 100 Q 20 50 32 98 Q 15 138 60 100 Z" fill="url(#youngGrad)" fillOpacity="0.5" stroke="url(#youngGrad)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 38 88 Q 28 78 20 82" stroke="url(#youngGrad)" strokeWidth="2" />
      <path d="M 38 112 Q 26 122 18 118" stroke="url(#youngGrad)" strokeWidth="2" />
    </g>
    
    {/* Pectoral Fin - Pivot at (112, 118) */}
    <g style={{ transformOrigin: '112px 118px', animation: 'scFinFlap 0.9s ease-in-out infinite alternate' }}>
      <path d="M 112 118 Q 95 142 82 134 Q 96 116 112 118" fill="url(#youngAccent)" fillOpacity="0.5" stroke="url(#youngAccent)" strokeWidth="3" />
    </g>
    
    {/* Body */}
    <path d="M 60 100 C 80 62, 130 62, 166 95 C 135 125, 90 128, 60 100 Z" fill="url(#youngGrad)" fillOpacity="0.25" stroke="url(#youngGrad)" strokeWidth="3.5" filter="url(#youngGlow)" />
    
    {/* Eye - Pivot at (134, 88) */}
    <g style={{ transformOrigin: '134px 88px', animation: 'scEyeBlink 5s infinite' }}>
      <circle cx="134" cy="88" r="8.5" fill="white" />
      <circle cx="136" cy="88" r="4.5" fill="#0f2230" />
      <circle cx="134" cy="86" r="2.5" fill="white" />
      <path d="M 129 80 Q 134 77 139 81" stroke="url(#youngGrad)" strokeWidth="2" strokeLinecap="round" />
    </g>
    
    {/* Gill slits */}
    <path d="M 114 90 Q 112 98 114 106" fill="none" stroke="url(#youngGrad)" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M 119 91 Q 117 98 119 105" fill="none" stroke="url(#youngGrad)" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M 124 92 Q 122 98 124 104" fill="none" stroke="url(#youngGrad)" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
    
    {/* Smile + soft teeth */}
    <path d="M 148 103 Q 138 110 132 105" fill="none" stroke="url(#youngGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 140 106 L 142 109 L 144 106" fill="none" stroke="white" strokeWidth="1.5" />
    <path d="M 136 105 L 138 108 L 140 105" fill="none" stroke="white" strokeWidth="1.5" />
  </svg>
);

// ── 5. SovereignShark (Tubarão Soberano - Majestic, glowing, friendly neon shark) ──
const SovereignShark = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sovGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2575fc" />
        <stop offset="50%" stopColor="#1a2a6c" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
      <linearGradient id="sovGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#4facfe" />
      </linearGradient>
      <filter id="sovFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Lower Fin */}
    <path d="M 85 124 Q 72 142 85 138" fill="url(#sovGrad)" fillOpacity="0.4" stroke="url(#sovGrad)" strokeWidth="3" />
    
    {/* Dorsal Fin */}
    <path d="M 102 70 Q 106 20 130 25 Q 126 62 102 70" fill="url(#sovGrad)" fillOpacity="0.4" stroke="url(#sovGrad)" strokeWidth="3.5" filter="url(#sovFilter)" />
    
    {/* Tail - Pivot at (55, 100) */}
    <g style={{ transformOrigin: '55px 100px', animation: 'scTailWiggleSlow 0.65s ease-in-out infinite alternate' }}>
      <path d="M 55 100 Q 12 40 26 96 Q 8 148 55 100 Z" fill="url(#sovGrad)" fillOpacity="0.5" stroke="url(#sovGrad)" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M 38 82 C 28 65, 20 70, 22 85" stroke="url(#sovGlow)" strokeWidth="2" strokeOpacity="0.7" />
      <path d="M 38 118 C 28 135, 20 130, 22 115" stroke="url(#sovGlow)" strokeWidth="2" strokeOpacity="0.7" />
    </g>
    
    {/* Pectoral Fin - Pivot at (115, 118) */}
    <g style={{ transformOrigin: '115px 118px', animation: 'scFinFlap 1.0s ease-in-out infinite alternate' }}>
      <path d="M 115 118 Q 98 145 84 136 Q 98 116 115 118" fill="url(#sovGlow)" fillOpacity="0.5" stroke="url(#sovGlow)" strokeWidth="3" />
    </g>
    
    {/* Main Body */}
    <path d="M 55 100 C 78 58, 140 58, 176 95 C 140 130, 90 132, 55 100 Z" fill="url(#sovGrad)" fillOpacity="0.25" stroke="url(#sovGrad)" strokeWidth="3.5" filter="url(#sovFilter)" />
    
    {/* Flank Stripes */}
    <path d="M 75 96 C 92 88, 115 88, 130 96" fill="none" stroke="url(#sovGlow)" strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" />
    
    {/* Eye - Pivot at (136, 86) */}
    <g style={{ transformOrigin: '136px 86px', animation: 'scEyeBlink 6s infinite' }}>
      <circle cx="136" cy="86" r="9" fill="white" />
      <circle cx="138" cy="86" r="5" fill="#1a2a6c" />
      <circle cx="136" cy="84" r="2.5" fill="#00f2fe" />
    </g>
    
    {/* Gill slits */}
    <path d="M 112 88 Q 109 98 112 108" fill="none" stroke="url(#sovGlow)" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
    <path d="M 117 89 Q 114 98 117 107" fill="none" stroke="url(#sovGlow)" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
    <path d="M 122 90 Q 119 98 122 106" fill="none" stroke="url(#sovGlow)" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
    
    {/* Friendly smile with teeth */}
    <path d="M 152 102 Q 142 115 132 105 Z" fill="#1a2a6c" fillOpacity="0.5" stroke="url(#sovGlow)" strokeWidth="2.5" />
    <path d="M 148 103 L 146 106 L 144 103" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M 142 103 L 140 106 L 138 103" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

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

          // Cross-fade SVG graphics
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
        @keyframes scTailWiggleFast {
          0% { transform: rotate(-12deg); }
          100% { transform: rotate(12deg); }
        }
        @keyframes scTailWiggleMedium {
          0% { transform: rotate(-9deg); }
          100% { transform: rotate(9deg); }
        }
        @keyframes scTailWiggleSlow {
          0% { transform: rotate(-7deg); }
          100% { transform: rotate(7deg); }
        }
        @keyframes scFinFlap {
          0% { transform: rotate(-14deg); }
          100% { transform: rotate(14deg); }
        }
        @keyframes scEyeBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.15); }
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
                  [SVGs] → inline vectors with tail/fin keyframes
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
              {/* Stage 1: Bebê Peixinho */}
              <div
                ref={el => charRefs.current[0] = el}
                className="absolute inset-0"
                style={{ opacity: 1, transform: 'scale(1)', willChange: 'opacity,transform' }}
              >
                <BabyFish />
              </div>

              {/* Stage 2: Peixinho Jovem */}
              <div
                ref={el => charRefs.current[1] = el}
                className="absolute inset-0"
                style={{ opacity: 0, transform: 'scale(0.82)', willChange: 'opacity,transform' }}
              >
                <JuniorFish />
              </div>

              {/* Stage 3: Peixe Predador */}
              <div
                ref={el => charRefs.current[2] = el}
                className="absolute inset-0"
                style={{ opacity: 0, transform: 'scale(0.82)', willChange: 'opacity,transform' }}
              >
                <PredatorFish />
              </div>

              {/* Stage 4: Tubarão Jovem */}
              <div
                ref={el => charRefs.current[3] = el}
                className="absolute inset-0"
                style={{ opacity: 0, transform: 'scale(0.82)', willChange: 'opacity,transform' }}
              >
                <YoungShark />
              </div>

              {/* Stage 5: Tubarão Soberano */}
              <div
                ref={el => charRefs.current[4] = el}
                className="absolute inset-0"
                style={{ opacity: 0, transform: 'scale(0.82)', willChange: 'opacity,transform' }}
              >
                <SovereignShark />
              </div>

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
