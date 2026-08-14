import React from 'react';

// Componente: Flotilla de Robots "T" Builder
// Animación SVG masiva: 2 montacargas construyendo la T con cajas grandes
export function AnimatedLogoContainer() {
  return (
    <div className="mx-auto w-full max-w-[320px] h-52 mb-8 relative">
      <style>
        {`
          @keyframes robotLeftMove {
            0%       { transform: translate(-80px, 0); }
            5%, 10%  { transform: translate(104px, 0); }
            15%      { transform: translate(-80px, 0); }
            30%      { transform: translate(-80px, 0); }
            35%, 40% { transform: translate(104px, 0); }
            45%      { transform: translate(-80px, 0); }
            50%, 55% { transform: translate(64px, 0); }
            60%, 100%{ transform: translate(-20px, 0); }
          }
          @keyframes forkLeftMove {
            0%, 5%   { transform: translateY(170px); }
            10%, 15% { transform: translateY(180px); }
            30%, 35% { transform: translateY(90px); }
            40%, 45% { transform: translateY(100px); }
            50%, 55% { transform: translateY(90px); }
            60%, 100%{ transform: translateY(180px); }
          }
          @keyframes robotRightMove {
            0%, 15%  { transform: translate(400px, 0); }
            20%, 25% { transform: translate(216px, 0); }
            30%, 45% { transform: translate(400px, 0); }
            50%, 55% { transform: translate(256px, 0); }
            60%, 100%{ transform: translate(340px, 0); }
          }
          @keyframes forkRightMove {
            0%, 20%  { transform: translateY(130px); }
            25%, 30% { transform: translateY(140px); }
            45%, 50% { transform: translateY(90px); }
            55%, 60% { transform: translateY(100px); }
            65%, 100%{ transform: translateY(180px); }
          }
          @keyframes box1Move {
            0%       { transform: translate(-44px, 130px); opacity: 0; }
            1%       { opacity: 1; }
            5%       { transform: translate(140px, 130px); opacity: 1; }
            10%, 100%{ transform: translate(140px, 140px); opacity: 1; }
          }
          @keyframes box2Move {
            0%, 15%  { transform: translate(324px, 90px); opacity: 0; }
            16%      { opacity: 1; }
            20%      { transform: translate(140px, 90px); opacity: 1; }
            25%, 100%{ transform: translate(140px, 100px); opacity: 1; }
          }
          @keyframes box3Move {
            0%, 30%  { transform: translate(-44px, 50px); opacity: 0; }
            31%      { opacity: 1; }
            35%      { transform: translate(140px, 50px); opacity: 1; }
            40%, 100%{ transform: translate(140px, 60px); opacity: 1; }
          }
          @keyframes box4Move {
            0%, 45%  { transform: translate(-44px, 50px); opacity: 0; }
            46%      { opacity: 1; }
            50%      { transform: translate(100px, 50px); opacity: 1; }
            55%, 100%{ transform: translate(100px, 60px); opacity: 1; }
          }
          @keyframes box5Move {
            0%, 45%  { transform: translate(324px, 50px); opacity: 0; }
            46%      { opacity: 1; }
            50%      { transform: translate(180px, 50px); opacity: 1; }
            55%, 100%{ transform: translate(180px, 60px); opacity: 1; }
          }
          @keyframes colorTransform {
            0%, 68% { fill: #DEB887; stroke: #B48E5D; stroke-width: 1px; }
            72%, 75% { fill: #FFFFFF; stroke: #FFFFFF; stroke-width: 2px; filter: drop-shadow(0 0 15px #5BA3D9); }
            80%, 100% { fill: #2A5D8F; stroke: #2A5D8F; stroke-width: 0px; filter: drop-shadow(0 0 0px transparent); }
          }
          @keyframes tapeFade {
            0%, 68% { opacity: 1; fill: #E6C280; }
            72%, 100% { opacity: 0; }
          }
          @keyframes sirenFlash {
            0%, 100% { fill: #EF4444; filter: drop-shadow(0 0 0px transparent); }
            50% { fill: #FCA5A5; filter: drop-shadow(0 0 8px #EF4444); }
          }
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          .anim-robot-left { animation: robotLeftMove 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-fork-left { animation: forkLeftMove 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-robot-right { animation: robotRightMove 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-fork-right { animation: forkRightMove 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          .anim-box1 { animation: box1Move 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box2 { animation: box2Move 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box3 { animation: box3Move 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box4 { animation: box4Move 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          .anim-box5 { animation: box5Move 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          
          .anim-color { animation: colorTransform 10s ease-out forwards; }
          .anim-tape { animation: tapeFade 10s ease-out forwards; }
          .anim-siren { animation: sirenFlash 0.5s infinite; }
        `}
      </style>
      
      <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden animate-pop-in">
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <g id="forklift">
              {/* Mast */}
              <rect x="26" y="50" width="8" height="130" rx="2" fill="#64748B" />
              <rect x="30" y="50" width="2" height="130" fill="#94A3B8" />
              {/* Body */}
              <path d="M -15 140 L 20 140 L 26 170 L -10 170 Z" fill="#EAB308" />
              {/* Cabin */}
              <path d="M -5 140 L -5 100 L 15 100 L 20 140 Z" fill="#0F172A" opacity="0.8" />
              <rect x="-8" y="96" width="26" height="4" rx="2" fill="#1E293B" />
              <path d="M -15 140 L -25 140 L -25 160 L -10 170 Z" fill="#334155" />
              {/* Wheels */}
              <circle cx="-5" cy="170" r="12" fill="#0F172A" />
              <circle cx="-5" cy="170" r="5" fill="#94A3B8" />
              <circle cx="18" cy="170" r="10" fill="#0F172A" />
              <circle cx="18" cy="170" r="4" fill="#94A3B8" />
              {/* Siren */}
              <circle cx="-2" cy="92" r="3" className="anim-siren" />
            </g>
            <g id="box">
              <rect width="40" height="40" rx="3" className="anim-color" />
              <rect x="10" y="16" width="20" height="8" rx="1" className="anim-tape" />
              <path d="M 0 20 L 40 20" stroke="#B48E5D" strokeWidth="1" className="anim-tape" opacity="0.5" />
            </g>
          </defs>

          {/* Suelo */}
          <line x1="0" y1="182" x2="320" y2="182" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="8 8" strokeLinecap="round" />

          {/* Las 5 cajas gigantes */}
          <g>
            <g className="anim-box1"><use href="#box" /></g>
            <g className="anim-box2"><use href="#box" /></g>
            <g className="anim-box3"><use href="#box" /></g>
            <g className="anim-box4"><use href="#box" /></g>
            <g className="anim-box5"><use href="#box" /></g>
          </g>

          {/* Robot Izquierdo */}
          <g className="anim-robot-left">
            <use href="#forklift" />
            <g className="anim-fork-left">
              <rect x="32" y="-20" width="4" height="24" rx="1" fill="#334155" />
              <path d="M 36 0 L 76 0 L 76 4 L 36 4 Z" fill="#F59E0B" />
            </g>
          </g>

          {/* Robot Derecho (Espejo) */}
          <g className="anim-robot-right">
            <g transform="scale(-1, 1)">
              <use href="#forklift" />
              <g className="anim-fork-right">
                <rect x="32" y="-20" width="4" height="24" rx="1" fill="#334155" />
                <path d="M 36 0 L 76 0 L 76 4 L 36 4 Z" fill="#F59E0B" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

