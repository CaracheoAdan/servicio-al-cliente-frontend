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

// Componente: Chibi Robots Builders & Physics Engine
// Una maravilla interactiva donde robots humanoides tiran cajas haciendo un arco perfecto.
// Al terminar, corren por la pantalla y si pasas el mouse, explotan cajas físicas por todos lados.
export function AnimatedLogoContainer() {
  const [phase, setPhase] = useState<'build' | 'loop'>('build');
  const [physicsBoxes, setPhysicsBoxes] = useState<PhysicsBox[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastThrow = useRef<number>(0);

  // Terminar construcción a los 8 segundos
  useEffect(() => {
    const timer = setTimeout(() => setPhase('loop'), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Motor de Físicas de Gravedad a 60 FPS
  useEffect(() => {
    let frame: number;
    const update = () => {
      setPhysicsBoxes(prev => {
        if (prev.length === 0) return prev;
        return prev.map(b => ({
          ...b,
          x: b.x + b.vx,
          y: b.y + b.vy,
          vy: b.vy + 0.8, // Gravedad
          rot: b.rot + b.vr
        })).filter(b => b.y < window.innerHeight + 100); // Eliminar al salir de pantalla
      });
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Lanzar cajas interactivas con el mouse
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastThrow.current > 40) { // Disparo ultra rápido (metralleta de cajas)
      lastThrow.current = now;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Origen de la erupción (centro del contenedor)
      const spawnX = rect.left + rect.width / 2;
      const spawnY = rect.top + rect.height / 2 + 50;

      setPhysicsBoxes(prev => [...prev, {
        id: Math.random(),
        x: spawnX + (Math.random() * 60 - 30),
        y: spawnY + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 35, // Explosión horizontal
        vy: -15 - Math.random() * 25,   // Salto vertical fuerte
        vr: (Math.random() - 0.5) * 45, // Rotación loca
        rot: 0,
        color: Math.random() > 0.3 ? '#DEB887' : '#2A5D8F'
      }]);
    }
  };

  const cssBuild = `
    @keyframes hLeftRun {
      0%, 2% { transform: translate(-50px, 135px); }
      10%    { transform: translate(60px, 135px); }
      15%, 25% { transform: translate(-50px, 135px); }
      35%    { transform: translate(60px, 135px); }
      40%, 50% { transform: translate(-50px, 135px); }
      60%    { transform: translate(60px, 135px); }
      65%, 100%{ transform: translate(0px, 135px); }
    }
    @keyframes hRightRun {
      0%, 15%  { transform: translate(350px, 135px) scaleX(-1); }
      22%      { transform: translate(220px, 135px) scaleX(-1); }
      27%, 37% { transform: translate(350px, 135px) scaleX(-1); }
      47%      { transform: translate(220px, 135px) scaleX(-1); }
      52%, 100%{ transform: translate(280px, 135px) scaleX(-1); }
    }
    @keyframes box1Toss {
      0%, 5%   { transform: translate(-50px, 120px); opacity: 0; }
      10%      { transform: translate(60px, 120px); opacity: 1; }
      12.5%    { transform: translate(100px, 80px) rotate(180deg); }
      15%, 100%{ transform: translate(140px, 140px) rotate(360deg); opacity: 1; }
    }
    @keyframes box2Toss {
      0%, 17%  { transform: translate(350px, 120px); opacity: 0; }
      22%      { transform: translate(220px, 120px); opacity: 1; }
      24.5%    { transform: translate(180px, 40px) rotate(-180deg); }
      27%, 100%{ transform: translate(140px, 100px) rotate(-360deg); opacity: 1; }
    }
    @keyframes box3Toss {
      0%, 30%  { transform: translate(-50px, 120px); opacity: 0; }
      35%      { transform: translate(60px, 120px); opacity: 1; }
      37.5%    { transform: translate(100px, 0px) rotate(180deg); }
      40%, 100%{ transform: translate(140px, 60px) rotate(360deg); opacity: 1; }
    }
    @keyframes box5Toss {
      0%, 42%  { transform: translate(350px, 120px); opacity: 0; }
      47%      { transform: translate(220px, 120px); opacity: 1; }
      49.5%    { transform: translate(200px, 0px) rotate(-180deg); }
      52%, 100%{ transform: translate(180px, 60px) rotate(-360deg); opacity: 1; }
    }
    @keyframes box4Toss {
      0%, 55%  { transform: translate(-50px, 120px); opacity: 0; }
      60%      { transform: translate(60px, 120px); opacity: 1; }
      62.5%    { transform: translate(80px, 0px) rotate(180deg); }
      65%, 100%{ transform: translate(100px, 60px) rotate(360deg); opacity: 1; }
    }
    @keyframes colorTransform {
      0%, 75% { fill: #DEB887; stroke: #B48E5D; stroke-width: 1px; }
      78%, 82% { fill: #FFFFFF; stroke: #FFFFFF; stroke-width: 2px; filter: drop-shadow(0 0 15px #5BA3D9); }
      85%, 100% { fill: #2A5D8F; stroke: #2A5D8F; stroke-width: 0px; filter: drop-shadow(0 0 0px transparent); }
    }
    @keyframes tapeFade {
      0%, 75% { opacity: 1; fill: #E6C280; }
      78%, 100% { opacity: 0; }
    }
    .b-h-left { animation: hLeftRun 8s ease-in-out forwards; }
    .b-h-right { animation: hRightRun 8s ease-in-out forwards; }
    .b-box1 { animation: box1Toss 8s linear forwards; }
    .b-box2 { animation: box2Toss 8s linear forwards; }
    .b-box3 { animation: box3Toss 8s linear forwards; }
    .b-box4 { animation: box4Toss 8s linear forwards; }
    .b-box5 { animation: box5Toss 8s linear forwards; }
    .anim-color { animation: colorTransform 8s ease-out forwards; }
    .anim-tape { animation: tapeFade 8s ease-out forwards; }
    .leg-anim { animation: scissor 0.3s infinite alternate linear; transform-origin: top; }
    .leg-anim-rev { animation: scissor 0.3s infinite alternate-reverse linear; transform-origin: top; }
    @keyframes scissor { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
    @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  `;

  const cssLoop = `
    @keyframes runAc {
      0% { transform: translate(-80px, 135px); }
      100% { transform: translate(350px, 135px); }
    }
    @keyframes runAcRev {
      0% { transform: translate(350px, 135px) scaleX(-1); }
      100% { transform: translate(-80px, 135px) scaleX(-1); }
    }
    .l-human1 { animation: runAc 4s linear infinite; }
    .l-human2 { animation: runAcRev 5s linear infinite 1s backwards; }
    .l-human3 { animation: runAc 3.5s linear infinite 2.5s backwards; }
    .leg-anim { animation: scissor 0.2s infinite alternate linear; transform-origin: top; }
    .leg-anim-rev { animation: scissor 0.2s infinite alternate-reverse linear; transform-origin: top; }
    @keyframes scissor { from { transform: rotate(-35deg); } to { transform: rotate(35deg); } }
    .static-box { fill: #2A5D8F; stroke: none; }
    .static-tape { opacity: 0; display: none; }
  `;

  return (
    <>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className="mx-auto w-full max-w-[320px] h-52 mb-8 relative cursor-crosshair group"
      >
        <style>{phase === 'build' ? cssBuild : cssLoop}</style>
        
        <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in transition-transform duration-300 group-hover:scale-[1.02]">
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <defs>
              <g id="human">
                <line x1="0" y1="20" x2="0" y2="45" stroke="#475569" strokeWidth="6" strokeLinecap="round" className="leg-anim" />
                <line x1="0" y1="20" x2="0" y2="45" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" className="leg-anim-rev" />
                <rect x="-12" y="0" width="24" height="25" rx="6" fill="#EAB308" />
                <rect x="-6" y="5" width="12" height="10" rx="2" fill="#0F172A" />
                <rect x="-10" y="-18" width="20" height="16" rx="4" fill="#EAB308" />
                <rect x="-8" y="-14" width="16" height="6" rx="2" fill="#0F172A" />
                <circle cx="-3" cy="-11" r="2" fill="#06B6D4" />
                <circle cx="3" cy="-11" r="2" fill="#06B6D4" />
                <path d="M -12 5 L -20 20" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                <path d="M 12 5 L 20 20" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g id="human-carry">
                <use href="#human" />
                <rect x="8" y="0" width="20" height="20" rx="2" fill="#DEB887" />
                <path d="M 0 10 L 15 15" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g id="box-svg">
                <rect width="40" height="40" rx="3" className={phase === 'build' ? 'anim-color' : 'static-box'} />
                <rect x="10" y="16" width="20" height="8" rx="1" className={phase === 'build' ? 'anim-tape' : 'static-tape'} />
                <path d="M 0 20 L 40 20" stroke="#B48E5D" strokeWidth="1" className={phase === 'build' ? 'anim-tape' : 'static-tape'} opacity="0.5" />
              </g>
            </defs>

            {/* Suelo */}
            <line x1="0" y1="182" x2="320" y2="182" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" />

            {/* Cajas (La Letra T) */}
            {phase === 'build' ? (
              <g>
                <g className="b-box1"><use href="#box-svg" /></g>
                <g className="b-box2"><use href="#box-svg" /></g>
                <g className="b-box3"><use href="#box-svg" /></g>
                <g className="b-box4"><use href="#box-svg" /></g>
                <g className="b-box5"><use href="#box-svg" /></g>
              </g>
            ) : (
              <g>
                <g transform="translate(140, 140)"><use href="#box-svg" /></g>
                <g transform="translate(140, 100)"><use href="#box-svg" /></g>
                <g transform="translate(140, 60)"><use href="#box-svg" /></g>
                <g transform="translate(100, 60)"><use href="#box-svg" /></g>
                <g transform="translate(180, 60)"><use href="#box-svg" /></g>
              </g>
            )}

            {/* Robots Animados */}
            {phase === 'build' ? (
              <g>
                <g className="b-h-left"><use href="#human" /></g>
                <g className="b-h-right"><use href="#human" /></g>
              </g>
            ) : (
              <g>
                <g className="l-human1"><use href="#human-carry" /></g>
                <g className="l-human2"><use href="#human-carry" /></g>
                <g className="l-human3"><use href="#human-carry" /></g>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Physics Overlay (Renderizado sobre toda la pantalla) */}
      {typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
          {physicsBoxes.map(b => (
            <div key={b.id} style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
              width: '32px',
              height: '32px',
              backgroundColor: b.color,
              borderRadius: '3px',
              border: '1px solid rgba(0,0,0,0.15)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{ position: 'absolute', top: '14px', left: 0, width: '100%', height: '4px', backgroundColor: 'rgba(0,0,0,0.15)' }} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

