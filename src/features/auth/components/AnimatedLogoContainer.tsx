import React from 'react';

// Componente: Robot "T" Builder
// Una animación SVG pura sin dependencias (cero Lottie, cero Framer Motion)
// El robot ensambla las piezas como cajas de cartón y luego se transforman en el logo azul
export function AnimatedLogoContainer() {
  return (
    <div className="mx-auto h-24 w-24 mb-8 relative">
      <style>
        {`
          @keyframes robotMove {
            0%, 10% { transform: translateX(-90px); }
            20%, 30% { transform: translateX(45px); }
            40%, 50% { transform: translateX(-90px); }
            60%, 75% { transform: translateX(28px); }
            85%, 100% { transform: translateX(0px); }
          }
          @keyframes forkMove {
            0%, 20% { transform: translateY(145px); }
            25%, 40% { transform: translateY(155px); }
            45%, 60% { transform: translateY(85px); }
            70%, 75% { transform: translateY(95px); }
            80%, 100% { transform: translateY(120px); }
          }
          @keyframes box1Move {
            0%, 10% { transform: translate(-45px, 90px); }
            20% { transform: translate(90px, 90px); }
            25%, 100% { transform: translate(90px, 100px); }
          }
          @keyframes box2Move {
            0%, 50% { transform: translate(-48px, 70px); }
            60% { transform: translate(70px, 70px); }
            70%, 100% { transform: translate(70px, 80px); }
          }
          @keyframes colorTransform {
            0%, 82% { fill: #DEB887; }
            88%, 100% { fill: #2A5D8F; }
          }
          @keyframes tapeFade {
            0%, 82% { opacity: 1; fill: #C19A6B; }
            85%, 100% { opacity: 0; }
          }
          @keyframes eyeBlink {
            0%, 88%, 92%, 100% { transform: scaleY(1); }
            90% { transform: scaleY(0.1); }
          }
          @keyframes popIn {
            0% { transform: scale(0.8) rotate(-15deg); opacity: 0; }
            100% { transform: scale(1) rotate(-3deg); opacity: 1; }
          }
          
          .anim-robot { animation: robotMove 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-fork { animation: forkMove 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box1 { animation: box1Move 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box2 { animation: box2Move 5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-color { animation: colorTransform 5s ease-out forwards; }
          .anim-tape { animation: tapeFade 5s ease-out forwards; }
          .anim-eye { animation: eyeBlink 4s linear infinite; transform-origin: 20px 124px; }
        `}
      </style>
      
      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in transition-transform hover:rotate-0">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Suelo punteado */}
          <line x1="0" y1="160" x2="200" y2="160" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="4 4" />

          {/* Caja 1 (Base Vertical) */}
          <g className="anim-box1">
            <rect width="20" height="60" rx="2" className="anim-color" />
            <rect x="0" y="25" width="20" height="10" className="anim-tape" />
          </g>

          {/* Caja 2 (Techo Horizontal) */}
          <g className="anim-box2">
            <rect width="60" height="20" rx="2" className="anim-color" />
            <rect x="25" y="0" width="10" height="20" className="anim-tape" />
          </g>

          {/* Montacargas Robot */}
          <g className="anim-robot">
            {/* Mástil del montacargas */}
            <rect x="40" y="70" width="4" height="90" fill="#475569" />
            
            {/* Carro y Uñas (Horquillas) */}
            <g className="anim-fork">
              <rect x="38" y="-10" width="8" height="20" rx="2" fill="#334155" />
              <path d="M 46 5 L 60 5 L 60 9 L 46 9 Z" fill="#F59E0B" />
            </g>

            {/* Orugas / Ruedas */}
            <rect x="5" y="145" width="30" height="15" rx="5" fill="#1E293B" />
            <circle cx="12" cy="152.5" r="4" fill="#334155" />
            <circle cx="28" cy="152.5" r="4" fill="#334155" />
            
            {/* Cuerpo */}
            <rect x="10" y="115" width="20" height="35" rx="4" fill="#94A3B8" />
            
            {/* Pantalla / Cara */}
            <rect x="12" y="118" width="16" height="12" rx="2" fill="#0F172A" />
            <circle cx="20" cy="124" r="2.5" fill="#06B6D4" className="anim-eye" />
          </g>
        </svg>
      </div>
    </div>
  );
}

