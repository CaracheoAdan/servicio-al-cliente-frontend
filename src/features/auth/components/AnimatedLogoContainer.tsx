import React, { useState, useEffect, useMemo } from 'react';

type Variant = 'forklifts' | 'drones' | 'tanks' | 'humanoids' | 'crane';

const VARIANTS: Variant[] = ['forklifts', 'drones', 'tanks', 'humanoids', 'crane'];
const DUR = 8;

// 15 box positions forming the T (28x28 boxes)
// Build order: stem bottom-up, then top bar center-out
const BOXES = [
  // Stem bottom-up (centered at x=160: cols at 132, 160)
  { x: 132, y: 132, side: 'L' as const },
  { x: 160, y: 132, side: 'R' as const },
  { x: 132, y: 104, side: 'L' as const },
  { x: 160, y: 104, side: 'R' as const },
  { x: 132, y: 76, side: 'L' as const },
  { x: 160, y: 76, side: 'R' as const },
  // Top bar center-out (8 cols symmetric around x=160)
  { x: 132, y: 48, side: 'L' as const },
  { x: 160, y: 48, side: 'R' as const },
  { x: 104, y: 48, side: 'L' as const },
  { x: 188, y: 48, side: 'R' as const },
  { x: 76, y: 48, side: 'L' as const },
  { x: 216, y: 48, side: 'R' as const },
  { x: 48, y: 48, side: 'L' as const },
  { x: 244, y: 48, side: 'R' as const },
];

const pct = (t: number): string => ((t / DUR) * 100).toFixed(2) + '%';

export function AnimatedLogoContainer() {
  const variant = useMemo<Variant>(
    () => VARIANTS[Math.floor(Math.random() * VARIANTS.length)],
    []
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), DUR * 1000);
    return () => clearTimeout(timer);
  }, []);

  const mode = variant === 'drones' ? 'air' : variant === 'crane' ? 'crane' : 'ground';

  // ─── CSS Generation (string concat to avoid escape issues) ───
  const buildCss = useMemo(() => {
    let css = '';
    const gY = 155;

    // Box keyframes
    BOXES.forEach((box, i) => {
      const st = 0.3 + i * 0.38;
      const tt = st + 0.22;
      const lt = tt + 0.25;

      if (mode === 'ground') {
        const fx = box.side === 'L' ? 35 : 285;
        const peakY = Math.min(gY, box.y) - 35;
        const dir = box.side === 'L' ? 1 : -1;
        css += '@keyframes b' + i + '{'
          + '0%,' + pct(st) + '{transform:translate(' + fx + 'px,' + gY + 'px);opacity:0}'
          + pct(st + 0.01) + '{opacity:1;transform:translate(' + fx + 'px,' + gY + 'px)}'
          + pct(tt) + '{transform:translate(' + fx + 'px,' + gY + 'px)}'
          + pct((tt + lt) / 2) + '{transform:translate(' + ((fx + box.x) / 2) + 'px,' + peakY + 'px) rotate(' + (dir * 180) + 'deg)}'
          + pct(lt) + ',100%{transform:translate(' + box.x + 'px,' + box.y + 'px) rotate(' + (dir * 360) + 'deg);opacity:1}'
          + '}\n';
      } else if (mode === 'air') {
        css += '@keyframes b' + i + '{'
          + '0%,' + pct(st) + '{transform:translate(' + box.x + 'px,-30px);opacity:0}'
          + pct(st + 0.01) + '{opacity:1;transform:translate(' + box.x + 'px,-30px)}'
          + pct(tt) + '{transform:translate(' + box.x + 'px,' + (box.y - 12) + 'px)}'
          + pct(lt) + ',100%{transform:translate(' + box.x + 'px,' + box.y + 'px);opacity:1}'
          + '}\n';
      } else {
        const cst = 0.3 + i * 0.38;
        const clt = cst + 0.25;
        css += '@keyframes b' + i + '{'
          + '0%,' + pct(cst) + '{transform:translate(' + box.x + 'px,36px);opacity:0}'
          + pct(cst + 0.01) + '{opacity:1;transform:translate(' + box.x + 'px,36px)}'
          + pct(cst + 0.10) + '{transform:translate(' + box.x + 'px,36px)}'
          + pct(clt) + ',100%{transform:translate(' + box.x + 'px,' + box.y + 'px);opacity:1}'
          + '}\n';
      }
      css += '.ab' + i + '{animation:b' + i + ' ' + DUR + 's linear both}\n';
    });

    // Robot keyframes
    if (mode === 'ground') {
      ['L', 'R'].forEach(side => {
        const off = side === 'L' ? -30 : 340;
        const tx = side === 'L' ? 35 : 285;
        const sc = side === 'L' ? '' : ' scaleX(-1)';
        let kf = '@keyframes r' + side + '{0%{transform:translate(' + off + 'px,' + gY + 'px)' + sc + '} ';

        BOXES.forEach((box, i) => {
          if (box.side !== side) return;
          const st = 0.3 + i * 0.38;
          const en = Math.max(0.05, st - 0.25);
          const tt = st + 0.22;
          const ex = tt + 0.25;

          kf += pct(en) + '{transform:translate(' + off + 'px,' + gY + 'px)' + sc + '} ';
          kf += pct(st) + '{transform:translate(' + tx + 'px,' + gY + 'px)' + sc + '} ';
          kf += pct(tt) + '{transform:translate(' + tx + 'px,' + gY + 'px)' + sc + '} ';
          kf += pct(ex) + '{transform:translate(' + off + 'px,' + gY + 'px)' + sc + '} ';
        });

        kf += '100%{transform:translate(' + off + 'px,' + gY + 'px)' + sc + '}}';
        css += kf + '\n.ar' + side + '{animation:r' + side + ' ' + DUR + 's linear both}\n';
      });
    } else if (mode === 'air') {
      ['L', 'R'].forEach(side => {
        let kf = '@keyframes d' + side + '{0%{transform:translate(160px,-30px)} ';

        BOXES.forEach((box, i) => {
          if (box.side !== side) return;
          const st = 0.3 + i * 0.38;
          const en = Math.max(0.05, st - 0.2);
          const tt = st + 0.22;
          const ex = tt + 0.2;
          const bx = box.x + 14;
          const by = box.y - 20;

          kf += pct(en) + '{transform:translate(' + bx + 'px,-30px)} ';
          kf += pct(st) + '{transform:translate(' + bx + 'px,' + by + 'px)} ';
          kf += pct(tt) + '{transform:translate(' + bx + 'px,' + by + 'px)} ';
          kf += pct(ex) + '{transform:translate(' + bx + 'px,-30px)} ';
        });

        kf += '100%{transform:translate(160px,-30px)}}';
        css += kf + '\n.ar' + side + '{animation:d' + side + ' ' + DUR + 's linear both}\n';
      });
    } else {
      let kf = '@keyframes cr{0%{transform:translate(160px,0px)} ';

      BOXES.forEach((box, i) => {
        const st = 0.3 + i * 0.38;
        const lt = st + 0.25;
        const bx = box.x + 14;

        kf += pct(Math.max(0.05, st - 0.08)) + '{transform:translate(' + bx + 'px,0px)} ';
        kf += pct(st) + '{transform:translate(' + bx + 'px,0px)} ';
        kf += pct(lt) + '{transform:translate(' + bx + 'px,0px)} ';
      });

      kf += '100%{transform:translate(160px,0px)}}';
      css += kf + '\n.acr{animation:cr ' + DUR + 's linear both}\n';
    }

    // Boxes fade out at the end (no color morph → no visible seams)
    css += '@keyframes bf{0%,88%{opacity:1}100%{opacity:0}}\n';
    css += '.bf{animation:bf ' + DUR + 's ease-out both}\n';

    return css;
  }, [mode]);

  // ─── Common CSS ───────────────────────────────────────
  const commonCss = [
    '@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}',
    '@keyframes fadeIn{0%{opacity:0;transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}',
    '@keyframes pulse{0%,100%{filter:drop-shadow(0 2px 6px rgba(42,93,143,0.2))}50%{filter:drop-shadow(0 2px 14px rgba(42,93,143,0.5))}}',
    '.bob{animation:bob 0.25s infinite}',
    '.fadeIn{animation:fadeIn 0.6s ease-out forwards}',
    '.pulse{animation:pulse 3s ease-in-out infinite}',
  ].join('\n');

  // ─── Robot SVG ────────────────────────────────────────
  const robotDef = () => {
    switch (variant) {
      case 'forklifts':
        return (
          <g id="rob">
            <g className="bob">
              <rect x="-12" y="-10" width="20" height="16" rx="3" fill="#EAB308" />
              <rect x="-14" y="-18" width="10" height="10" rx="2" fill="#EAB308" />
              <rect x="-12" y="-14" width="6" height="4" rx="1" fill="#0F172A" />
              <circle cx="-9" cy="-12" r="0.8" fill="#06B6D4" />
              <rect x="8" y="-10" width="3" height="18" rx="1" fill="#64748B" />
              <rect x="8" y="2" width="8" height="2" rx="0.5" fill="#64748B" />
              <rect x="8" y="6" width="8" height="2" rx="0.5" fill="#64748B" />
            </g>
            <circle cx="-8" cy="10" r="4" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <circle cx="5" cy="10" r="3" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          </g>
        );
      case 'drones':
        return (
          <g id="rob">
            <g className="bob">
              <rect x="-7" y="-3" width="14" height="8" rx="3" fill="#475569" />
              <circle cx="0" cy="1" r="2" fill="#06B6D4" />
              <line x1="-11" y1="-5" x2="-7" y2="-3" stroke="#1E293B" strokeWidth="1.5" />
              <line x1="7" y1="-3" x2="11" y2="-5" stroke="#1E293B" strokeWidth="1.5" />
              <line x1="-15" y1="-5" x2="-7" y2="-5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="7" y1="-5" x2="15" y2="-5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <rect x="-4" y="5" width="8" height="5" rx="1" fill="#EAB308" />
            </g>
          </g>
        );
      case 'tanks':
        return (
          <g id="rob">
            <g className="bob">
              <rect x="-8" y="-12" width="16" height="16" rx="4" fill="#EAB308" />
              <path d="M -10 -2 L 10 -2" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              <rect x="-6" y="-8" width="12" height="5" rx="1.5" fill="#0F172A" />
              <circle cx="-2" cy="-5.5" r="1.2" fill="#06B6D4" />
              <circle cx="2" cy="-5.5" r="1.2" fill="#06B6D4" />
              <path d="M -2 0 L -8 5 L -2 5" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 4 0 L 10 5 L 4 5" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <rect x="-9" y="5" width="18" height="7" rx="3.5" fill="#1E293B" />
            <circle cx="-5" cy="8.5" r="1.5" fill="#64748B" />
            <circle cx="0" cy="8.5" r="1.5" fill="#64748B" />
            <circle cx="5" cy="8.5" r="1.5" fill="#64748B" />
          </g>
        );
      case 'humanoids':
        return (
          <g id="rob">
            <g className="bob">
              <circle cx="0" cy="-10" r="5" fill="#EAB308" />
              <rect x="-3" y="-12" width="6" height="3" rx="1" fill="#0F172A" />
              <circle cx="-1.5" cy="-10" r="0.8" fill="#06B6D4" />
              <circle cx="1.5" cy="-10" r="0.8" fill="#06B6D4" />
              <rect x="-4" y="-4" width="8" height="10" rx="2" fill="#EAB308" />
              <path d="M -4 2 L 4 2" stroke="#D97706" strokeWidth="1" />
              <path d="M -4 -1 L -8 4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M 4 -1 L 8 4" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            </g>
            <rect x="-4" y="6" width="3" height="5" rx="1.5" fill="#475569" />
            <rect x="1" y="6" width="3" height="5" rx="1.5" fill="#1E293B" />
          </g>
        );
      case 'crane':
        return (
          <g id="rob">
            <rect x="-10" y="0" width="20" height="8" rx="2" fill="#EAB308" />
            <circle cx="-6" cy="10" r="2.5" fill="#1E293B" />
            <circle cx="6" cy="10" r="2.5" fill="#1E293B" />
            <rect x="-1" y="12" width="2" height="18" fill="#475569" />
            <path d="M -4 30 L 4 30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M -3 30 L -4 34" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 3 30 L 4 34" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
    }
  };

  // ─── Render ───────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-[320px] h-52 mb-8">
      <style>{commonCss + '\n' + (!done ? buildCss : '')}</style>

      <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
        {!done ? (
          <svg viewBox="0 0 320 200" className="w-full h-full">
            <defs>{robotDef()}</defs>

            {/* Ground line for walking variants */}
            {mode === 'ground' && (
              <line x1="0" y1="168" x2="320" y2="168" stroke="#E2E8F0" strokeWidth="3" strokeDasharray="8 8" />
            )}

            {/* Crane rail */}
            {mode === 'crane' && (
              <>
                <line x1="0" y1="10" x2="320" y2="10" stroke="#64748B" strokeWidth="4" />
                <rect x="8" y="4" width="5" height="12" rx="1" fill="#64748B" />
                <rect x="307" y="4" width="5" height="12" rx="1" fill="#64748B" />
              </>
            )}

            {/* Animated boxes (fade out at end, stay brown) */}
            <g className="bf">
              {BOXES.map((_, i) => (
                <g key={i} className={'ab' + i}>
                  <rect width="28" height="28" rx="3" fill="#DEB887" stroke="#B48E5D" strokeWidth="0.5" />
                  <rect x="6" y="12" width="16" height="4" rx="1" fill="#E6C280" />
                  <path d="M 0 14 L 28 14" stroke="#B48E5D" strokeWidth="0.5" opacity="0.5" />
                </g>
              ))}
            </g>

            {/* Robots */}
            {mode !== 'crane' ? (
              <>
                <g className="arL"><use href="#rob" /></g>
                <g className="arR"><use href="#rob" /></g>
              </>
            ) : (
              <g className="acr"><use href="#rob" /></g>
            )}
          </svg>
        ) : (
          <svg viewBox="0 0 320 200" className="w-full h-full fadeIn pulse">
            <defs>
              <linearGradient id="tG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B7AC0" />
                <stop offset="100%" stopColor="#1E4D7A" />
              </linearGradient>
              <filter id="tS">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E3A5F" floodOpacity="0.25" />
              </filter>
            </defs>
            <g filter="url(#tS)">
              <rect x="48" y="20" width="224" height="56" rx="6" fill="url(#tG)" />
              <rect x="132" y="20" width="56" height="140" rx="6" fill="url(#tG)" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
