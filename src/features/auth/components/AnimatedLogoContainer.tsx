import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PhysicsBox = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  rot: number;
  color: string;
};

// Configuración de la secuencia (30 segundos)
const TOTAL_TIME = 30;
const BUILD_DUR = 27; // 27s para construir, 3s para brillar

// T Gigante: 24 cajas. Tallo 4x2, Techo 2x8. Centro X=150.
const boxTargets = [
  // Tallo
  { bx: 140, by: 160, side: 'L' }, { bx: 160, by: 160, side: 'R' },
  { bx: 140, by: 140, side: 'L' }, { bx: 160, by: 140, side: 'R' },
  { bx: 140, by: 120, side: 'L' }, { bx: 160, by: 120, side: 'R' },
  { bx: 140, by: 100, side: 'L' }, { bx: 160, by: 100, side: 'R' },
  // Techo Nivel 1
  { bx: 140, by: 80, side: 'L' }, { bx: 160, by: 80, side: 'R' },
  { bx: 120, by: 80, side: 'L' }, { bx: 180, by: 80, side: 'R' },
  { bx: 100, by: 80, side: 'L' }, { bx: 200, by: 80, side: 'R' },
  { bx: 80, by: 80, side: 'L' },  { bx: 220, by: 80, side: 'R' },
  // Techo Nivel 2
  { bx: 140, by: 60, side: 'L' }, { bx: 160, by: 60, side: 'R' },
  { bx: 120, by: 60, side: 'L' }, { bx: 180, by: 60, side: 'R' },
  { bx: 100, by: 60, side: 'L' }, { bx: 200, by: 60, side: 'R' },
  { bx: 80, by: 60, side: 'L' },  { bx: 220, by: 60, side: 'R' },
];

const trips = boxTargets.map((box, index) => {
  const isLeft = box.side === 'L';
  const sideIndex = Math.floor(index / 2); // 0 a 11
  
  // R1 y R3 para la izquierda, R2 y R4 para la derecha
  const robotId = isLeft ? (sideIndex % 2 === 0 ? 1 : 3) : (sideIndex % 2 === 0 ? 2 : 4);
  
  const spacing = (BUILD_DUR - 5) / 11;
  const tossTime = 1.5 + (sideIndex * spacing) + (isLeft ? 0 : spacing * 0.5);
  
  return {
    r: robotId,
    s: Math.max(0, tossTime - 1.5), // 1.5s de carrera
    t: tossTime,
    e: tossTime + 1.5,
    side: box.side,
    tx: isLeft ? box.bx - 40 : box.bx + 40,
    bx: box.bx,
    by: box.by
  };
});

const p = (t: number) => ((t / TOTAL_TIME) * 100).toFixed(2) + '%';

export function AnimatedLogoContainer() {
  const [phase, setPhase] = useState<'build' | 'loop'>('build');
  const [physicsBoxes, setPhysicsBoxes] = useState<PhysicsBox[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastThrow = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('loop'), TOTAL_TIME * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame: number;
    const update = () => {
      setPhysicsBoxes(prev => {
        if (prev.length === 0) return prev;
        return prev.map(b => ({
          ...b,
          x: b.x + b.vx,
          y: b.y + b.vy,
          vy: b.vy + 0.8,
          rot: b.rot + b.vr
        })).filter(b => b.y < window.innerHeight + 100);
      });
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseMove = () => {
    const now = Date.now();
    if (now - lastThrow.current > 30) {
      lastThrow.current = now;
      
      const bots = [1, 2, 3, 4].map(i => document.getElementById(`robot-${i}`)).filter(Boolean) as HTMLElement[];
      const activeBots = bots.filter(b => {
         const rect = b.getBoundingClientRect();
         return rect.left > 0 && rect.right < window.innerWidth;
      });
      
      const sourceBot = activeBots.length > 0 
        ? activeBots[Math.floor(Math.random() * activeBots.length)]
        : bots[0]; 
        
      if (!sourceBot) return;

      const rect = sourceBot.getBoundingClientRect();
      const spawnX = rect.left + rect.width / 2;
      const spawnY = rect.top + rect.height / 2;

      setPhysicsBoxes(prev => {
        const newBoxes = [];
        for(let i=0; i<3; i++) {
          newBoxes.push({
            id: Math.random(),
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 50,
            vy: -10 - Math.random() * 30,
            vr: (Math.random() - 0.5) * 50,
            rot: 0,
            color: Math.random() > 0.4 ? '#DEB887' : '#2A5D8F'
          });
        }
        return [...prev, ...newBoxes];
      });
    }
  };

  const getDynamicCss = () => {
    let boxCss = '';
    trips.forEach((trip, i) => {
      const tStart = trip.s;
      const tThrow = trip.t;
      const tLand = trip.t + 0.5;
      const tReach = trip.t - 0.2;
      const startX = trip.side === 'L' ? -40 : 340;
      
      boxCss += `
        @keyframes box${i}Anim {
          0%, ${p(tStart)} { transform: translate(${startX}px, 150px); opacity: 0; }
          ${p(tStart + 0.02)} { opacity: 1; }
          ${p(tReach)}, ${p(tThrow)} { transform: translate(${trip.tx + (trip.side === 'L' ? 8 : -8)}px, 150px); opacity: 1; }
          ${p((tThrow + tLand) / 2)} { transform: translate(${(trip.tx + trip.bx) / 2}px, ${trip.by - 40}px) rotate(${trip.side === 'L' ? 180 : -180}deg); }
          ${p(tLand)}, 100% { transform: translate(${trip.bx}px, ${trip.by}px) rotate(${trip.side === 'L' ? 360 : -360}deg); opacity: 1; }
        }
        .b-box${i} { animation: box${i}Anim ${TOTAL_TIME}s linear forwards; transform-origin: 10px 10px; }
      `;
    });

    let robotCss = '';
    for (let r = 1; r <= 4; r++) {
      const rTrips = trips.filter(t => t.r === r);
      if (rTrips.length === 0) continue;
      
      const side = rTrips[0].side;
      const startX = side === 'L' ? -40 : 340;
      const scale = side === 'L' ? 1 : -1;
      
      let kf = `@keyframes robot${r}Anim {`;
      kf += `0% { transform: translate(${startX}px, 160px) scaleX(${scale}); }`;
      
      rTrips.forEach(trip => {
        const tReach = trip.t - 0.2;
        kf += `
          ${p(trip.s)} { transform: translate(${startX}px, 160px) scaleX(${scale}); }
          ${p(tReach)}, ${p(trip.t)} { transform: translate(${trip.tx}px, 160px) scaleX(${scale}); }
          ${p(trip.e)} { transform: translate(${startX}px, 160px) scaleX(${scale}); }
        `;
      });
      
      kf += `100% { transform: translate(${startX}px, 160px) scaleX(${scale}); } }`;
      robotCss += `${kf}\n.b-robot${r} { animation: robot${r}Anim ${TOTAL_TIME}s linear forwards; }`;
    }

    const colorCss = `
      @keyframes colorTransform {
        0%, ${p(27)} { fill: #DEB887; stroke: #B48E5D; stroke-width: 1px; }
        ${p(27.5)}, ${p(28.5)} { fill: #FFFFFF; stroke: #FFFFFF; stroke-width: 2px; filter: drop-shadow(0 0 10px #5BA3D9); }
        ${p(29)}, 100% { fill: #2A5D8F; stroke: none; filter: drop-shadow(0 0 0px transparent); }
      }
      @keyframes tapeFade {
        0%, ${p(27)} { opacity: 1; fill: #E6C280; }
        ${p(27.5)}, 100% { opacity: 0; }
      }
      .anim-color { animation: colorTransform ${TOTAL_TIME}s ease-out forwards; }
      .anim-tape { animation: tapeFade ${TOTAL_TIME}s ease-out forwards; }
    `;

    return boxCss + robotCss + colorCss;
  };

  const cssStaticLoop = `
    @keyframes runAcL {
      0% { transform: translate(-50px, 160px) scaleX(1); }
      49.9% { transform: translate(350px, 160px) scaleX(1); }
      50% { transform: translate(350px, 160px) scaleX(-1); }
      99.9% { transform: translate(-50px, 160px) scaleX(-1); }
      100% { transform: translate(-50px, 160px) scaleX(1); }
    }
    @keyframes runAcR {
      0% { transform: translate(350px, 160px) scaleX(-1); }
      49.9% { transform: translate(-50px, 160px) scaleX(-1); }
      50% { transform: translate(-50px, 160px) scaleX(1); }
      99.9% { transform: translate(350px, 160px) scaleX(1); }
      100% { transform: translate(350px, 160px) scaleX(-1); }
    }
    .l-robot1 { animation: runAcL 8s linear infinite; }
    .l-robot2 { animation: runAcR 7s linear infinite 1s backwards; }
    .l-robot3 { animation: runAcL 9s linear infinite 2s backwards; }
    .l-robot4 { animation: runAcR 6s linear infinite 3s backwards; }
    .static-box { fill: #2A5D8F; stroke: none; }
    .static-tape { opacity: 0; display: none; }
  `;

  const cssCommon = `
    @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
    .anim-bob { animation: bob 0.25s infinite; }
    .wheel-spin { animation: spin 0.6s linear infinite; transform-origin: 0px 8.5px; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  `;

  return (
    <>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className="mx-auto w-full max-w-[320px] h-52 mb-8 relative cursor-crosshair group"
      >
        <style>
          {cssCommon}
          {phase === 'build' ? getDynamicCss() : cssStaticLoop}
        </style>
        
        <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in transition-transform duration-300 group-hover:scale-[1.02]">
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <defs>
              <g id="worker">
                <g className="anim-bob">
                  {/* Brazo atrás */}
                  <path d="M -2 0 L -8 6 L -2 6" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="-8" y="-12" width="16" height="16" rx="4" fill="#EAB308" />
                  <path d="M -10 -2 L 10 -2" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                  <rect x="-6" y="-8" width="12" height="5" rx="1.5" fill="#0F172A" />
                  <circle cx="-2" cy="-5.5" r="1.2" fill="#06B6D4" />
                  <circle cx="2" cy="-5.5" r="1.2" fill="#06B6D4" />
                  {/* Brazo frente */}
                  <path d="M 4 0 L 10 6 L 4 6" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                {/* Oruga de tanque (Track) */}
                <rect x="-7" y="5" width="14" height="7" rx="3.5" fill="#1E293B" />
                <g className="wheel-spin">
                  <circle cx="-3.5" cy="8.5" r="1.5" fill="#64748B" />
                  <circle cx="3.5" cy="8.5" r="1.5" fill="#64748B" />
                  <circle cx="0" cy="5" r="1.5" fill="#64748B" />
                  <circle cx="0" cy="12" r="1.5" fill="#64748B" />
                </g>
              </g>
              <g id="worker-carry">
                <use href="#worker" />
                <g className="anim-bob">
                  <rect x="6" y="-10" width="12" height="12" rx="2" fill="#DEB887" />
                  <path d="M 6 -4 L 18 -4" stroke="#B48E5D" strokeWidth="1" />
                  <path d="M 4 -4 L 10 2" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>
              <g id="box-svg">
                <rect width="20" height="20" rx="2" className={phase === 'build' ? 'anim-color' : 'static-box'} />
                <rect x="4" y="8" width="12" height="4" rx="1" className={phase === 'build' ? 'anim-tape' : 'static-tape'} />
                <path d="M 0 10 L 20 10" stroke="#B48E5D" strokeWidth="1" className={phase === 'build' ? 'anim-tape' : 'static-tape'} opacity="0.5" />
              </g>
            </defs>

            {/* Suelo industrial */}
            <line x1="0" y1="172" x2="320" y2="172" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />

            {/* Cajas (La Letra T) */}
            {phase === 'build' ? (
              <g>
                {trips.map((_, i) => <g key={`box-${i}`} className={`b-box${i}`}><use href="#box-svg" /></g>)}
              </g>
            ) : (
              <g>
                {trips.map((t, i) => <g key={`sbox-${i}`} transform={`translate(${t.bx}, ${t.by})`}><use href="#box-svg" /></g>)}
              </g>
            )}

            {/* Robots Animados */}
            {phase === 'build' ? (
              <g>
                {[1, 2, 3, 4].map(r => <g key={`r-${r}`} id={`robot-${r}`} className={`b-robot${r}`}><use href="#worker" /></g>)}
              </g>
            ) : (
              <g>
                {[1, 2, 3, 4].map(r => <g key={`lr-${r}`} id={`robot-${r}`} className={`l-robot${r}`}><use href="#worker-carry" /></g>)}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Physics Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
          {physicsBoxes.map(b => (
            <div key={b.id} style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
              width: '24px',
              height: '24px',
              backgroundColor: b.color,
              borderRadius: '2px',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
            }}>
              <div style={{ position: 'absolute', top: '10px', left: 0, width: '100%', height: '3px', backgroundColor: 'rgba(0,0,0,0.15)' }} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
