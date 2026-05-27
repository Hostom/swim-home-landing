import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { label: 'Bebê (6m – 2a)',         phase: '01' },
  { label: 'Mergulho (3a – 5a)',      phase: '02' },
  { label: 'Autonomia (6a – 10a)',    phase: '03' },
  { label: 'Técnica (11a – 14a)',     phase: '04' },
  { label: 'Habilidade para a Vida',  phase: '05' },
];

const phaseColors = [
  { from: '#7dd4f0', to: '#1A7FA8', glow: 'rgba(125,212,240,0.45)', glowHex: '#7dd4f0' },
  { from: '#50c8e8', to: '#0e5c80', glow: 'rgba(80,200,232,0.4)',   glowHex: '#50c8e8' },
  { from: '#29b6d8', to: '#0a3d5c', glow: 'rgba(41,182,216,0.35)',  glowHex: '#29b6d8' },
  { from: '#1A7FA8', to: '#07263a', glow: 'rgba(26,127,168,0.35)',  glowHex: '#1A7FA8' },
  { from: '#0e4b73', to: '#040e18', glow: 'rgba(14,75,115,0.45)',   glowHex: '#0e4b73' },
];

const phaseConfigs = [
  // 0: Bebê — extremely chubby, large head, short cute limbs, thick body, playful paddle
  {
    scale: 0.65,
    headRadius: 26,       // big round baby head
    torsoWidth: 52,       // super chubby torso!
    torsoLength: 46,
    armLength: 32,
    armWidth: 20,         // thick cute baby arms
    legLength: 26,
    legWidth: 19,         // thick cute baby legs
    swimFreq: 0.8,        // gentle slower baby paddle
    swimAmp: 16,
  },
  // 1: Mergulho — toddler, slightly longer, but still robust and chubby
  {
    scale: 0.8,
    headRadius: 21,
    torsoWidth: 44,       // robust child body
    torsoLength: 60,
    armLength: 44,
    armWidth: 16,
    legLength: 40,
    legWidth: 15,
    swimFreq: 0.65,
    swimAmp: 13,
  },
  // 2: Autonomia — young child, growing longer limbs
  {
    scale: 0.95,
    headRadius: 18,
    torsoWidth: 38,       // athletic child body
    torsoLength: 72,
    armLength: 54,
    armWidth: 13.5,
    legLength: 52,
    legWidth: 13,
    swimFreq: 0.5,
    swimAmp: 11,
  },
  // 3: Técnica — teenager, broad shoulders, streamlined athletic body
  {
    scale: 1.1,
    headRadius: 15,
    torsoWidth: 32,       // broad chest, tapered waist
    torsoLength: 82,
    armLength: 66,
    armWidth: 11.5,
    legLength: 64,
    legWidth: 11,
    swimFreq: 0.4,
    swimAmp: 9,
  },
  // 4: Adulto — full athletic proportions, strong shoulders, long powerful limbs
  {
    scale: 1.25,
    headRadius: 13,
    torsoWidth: 28,       // powerful tapered athletic body
    torsoLength: 90,
    armLength: 76,
    armWidth: 10,
    legLength: 74,
    legWidth: 9.5,
    swimFreq: 0.32,
    swimAmp: 8,
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

  // Skeletal nodes
  const scaleGroupRef   = useRef(null);
  const headRef         = useRef(null);
  const torsoRef        = useRef(null);
  
  // Back Arm
  const leftUpperArmRef = useRef(null);
  const leftForearmRef = useRef(null);
  const leftHandRef = useRef(null);
  const innerLeftUpperArmRef = useRef(null);
  const innerLeftForearmRef = useRef(null);

  // Front Arm
  const rightUpperArmRef = useRef(null);
  const rightForearmRef = useRef(null);
  const rightHandRef = useRef(null);
  const innerRightUpperArmRef = useRef(null);
  const innerRightForearmRef = useRef(null);

  // Back Leg
  const leftThighRef = useRef(null);
  const leftCalfRef = useRef(null);
  const leftFootRef = useRef(null);
  const innerLeftThighRef = useRef(null);
  const innerLeftCalfRef = useRef(null);

  // Front Leg
  const rightThighRef = useRef(null);
  const rightCalfRef = useRef(null);
  const rightFootRef = useRef(null);
  const innerRightThighRef = useRef(null);
  const innerRightCalfRef = useRef(null);

  // Volumetric inner torso layer
  const innerTorsoRef   = useRef(null);

  // Head details
  const gogglesStrapRef = useRef(null);
  const gogglesLensRef  = useRef(null);

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

  // Current procedural joint configurations
  const currentConfig = useRef({ ...phaseConfigs[0] });

  useGSAP(() => {
    // ── Set initial body proportions ───────────────────────────
    const initialConf = phaseConfigs[0];
    currentConfig.current = { ...initialConf };

    // ── 1. Idle float (on floatRef only) ──────────────────────
    gsap.to(floatRef.current, {
      y: '+=14', duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 2. Portal pulse ───────────────────────────────────────
    gsap.to(portalRef.current, {
      scale: 1.07, opacity: 0.88, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // ── 3. Ambient bubble rise ────────────────────────────────
    gsap.utils.toArray('.sc-bubble').forEach((el) => {
      gsap.to(el, {
        y: -(window.innerHeight + 100),
        duration: gsap.utils.random(5, 12),
        repeat: -1,
        delay: gsap.utils.random(0, 7),
        ease: 'none',
      });
    });

    // We keep track of phase in kickObj
    const kickObj = { phase: 0 };

    const tickHandler = (time, deltaTime) => {
      try {
        const conf = currentConfig.current;
        const freq = conf.swimFreq || 0.4;
        
        // Prevent NaN speed scales or division issues
        const speedScale = 0.55 + (Number(velocityFactorRef.current) || 0) * 1.6;
        
        // Fixed safe 0.016 time step multiplied by 12.0 for highly visible, active strokes
        kickObj.phase += 0.016 * 12.0 * freq * speedScale;
        const phase = kickObj.phase;

        // Extract current configurations
        const scale = conf.scale;
        const headR = conf.headRadius;
        const tW = conf.torsoWidth;
        const tL = conf.torsoLength;
        const aL = conf.armLength;
        const aW = conf.armWidth;
        const lL = conf.legLength;
        const lW = conf.legWidth;

        // Displacement & flex wiggling
        const wavyAmp = maxFlexRef.current * 0.8;
        const dispVal = morphScaleRef.current + Math.sin(phase) * wavyAmp * 0.5;

        // Drive displacement map scale
        if (displacRef.current) {
          displacRef.current.setAttribute('scale', String(Math.max(0, dispVal)));
        }

        // Skew and scale flex container
        if (flexRef.current) {
          gsap.set(flexRef.current, {
            skewX:  Math.sin(phase) * wavyAmp * 0.12,
            scaleX: 1 - Math.abs(dispVal) * 0.0008,
            scaleY: 1 + Math.abs(dispVal) * 0.0016,
          });
        }

        // Calculate joints with continuous S-like wiggling wave
        const hipY = 120 + Math.sin(phase - 1.2) * wavyAmp * 0.6;
        const shoulderY = 120 + Math.sin(phase + 1.2) * wavyAmp * 0.6;
        const midY = 120 + Math.sin(phase) * wavyAmp;

        const hipX = 120 - tL / 2;
        const shoulderX = 120 + tL / 2;

        const headX = shoulderX + headR * 0.8 + 2;
        const headY = shoulderY + Math.sin(phase + 1.8) * wavyAmp * 0.4;

        // Calculate limb rotation angles (in degrees)
        let leftArmAngle = 0;
        let rightArmAngle = 0;
        let leftLegAngle = 0;
        let rightLegAngle = 0;

        const currentIdx = frameRef.current; // Read from Ref to bypass stale closure bug

        if (currentIdx === 0) {
          // Bebê: Dog-paddle vaivém
          leftArmAngle = Math.sin(phase * 2.2) * 35;
          rightArmAngle = Math.sin(phase * 2.2 + Math.PI) * 35;
          leftLegAngle = Math.sin(phase * 2.8) * 22;
          rightLegAngle = Math.sin(phase * 2.8 + Math.PI) * 22;
        } else if (currentIdx === 1) {
          // Mergulho: Síncronos dolphin pull & kick
          leftArmAngle = Math.sin(phase) * 40 - 20;
          rightArmAngle = Math.sin(phase) * 40 - 20;
          leftLegAngle = Math.sin(phase + 1.5) * 20;
          rightLegAngle = Math.sin(phase + 1.5) * 20;
        } else {
          // Crawl: Rotações de 360° alternadas + flutter kick
          const armDeg = (phase * (180 / Math.PI)) * 1.1;
          leftArmAngle = armDeg % 360;
          rightArmAngle = (armDeg + 180) % 360;

          leftLegAngle = Math.sin(phase * 2.0) * 16;
          rightLegAngle = Math.sin(phase * 2.0 + Math.PI) * 16;
        }

        // Convert angles to radians for limb kinematics
        const leftArmRad = leftArmAngle * (Math.PI / 180);
        const rightArmRad = rightArmAngle * (Math.PI / 180);
        const leftLegRad = leftLegAngle * (Math.PI / 180);
        const rightLegRad = rightLegAngle * (Math.PI / 180);

        // --- Left Arm (Back Layer) Kinematics with high-elbow recovery ---
        const leftElbowX = shoulderX + Math.cos(leftArmRad) * aL * 0.45;
        const leftElbowY = shoulderY + Math.sin(leftArmRad) * aL * 0.45;
        // Bends elbow deeply (up to 75 deg) when arm recovers forward above the head
        const leftElbowBend = (leftArmRad > Math.PI) ? (Math.sin(leftArmRad) * 1.1) : (Math.sin(leftArmRad) * 0.15);
        const leftForearmRad = leftArmRad + leftElbowBend;
        const leftHandX = leftElbowX + Math.cos(leftForearmRad) * aL * 0.55;
        const leftHandY = leftElbowY + Math.sin(leftForearmRad) * aL * 0.55;

        // --- Right Arm (Front Layer) Kinematics with high-elbow recovery ---
        const rightElbowX = shoulderX + Math.cos(rightArmRad) * aL * 0.45;
        const rightElbowY = shoulderY + Math.sin(rightArmRad) * aL * 0.45;
        const rightElbowBend = (rightArmRad > Math.PI) ? (Math.sin(rightArmRad) * 1.1) : (Math.sin(rightArmRad) * 0.15);
        const rightForearmRad = rightArmRad + rightElbowBend;
        const rightHandX = rightElbowX + Math.cos(rightForearmRad) * aL * 0.55;
        const rightHandY = rightElbowY + Math.sin(rightForearmRad) * aL * 0.55;

        // --- Left Leg (Back Layer) Kinematics with dynamic knee wiggling ---
        const leftKneeX = hipX - Math.cos(leftLegRad) * lL * 0.5;
        const leftKneeY = hipY + Math.sin(leftLegRad) * lL * 0.5;
        const leftCalfRad = leftLegRad + Math.sin(phase - 0.5) * 0.18;
        const leftFootX = leftKneeX - Math.cos(leftCalfRad) * lL * 0.5;
        const leftFootY = leftKneeY + Math.sin(leftCalfRad) * lL * 0.5;

        // --- Right Leg (Front Layer) Kinematics with dynamic knee wiggling ---
        const rightKneeX = hipX - Math.cos(rightLegRad) * lL * 0.5;
        const rightKneeY = hipY + Math.sin(rightLegRad) * lL * 0.5;
        const rightCalfRad = rightLegRad + Math.sin(phase - 0.5 + Math.PI) * 0.18;
        const rightFootX = rightKneeX - Math.cos(rightCalfRad) * lL * 0.5;
        const rightFootY = rightKneeY + Math.sin(rightCalfRad) * lL * 0.5;

        // Helper function to update jointed line segments
        const updateSegment = (upperNode, innerUpperNode, lowerNode, innerLowerNode, handNode, x1, y1, x2, y2, x3, y3, w1, w2) => {
          if (upperNode) {
            upperNode.setAttribute('x1', String(x1));
            upperNode.setAttribute('y1', String(y1));
            upperNode.setAttribute('x2', String(x2));
            upperNode.setAttribute('y2', String(y2));
            upperNode.setAttribute('stroke-width', String(w1));
          }
          if (innerUpperNode) {
            innerUpperNode.setAttribute('x1', String(x1));
            innerUpperNode.setAttribute('y1', String(y1));
            innerUpperNode.setAttribute('x2', String(x2));
            innerUpperNode.setAttribute('y2', String(y2));
            innerUpperNode.setAttribute('stroke-width', String(w1 * 0.4));
          }
          if (lowerNode) {
            lowerNode.setAttribute('x1', String(x2));
            lowerNode.setAttribute('y1', String(y2));
            lowerNode.setAttribute('x2', String(x3));
            lowerNode.setAttribute('y2', String(y3));
            lowerNode.setAttribute('stroke-width', String(w2));
          }
          if (innerLowerNode) {
            innerLowerNode.setAttribute('x1', String(x2));
            innerLowerNode.setAttribute('y1', String(y2));
            innerLowerNode.setAttribute('x2', String(x3));
            innerLowerNode.setAttribute('y2', String(y3));
            innerLowerNode.setAttribute('stroke-width', String(w2 * 0.4));
          }
          if (handNode) {
            handNode.setAttribute('cx', String(x3));
            handNode.setAttribute('cy', String(y3));
            handNode.setAttribute('r', String(w2 * 0.72));
          }
        };

        // Helper to update foot segments
        const updateFoot = (footNode, x, y, size) => {
          if (footNode) {
            footNode.setAttribute('x1', String(x));
            footNode.setAttribute('y1', String(y));
            footNode.setAttribute('x2', String(x - size * 1.5));
            footNode.setAttribute('y2', String(y + size * 0.5));
            footNode.setAttribute('stroke-width', String(size * 0.9));
          }
        };

        // Update scale group transform
        if (scaleGroupRef.current) {
          scaleGroupRef.current.setAttribute('transform', `translate(120, 120) scale(${scale}) translate(-120, -120)`);
        }

        // Update Back Arm (Left)
        updateSegment(
          leftUpperArmRef.current, innerLeftUpperArmRef.current,
          leftForearmRef.current, innerLeftForearmRef.current,
          leftHandRef.current,
          shoulderX, shoulderY, leftElbowX, leftElbowY, leftHandX, leftHandY,
          aW * 1.45, aW * 1.05
        );

        // Update Front Arm (Right)
        updateSegment(
          rightUpperArmRef.current, innerRightUpperArmRef.current,
          rightForearmRef.current, innerRightForearmRef.current,
          rightHandRef.current,
          shoulderX, shoulderY, rightElbowX, rightElbowY, rightHandX, rightHandY,
          aW * 1.45, aW * 1.05
        );

        // Update Back Leg (Left)
        updateSegment(
          leftThighRef.current, innerLeftThighRef.current,
          leftCalfRef.current, innerLeftCalfRef.current,
          null,
          hipX, hipY, leftKneeX, leftKneeY, leftFootX, leftFootY,
          lW * 1.5, lW * 1.1
        );
        updateFoot(leftFootRef.current, leftFootX, leftFootY, lW);

        // Update Front Leg (Right)
        updateSegment(
          rightThighRef.current, innerRightThighRef.current,
          rightCalfRef.current, innerRightCalfRef.current,
          null,
          hipX, hipY, rightKneeX, rightKneeY, rightFootX, rightFootY,
          lW * 1.5, lW * 1.1
        );
        updateFoot(rightFootRef.current, rightFootX, rightFootY, lW);

        // Update Torso (closed organic silhouette that tapers at the waist and bulges at shoulders/hips)
        const backOffset = tW * 0.45;
        const bellyOffset = tW * 0.55;
        const torsoPath = `M ${hipX},${hipY - backOffset} 
                           Q 120,${midY - tW * 0.4} ${shoulderX},${shoulderY - tW * 0.65} 
                           L ${shoulderX},${shoulderY + tW * 0.65} 
                           Q 120,${midY + tW * 0.4} ${hipX},${hipY + bellyOffset} Z`;

        if (torsoRef.current) {
          torsoRef.current.setAttribute('d', torsoPath);
        }
        if (innerTorsoRef.current) {
          // Glowing spine line down the center
          const centerSpine = `M ${hipX},${hipY} Q 120,${midY} ${shoulderX},${shoulderY}`;
          innerTorsoRef.current.setAttribute('d', centerSpine);
          innerTorsoRef.current.setAttribute('stroke-width', String(tW * 0.35));
        }

        // Update Head & Swimming Cap / Goggles Details
        if (headRef.current) {
          headRef.current.setAttribute('cx', String(headX));
          headRef.current.setAttribute('cy', String(headY));
          headRef.current.setAttribute('r', String(headR));
        }
        if (gogglesStrapRef.current) {
          gogglesStrapRef.current.setAttribute('x1', String(headX - headR * 0.85));
          gogglesStrapRef.current.setAttribute('y1', String(headY - headR * 0.15));
          gogglesStrapRef.current.setAttribute('x2', String(headX + headR * 0.15));
          gogglesStrapRef.current.setAttribute('y2', String(headY - headR * 0.15));
        }
        if (gogglesLensRef.current) {
          gogglesLensRef.current.setAttribute('cx', String(headX + headR * 0.38));
          gogglesLensRef.current.setAttribute('cy', String(headY - headR * 0.18));
          gogglesLensRef.current.setAttribute('rx', String(headR * 0.35));
          gogglesLensRef.current.setAttribute('ry', String(headR * 0.18));
        }

        // Wake bubbles trailing
        const wakeNodes = [wake1Ref.current, wake2Ref.current, wake3Ref.current, wake4Ref.current];
        wakeNodes.forEach((node, i) => {
          if (node) {
            const bubbleX = hipX - 10 - i * 15 - Math.sin(phase + i) * 4;
            const bubbleY = hipY + Math.sin(phase * 1.3 + i) * 7;
            node.setAttribute('cx', String(bubbleX));
            node.setAttribute('cy', String(bubbleY));
          }
        });
      } catch (err) {
        console.error('Procedural swimmer frame update failed:', err);
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

    // Keeping Y translation in a safe, perfectly centered range so the character is fully visible at all times!
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
        
        // Bulletproof scroll velocity lookup to prevent NaN poisoning in the ticker
        const velocity = self.getVelocity() || 0;
        const normVel = gsap.utils.clamp(0, 1, Math.abs(velocity) / 2200) || 0;

        // ── Frame threshold evolution ──────────────────────────
        const thresholds = [0.18, 0.38, 0.58, 0.78];
        const newIdx     = thresholds.findIndex((t) => progress < t);
        const idx        = newIdx === -1 ? 4 : newIdx;

        if (idx !== frameRef.current) {
          frameRef.current = idx;
          setActiveFrame(idx);

          // Transition joint proportions to the next phase configurations
          const targetConf = phaseConfigs[idx];
          gsap.to(currentConfig.current, {
            scale: targetConf.scale,
            headRadius: targetConf.headRadius,
            torsoWidth: targetConf.torsoWidth,
            torsoLength: targetConf.torsoLength,
            armLength: targetConf.armLength,
            armWidth: targetConf.armWidth,
            legLength: targetConf.legLength,
            legWidth: targetConf.legWidth,
            swimFreq: targetConf.swimFreq,
            swimAmp: targetConf.swimAmp,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
          });

          // Displacement spike for liquid age-morph effect
          gsap.timeline()
            .to(morphScaleRef, { current: 70, duration: 0.25, ease: 'power2.out' })
            .to(morphScaleRef, { current: 0,   duration: 0.65, ease: 'elastic.out(1, 0.55)' });

          // Turbulence frequency spike for extra liquid chaos
          if (turbuRef.current) {
            gsap.timeline()
              .to(turbuRef.current, { attr: { baseFrequency: '0.042 0.088' }, duration: 0.22, ease: 'power2.out' })
              .to(turbuRef.current, { attr: { baseFrequency: '0.012 0.024' }, duration: 0.55, ease: 'power2.inOut' });
          }

          // Splash scatter from character position
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

        // ── Kick speed + flex amplitude reactive to scroll ─────
        velocityFactorRef.current = normVel;
        gsap.to(maxFlexRef, {
          current: 3 + normVel * 16,
          duration: 0.28,
          overwrite: 'auto',
        });

        // ── Auto-orientation: pitch + horizontal flip ──────────
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
  }, []); // Run ONCE to completely solve recreated ScrollTrigger flicker / jump back to baby bug!

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

          <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
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

      {/* Pool tile floor grid */}
      <div className="pool-floor-grid pointer-events-none" />
      {/* Light rays */}
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

      {/* ── Portal glow (follows phase color) ─────────────────── */}
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
          SWIMMER HIERARCHY:
          wrapperRef  → X/Y path position + rotation (pitch)
            mirrorRef → horizontal flip (scaleX ±1)
              flexRef → dolphin kick skew/scale + SVG water-morph filter
                floatRef → idle ambient float (y only)
                  SVG → procedural skeletal glowing human swimmer
         ══════════════════════════════════════════════════════════ */}
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
                  {/* Phase-reactive gradient */}
                  <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={color.from} />
                    <stop offset="55%"  stopColor={color.to} />
                    <stop offset="100%" stopColor="#0afcff" stopOpacity="0.7" />
                  </linearGradient>

                  {/* Wake bubble gradient */}
                  <radialGradient id="wake-grad">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.5)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>

                {/* ─── PROCEDURAL SKELETAL SWIMMER GROUP ───────── */}
                <g ref={scaleGroupRef}>
                  
                  {/* Left Arm (Back Layer - darker depth) */}
                  <line
                    ref={leftUpperArmRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <line
                    ref={innerLeftUpperArmRef}
                    stroke="rgba(255,255,255,0.4)"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    ref={leftForearmRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <line
                    ref={innerLeftForearmRef}
                    stroke="rgba(255,255,255,0.4)"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <circle
                    ref={leftHandRef}
                    fill="url(#body-grad)"
                    opacity="0.6"
                  />

                  {/* Left Leg (Back Layer - darker depth) */}
                  <line
                    ref={leftThighRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <line
                    ref={innerLeftThighRef}
                    stroke="rgba(255,255,255,0.4)"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    ref={leftCalfRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <line
                    ref={innerLeftCalfRef}
                    stroke="rgba(255,255,255,0.4)"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <line
                    ref={leftFootRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                    opacity="0.6"
                  />

                  {/* Torso / Organic Tapered human silhouette (Middle Layer) */}
                  <path
                    ref={torsoRef}
                    fill="url(#body-grad)"
                    stroke="url(#body-grad)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Glowing spine column inside the torso */}
                  <path
                    ref={innerTorsoRef}
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeLinecap="round"
                  />

                  {/* Head (Middle Layer) */}
                  <circle
                    ref={headRef}
                    fill="url(#body-grad)"
                  />
                  {/* Goggles Strap */}
                  <line
                    ref={gogglesStrapRef}
                    stroke="#020c16"
                    strokeLinecap="round"
                    opacity="0.7"
                    strokeWidth="1.8"
                  />
                  {/* Glowing Goggles Lens */}
                  <ellipse
                    ref={gogglesLensRef}
                    fill="#0afcff"
                    opacity="0.95"
                  />

                  {/* Right Leg (Front Layer - fully bright) */}
                  <line
                    ref={rightThighRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={innerRightThighRef}
                    stroke="rgba(255,255,255,0.5)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={rightCalfRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={innerRightCalfRef}
                    stroke="rgba(255,255,255,0.5)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={rightFootRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                  />

                  {/* Right Arm (Front Layer - fully bright) */}
                  <line
                    ref={rightUpperArmRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={innerRightUpperArmRef}
                    stroke="rgba(255,255,255,0.5)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={rightForearmRef}
                    stroke="url(#body-grad)"
                    strokeLinecap="round"
                  />
                  <line
                    ref={innerRightForearmRef}
                    stroke="rgba(255,255,255,0.5)"
                    strokeLinecap="round"
                  />
                  <circle
                    ref={rightHandRef}
                    fill="url(#body-grad)"
                  />

                </g>

                {/* ─── Wake bubbles trailing from feet ─────────── */}
                <circle ref={wake1Ref} r="4.5" fill="url(#wake-grad)" opacity="0.6" />
                <circle ref={wake2Ref} r="3.2" fill="url(#wake-grad)" opacity="0.45" />
                <circle ref={wake3Ref} r="2.4" fill="url(#wake-grad)" opacity="0.35" />
                <circle ref={wake4Ref} r="1.6" fill="url(#wake-grad)" opacity="0.25" />

              </svg>

            </div>
          </div>
        </div>
      </div>

      {/* ── Phase label — fixed to bottom center, NOT inside wrapperRef ── */}
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
