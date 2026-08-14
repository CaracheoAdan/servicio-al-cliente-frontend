import React from 'react';

// Componente: Robot "T" Drone Builder
// Animación épica de 12 segundos donde un drone futurista construye el logo caja por caja
export function AnimatedLogoContainer() {
  return (
    <div className="mx-auto w-full max-w-[320px] h-52 mb-8 relative">
      <style>
        {`
          @keyframes robotMove {
            0%       { transform: translate(-50px, 145px); }
            5%, 10%  { transform: translate(135px, 145px); }
            15%      { transform: translate(-50px, 145px); }
            16%      { transform: translate(-50px, 125px); }
            20%, 25% { transform: translate(135px, 125px); }
            30%      { transform: translate(-50px, 125px); }
            31%      { transform: translate(-50px, 105px); }
            35%, 40% { transform: translate(135px, 105px); }
            45%      { transform: translate(-50px, 105px); }
            50%, 55% { transform: translate(115px, 105px); }
            60%      { transform: translate(-50px, 105px); }
            65%, 70% { transform: translate(155px, 105px); }
            75%, 100%{ transform: translate(40px, 145px); }
          }
          @keyframes box1Move {
            0%       { transform: translate(-35px, 150px); opacity: 0; }
            1%       { opacity: 1; }
            5%, 100% { transform: translate(150px, 150px); opacity: 1; }
          }
          @keyframes box2Move {
            0%, 15%  { transform: translate(-35px, 130px); opacity: 0; }
            16%      { opacity: 1; }
            20%, 100%{ transform: translate(150px, 130px); opacity: 1; }
          }
          @keyframes box3Move {
            0%, 30%  { transform: translate(-35px, 110px); opacity: 0; }
            31%      { opacity: 1; }
            35%, 100%{ transform: translate(150px, 110px); opacity: 1; }
          }
          @keyframes box4Move {
            0%, 45%  { transform: translate(-35px, 110px); opacity: 0; }
            46%      { opacity: 1; }
            50%, 100%{ transform: translate(130px, 110px); opacity: 1; }
          }
          @keyframes box5Move {
            0%, 60%  { transform: translate(-35px, 110px); opacity: 0; }
            61%      { opacity: 1; }
            65%, 100%{ transform: translate(170px, 110px); opacity: 1; }
          }
          @keyframes colorTransform {
            0%, 78% { fill: #DEB887; stroke: #B48E5D; stroke-width: 1px; }
            80%, 82% { fill: #FFFFFF; stroke: #FFFFFF; stroke-width: 2px; filter: drop-shadow(0 0 12px #5BA3D9); }
            85%, 100% { fill: #2A5D8F; stroke: #2A5D8F; stroke-width: 0px; filter: drop-shadow(0 0 0px transparent); }
          }
          @keyframes tapeFade {
            0%, 78% { opacity: 1; fill: #E6C280; }
            80%, 100% { opacity: 0; }
          }
          @keyframes thrusterFlicker {
            0%, 100% { transform: scaleY(1); opacity: 0.8; }
            50% { transform: scaleY(1.4); opacity: 1; }
          }
          @keyframes robotHoverAnim {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes eyeBlink {
            0%, 88%, 92%, 96%, 100% { transform: scaleY(1); }
            90%, 94% { transform: scaleY(0.1); }
          }
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .anim-robot { animation: robotMove 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-robot-hover { animation: robotHoverAnim 2s ease-in-out infinite; }
          .anim-box1 { animation: box1Move 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box2 { animation: box2Move 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box3 { animation: box3Move 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box4 { animation: box4Move 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box5 { animation: box5Move 12s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-color { animation: colorTransform 12s ease-out forwards; }
          .anim-tape { animation: tapeFade 12s ease-out forwards; }
          .anim-thruster { animation: thrusterFlicker 0.15s infinite; transform-origin: top; }
          .anim-eye { animation: eyeBlink 12s linear infinite; transform-origin: 8px 2px; }
        `}
      </style>
      
      <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in">
        <svg viewBox="0 0 320 200" className="w-full h-full">
          {/* Suelo punteado */}
          <line x1="20" y1="170" x2="300" y2="170" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />

          {/* Grupo de la T (Las 5 cajas) */}
          <g>
            <g className="anim-box1"><rect width="20" height="20" rx="2" className="anim-color"/><rect x="5" y="8" width="10" height="4" rx="1" className="anim-tape"/></g>
            <g className="anim-box2"><rect width="20" height="20" rx="2" className="anim-color"/><rect x="5" y="8" width="10" height="4" rx="1" className="anim-tape"/></g>
            <g className="anim-box3"><rect width="20" height="20" rx="2" className="anim-color"/><rect x="5" y="8" width="10" height="4" rx="1" className="anim-tape"/></g>
            <g className="anim-box4"><rect width="20" height="20" rx="2" className="anim-color"/><rect x="5" y="8" width="10" height="4" rx="1" className="anim-tape"/></g>
            <g className="anim-box5"><rect width="20" height="20" rx="2" className="anim-color"/><rect x="5" y="8" width="10" height="4" rx="1" className="anim-tape"/></g>
          </g>

          {/* Drone Robot */}
          <g className="anim-robot">
            <g className="anim-robot-hover">
              {/* Fuego del propulsor */}
              <path d="M -8 15 L 0 15 L -4 30 Z" fill="#06B6D4" opacity="0.6" className="anim-thruster" />
              <path d="M -6 15 L -2 15 L -4 25 Z" fill="#FFFFFF" className="anim-thruster" />
              <rect x="-10" y="10" width="12" height="6" rx="2" fill="#1E293B" />
              
              {/* Chasis */}
              <path d="M -15 -10 L 5 -10 L 15 0 L 10 12 L -12 12 Z" fill="#94A3B8" />
              <path d="M -10 -5 L 2 -5 L 8 2 L 5 8 L -8 8 Z" fill="#64748B" />
              
              {/* Visor y Ojo */}
              <path d="M 5 -5 L 15 0 L 10 8 L 2 8 Z" fill="#0F172A" />
              <circle cx="8" cy="2" r="2" fill="#06B6D4" className="anim-eye" />
              
              {/* Brazo Mecánico */}
              <path d="M 0 5 L 12 5 L 16 15" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 14 10 L 18 15 L 14 20" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

