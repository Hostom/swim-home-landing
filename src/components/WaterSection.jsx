import React, { useEffect, useState } from 'react';

// Wave paths for unique visual transitions between sections
const WAVE_PATHS = {
  top: "M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z",
  bottom: "M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
};

export default function WaterSection({
  children,
  className = '',
  id = '',
  bubblesCount = 8,
  waveTop = false,
  waveBottom = false,
  waveTopColor = '#0A3D5C',
  waveBottomColor = '#0A3D5C',
  bgColor = 'bg-water-deep',
}) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate randomized bubbles
    const newBubbles = Array.from({ length: bubblesCount }).map((_, i) => {
      const size = Math.random() * 24 + 8; // 8px to 32px
      const left = Math.random() * 100; // 0% to 100%
      const delay = Math.random() * 10; // 0s to 10s
      const duration = Math.random() * 8 + 8; // 8s to 16s
      return { id: i, size, left, delay, duration };
    });
    setBubbles(newBubbles);
  }, [bubblesCount]);

  return (
    <section id={id} className={`relative w-full ${bgColor} ${className} overflow-hidden`}>
      
      {/* Wave top */}
      {waveTop && (
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[40px] sm:h-[60px]"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path
              d={WAVE_PATHS.bottom}
              fill={waveTopColor}
            ></path>
          </svg>
        </div>
      )}

      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main Section Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Wave bottom */}
      {waveBottom && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[40px] sm:h-[60px]"
          >
            <path
              d={WAVE_PATHS.bottom}
              fill={waveBottomColor}
            ></path>
          </svg>
        </div>
      )}
    </section>
  );
}
