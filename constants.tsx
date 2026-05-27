import React from 'react';
import { EntityType, Entity, MapId, Portal } from './types';

export const GRID_SIZE = 12;
export const CELL_SIZE = 64; // pixels

export const ITEM_DESCRIPTIONS: Record<string, string> = {
    '干枯的花朵': '一朵早已失去水分的花，却散发着某种违禁的怀旧气息。',
    '死蜂徽章': '一枚从废弃躯壳上取下的徽章，象征着被系统抹除的身份。',
    '发条心脏': '冰冷的机械心脏，上紧发条后能提供虚假的生命力，让你更适应这台机器。',
    '记忆碎片': '闪烁着微光的碎片，记录着不属于这个蜂巢的零星画面。',
    '锈蚀的钥匙': '一把沉重的旧钥匙。它似乎能打开隐藏房间中那个被遗忘的铁盒。',
    '破碎的皇冠': '金色的残片，曾经代表着至高无上的权力，现在只是沉重的负担。',
    '违禁记录': '记载着蜂巢实验真相的文档，阅读它会让你感到剧烈的眩晕。',
    '镇静剂': '标准配给的药物，能强制平复波动的情绪，抹除危险的想法。',
    '纯净的蜂王浆': '绝对服从的结晶，散发着诱人的蓝光。',
    '监控录像': '一盘旧录像带，记录着被掩盖的真相。',
    '全景监狱蓝图': '第一代蜂后的设计图，揭示了蜂巢的真实面目。'
};

export const ItemIconSVG = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
    switch (name) {
        case '干枯的花朵':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Stem */}
                    <path d="M12 12 Q 8 18 14 23" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="2,1" />
                    {/* Petals - 5 petals, stark contrast */}
                    <g fill="#f5f5f5" stroke="#000" strokeWidth="1.5">
                        <path d="M12 12 C 4 0, 20 0, 12 12" transform="rotate(0 12 12)" />
                        <path d="M12 12 C 4 0, 20 0, 12 12" transform="rotate(72 12 12)" />
                        <path d="M12 12 C 4 0, 20 0, 12 12" transform="rotate(144 12 12)" />
                        <path d="M12 12 C 4 0, 20 0, 12 12" transform="rotate(216 12 12)" />
                        <path d="M12 12 C 4 0, 20 0, 12 12" transform="rotate(288 12 12)" />
                    </g>
                    {/* Inner details */}
                    <circle cx="12" cy="12" r="3" fill="#b71c1c" stroke="#000" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="1" fill="#fff" />
                </svg>
            );
        case '死蜂徽章':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" fill="#212121" stroke="#757575" strokeWidth="1.5" />
                    <path d="M8 8l8 8M16 8l-8 8" stroke="#b71c1c" strokeWidth="2" />
                    <circle cx="12" cy="12" r="2" fill="#b71c1c" />
                </svg>
            );
        case '发条心脏':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#424242" stroke="#b71c1c" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="4" fill="#fbc02d" stroke="#f57f17" strokeWidth="1" />
                    <path d="M12 6v4l2 2" stroke="#3e2723" strokeWidth="1.5" />
                    <path d="M16 8l2-2" stroke="#fbc02d" strokeWidth="1.5" />
                </svg>
            );
        case '记忆碎片':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 22 8 18 22 4 18 2 10" fill="#e0f7fa" stroke="#00acc1" strokeWidth="1" opacity="0.8" />
                    <polygon points="10 6 16 12 12 18 6 12" fill="#b2ebf2" stroke="#00bcd4" strokeWidth="0.5" />
                    <circle cx="12" cy="12" r="2" fill="#fff" />
                </svg>
            );
        case '锈蚀的钥匙':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="12" r="4" fill="#3e2723" stroke="#d84315" strokeWidth="1.5" />
                    <path d="M11 12h10v3h-2v-3h-2v3h-2v-3" stroke="#d84315" strokeWidth="1.5" />
                    <circle cx="7" cy="12" r="1" fill="#d84315" />
                </svg>
            );
        case '破碎的皇冠':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 20h20L19 7l-3 5-4-8-4 8-3-5-2 13z" fill="#fbc02d" stroke="#f57f17" strokeWidth="1.5" />
                    <path d="M12 4l-1 16M15 9l-2 11" stroke="#212121" strokeWidth="1" strokeDasharray="2,2" />
                </svg>
            );
        case '违禁记录':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3h14v18H5z" fill="#f5f5f5" stroke="#757575" strokeWidth="1.5" />
                    <path d="M8 7h8M8 11h8M8 15h4" stroke="#212121" strokeWidth="2" />
                    <path d="M14 15h2" stroke="#b71c1c" strokeWidth="2" />
                    <path d="M5 3l14 18" stroke="#e0e0e0" strokeWidth="0.5" />
                </svg>
            );
        case '镇静剂':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="10" width="14" height="4" rx="2" fill="#e3f2fd" stroke="#1976d2" strokeWidth="1.5" />
                    <path d="M10 10v4" stroke="#1976d2" strokeWidth="1.5" />
                    <path d="M17 12h4M21 10v4" stroke="#90caf9" strokeWidth="1.5" />
                    <circle cx="6" cy="12" r="1" fill="#1976d2" />
                </svg>
            );
        case '纯净的蜂王浆':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8 2 5 9 5 15c0 3.86 3.14 7 7 7s7-3.14 7-7c0-6-3-13-7-13z" fill="#fff59d" stroke="#fbc02d" strokeWidth="1.5" />
                    <path d="M9 10c1-2 3-2 4 0" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="12" cy="16" r="2" fill="#fff" opacity="0.8" />
                </svg>
            );
        case '监控录像':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="1" fill="#212121" stroke="#616161" strokeWidth="1.5" />
                    <circle cx="8" cy="12" r="3" fill="#424242" stroke="#757575" strokeWidth="1" />
                    <circle cx="16" cy="12" r="3" fill="#424242" stroke="#757575" strokeWidth="1" />
                    <path d="M11 12h2" stroke="#9e9e9e" strokeWidth="1" />
                    <rect x="6" y="6" width="12" height="2" fill="#b71c1c" />
                </svg>
            );
        case '全景监狱蓝图':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" fill="#0d47a1" stroke="#1565c0" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="5" stroke="#90caf9" strokeWidth="1" fill="none" />
                    <circle cx="12" cy="12" r="2" fill="#90caf9" />
                    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M5.5 18.5l13-13" stroke="#90caf9" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" strokeWidth="1.5" />
                    <path d="M12 8v4M12 16h.01" stroke="#fff" strokeWidth="2" />
                </svg>
            );
    }
};

// --- VISUAL ASSETS ---

// Shared Patterns for Collage Effect
export const CollagePatterns = () => (
    <defs>
        <pattern id="newsprint" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <rect width="40" height="40" fill="#f5f5f0" />
            <text x="0" y="10" fontSize="6" fill="#333" fontFamily="serif" opacity="0.4">CLASSIFIED DATA</text>
            <text x="0" y="20" fontSize="6" fill="#333" fontFamily="serif" opacity="0.4">CONFORMITY IS KEY</text>
            <text x="0" y="30" fontSize="6" fill="#333" fontFamily="serif" opacity="0.4">THE HIVE REMEMBERS</text>
            <text x="0" y="40" fontSize="6" fill="#333" fontFamily="serif" opacity="0.4">NO EXIT FOUND</text>
        </pattern>
        <pattern id="cardboard" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
             <rect width="30" height="30" fill="#bcaaa4"/>
             <path d="M0,5 L30,5 M0,15 L30,15 M0,25 L30,25" stroke="#8d6e63" strokeWidth="1" opacity="0.5"/>
             <rect width="30" height="30" fill="none" stroke="#795548" strokeWidth="0.5" opacity="0.2"/>
        </pattern>
        <pattern id="plaid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
             <rect width="12" height="12" fill="#ffcdd2"/>
             <rect width="6" height="12" fill="#e57373" opacity="0.5"/>
             <rect width="12" height="6" fill="#e57373" opacity="0.5"/>
             <path d="M0,0 L12,12 M12,0 L0,12" stroke="#c62828" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
        <pattern id="gridpat" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
             <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#444" strokeWidth="0.5" opacity="0.4"/>
        </pattern>
        <pattern id="tape" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#fff9c4" opacity="0.6" />
            <path d="M0,0 Q5,10 0,20 M20,0 Q15,10 20,20" fill="none" stroke="#fbc02d" strokeWidth="1" opacity="0.3" />
        </pattern>
        <pattern id="lace" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" />
            <circle cx="10" cy="10" r="8" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
            <circle cx="10" cy="10" r="4" fill="none" stroke="#000" strokeWidth="0.3" opacity="0.1" />
            <path d="M10,0 L10,20 M0,10 L20,10" stroke="#000" strokeWidth="0.2" opacity="0.1" />
        </pattern>
        <radialGradient id="photoEyeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="40%" stopColor="#333" />
            <stop offset="60%" stopColor="#666" />
            <stop offset="80%" stopColor="#999" />
            <stop offset="100%" stopColor="#fff" />
        </radialGradient>
        <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="1.5" result="light">
                <feDistantLight azimuth="45" elevation="55"/>
            </feDiffuseLighting>
            <feComposite in="light" in2="SourceGraphic" operator="in" result="lit"/>
            <feBlend in="lit" in2="SourceGraphic" mode="multiply"/>
        </filter>
        <filter id="tornEdge">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <clipPath id="hexClip">
            <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
        </clipPath>
        <pattern id="photo-pulp" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill="#ff9800" />
            <circle cx="10" cy="10" r="4" fill="#ffb74d" opacity="0.6" />
            <circle cx="30" cy="20" r="6" fill="#ffa726" opacity="0.4" />
            <circle cx="15" cy="40" r="3" fill="#ffcc80" opacity="0.5" />
            <path d="M0,0 L50,50 M50,0 L0,50" stroke="#fb8c00" strokeWidth="1" opacity="0.3" />
        </pattern>
        <pattern id="moldy-pulp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#2b1a1a" />
            <circle cx="5" cy="5" r="4" fill="#0a0f05" opacity="0.6" />
            <circle cx="25" cy="15" r="6" fill="#1a1f0a" opacity="0.5" />
            <circle cx="10" cy="30" r="3" fill="#050505" opacity="0.7" />
            <path d="M0,20 Q10,10 20,20 T40,20" fill="none" stroke="#2d3a1a" strokeWidth="1" opacity="0.3" />
        </pattern>
        <filter id="moldFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="5" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.15  0 0 0 0 0.05  0 0 0 1 0" />
            <feComposite operator="in" in2="SourceGraphic" />
            <feMorphology operator="dilate" radius="1" />
        </filter>
        <filter id="photoGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" result="clippedNoise" />
            <feBlend in="SourceGraphic" in2="clippedNoise" mode="multiply" />
        </filter>
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="50%" stopColor="#f5f2e9" />
            <stop offset="100%" stopColor="#e8e4d8" />
        </linearGradient>
    </defs>
);

export const HexTileSVG = ({ type, theme, corruption = 0 }: { type: number, theme: any, corruption?: number }) => {
    // 0: Floor, 1: Wall, 2: Decor
    const isWall = type === 1;
    const isDecor = type === 2;
    
    // Floor color shift
    const floorFill = corruption > 0.5 
        ? `rgba(${255 * corruption}, 0, 0, ${0.1 + corruption * 0.2})` 
        : 'rgba(255,255,255,0.05)';

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* CollagePatterns removed - rendered globally in App.tsx */}
            
            {/* Base Hexagon with rough paper texture */}
            <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
                  fill={isWall ? theme.primary : (isDecor ? theme.primary + '40' : floorFill)} 
                  stroke={theme.secondary} 
                  strokeWidth={isWall ? "4" : "1"}
                  filter={isWall ? "url(#roughPaper)" : "none"}
            />
            
            {/* Collage elements for walls */}
            {isWall && (
                <>
                    {/* Inner newsprint layer */}
                    <path d="M50 5 L89 27 L89 73 L50 95 L11 73 L11 27 Z" 
                          fill="url(#newsprint)" 
                          opacity={0.4 + corruption * 0.3}
                    />
                    {/* Honeycomb inner lines */}
                    <path d="M50 10 L84 30 L84 70 L50 90 L16 70 L16 30 Z" 
                          fill="none"
                          stroke={theme.secondary}
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity={0.6}
                    />
                </>
            )}

            {/* Decor elements */}
            {isDecor && (
                <g opacity={0.7 + corruption * 0.3} className="animate-wobble origin-center">
                    <circle cx="50" cy="50" r={12 + corruption * 5} fill="url(#plaid)" stroke={theme.secondary} strokeWidth="1" />
                    <path d="M45 45 L55 55 M55 45 L45 55" stroke="#000" strokeWidth="2" />
                    <path d="M50 20 L50 80 M20 50 L80 50" stroke={theme.secondary} strokeWidth="1" strokeDasharray="2,2" />
                </g>
            )}

            {/* Floor details (subtle) */}
            {!isWall && !isDecor && (
                <g className="animate-breathe origin-center">
                    <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" 
                          fill="none" 
                          stroke={corruption > 0.6 ? "#ff0000" : theme.secondary} 
                          strokeWidth={0.5 + corruption} 
                          opacity={0.2 + corruption * 0.4} 
                          strokeDasharray="1,3" />
                    {/* Inner honeycomb pattern for floor */}
                    <path d="M50 35 L63 42 L63 58 L50 65 L37 58 L37 42 Z" 
                          fill="none" 
                          stroke={theme.secondary} 
                          strokeWidth="0.5" 
                          opacity={0.1 + corruption * 0.2} />
                    {corruption > 0.8 && (
                        <circle cx="50" cy="50" r="2" fill="#ff0000" className="animate-pulse" />
                    )}
                </g>
            )}
        </svg>
    );
};

export const CitrusHeadSVG = ({ rot = 0, mood = 'neutral', corruption = 0 }: { rot?: number, mood?: 'neutral' | 'scared' | 'rotten', corruption?: number }) => {
    const c = Math.max(0, Math.min(1, corruption));
    const isRotten = c > 0.8; // Structural toggles and mold show up much later
    const corruptionFactor = c;
    
    // Color transitions faster, reaching target dark green at c=0.5
    const colorC = Math.min(1, c * 2);

    // Smooth interpolations for the citrus head
    const rRind = Math.round(255 + colorC * (45 - 255));
    const gRind = Math.round(152 + colorC * (58 - 152));
    const bRind = Math.round(0 + colorC * (26 - 0));
    const rindColor = `rgb(${rRind}, ${gRind}, ${bRind})`;

    const rStroke = Math.round(230 + colorC * (0 - 230));
    const gStroke = Math.round(81 + colorC * (0 - 81));
    const bStroke = 0;
    const rindStrokeColor = `rgb(${rStroke}, ${gStroke}, ${bStroke})`;

    const rPith = Math.round(255 + colorC * (18 - 255));
    const gPith = Math.round(254 + colorC * (20 - 254));
    const bPith = Math.round(240 + colorC * (10 - 240));
    const pithColor = `rgb(${rPith}, ${gPith}, ${bPith})`;

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" style={{ transform: `rotate(${rot}deg)` }}>
        <defs>
            <clipPath id="citrusHeadClip">
                <path d="M 0 -12 C 0 -22, -22 -22, -22 -6 C -22 7, 0 17, 0 22 C 0 17, 22 7, 22 -6 C 22 -22, 0 -22, 0 -12 Z" />
            </clipPath>
            <clipPath id="citrusRindClip">
                <path d="M 0 -10 C 0 -20, -20 -20, -20 -5 C -20 5, 0 15, 0 20 C 0 15, 20 5, 20 -5 C 20 -20, 0 -20, 0 -10 Z" />
            </clipPath>
            <clipPath id="citrusPulpClip">
                <path d="M 0 -6 C 0 -14, -16 -14, -16 -3 C -16 5, 0 13, 0 16 C 0 13, 16 5, 16 -3 C 16 -14, 0 -14, 0 -6 Z" />
            </clipPath>
        </defs>
        
        <g transform="translate(50,60)">
            {/* WINGS: Disjointed */}
            <g className="animate-wiggle origin-bottom">
                <path d="M0,0 C-45,-65 -75,5 0,20" fill="#f5f5f5" stroke="#000" strokeWidth="1.5" strokeDasharray="3,2" />
                {isRotten && <path d="M-20,-10 C-30,-20 -40,0 -10,10" fill="none" stroke="#8b0000" strokeWidth="2" opacity="0.6" />}
                {/* Tape holding wing */}
                <rect x="-10" y="-5" width="15" height="6" fill="url(#tape)" transform="rotate(-30)" />
                {isRotten && <rect x="-15" y="-15" width="20" height="8" fill="url(#plaid)" opacity="0.5" transform="rotate(-45)" />}
            </g>
            <g className="animate-wiggle origin-bottom" style={{ animationDelay: '-0.2s', transform: 'scaleX(-1)' }}>
                <path d="M0,0 C-45,-65 -75,5 0,20" fill="#f5f5f5" stroke="#000" strokeWidth="1.5" strokeDasharray="3,2" />
                <rect x="-10" y="-5" width="15" height="6" fill="url(#tape)" transform="rotate(-30)" />
            </g>
    
            {/* LEGS: Disjointed matchsticks */}
            <g transform="translate(-8, 15) rotate(10)" filter="url(#roughPaper)">
                <path d="M-2,0 L2,0 L4,15 L-4,15 Z" fill="url(#cardboard)" stroke="#5d4037" strokeWidth="1" />
                <path d="M-5,0 L5,0" stroke="#000" strokeWidth="1.5" strokeDasharray="2,2" />
            </g>
            <g transform="translate(8, 15) rotate(-10)" filter="url(#roughPaper)">
                <path d="M-2,0 L2,0 L4,15 L-4,15 Z" fill="url(#cardboard)" stroke="#5d4037" strokeWidth="1" />
                <path d="M-5,0 L5,0" stroke="#000" strokeWidth="1.5" strokeDasharray="2,2" />
            </g>
 
            {/* BODY: Scrawled scribble with clipped texture */}
            <g filter="url(#roughPaper)">
                <ellipse cx="0" cy="10" rx="13" ry="20" fill={isRotten ? "#2a1a1a" : "#1a1a1a"} />
                <ellipse cx="0" cy="10" rx="12" ry="18" fill="url(#gridpat)" opacity="0.5" />
                <ellipse cx="0" cy="10" rx="12" ry="18" fill="url(#lace)" opacity={isRotten ? 0.4 : 0.2} />
                {isRotten && <ellipse cx="0" cy="10" rx="14" ry="22" fill="url(#moldy-pulp)" opacity="0.6" filter="url(#tornEdge)" />}
                <path d="M-12,0 L12,20 M-12,10 L12,30" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
                
                {/* Disjointed Stinger (Tail Needle) */}
                <g transform="translate(0, 28)" filter="url(#tornEdge)">
                    <path d="M-3,0 L3,0 L1,24 L-1,24 Z" fill="#e0e0e0" stroke="#333" strokeWidth="1" />
                    <path d="M-1,2 L1,2 L0.5,20 L-0.5,20 Z" fill="url(#newsprint)" opacity="0.4" />
                    <rect x="-10" y="-4" width="20" height="7" fill="url(#tape)" opacity="0.8" transform="rotate(5)" />
                    <path d="M-8,0 L8,0" stroke="#000" strokeWidth="1.5" strokeDasharray="3,2" />
                </g>
            </g>
        </g>
    
        {/* HEAD: The Citrus Slice - Layered Collage */}
        <g transform="translate(50, 42) scale(1.4)" filter="url(#tornEdge)">
            {/* Outer "Paper" Layer */}
            <path d="M 0 -12 C 0 -22, -22 -22, -22 -6 C -22 7, 0 17, 0 22 C 0 17, 22 7, 22 -6 C 22 -22, 0 -22, 0 -12 Z" 
                  fill={isRotten ? '#0a0a0a' : 'url(#paperGrad)'} 
                  stroke={isRotten ? '#000' : '#888'} 
                  strokeWidth="1" 
                  filter="url(#roughPaper)" />
            
            {/* Textures for the WHOLE head - using path instead of rect for robustness */}
            <path d="M 0 -12 C 0 -22, -22 -22, -22 -6 C -22 7, 0 17, 0 22 C 0 17, 22 7, 22 -6 C 22 -22, 0 -22, 0 -12 Z" 
                  fill="url(#roughPaper)" opacity={isRotten ? 0.4 : 0.2} style={{ mixBlendMode: 'multiply' }} />
            
            {/* Main Rind - Sickly colors when rotten */}
            <path d="M 0 -10 C 0 -20, -20 -20, -20 -5 C -20 5, 0 15, 0 20 C 0 15, 20 5, 20 -5 C 20 -20, 0 -20, 0 -10 Z" 
                  fill={rindColor} 
                  stroke={rindStrokeColor} 
                  strokeWidth="1.5" />
            
            <path d="M 0 -10 C 0 -20, -20 -20, -20 -5 C -20 5, 0 15, 0 20 C 0 15, 20 5, 20 -5 C 20 -20, 0 -20, 0 -10 Z" 
                  fill="url(#roughPaper)" opacity={isRotten ? 0.8 : 0.4} style={{ mixBlendMode: 'multiply' }} />
            
            {/* Inner Pulp Layer (The Pith) */}
            <path d="M 0 -8 C 0 -17, -18 -17, -18 -4 C -18 5, 0 14, 0 18 C 0 14, 18 5, 18 -4 C 18 -17, 0 -17, 0 -8 Z" 
                  fill={pithColor} 
                  filter={isRotten ? "url(#photoGrain)" : "none"} />
            
            <g clipPath="url(#citrusPulpClip)">
                <path d="M 0 -6 C 0 -14, -16 -14, -16 -3 C -16 5, 0 13, 0 16 C 0 13, 16 5, 16 -3 C 16 -14, 0 -14, 0 -6 Z" 
                      fill={rindColor} 
                      opacity="0.95" />
                
                <path d="M 0 -6 C 0 -14, -16 -14, -16 -3 C -16 5, 0 13, 0 16 C 0 13, 16 5, 16 -3 C 16 -14, 0 -14, 0 -6 Z" 
                      fill={isRotten ? 'url(#moldy-pulp)' : 'url(#photo-pulp)'} 
                      opacity="0.4" 
                      style={{ mixBlendMode: 'overlay' }}
                      filter={isRotten ? "url(#moldFilter)" : "none"} />
                
                {/* Honeycomb pattern overlay on pulp */}
                <path d="M -10 -5 L -5 -10 L 5 -10 L 10 -5 L 5 0 L -5 0 Z M -5 0 L 0 5 L 10 5 L 15 0 L 10 -5 L 0 -5 Z M -10 5 L -5 0 L 5 0 L 10 5 L 5 10 L -5 10 Z" 
                      fill="none" 
                      stroke={isRotten ? '#000' : '#fff'} 
                      strokeWidth="0.5" 
                      opacity={isRotten ? 0.8 : 0.3} 
                />

                {/* Pulp Segments - Sharp and disjointed */}
                <g stroke={isRotten ? '#000' : '#fff'} strokeWidth="1.5" opacity={isRotten ? 0.9 : 0.7}>
                    {[0,45,90,135,180,225,270,315].map((d) => (
                        <path key={d} d="M0,2 L0,-18" transform={`rotate(${d} 0 2)`} strokeDasharray={isRotten ? "2,1" : "none"} />
                    ))}
                </g>
            </g>

            {/* Surreal Eye - Photo Cutout Style */}
            <g transform="translate(0, -2)" filter="url(#photoGrain)">
                <g className="animate-eye-twitch">
                    {/* Eye socket/shadow */}
                    <ellipse cx="0" cy="0" rx="10" ry="7" fill="#000" opacity="0.3" />
                    {/* Sclera - Yellowed or greyed when rotten */}
                    <ellipse cx="0" cy="0" rx="9" ry="6" fill={isRotten ? '#444' : '#f0f0f0'} stroke="black" strokeWidth="1.5" />
                    {/* Iris/Pupil - High contrast photo look */}
                    <circle cx="0" cy="0" r="5.5" fill="url(#photoEyeGrad)" />
                    <circle cx="0" cy="0" r="2.5" fill="#000" />
                    {/* Glint */}
                    <circle cx="2.5" cy="-2.5" r="1.5" fill="white" opacity={isRotten ? 0.3 : 0.8} />
                    
                    {/* Eyelashes - Sharp ink strokes */}
                    <g stroke="black" strokeWidth="1.2" strokeLinecap="round">
                        <path d="M-7,-5 L-11,-12" />
                        <path d="M-3,-6 L-4,-14" />
                        <path d="M3,-6 L4,-14" />
                        <path d="M7,-5 L11,-12" />
                    </g>
                    
                    {/* Scared / Rotten expressions */}
                    {mood === 'scared' && (
                        <g>
                            <circle cx="0" cy="0" r="1" fill="#000" />
                            <path d="M-4,-4 Q0,-6 4,-4" fill="none" stroke="#000" strokeWidth="0.5" />
                            <path d="M-3,3 L-3,6 M3,3 L3,5" stroke="#000" strokeWidth="0.5" opacity="0.5" />
                        </g>
                    )}
                    {isRotten && (
                        <g>
                            <path d="M-4,-5 L4,-3 M-4,5 L4,3" stroke="#000" strokeWidth="1" strokeDasharray="1,1" />
                            <circle cx="-8" cy="-8" r="2" fill="url(#photoEyeGrad)" opacity="0.8" />
                            <circle cx="6" cy="6" r="1.5" fill="url(#photoEyeGrad)" opacity="0.6" />
                            <path d="M-2,2 Q2,6 0,10" fill="none" stroke="#b71c1c" strokeWidth="1" opacity="0.8" />
                        </g>
                    )}
                </g>
            </g>
            
            {/* Early Mold - Black Dots */}
            {c > 0.7 && (
                <g>
                    {/* Fungal Spores / Dots */}
                    {Array.from({ length: 16 }).map((_, i) => {
                        const threshold = 0.70 + (i * 0.006);
                        if (c < threshold) return null;
                        
                        return (
                            <circle 
                                key={`spore-${i}`} 
                                cx={Math.sin(i * 1.5) * 18} 
                                cy={Math.cos(i * 1.5) * 18} 
                                r={1 + Math.abs(Math.sin(i * 3.1)) * 3} 
                                fill={i % 2 === 0 ? "#1a1a1a" : "#2d3a1a"} 
                            />
                        );
                    })}
                    {c > 0.75 && <circle cx="-14" cy="3" r="6" fill="#000" opacity="0.6" filter="url(#roughPaper)" />}
                    {c > 0.78 && <circle cx="16" cy="-6" r="5" fill="#050505" opacity="0.7" filter="url(#tornEdge)" />}
                </g>
            )}
            
            {/* Severe Rot and Decay Overlays */}
            {isRotten && (
                <g opacity={Math.min(1, 0.7 + corruptionFactor * 0.3)}>
                    {/* Aggressive Mold Growth */}
                    <circle cx="-8" cy="-10" r="8" fill="#0a0f05" filter="url(#moldFilter)" />
                    <circle cx="10" cy="7" r="9" fill="#1a1f0a" filter="url(#moldFilter)" />
                    <circle cx="5" cy="-15" r="5" fill="#2d3a1a" filter="url(#moldFilter)" />
                    
                    {/* Cracks and Tape - Holding the rot together */}
                    <path d="M-14,14 L14,-14" stroke="#000" strokeWidth="2.5" strokeDasharray="4,2" opacity="0.8" />
                    <path d="M-18,0 L18,0" stroke="#000" strokeWidth="1.5" opacity="0.6" />
                    
                    {/* Tape strips */}
                    <rect x="-15" y="-5" width="15" height="6" fill="url(#tape)" transform="rotate(45)" opacity="0.9" />
                    <rect x="5" y="10" width="12" height="5" fill="url(#tape)" transform="rotate(-20)" opacity="0.7" />
                    <rect x="-5" y="-18" width="10" height="4" fill="url(#tape)" transform="rotate(10)" opacity="0.8" />

                    {/* Staples / Stitches */}
                    <g stroke="#333" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M-10,10 L-5,15" />
                        <path d="M-5,5 L0,10" />
                        <path d="M0,0 L5,5" />
                        <path d="M5,-5 L10,0" />
                    </g>
                    
                    <text x="-18" y="18" fontSize="6" fill="black" fontWeight="bold" opacity="0.8" transform="rotate(-15)" filter="url(#photoGrain)">DECAY</text>
                    <text x="5" y="-12" fontSize="4" fill="black" opacity="0.5" transform="rotate(10)" filter="url(#photoGrain)">VOID</text>
                    
                    {/* Ooze/Drip - More viscous */}
                    <path d="M-6,15 Q-6,28 0,28 Q6,28 6,15" fill="#0a0f05" opacity="0.9" />
                    <circle cx="0" cy="28" r="2.5" fill="#0a0f05" opacity="0.9">
                        <animate attributeName="cy" values="28;45" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                </g>
            )}
        </g>
      </svg>
    );
}

export const WorkerBeeSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
    {/* CollagePatterns removed - rendered globally in App.tsx */}
    
    <g className="animate-float">
        {/* Wings: Tracing Paper / Scribbled Plastic */}
        <g filter="url(#tornEdge)" opacity="0.6">
            <path d="M50,40 Q15,-5 10,35 Q25,65 50,40" fill="#fff" stroke="#999" strokeWidth="1" />
            <path d="M50,40 Q85,-5 90,35 Q75,65 50,40" fill="#fff" stroke="#999" strokeWidth="1" />
            <path d="M20,20 L40,30 M70,20 L60,30" stroke="#000" strokeWidth="0.5" opacity="0.3" />
            <path d="M30,15 Q35,25 30,35" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2" />
        </g>
        
        {/* Tape strips holding wings - Disjointed feel */}
        <rect x="22" y="32" width="18" height="8" fill="url(#tape)" transform="rotate(-15 31 36)" filter="url(#roughPaper)" />
        <rect x="60" y="32" width="18" height="8" fill="url(#tape)" transform="rotate(15 69 36)" filter="url(#roughPaper)" />

        {/* Body: Cardboard Box with visible flaps */}
        <g filter="url(#roughPaper)">
            <rect x="35" y="30" width="30" height="40" fill="url(#cardboard)" stroke="#5d4037" strokeWidth="1.5" />
            <path d="M35,30 L50,35 L65,30" fill="none" stroke="#5d4037" strokeWidth="1" opacity="0.6" />
            <path d="M35,70 L50,65 L65,70" fill="none" stroke="#5d4037" strokeWidth="1" opacity="0.6" />
            
            <rect x="35" y="30" width="30" height="40" fill="url(#gridpat)" opacity="0.4" />
            <rect x="35" y="30" width="30" height="40" fill="url(#newsprint)" opacity="0.2" />
            <rect x="35" y="30" width="30" height="40" fill="url(#lace)" opacity="0.15" />
            
            {/* Honeycomb branding */}
            <path d="M45 45 L55 45 L60 55 L55 65 L45 65 L40 55 Z" fill="none" stroke="#8d6e63" strokeWidth="1" opacity="0.5" />
            <path d="M47 47 L53 47 L56 55 L53 63 L47 63 L44 55 Z" fill="none" stroke="#8d6e63" strokeWidth="0.5" opacity="0.3" />

            {/* Scribble marks on body */}
            <path d="M40,45 Q45,40 50,45 T60,40" fill="none" stroke="black" strokeWidth="0.5" opacity="0.3" />
            <path d="M38,55 L45,52 M55,58 L62,55" stroke="black" strokeWidth="0.3" opacity="0.4" />

            {/* Stitches */}
            <path d="M35,40 L65,40 M35,60 L65,60" stroke="black" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />

            {/* Barcode Sticker - Magazine Cutout Style */}
            <g transform="translate(38, 35) rotate(-3)" filter="url(#tornEdge)">
                <rect x="0" y="0" width="22" height="12" fill="white" stroke="#ddd" strokeWidth="0.5" />
                <path d="M2,2 L2,8 M4,2 L4,8 M5,2 L5,8 M8,2 L8,8 M11,2 L11,8 M12,2 L12,8 M15,2 L15,8 M18,2 L18,8" stroke="black" strokeWidth="0.8" />
                <text x="2" y="11" fontSize="3" fontFamily="monospace" fill="#000">ID:743-B</text>
            </g>
            
            <path d="M32,50 L38,50 A2,2 0 0,1 40,52 L40,60 A3,3 0 0,1 34,60 L34,53 A1,1 0 0,1 36,53 L36,58" fill="none" stroke="#78909c" strokeWidth="1.2" />
        </g>

        {/* Head: Large Button - Disjointed */}
        <g transform="translate(50, 22)" filter="url(#roughPaper)">
            <circle cx="0" cy="0" r="14" fill="#212121" />
            <circle cx="0" cy="0" r="12" fill="#3e2723" stroke="#1a1a1a" strokeWidth="1" />
            
            {/* Torn paper collar effect */}
            <path d="M-14,8 L-10,14 L0,12 L10,14 L14,8 Z" fill="white" opacity="0.6" filter="url(#tornEdge)" />
            
            {/* Mismatched Eyes */}
            <g transform="translate(-4, -4)">
                <circle cx="0" cy="0" r="4" fill="white" />
                <circle cx="0" cy="0" r="2" fill="url(#photoEyeGrad)" />
            </g>
            <g transform="translate(5, -3)">
                <rect x="-2" y="-2" width="4" height="4" fill="#000" />
                <path d="M-2,-2 L2,2 M2,-2 L-2,2" stroke="white" strokeWidth="0.5" />
            </g>
            
            <path d="M-4,4 L4,4" stroke="#fff" strokeWidth="1" opacity="0.6" />
            <path d="M0,12 L0,18" stroke="#000" strokeWidth="2" strokeDasharray="2,2" />
        </g>
        
        {/* Antennae: Twisted wire */}
        <path d="M42,12 Q35,5 40,0" fill="none" stroke="#000" strokeWidth="1.2" />
        <path d="M58,12 Q65,5 60,0" fill="none" stroke="#000" strokeWidth="1.2" />
    </g>
  </svg>
);

export const SoldierBeeSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
    <style>{"\
      @keyframes flap-left {\
        0% { transform: rotate(0deg) scaleX(1) scaleY(1); }\
        100% { transform: rotate(-10deg) scaleX(0.3) scaleY(0.9); }\
      }\
      @keyframes flap-right {\
        0% { transform: rotate(0deg) scaleX(1) scaleY(1); }\
        100% { transform: rotate(10deg) scaleX(0.3) scaleY(0.9); }\
      }\
      .flap-l { transform-origin: 50px 40px; animation: flap-left 0.05s infinite alternate; }\
      .flap-r { transform-origin: 50px 40px; animation: flap-right 0.05s infinite alternate; }\
    "}</style>
    {/* CollagePatterns removed - rendered globally in App.tsx */}
    
    <g className="animate-float">
        {/* Rapidly flapping semi-transparent wings */}
        <g opacity="0.6">
            <path className="flap-l" d="M50,35 C 10, -10 -10, 20 20, 45 C 30, 50 45, 45 50, 40 Z" fill="#eceff1" stroke="#fff" strokeWidth="2" />
            <path className="flap-r" d="M50,35 C 90, -10 110, 20 80, 45 C 70, 50 55, 45 50, 40 Z" fill="#eceff1" stroke="#fff" strokeWidth="2" />
        </g>

        {/* Jagged Wings - Warning Tape / Plaid / Newsprint */}
        <g filter="url(#tornEdge)">
            <path d="M50,40 L5,5 L25,30 L0,45 L30,50 Z" fill="url(#plaid)" stroke="#b71c1c" strokeWidth="1.5" />
            <path d="M50,40 L95,5 L75,30 L100,45 L70,50 Z" fill="url(#newsprint)" stroke="#000" strokeWidth="1.5" />
            <path d="M12,18 L22,23 A2,2 0 0,1 22,27 L8,19 A3,3 0 0,1 12,14 L18,17" fill="none" stroke="#607d8b" strokeWidth="1.2" />
        </g>
        
        {/* Tape holding wings */}
        <rect x="35" y="32" width="15" height="6" fill="url(#tape)" transform="rotate(-45 42 35)" />
        <rect x="50" y="32" width="15" height="6" fill="url(#tape)" transform="rotate(45 57 35)" />
 
        {/* Body: Razor Blade / Metal Plate with ragged edges */}
        <g filter="url(#roughPaper)">
            <path d="M35,30 L65,25 L75,75 L45,85 L25,70 Z" fill="#37474f" stroke="#212121" strokeWidth="2" />
            <path d="M35,30 L65,25 L75,75 L45,85 L25,70 Z" fill="url(#gridpat)" opacity="0.4" />
            <path d="M35,30 L65,25 L75,75 L45,85 L25,70 Z" fill="url(#lace)" opacity="0.1" />
            <path d="M35,30 L65,25 L75,75 L45,85 L25,70 Z" fill="url(#newsprint)" opacity="0.15" />
            
            {/* Honeycomb armor plating */}
            <path d="M40 40 L50 35 L60 40 L60 50 L50 55 L40 50 Z" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.6" />
            <path d="M45 55 L55 50 L65 55 L65 65 L55 70 L45 65 Z" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.6" />
            <path d="M35 55 L45 50 L55 55 L55 65 L45 70 L35 65 Z" fill="none" stroke="#546e7a" strokeWidth="1.5" opacity="0.6" />

            {/* "Blood" / Ink splatters */}
            <circle cx="45" cy="60" r="4" fill="#b71c1c" opacity="0.6" filter="url(#roughPaper)" />
            <circle cx="55" cy="75" r="3" fill="#b71c1c" opacity="0.5" filter="url(#roughPaper)" />
            <circle cx="35" cy="45" r="5" fill="#b71c1c" opacity="0.4" filter="url(#tornEdge)" />
            <path d="M30,40 L35,45 M60,60 L65,55" stroke="#b71c1c" strokeWidth="2" opacity="0.4" />
 
            <text x="32" y="65" fontSize="12" fontFamily="serif" fontWeight="bold" fill="#c62828" transform="rotate(-20 32 65)" opacity="0.6">REJECT</text>
            
            <g fill="#90a4ae" stroke="#263238" strokeWidth="0.5">
                <circle cx="40" cy="35" r="2.5" />
                <circle cx="62" cy="32" r="2.5" />
                <circle cx="65" cy="68" r="2.5" />
                <circle cx="38" cy="72" r="2.5" />
            </g>
            <path d="M40,40 L50,50 M60,30 L55,40" stroke="#000" strokeWidth="0.5" opacity="0.3" />
        </g>
 
        {/* The All-Seeing Eye (High-Contrast Photo Cutout Style) */}
        <g transform="translate(50, 52)" filter="url(#tornEdge)">
            <path d="M-28,-8 L-18,-25 L5,-30 L20,-22 L30,-8 L25,12 L8,25 L-15,18 Z" fill="#fffef0" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2,2" />
            
            <path d="M-22,0 Q0,-18 22,0 Q0,18 -22,0 Z" fill="#fff" stroke="#000" strokeWidth="2" />
            
            {/* Cracked effect on eye */}
            <path d="M-10,-5 L-5,0 M5,5 L10,10 M-8,8 L-2,2" stroke="black" strokeWidth="0.5" opacity="0.4" />
            
            <circle cx="0" cy="0" r="10" fill="url(#photoEyeGrad)" />
            <circle cx="0" cy="0" r="4" fill="#ff0000" className="animate-pulse" />
            <g stroke="#b71c1c" strokeWidth="0.5" opacity="0.6">
                <path d="M-9,0 L-15,-5 M9,0 L15,5 M0,-9 L0,-15" />
            </g>
            <path d="M-18,-12 L-10,-22 M18,-12 L10,-22 M0,-18 L0,-28" stroke="#000" strokeWidth="1.5" />
        </g>
        
        {/* Weapon / Stinger: Syringe Needle - Disjointed */}
        <g transform="translate(50, 85)" filter="url(#roughPaper)">
            <path d="M-5,0 L5,-2 L2,20 L-2,20 Z" fill="#cfd8dc" stroke="#455a64" strokeWidth="1" />
            <path d="M0,5 L0,18" stroke="#c62828" strokeWidth="1.2" strokeDasharray="2,1" />
            <rect x="-8" y="-4" width="16" height="6" fill="url(#tape)" opacity="0.7" />
        </g>
    </g>
  </svg>
);

export const OldBeeSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
        {/* CollagePatterns removed - rendered globally in App.tsx */}
        <defs>
            <clipPath id="oldBodyClip">
                <path d="M35,30 L55,25 L68,45 L55,75 L30,70 L22,45 Z" />
            </clipPath>
        </defs>
        <g className="animate-wiggle" style={{ animationDuration: '4s' }}>
            {/* Asymmetrical, broken wings - Old Newspaper / Wire */}
            <g filter="url(#tornEdge)" opacity="0.5">
                <path d="M40,40 Q15,5 -5,25 Q10,55 40,40" fill="url(#newsprint)" stroke="#555" strokeWidth="1" />
                <path d="M60,40 L85,15 L95,35 L75,55 Z" fill="none" stroke="#222" strokeWidth="1.5" strokeDasharray="3,1" />
                <rect x="55" y="35" width="12" height="5" fill="url(#tape)" transform="rotate(20)" />
            </g>
            
            {/* Body: Crumpled Cardboard / Ragged shape */}
            <g filter="url(#roughPaper)">
                <path d="M35,30 L55,25 L68,45 L55,75 L30,70 L22,45 Z" fill="url(#cardboard)" stroke="#4e342e" strokeWidth="1.5" />
                <rect x="20" y="20" width="55" height="65" fill="url(#gridpat)" clipPath="url(#oldBodyClip)" opacity="0.3" />
                <rect x="20" y="20" width="55" height="65" fill="url(#lace)" clipPath="url(#oldBodyClip)" opacity="0.1" />
                
                <path d="M45,45 L65,48 L60,65 L40,60 Z" fill="url(#newsprint)" opacity="0.4" filter="url(#tornEdge)" />
                <path d="M25,40 L40,35 L45,50 L30,55 Z" fill="url(#plaid)" opacity="0.2" filter="url(#tornEdge)" />
                
                {/* Faded honeycomb pattern */}
                <path d="M40 50 L48 45 L56 50 L56 60 L48 65 L40 60 Z" fill="none" stroke="#3e2723" strokeWidth="0.5" opacity="0.4" />
                <path d="M42 52 L48 48 L54 52 L54 58 L48 62 L42 58 Z" fill="none" stroke="#3e2723" strokeWidth="0.5" opacity="0.2" />
            </g>

            {/* Stitches - Heavy and disjointed */}
            <g stroke="#000" strokeWidth="1.2" strokeDasharray="2,2">
                <path d="M30,45 L65,52" />
                <path d="M48,28 L42,72" />
                <path d="M25,55 L55,65" />
                <path d="M40,45 L50,55 M50,45 L40,55" strokeWidth="1" />
            </g>

            {/* Face: A scribbled spiral / button - Disjointed */}
            <g transform="translate(42, 35)" filter="url(#roughPaper)">
                <circle cx="0" cy="0" r="13" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="1" />
                <circle cx="-4" cy="-3" r="4" fill="url(#photoEyeGrad)" opacity="0.8" />
                <path d="M-6,-6 Q6,-12 10,0 Q12,12 -2,10 Q-12,6 -6,-6" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
                <path d="M8,-2 L14,4 M14,-2 L8,4" stroke="#c62828" strokeWidth="1.5" />
            </g>
            
            {/* Cane: Bent Matchstick - Disjointed */}
            <g transform="translate(62, 58) rotate(12)" filter="url(#roughPaper)">
                <rect x="0" y="0" width="5" height="42" fill="#ffe0b2" stroke="#e64a19" strokeWidth="0.8" />
                <ellipse cx="2.5" cy="0" rx="5" ry="7" fill="#bf360c" />
                <rect x="-4" y="5" width="12" height="4" fill="url(#tape)" opacity="0.8" />
            </g>

            <g transform="translate(30, 68)">
                <path d="M0,0 Q-15,15 -10,30" fill="none" stroke="#000" strokeWidth="0.8" />
                <g transform="translate(-10, 30) rotate(15)">
                    <path d="M0,0 L-2,12 L1,12 L0,0 Z" fill="#b0bec5" stroke="#455a64" strokeWidth="0.5" />
                    <circle cx="0" cy="2" r="0.6" fill="#000" />
                </g>
            </g>
        </g>
    </svg>
);

export const QueenGateSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
        {/* CollagePatterns removed - rendered globally in App.tsx */}
        <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
        </defs>
        
        <g filter="url(#roughPaper)">
            {/* Background texture for the gate */}
            <rect x="10" y="5" width="80" height="90" fill="url(#cardboard)" opacity="0.8" />
            <rect x="10" y="5" width="80" height="90" fill="url(#gridpat)" opacity="0.3" />
            
            {/* The Gate Frame - Disjointed metal/wood */}
            <rect x="15" y="10" width="70" height="80" fill="none" stroke="url(#goldGrad)" strokeWidth="6" strokeDasharray="20, 2" />
            <path d="M15,10 L50,0 L85,10" fill="url(#goldGrad)" stroke="#000" strokeWidth="2" />
            <path d="M15,10 L50,0 L85,10" fill="url(#newsprint)" opacity="0.4" />
            
            {/* Honeycomb gate pattern */}
            <g stroke="#B8860B" strokeWidth="1.5" opacity="0.5" fill="none">
                <path d="M30 30 L40 25 L50 30 L50 40 L40 45 L30 40 Z" />
                <path d="M50 30 L60 25 L70 30 L70 40 L60 45 L50 40 Z" />
                <path d="M40 45 L50 40 L60 45 L60 55 L50 60 L40 55 Z" />
                <path d="M30 60 L40 55 L50 60 L50 70 L40 75 L30 70 Z" />
                <path d="M50 60 L60 55 L70 60 L70 70 L60 75 L50 70 Z" />
            </g>

            {/* Bars - Wire/Scribbles */}
            <path d="M30,15 Q32,50 28,90" fill="none" stroke="#212121" strokeWidth="3" />
            <path d="M50,15 Q48,50 52,90" fill="none" stroke="#212121" strokeWidth="3" />
            <path d="M70,15 Q72,50 68,90" fill="none" stroke="#212121" strokeWidth="3" />
            
            {/* Tape holding the bars */}
            <rect x="25" y="40" width="10" height="5" fill="url(#tape)" transform="rotate(-10 30 42)" />
            <rect x="45" y="60" width="10" height="5" fill="url(#tape)" transform="rotate(15 50 62)" />
            <rect x="65" y="30" width="10" height="5" fill="url(#tape)" transform="rotate(-5 70 32)" />
            
            {/* Eye in center - Photo cutout style */}
            <g className="animate-pulse-slow" transform="translate(50, 50)" filter="url(#tornEdge)">
                 <path d="M-20,0 Q0,-15 20,0 Q0,15 -20,0 Z" fill="#fffef0" stroke="#B8860B" strokeWidth="2" />
                 <circle cx="0" cy="0" r="8" fill="url(#photoEyeGrad)" />
                 <circle cx="0" cy="0" r="3" fill="#FFD700" />
                 <path d="M-10,-5 L-5,0 M5,5 L10,10" stroke="#000" strokeWidth="0.5" opacity="0.5" />
            </g>
            
            {/* Scribbles and text */}
            <path d="M20,80 L80,80" stroke="#b71c1c" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
            <text x="50" y="85" fontSize="6" fontFamily="serif" fill="#b71c1c" textAnchor="middle" opacity="0.8" transform="rotate(-2 50 85)">DO NOT ENTER</text>
        </g>
    </svg>
);

export const LarvaSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
        <g className="animate-breathe" style={{ animationDuration: '3s' }}>
            <g filter="url(#roughPaper)">
                {/* Body segments - pale, sickly */}
                <path d="M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50 Z" fill="#f5f5dc" stroke="#8d6e63" strokeWidth="2" />
                <path d="M30,45 Q40,35 50,45 Q60,35 70,45" fill="none" stroke="#d7ccc8" strokeWidth="1.5" opacity="0.6" />
                <path d="M35,55 Q45,65 50,55 Q55,65 65,55" fill="none" stroke="#d7ccc8" strokeWidth="1.5" opacity="0.6" />
                
                {/* Honeycomb texture overlay */}
                <path d="M40 45 L45 42 L50 45 L50 50 L45 53 L40 50 Z" fill="none" stroke="#bcaaa4" strokeWidth="0.5" opacity="0.4" />
                <path d="M50 45 L55 42 L60 45 L60 50 L55 53 L50 50 Z" fill="none" stroke="#bcaaa4" strokeWidth="0.5" opacity="0.4" />
                <path d="M45 53 L50 50 L55 53 L55 58 L50 61 L45 58 Z" fill="none" stroke="#bcaaa4" strokeWidth="0.5" opacity="0.4" />

                {/* Veins / Scribbles */}
                <path d="M25,50 Q35,45 40,55" stroke="#b71c1c" strokeWidth="0.5" fill="none" opacity="0.3" />
                <path d="M75,50 Q65,55 60,45" stroke="#b71c1c" strokeWidth="0.5" fill="none" opacity="0.3" />
                
                {/* Single eye - unsettling */}
                <g transform="translate(35, 48)">
                    <circle cx="0" cy="0" r="4" fill="#fff" stroke="#000" strokeWidth="0.5" />
                    <circle cx="1" cy="0" r="1.5" fill="#000" />
                </g>
            </g>
        </g>
    </svg>
);

export const MirrorSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
        <g filter="url(#roughPaper)">
            {/* Frame - Ornate but decaying */}
            <path d="M50,10 C20,10 10,30 10,50 C10,70 20,90 50,90 C80,90 90,70 90,50 C90,30 80,10 50,10 Z" fill="#5d4037" stroke="#3e2723" strokeWidth="3" />
            <path d="M50,15 C25,15 15,32 15,50 C15,68 25,85 50,85 C75,85 85,68 85,50 C85,32 75,15 50,15 Z" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="1" />
            
            {/* Glass - Cracked and reflective */}
            <path d="M50,18 C28,18 18,34 18,50 C18,66 28,82 50,82 C72,82 82,66 82,50 C82,34 72,18 50,18 Z" fill="#e0f7fa" opacity="0.8" />
            
            {/* Reflections / Glare */}
            <path d="M25,30 L40,15 M20,45 L45,20" stroke="#fff" strokeWidth="2" opacity="0.6" />
            <path d="M75,70 L60,85 M80,55 L55,80" stroke="#fff" strokeWidth="1" opacity="0.3" />
            
            {/* Cracks */}
            <path d="M50,18 L45,35 L55,50 L40,65 L50,82" fill="none" stroke="#000" strokeWidth="1" opacity="0.5" />
            <path d="M55,50 L70,45 L80,55" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.4" />
            <path d="M45,35 L30,40 L20,35" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.4" />
            
            {/* Honeycomb smudge on glass */}
            <g stroke="#000" strokeWidth="0.5" opacity="0.1" fill="none">
                <path d="M60 30 L65 28 L70 30 L70 35 L65 37 L60 35 Z" />
                <path d="M65 37 L70 35 L75 37 L75 42 L70 44 L65 42 Z" />
            </g>
        </g>
    </svg>
);

export const WallEyeSVG = ({ corruption = 0 }: { corruption?: number }) => {
    const intensity = 0.4 + (corruption * 0.6);
    const color = corruption > 0.6 ? "#ff0000" : "#d32f2f";
    
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" style={{ opacity: intensity }}>
            <g filter="url(#roughPaper)">
                {/* Torn paper background for the eye */}
                <path d="M5,50 Q25,20 50,10 Q75,20 95,50 Q75,80 50,90 Q25,80 5,50 Z" fill="url(#newsprint)" opacity="0.5" filter="url(#tornEdge)" />
                
                {/* The Eye - Photo cutout */}
                <path d="M10,50 Q50,10 90,50 Q50,90 10,50" fill="#fffef0" stroke="#333" strokeWidth="1.5" strokeDasharray="4,1" />
                
                {/* Iris & Pupil */}
                <circle cx="50" cy="50" r="18" fill="url(#photoEyeGrad)" />
                <circle cx="50" cy="50" r={8 + corruption * 4} fill={color} className="animate-pulse">
                    <animate attributeName="r" values={`${8 + corruption * 4};${12 + corruption * 6};${8 + corruption * 4}`} dur={`${4 - corruption * 3}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                
                {/* Veins / Scribbles Removed */}
                
                {/* Eyelids / Tape */}
                <path d="M10,50 Q50,20 90,50" fill="none" stroke="#000" strokeWidth="2" opacity={0.3 + corruption * 0.4} />
                <rect x="20" y="15" width="15" height="6" fill="url(#tape)" transform="rotate(-20 27 18)" opacity="0.8" />
                <rect x="65" y="75" width="15" height="6" fill="url(#tape)" transform="rotate(20 72 78)" opacity="0.8" />
            </g>
        </svg>
    );
};

export const HoneyPoolSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
    <path d="M10,50 Q25,25 50,50 T90,50" fill="none" stroke="#FFD700" strokeWidth="5" strokeLinecap="round">
         <animate attributeName="d" values="M10,50 Q25,25 50,50 T90,50; M10,50 Q25,75 50,50 T90,50; M10,50 Q25,25 50,50 T90,50" dur="4s" repeatCount="indefinite"/>
    </path>
    <path d="M20,60 Q40,40 60,60 T100,60" fill="none" stroke="#FFA000" strokeWidth="3" opacity="0.6">
         <animate attributeName="d" values="M20,60 Q40,40 60,60 T100,60; M20,60 Q40,80 60,60 T100,60; M20,60 Q40,40 60,60 T100,60" dur="5s" repeatCount="indefinite"/>
    </path>
    <circle cx="50" cy="50" r="30" fill="#FFD700" opacity="0.3" />
  </svg>
);

// --- DECORATION SVGS ---

export const GearDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_10s_linear_infinite]">
         <circle cx="50" cy="50" r="40" stroke="#5d4037" strokeWidth="8" strokeDasharray="10, 5" fill="none"/>
         <circle cx="50" cy="50" r="20" stroke="#8d6e63" strokeWidth="4" fill="none"/>
         <rect x="45" y="10" width="10" height="80" fill="#5d4037" />
         <rect x="10" y="45" width="80" height="10" fill="#5d4037" />
    </svg>
);

export const TVDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <rect x="10" y="20" width="80" height="60" rx="5" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
        <rect x="15" y="25" width="60" height="50" fill="#000"/>
        {/* Static Noise */}
        <rect x="15" y="25" width="60" height="50" fill="white" opacity="0.1">
             <animate attributeName="opacity" values="0.1;0.3;0.1" dur="0.1s" repeatCount="indefinite"/>
        </rect>
        <circle cx="85" cy="35" r="5" fill="#333"/>
        <circle cx="85" cy="50" r="5" fill="#333"/>
        <path d="M50,20 L30,5" stroke="silver" strokeWidth="2"/>
        <path d="M50,20 L70,5" stroke="silver" strokeWidth="2"/>
    </svg>
);

export const EyePlantDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Stalk */}
        <path d="M50,90 Q50,50 30,30" stroke="#558b2f" strokeWidth="4" fill="none" />
        <path d="M50,90 Q50,60 70,40" stroke="#558b2f" strokeWidth="3" fill="none" />
        {/* Eye Bloom */}
        <g transform="translate(30,30)">
             <circle cx="0" cy="0" r="15" fill="#f48fb1" stroke="#880e4f" strokeWidth="1"/>
             <ellipse cx="0" cy="0" rx="10" ry="5" fill="white"/>
             <circle cx="0" cy="0" r="3" fill="black"/>
        </g>
         <g transform="translate(70,40)">
             <circle cx="0" cy="0" r="10" fill="#ce93d8" stroke="#4a148c" strokeWidth="1"/>
             <ellipse cx="0" cy="0" rx="6" ry="3" fill="white"/>
             <circle cx="0" cy="0" r="2" fill="black"/>
        </g>
    </svg>
);

export const IVDripDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <line x1="50" y1="90" x2="50" y2="10" stroke="#90a4ae" strokeWidth="3"/>
        <line x1="30" y1="90" x2="70" y2="90" stroke="#90a4ae" strokeWidth="3"/>
        <line x1="30" y1="15" x2="50" y2="10" stroke="#90a4ae" strokeWidth="2"/>
        {/* Bag */}
        <path d="M30,15 L30,40 Q30,50 40,50 L40,50 Q50,50 50,40 L50,15" fill="#e1f5fe" stroke="#0277bd" strokeWidth="1" opacity="0.8"/>
        {/* Drip */}
        <circle cx="40" cy="60" r="2" fill="#0277bd" className="animate-[float_2s_infinite]"/>
    </svg>
);

export const TrafficLightDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="35" y="10" width="30" height="80" fill="#212121" stroke="black"/>
        <circle cx="50" cy="25" r="8" fill="#d32f2f" opacity="0.3">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="50" cy="50" r="8" fill="#fbc02d" opacity="0.3"/>
        <circle cx="50" cy="75" r="8" fill="#388e3c" opacity="0.3"/>
    </svg>
);

export const HoneyDripDecor = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50,0 L50,30" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        <circle cx="50" cy="30" r="4" fill="#FFD700">
            <animate attributeName="cy" values="30;95" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="4;2" dur="2s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="50" cy="95" rx="12" ry="4" fill="#FFD700" opacity="0.5">
            <animate attributeName="rx" values="8;14;8" dur="2s" repeatCount="indefinite" />
        </ellipse>
    </svg>
);

// --- MAP CONFIG ---

export interface MapConfig {
    layout: number[][];
    entities: Entity[];
    portals: Portal[];
    theme: {
        primary: string;
        secondary: string;
        bgPattern: 'hex' | 'lines' | 'grid';
    }
}

// 0: Floor, 1: Wall, 2: Decor/Interactable (Walkable but visually different)

const MAP_ENTRANCE = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,2,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,2,0,1],
    [1,0,0,0,1,1,1,1,0,0,0,1], // Central pillar structure
    [1,0,0,0,1,2,2,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,1,0,0,1], // Small alcoves
    [1,0,0,1,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,1,1,1,1], // Bottom exit
];

const MAP_QUARTERS = [
    [1,1,1,1,1,1,0,0,1,1,1,1], // Top entrance
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,1,1,0,0,1], // Cell block L
    [1,0,0,2,1,0,0,1,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0], // Right exit
    [1,0,0,0,1,0,0,1,0,0,0,1], // Watch tower base
    [1,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,2,1,0,0,1,2,0,0,1], // Cell block R
    [1,0,0,1,1,0,0,1,1,0,0,1],
    [1,0,2,0,0,0,0,0,0,2,0,1], // Clutter
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,1,1,1,1], // Bottom exit
];

const MAP_STORAGE = [
    [1,1,1,1,1,0,0,1,1,1,1,1], // Top exit to Lab
    [1,0,0,2,2,0,0,2,2,0,0,1], // Vats
    [1,0,0,2,2,0,0,2,2,0,0,1],
    [0,0,0,0,0,0,0,0,0,0,0,0], // Left entrance from Quarters, Right exit to Processing
    [0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,1,1,0,0,1,1,0,0,1], // Pillars
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,0,0,0,0,0,0,0,0,2,1], // Spilled honey
    [1,0,0,1,1,1,1,1,1,0,0,1], // Back wall
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,2,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_NURSERY = [
    [1,1,1,1,1,1,0,0,1,1,1,1], // Top entrance
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,2,0,1], // Decor
    [1,1,2,2,1,0,0,1,2,2,1,1], // Pods
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,2,2,1,0,0,1,2,2,1,1], // Pods
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,1,1,1,1,1], // Bottom exit
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,1,1,1,1,1], 
];

const MAP_THRONE = [
    [1,1,1,1,1,0,0,1,1,1,1,1], // Top entrance
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,2,2,1,0,0,0,1], // Gate Frame
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,0,0,0,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,0,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_HIDDEN = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,0,0,0,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,0,0,0,2,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1],
];

const MAP_LABORATORY = [
    [1,1,1,1,1,0,0,1,1,1,1,1], // Top entrance from Archive
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,1,1,1,1,1], // Bottom entrance from Storage
];

const MAP_OBSERVATORY = [
    [1,1,1,1,1,0,0,1,1,1,1,1], // Top entrance from Throne
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,2,0,0,0,0,1], // Central Panopticon core
    [1,0,0,0,0,2,2,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,1,1,1,1,1], // Bottom entrance from Quarters
];

const MAP_PROCESSING = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,1,1,1,0,1],
    [0,0,1,0,0,0,0,0,0,1,0,1], // Left entrance from Storage
    [0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,2,2,0,0,0,0,1], // Processing vat
    [1,0,0,0,0,2,2,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_ARCHIVE = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,2,0,0,0,0,1], // Archive core
    [1,0,0,0,0,2,2,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,2,2,0,0,0,0,2,2,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,0,1,1,1,1,1], // Bottom entrance from Laboratory
];

export const MAPS: Record<MapId, MapConfig> = {
    [MapId.ENTRANCE]: {
        layout: MAP_ENTRANCE,
        theme: { primary: '#FFD700', secondary: '#1a0505', bgPattern: 'hex' },
        entities: [
            { id: 'guard_entry', type: EntityType.SOLDIER_BEE, x: 8, y: 2 },
            { id: 'mirror_entry', type: EntityType.MIRROR, x: 2, y: 2 },
            { id: 'worker_entry', type: EntityType.WORKER_BEE, x: 10, y: 6 },
            { id: 'item_flower', type: EntityType.ITEM_DROP, x: 2, y: 9, data: { name: '干枯的花朵' } },
        ],
        portals: [
            { x: 6, y: 11, targetMap: MapId.QUARTERS, targetX: 6, targetY: 1 },
            { x: 7, y: 11, targetMap: MapId.QUARTERS, targetX: 7, targetY: 1 }
        ]
    },
    [MapId.QUARTERS]: {
        layout: MAP_QUARTERS,
        theme: { primary: '#607d8b', secondary: '#263238', bgPattern: 'grid' },
        entities: [
             { id: 'worker_tired', type: EntityType.WORKER_BEE, x: 3, y: 3 },
             { id: 'worker_sleeping', type: EntityType.WORKER_BEE, x: 8, y: 3 },
             { id: 'item_badge', type: EntityType.ITEM_DROP, x: 1, y: 10, data: { name: '死蜂徽章' } },
             { id: 'npc_old_bee', type: EntityType.NPC_OLD, x: 2, y: 8 },
        ],
        portals: [
            { x: 6, y: 0, targetMap: MapId.ENTRANCE, targetX: 6, targetY: 10 },
            { x: 7, y: 0, targetMap: MapId.ENTRANCE, targetX: 7, targetY: 10 },
            { x: 11, y: 4, targetMap: MapId.STORAGE, targetX: 1, targetY: 3 },
            { x: 6, y: 11, targetMap: MapId.NURSERY, targetX: 6, targetY: 1 },
            { x: 7, y: 11, targetMap: MapId.NURSERY, targetX: 7, targetY: 1 }
        ]
    },
    [MapId.STORAGE]: {
        layout: MAP_STORAGE,
        theme: { primary: '#ff6f00', secondary: '#3e2723', bgPattern: 'hex' },
        entities: [
            { id: 'honey_vat1', type: EntityType.HONEY_POOL, x: 3, y: 2 },
            { id: 'honey_vat2', type: EntityType.HONEY_POOL, x: 8, y: 2 },
            { id: 'glutton_bee', type: EntityType.WORKER_BEE, x: 5, y: 3 },
            { id: 'item_clockwork', type: EntityType.ITEM_DROP, x: 10, y: 7, data: { name: '发条心脏' } },
            { id: 'item_memory', type: EntityType.ITEM_DROP, x: 1, y: 7, data: { name: '记忆碎片' } },
            { id: 'rusty_key', type: EntityType.ITEM_DROP, x: 5, y: 10, data: { name: '锈蚀的钥匙' } },
        ],
        portals: [
            { x: 0, y: 3, targetMap: MapId.QUARTERS, targetX: 10, targetY: 4 },
            { x: 5, y: 0, targetMap: MapId.LABORATORY, targetX: 5, targetY: 10 },
            { x: 6, y: 0, targetMap: MapId.LABORATORY, targetX: 6, targetY: 10 },
            { x: 11, y: 3, targetMap: MapId.PROCESSING, targetX: 1, targetY: 3 },
            { x: 11, y: 4, targetMap: MapId.PROCESSING, targetX: 1, targetY: 4 }
        ]
    },
    [MapId.PROCESSING]: {
        layout: MAP_PROCESSING,
        theme: { primary: '#b71c1c', secondary: '#212121', bgPattern: 'lines' },
        entities: [
            { id: 'proc_worker1', type: EntityType.WORKER_BEE, x: 5, y: 2 },
            { id: 'proc_worker2', type: EntityType.WORKER_BEE, x: 5, y: 8 },
            { id: 'item_pure_jelly', type: EntityType.ITEM_DROP, x: 2, y: 5, data: { name: '纯净的蜂王浆' } },
        ],
        portals: [
            { x: 0, y: 3, targetMap: MapId.STORAGE, targetX: 10, targetY: 3 },
            { x: 0, y: 4, targetMap: MapId.STORAGE, targetX: 10, targetY: 4 }
        ]
    },
    [MapId.NURSERY]: {
        layout: MAP_NURSERY,
        theme: { primary: '#f8bbd0', secondary: '#880e4f', bgPattern: 'lines' },
        entities: [
            { id: 'larva1', type: EntityType.LARVA, x: 2, y: 3 },
            { id: 'larva2', type: EntityType.LARVA, x: 9, y: 3 },
            { id: 'larva3', type: EntityType.LARVA, x: 2, y: 6 },
            { id: 'nurse_bee', type: EntityType.WORKER_BEE, x: 8, y: 5 },
        ],
        portals: [
            { x: 6, y: 0, targetMap: MapId.QUARTERS, targetX: 6, targetY: 10 },
            { x: 7, y: 0, targetMap: MapId.QUARTERS, targetX: 7, targetY: 10 },
            { x: 5, y: 11, targetMap: MapId.OBSERVATORY, targetX: 5, targetY: 1 },
            { x: 6, y: 11, targetMap: MapId.OBSERVATORY, targetX: 6, targetY: 1 }
        ]
    },
    [MapId.OBSERVATORY]: {
        layout: MAP_OBSERVATORY,
        theme: { primary: '#4a148c', secondary: '#000000', bgPattern: 'grid' },
        entities: [
            { id: 'obs_guard', type: EntityType.SOLDIER_BEE, x: 5, y: 3 },
            { id: 'obs_worker', type: EntityType.WORKER_BEE, x: 2, y: 8 },
            { id: 'item_tape', type: EntityType.ITEM_DROP, x: 8, y: 4, data: { name: '监控录像' } },
        ],
        portals: [
            { x: 5, y: 0, targetMap: MapId.NURSERY, targetX: 5, targetY: 10 },
            { x: 6, y: 0, targetMap: MapId.NURSERY, targetX: 6, targetY: 10 },
            { x: 5, y: 11, targetMap: MapId.THRONE, targetX: 5, targetY: 1 },
            { x: 6, y: 11, targetMap: MapId.THRONE, targetX: 6, targetY: 1 }
        ]
    },
    [MapId.THRONE]: {
        layout: MAP_THRONE,
        theme: { primary: '#FFD700', secondary: '#000000', bgPattern: 'hex' },
        entities: [
             { id: 'guard_royal1', type: EntityType.SOLDIER_BEE, x: 3, y: 5 },
             { id: 'guard_royal2', type: EntityType.SOLDIER_BEE, x: 8, y: 5 },
             { id: 'queen_gate', type: EntityType.QUEEN_GATE, x: 5, y: 5 },
             { id: 'item_crown', type: EntityType.ITEM_DROP, x: 1, y: 1, data: { name: '破碎的皇冠' } },
        ],
        portals: [
            { x: 5, y: 0, targetMap: MapId.OBSERVATORY, targetX: 5, targetY: 10 },
            { x: 6, y: 0, targetMap: MapId.OBSERVATORY, targetX: 6, targetY: 10 }
        ]
    },
    [MapId.HIDDEN]: {
        layout: MAP_HIDDEN,
        theme: { primary: '#ffffff', secondary: '#000000', bgPattern: 'hex' },
        entities: [
             { id: 'hidden_exit', type: EntityType.PORTAL, x: 6, y: 11, data: { targetMap: MapId.ENTRANCE } },
             { id: 'memory_box', type: EntityType.ITEM_DROP, x: 5, y: 2, data: { name: '被遗忘的铁盒' } }, // Needs key
        ],
        portals: [
            { x: 6, y: 11, targetMap: MapId.ENTRANCE, targetX: 2, targetY: 2 } // Returns to mirror
        ]
    },
    [MapId.LABORATORY]: {
        layout: MAP_LABORATORY,
        theme: { primary: '#e0e0e0', secondary: '#424242', bgPattern: 'grid' },
        entities: [
            { id: 'lab_scientist', type: EntityType.WORKER_BEE, x: 5, y: 5 },
            { id: 'item_records', type: EntityType.ITEM_DROP, x: 1, y: 1, data: { name: '违禁记录' } },
            { id: 'item_sedative', type: EntityType.ITEM_DROP, x: 10, y: 1, data: { name: '镇静剂' } },
        ],
        portals: [
            { x: 5, y: 11, targetMap: MapId.STORAGE, targetX: 5, targetY: 1 },
            { x: 6, y: 11, targetMap: MapId.STORAGE, targetX: 6, targetY: 1 },
            { x: 5, y: 0, targetMap: MapId.ARCHIVE, targetX: 5, targetY: 10 },
            { x: 6, y: 0, targetMap: MapId.ARCHIVE, targetX: 6, targetY: 10 }
        ]
    },
    [MapId.ARCHIVE]: {
        layout: MAP_ARCHIVE,
        theme: { primary: '#5d4037', secondary: '#1b1b1b', bgPattern: 'hex' },
        entities: [
            { id: 'archivist', type: EntityType.NPC_OLD, x: 5, y: 3 },
            { id: 'item_blueprint', type: EntityType.ITEM_DROP, x: 2, y: 8, data: { name: '全景监狱蓝图' } },
        ],
        portals: [
            { x: 5, y: 11, targetMap: MapId.LABORATORY, targetX: 5, targetY: 1 },
            { x: 6, y: 11, targetMap: MapId.LABORATORY, targetX: 6, targetY: 1 }
        ]
    }
};