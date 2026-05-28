import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { label: 'Bebê Peixinho (Estimulação)',  phase: '01' },
  { label: 'Peixinho Brincalhão (Adaptação)', phase: '02' },
  { label: 'Peixinho Explorador (Autonomia)', phase: '03' },
  { label: 'Tubarãozinho Amigo (Técnica)',  phase: '04' },
  { label: 'Tubarão Soberano (Habilidade)', phase: '05' },
];

const phaseColors = [
  { from: '#7dd4f0', to: '#1A7FA8', glow: 'rgba(125,212,240,0.45)', glowHex: '#7dd4f0' },
  { from: '#50c8e8', to: '#0e5c80', glow: 'rgba(80,200,232,0.4)',   glowHex: '#50c8e8' },
  { from: '#29b6d8', to: '#0a3d5c', glow: 'rgba(41,182,216,0.35)',  glowHex: '#29b6d8' },
  { from: '#1A7FA8', to: '#07263a', glow: 'rgba(26,127,168,0.35)',  glowHex: '#1A7FA8' },
  { from: '#0e4b73', to: '#040e18', glow: 'rgba(14,75,115,0.45)',   glowHex: '#0e4b73' },
];

const phaseConfigs = [
  // 0: Bebê Peixinho — extremely round, big cute eye, small caudal, fast playful wiggling
  {
    scale: 0.78,
    torsoLength: 85,
    swimFreq: 0.85,        // Fast cute baby wiggle
    swimAmp: 20,
    dorsalHeight: 14,
    dorsalOffset: 1,
    tailSize: 15,
    tailSpan: 28,
    tailTopLobe: 1.0,
    tailBottomLobe: 1.0,
    pecLength: 18,
    pecWidth: 9,
    eyeRadius: 6.8,        // Huge cute baby eye
    eyeStyle: 0.0,         // Always cute
    showDetails: 0.0,
    // Body profile widths (9 points from tail to head)
    w0: 3,                 // tail tip
    w1: 14,
    w2: 26,
    w3: 38,
    w4: 44,
    w5: 42,
    w6: 36,
    w7: 26,
    w8: 13,                // head snout
  },
  // 1: Peixinho Brincalhão — slightly longer, playful, larger fins
  {
    scale: 0.92,
    torsoLength: 105,
    swimFreq: 0.7,
    swimAmp: 17,
    dorsalHeight: 22,
    dorsalOffset: -3,
    tailSize: 22,
    tailSpan: 40,
    tailTopLobe: 1.05,
    tailBottomLobe: 0.95,
    pecLength: 26,
    pecWidth: 13,
    eyeRadius: 6.0,
    eyeStyle: 0.0,
    showDetails: 0.0,
    w0: 4,
    w1: 15,
    w2: 28,
    w3: 40,
    w4: 44,
    w5: 41,
    w6: 34,
    w7: 23,
    w8: 11,
  },
  // 2: Peixinho Explorador — streamlined happy hunter profile
  {
    scale: 1.06,
    torsoLength: 125,
    swimFreq: 0.58,
    swimAmp: 14,
    dorsalHeight: 30,
    dorsalOffset: -8,
    tailSize: 30,
    tailSpan: 54,
    tailTopLobe: 1.1,
    tailBottomLobe: 0.9,
    pecLength: 36,
    pecWidth: 17,
    eyeRadius: 5.4,
    eyeStyle: 0.0,
    showDetails: 0.0,
    w0: 5,
    w1: 16,
    w2: 29,
    w3: 40,
    w4: 43,
    w5: 39,
    w6: 31,
    w7: 20,
    w8: 9,
  },
  // 3: Tubarãozinho Amigo — sleek friendly baby shark shape
  {
    scale: 1.2,
    torsoLength: 145,
    swimFreq: 0.46,
    swimAmp: 11,
    dorsalHeight: 40,
    dorsalOffset: -15,
    tailSize: 38,
    tailSpan: 72,
    tailTopLobe: 1.18,
    tailBottomLobe: 0.82,
    pecLength: 48,
    pecWidth: 21,
    eyeRadius: 4.8,
    eyeStyle: 0.0,
    showDetails: 0.0,
    w0: 4.5,
    w1: 14,
    w2: 27,
    w3: 37,
    w4: 42,
    w5: 40,
    w6: 33,
    w7: 20,
    w8: 7,
  },
  // 4: Tubarão Soberano Amigável — powerful, majestic, yet cute and smiling sovereign shark
  {
    scale: 1.35,
    torsoLength: 165,
    swimFreq: 0.35,
    swimAmp: 8,
    dorsalHeight: 54,
    dorsalOffset: -24,
    tailSize: 48,
    tailSpan: 92,
    tailTopLobe: 1.25,
    tailBottomLobe: 0.75,
    pecLength: 62,
    pecWidth: 25,
    eyeRadius: 4.2,        // Always round, friendly, and cute!
    eyeStyle: 0.0,
    showDetails: 0.0,
    w0: 4,
    w1: 12,
    w2: 24,
    w3: 35,
    w4: 42,
    w5: 43,
    w6: 37,
    w7: 22,
    w8: 5.5,
  }
];

export default function ScrollCharacter() {
  const wrapperRef      = useRef(null);
  const mirrorRef       = useRef(null);
  const flexRef         = useRef(null);
  const floatRef        = useRef(null);
  const displacRef      = useRef(null);
  const turbuRef        = useRef(null);
  const portalRef       = useRef(null);

  // Skeletal refs for procedural fish
  const scaleGroupRef   = useRef(null);
  const bodyRef         = useRef(null);
  const leftPecFinRef   = useRef(null);
  const rightPecFinRef  = useRef(null);
  const dorsalFinRef    = useRef(null);
  const caudalFinRef    = useRef(null);
  const eyeRef          = useRef(null);
  const eyePupilRef     = useRef(null);
  const mouthRef        = useRef(null);

  // Wake bubbles
  const wake1Ref        = useRef(null);
  const wake2Ref        = useRef(null);
  const wake3Ref        = useRef(null);
  const wake4Ref        = useRef(null);

  const frameRef        = useRef(0);
  const morphScaleRef   = useRef(0);
  const maxFlexRef      = useRef(3);
  const velocityFactorRef = useRef(0.4);

  const [activeFrame, setActiveFrame] = useState(0);

  // Current procedural configurations
  const currentConfig = useRef({ ...phaseConfigs[0] });

  useGSAP(() => {
    // ── Set initial body proportions ───────────────────────────
    const initialConf = phaseConfigs[0];
    currentConfig.current = { ...initialConf };

    // ── 1. Idle float (on floatRef only) ──────────────────────
    gsap.to(floatRef.current, {
      y: '+=12', duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 2. Portal pulse ───────────────────────────────────────
    gsap.to(portalRef.current, {
      scale: 1.06, opacity: 0.85, duration: 4.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
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

    const kickObj = { phase: 0 };

    const tickHandler = (time, deltaTime) => {
      try {
        const conf = currentConfig.current;
        const freq = conf.swimFreq || 0.4;
        
        // Prevent NaN speed scales or division issues
        const speedScale = 0.55 + (Number(velocityFactorRef.current) || 0) * 1.5;
        
        // Base wiggle speed
        kickObj.phase += 0.016 * 9.0 * freq * speedScale;
        const phase = kickObj.phase;

        const scale = conf.scale;
        const tL = conf.torsoLength;
        const tSpan = conf.tailSpan;
        const tSize = conf.tailSize;
        const tTop = conf.tailTopLobe;
        const tBot = conf.tailBottomLobe;
        const pecL = conf.pecLength;
        const pecW = conf.pecWidth;
        const eyeR = conf.eyeRadius;

        // Displacement & flex wiggling driven by scroll
        const wavyAmp = maxFlexRef.current * 0.95;
        const dispVal = morphScaleRef.current + Math.sin(phase) * wavyAmp * 0.45;

        // Drive displacement map scale
        if (displacRef.current) {
          displacRef.current.setAttribute('scale', String(Math.max(0, dispVal)));
        }

        // Skew and scale flex container
        if (flexRef.current) {
          gsap.set(flexRef.current, {
            skewX:  Math.sin(phase) * wavyAmp * 0.1,
            scaleX: 1 - Math.abs(dispVal) * 0.0006,
            scaleY: 1 + Math.abs(dispVal) * 0.0012,
          });
        }

        // ─── Spine Node wiggling sequence (Hidden) ─────────
        const N = 9;
        const spine = [];
        const waveGap = 0.38;
        const tailX = 120 - tL / 2;

        for (let i = 0; i < N; i++) {
          const t = i / (N - 1);
          const x = tailX + t * tL;
          const amp = wavyAmp * (1 - t * 0.78);
          const y = 120 + Math.sin(phase - (N - 1 - i) * waveGap) * amp;
          spine.push({ x, y });
        }

        // ─── Perpendicular Body Contours ─────────
        const topPoints = [];
        const bottomPoints = [];

        for (let i = 0; i < N; i++) {
          const p = spine[i];
          let tx, ty;
          if (i === 0) {
            tx = spine[1].x - spine[0].x;
            ty = spine[1].y - spine[0].y;
          } else if (i === N - 1) {
            tx = spine[N - 1].x - spine[N - 2].x;
            ty = spine[N - 1].y - spine[N - 2].y;
          } else {
            tx = spine[i + 1].x - spine[i - 1].x;
            ty = spine[i + 1].y - spine[i - 1].y;
          }
          const len = Math.sqrt(tx * tx + ty * ty) || 1;
          const ux = tx / len;
          const uy = ty / len;
          const nx = -uy;
          const ny = ux;

          const r = conf[`w${i}`] || 10;

          topPoints.push({
            x: p.x + nx * r,
            y: p.y + ny * r,
            nx, ny, ux, uy
          });
          bottomPoints.push({
            x: p.x - nx * r,
            y: p.y - ny * r
          });
        }

        // Update Scale Group Transform
        if (scaleGroupRef.current) {
          scaleGroupRef.current.setAttribute('transform', `translate(120, 120) scale(${scale}) translate(-120, -120)`);
        }

        // ─── 1. Main Body Path ───
        let bodyD = `M ${spine[0].x.toFixed(1)},${spine[0].y.toFixed(1)} `;
        for (let i = 1; i < N; i++) {
          bodyD += `L ${topPoints[i].x.toFixed(1)},${topPoints[i].y.toFixed(1)} `;
        }
        bodyD += `A ${conf.w8},${conf.w8} 0 0 1 ${bottomPoints[N-1].x.toFixed(1)},${bottomPoints[N-1].y.toFixed(1)} `;
        for (let i = N - 2; i >= 0; i--) {
          bodyD += `L ${bottomPoints[i].x.toFixed(1)},${bottomPoints[i].y.toFixed(1)} `;
        }
        bodyD += 'Z';

        if (bodyRef.current) {
          bodyRef.current.setAttribute('d', bodyD);
        }

        // ─── 2. Dorsal Fin ──
        const dh = conf.dorsalHeight;
        const doff = conf.dorsalOffset;
        const pStart = bottomPoints[3];
        const pEnd = bottomPoints[5];
        const pMid = bottomPoints[4];

        const tMid = topPoints[4];
        const nx4 = tMid.nx;
        const ny4 = tMid.ny;
        const ux4 = tMid.ux;
        const uy4 = tMid.uy;

        const peakX = pMid.x - nx4 * dh + doff * ux4;
        const peakY = pMid.y - ny4 * dh + doff * uy4;

        const dorsalD = `M ${pStart.x.toFixed(1)},${pStart.y.toFixed(1)}
                         Q ${(pMid.x - nx4 * dh * 0.45).toFixed(1)},${(pMid.y - ny4 * dh * 0.45).toFixed(1)} ${peakX.toFixed(1)},${peakY.toFixed(1)}
                         Q ${(pEnd.x - nx4 * dh * 0.15).toFixed(1)},${(pEnd.y - ny4 * dh * 0.15).toFixed(1)} ${pEnd.x.toFixed(1)},${pEnd.y.toFixed(1)} Z`;

        if (dorsalFinRef.current) {
          dorsalFinRef.current.setAttribute('d', dorsalD);
        }

        // ─── 3. Caudal Fin (Tail) ─────────────────
        const tx0 = spine[1].x - spine[0].x;
        const ty0 = spine[1].y - spine[0].y;
        const len0 = Math.sqrt(tx0 * tx0 + ty0 * ty0) || 1;
        const ux0 = tx0 / len0;
        const uy0 = ty0 / len0;
        const nx0 = -uy0;
        const ny0 = ux0;

        const topTipX = spine[0].x - nx0 * (tSpan * 0.5 * tTop) - ux0 * tSize;
        const topTipY = spine[0].y - ny0 * (tSpan * 0.5 * tTop) - uy0 * tSize;

        const botTipX = spine[0].x + nx0 * (tSpan * 0.5 * tBot) - ux0 * (tSize * 0.8);
        const botTipY = spine[0].y + ny0 * (tSpan * 0.5 * tBot) - uy0 * (tSize * 0.8);

        const indentX = spine[0].x - ux0 * (tSize * 0.45);
        const indentY = spine[0].y - uy0 * (tSize * 0.45);

        const bodyBack0 = bottomPoints[0];
        const bodyBelly0 = topPoints[0];

        const caudalD = `M ${bodyBack0.x.toFixed(1)},${bodyBack0.y.toFixed(1)}
                         L ${topTipX.toFixed(1)},${topTipY.toFixed(1)}
                         Q ${indentX.toFixed(1)},${indentY.toFixed(1)} ${botTipX.toFixed(1)},${botTipY.toFixed(1)}
                         L ${bodyBelly0.x.toFixed(1)},${bodyBelly0.y.toFixed(1)} Z`;

        if (caudalFinRef.current) {
          caudalFinRef.current.setAttribute('d', caudalD);
        }

        // ─── 4. Pectoral Fins (Flapping on chest) ──
        const anchor = spine[5];
        const tx5 = spine[6].x - spine[4].x;
        const ty5 = spine[6].y - spine[4].y;
        const len5 = Math.sqrt(tx5 * tx5 + ty5 * ty5) || 1;
        const ux5 = tx5 / len5;
        const uy5 = ty5 / len5;
        const nx5 = -uy5;
        const ny5 = ux5;

        const flapPhase = phase * 1.5;
        const rightFlap = Math.sin(flapPhase) * 0.35 - 0.12;
        const leftFlap = Math.sin(flapPhase + Math.PI * 0.6) * 0.35 - 0.12;

        const rFinDirX = nx5 * Math.cos(rightFlap) - ux5 * Math.sin(rightFlap);
        const rFinDirY = ny5 * Math.cos(rightFlap) - uy5 * Math.sin(rightFlap);
        const rTipX = anchor.x + rFinDirX * pecL;
        const rTipY = anchor.y + rFinDirY * pecL;

        const lFinDirX = -nx5 * Math.cos(leftFlap) - ux5 * Math.sin(leftFlap);
        const lFinDirY = -ny5 * Math.cos(leftFlap) - uy5 * Math.sin(leftFlap);
        const lTipX = anchor.x + lFinDirX * pecL;
        const lTipY = anchor.y + lFinDirY * pecL;

        const rPecD = `M ${anchor.x.toFixed(1)},${(anchor.y - pecW * 0.15).toFixed(1)}
                       Q ${(anchor.x + rFinDirX * pecL * 0.3).toFixed(1)},${(anchor.y + rFinDirY * pecL * 0.3 + pecW * 0.6).toFixed(1)} ${rTipX.toFixed(1)},${rTipY.toFixed(1)}
                       L ${(anchor.x - ux5 * pecW).toFixed(1)},${(anchor.y - uy5 * pecW).toFixed(1)} Z`;

        const lPecD = `M ${anchor.x.toFixed(1)},${(anchor.y + pecW * 0.15).toFixed(1)}
                       Q ${(anchor.x + lFinDirX * pecL * 0.3).toFixed(1)},${(anchor.y + lFinDirY * pecL * 0.3 - pecW * 0.6).toFixed(1)} ${lTipX.toFixed(1)},${lTipY.toFixed(1)}
                       L ${(anchor.x - ux5 * pecW).toFixed(1)},${(anchor.y - uy5 * pecW).toFixed(1)} Z`;

        if (rightPecFinRef.current) {
          rightPecFinRef.current.setAttribute('d', rPecD);
        }
        if (leftPecFinRef.current) {
          leftPecFinRef.current.setAttribute('d', lPecD);
        }

        // ─── 5. Head details (Cute Eye & Smile) ───
        const t8 = topPoints[8];
        const eyeX = spine[8].x + t8.ux * conf.w8 * 0.15;
        const eyeY = spine[8].y - t8.nx * conf.w8 * 0.38;

        if (eyeRef.current) {
          eyeRef.current.setAttribute('cx', String(eyeX));
          eyeRef.current.setAttribute('cy', String(eyeY));
          eyeRef.current.setAttribute('rx', String(eyeR));
          eyeRef.current.setAttribute('ry', String(eyeR)); // Always perfectly circular and cute!
        }

        if (eyePupilRef.current) {
          eyePupilRef.current.setAttribute('cx', String(eyeX + eyeR * 0.22));
          eyePupilRef.current.setAttribute('cy', String(eyeY - eyeR * 0.05));
          eyePupilRef.current.setAttribute('r', String(eyeR * 0.45));
        }

        // Re-purposed mouthRef as a happy curved dark vector cartoon smile!
        if (mouthRef.current) {
          const mouthX1 = eyeX - eyeR * 0.4;
          const mouthY1 = eyeY + conf.w8 * 0.45;
          const mouthX2 = eyeX + eyeR * 1.4;
          const mouthY2 = eyeY + conf.w8 * 0.4;
          const ctrlX = eyeX + eyeR * 0.4;
          const ctrlY = eyeY + conf.w8 * 0.75; // Curve down for happy expression!

          const smileD = `M ${mouthX1.toFixed(1)},${mouthY1.toFixed(1)} Q ${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${mouthX2.toFixed(1)},${mouthY2.toFixed(1)}`;
          mouthRef.current.setAttribute('d', smileD);
        }

        // Wake bubbles
        const wakeNodes = [wake1Ref.current, wake2Ref.current, wake3Ref.current, wake4Ref.current];
        wakeNodes.forEach((node, i) => {
          if (node) {
            const bubbleX = spine[0].x - 12 - i * 16 - Math.sin(phase + i) * 5;
            const bubbleY = spine[0].y + Math.sin(phase * 1.2 + i) * 8;
            node.setAttribute('cx', String(bubbleX));
            node.setAttribute('cy', String(bubbleY));
          }
        });
      } catch (err) {
        console.error('Procedural fish frame update failed:', err);
      }
    };

    gsap.ticker.add(tickHandler);

    // ── 6. X/Y swim path timeline (master, scrubbed) ──────────
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

    // ── 7. Age-evolution + orientation ScrollTrigger ──────────
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
          frameRef.current = idx;
          setActiveFrame(idx);

          const targetConf = phaseConfigs[idx];
          
          const gsapVars = {
            scale: targetConf.scale,
            torsoLength: targetConf.torsoLength,
            swimFreq: targetConf.swimFreq,
            swimAmp: targetConf.swimAmp,
            dorsalHeight: targetConf.dorsalHeight,
            dorsalOffset: targetConf.dorsalOffset,
            tailSize: targetConf.tailSize,
            tailSpan: targetConf.tailSpan,
            tailTopLobe: targetConf.tailTopLobe,
            tailBottomLobe: targetConf.tailBottomLobe,
            pecLength: targetConf.pecLength,
            pecWidth: targetConf.pecWidth,
            eyeRadius: targetConf.eyeRadius,
            eyeStyle: targetConf.eyeStyle,
            showDetails: targetConf.showDetails,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
          };

          for (let i = 0; i < 9; i++) {
            gsapVars[`w${i}`] = targetConf[`w${i}`];
          }

          gsap.to(currentConfig.current, gsapVars);

          gsap.timeline()
            .to(morphScaleRef, { current: 70, duration: 0.25, ease: 'power2.out' })
            .to(morphScaleRef, { current: 0,   duration: 0.65, ease: 'elastic.out(1, 0.55)' });

          if (turbuRef.current) {
            gsap.timeline()
              .to(turbuRef.current, { attr: { baseFrequency: '0.042 0.088' }, duration: 0.22, ease: 'power2.out' })
              .to(turbuRef.current, { attr: { baseFrequency: '0.012 0.024' }, duration: 0.55, ease: 'power2.inOut' });
          }

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

        velocityFactorRef.current = normVel;
        gsap.to(maxFlexRef, {
          current: 3 + normVel * 16,
          duration: 0.28,
          overwrite: 'auto',
        });

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

          <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, #020c16 0%, #031525 40%, #041e35 100%)' }}
      />
      <div className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 62% 55% at 50% 50%, rgba(13,53,88,0.6), transparent)' }}
      />

      <div className="pool-floor-grid pointer-events-none" />
      <div className="pool-sun-rays pointer-events-none" />

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

      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="sc-splash absolute w-4 h-4 rounded-full pointer-events-none opacity-0"
          style={{ background: `radial-gradient(circle, ${color.glowHex}cc, transparent)` }}
        />
      ))}

      <div
        ref={wrapperRef}
        className="absolute"
        style={{ width: 'min(48vw, 48vh)', height: 'min(48vw, 48vh)', transformOrigin: 'center center', willChange: 'transform' }}
      >
        <div ref={mirrorRef} className="w-full h-full" style={{ transformOrigin: 'center center' }}>
          <div
            ref={flexRef}
            className="w-full h-full"
            style={{ filter: 'url(#sc-water-morph)', transformOrigin: 'center center' }}
          >
            <div ref={floatRef} className="w-full h-full" style={{ transformOrigin: 'center center' }}>

              <svg
                viewBox="0 0 240 240"
                className="w-full h-full overflow-visible"
                style={{ filter: 'url(#glow-filter)' }}
              >
                <defs>
                  <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={color.from} />
                    <stop offset="55%"  stopColor={color.to} />
                    <stop offset="100%" stopColor="#0afcff" stopOpacity="0.75" />
                  </linearGradient>

                  <radialGradient id="wake-grad">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>

                <g ref={scaleGroupRef}>
                  
                  {/* 1. Left Pectoral Fin (Back Layer) */}
                  <path
                    ref={leftPecFinRef}
                    fill="url(#body-grad)"
                    opacity="0.55"
                  />

                  {/* 2. Caudal Fin (Tail) */}
                  <path
                    ref={caudalFinRef}
                    fill="url(#body-grad)"
                  />

                  {/* 3. Dorsal Fin */}
                  <path
                    ref={dorsalFinRef}
                    fill="url(#body-grad)"
                  />

                  {/* 4. Main Body Silhouette */}
                  <path
                    ref={bodyRef}
                    fill="url(#body-grad)"
                    stroke="url(#body-grad)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />

                  {/* 5. Eye White / Outer Circle */}
                  <ellipse
                    ref={eyeRef}
                    fill="#ffffff"
                  />

                  {/* 6. Eye Pupil (Big cute round pupil) */}
                  <circle
                    ref={eyePupilRef}
                    fill="#030d18"
                  />

                  {/* 7. Happy Cartoon Smile Line */}
                  <path
                    ref={mouthRef}
                  />

                  {/* 8. Right Pectoral Fin (Front Layer) */}
                  <path
                    ref={rightPecFinRef}
                    fill="url(#body-grad)"
                  />

                </g>

                <circle ref={wake1Ref} r="4.0" fill="url(#wake-grad)" opacity="0.6" />
                <circle ref={wake2Ref} r="2.8" fill="url(#wake-grad)" opacity="0.45" />
                <circle ref={wake3Ref} r="2.0" fill="url(#wake-grad)" opacity="0.35" />
                <circle ref={wake4Ref} r="1.2" fill="url(#wake-grad)" opacity="0.25" />

              </svg>

            </div>
          </div>
        </div>
      </div>

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
