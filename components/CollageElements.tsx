import React, { useEffect, useState } from 'react';
import { EndingType } from '../types';
import { ItemIconSVG, WallEyeSVG } from '../constants';
import { playSound } from '../services/audioService';

export const DrawnIcon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
    switch(name) {
        case 'honey':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" fill="currentColor" opacity="0.8" />
                    <path d="M12 6 L18 10 L18 14 L12 18 L6 14 L6 10 Z" fill="none" stroke="rgba(0,0,0,0.5)" />
                    <circle cx="12" cy="12" r="2" fill="rgba(0,0,0,0.5)" />
                </svg>
            );
        case 'eye':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="rgba(255,0,0,0.2)"/>
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <circle cx="12" cy="12" r="1" fill="red" />
                    <path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12" stroke="currentColor" />
                </svg>
            );
        case 'gear':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" strokeDasharray="2 2" />
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 7 L12 2 M12 17 L12 22 M7 12 L2 12 M17 12 L22 12" />
                </svg>
            );
        case 'vial':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 2 L16 2 M10 2 L10 20 A2 2 0 0 0 14 20 L14 2" />
                    <path d="M10 12 L14 12 M10 16 L14 16" stroke="currentColor" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
            );
        case 'snowflake':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
            );
        case 'hammer':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 10 L22 2 M10 14 L2 22" />
                    <rect x="8" y="8" width="8" height="8" transform="rotate(45 12 12)" fill="currentColor" />
                </svg>
            );
        case 'butterfly':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L12 22" strokeDasharray="2 2" />
                    <path d="M12 12 C 6 6, 2 10, 12 12 C 18 6, 22 10, 12 12" fill="currentColor" opacity="0.5" />
                    <path d="M12 12 C 6 18, 2 14, 12 12 C 18 18, 22 14, 12 12" fill="currentColor" opacity="0.5" />
                </svg>
            );
        case 'chart':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3 L3 21 L21 21" />
                    <path d="M3 15 L9 9 L15 15 L21 3" strokeDasharray="2 2" />
                    <circle cx="21" cy="3" r="2" fill="currentColor" />
                </svg>
            );
        case 'sparkles':
        case 'sparkle':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" fill="currentColor" />
                </svg>
            );
        case 'bird':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12 Q12 2 22 12 Q12 22 2 12 Z" strokeDasharray="2 2" />
                    <circle cx="16" cy="12" r="2" fill="currentColor" />
                    <path d="M2 12 L8 12" />
                </svg>
            );
        case 'ghost':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 22 L6 10 C6 6 18 6 18 10 L18 22 L15 19 L12 22 L9 19 Z" fill="currentColor" opacity="0.2" />
                    <circle cx="10" cy="10" r="1" fill="currentColor" />
                    <circle cx="14" cy="10" r="1" fill="currentColor" />
                    <path d="M10 14 Q12 16 14 14" />
                </svg>
            );
        case 'hourglass':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2 L18 2 L12 12 L18 22 L6 22 L12 12 Z" fill="currentColor" opacity="0.2" />
                    <path d="M6 2 L18 2 M6 22 L18 22" strokeWidth="2" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z" />
                </svg>
            );
    }
}

// Complex background mimicking Gekidan Inu Curry style + Panopticon
export const PanopticonBackground = ({ theme, sanityRatio, mapId, playerPos }: { theme: any, sanityRatio: number, mapId: string, playerPos?: { x: number, y: number } }) => {
    
    // Calculate eye tracking based on player position
    const px = playerPos ? playerPos.x / 12 : 0.5;
    const py = playerPos ? playerPos.y / 12 : 0.5;
    
    const distress = 1 - sanityRatio;
    
    // Dynamic elements based on map
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000"
             style={{ backgroundColor: theme.secondary }}>
            
            {/* Layer 1: The Grid / Structure (Refined Hexagonal Grids) */}
            <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                    <pattern id="hexGrid" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                        <path d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z" 
                              fill="none" stroke={theme.primary} strokeWidth="1" />
                        <path d="M30 5 L55 19.5 L55 49.5 L30 64 L5 49.5 L5 19.5 Z" 
                              fill="none" stroke={theme.primary} strokeWidth="0.5" strokeDasharray="2,2" />
                        <circle cx="30" cy="34.64" r="1" fill={theme.primary} />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#hexGrid)" className="animate-pulse-slow" />
                </svg>
            </div>

            {/* Layer 2: Rotating Elements (Gears/Eyes) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <div className={`w-[800px] h-[800px] border-[50px] border-dashed rounded-full animate-[spin_60s_linear_infinite]`}
                      style={{ borderColor: theme.primary, opacity: 0.1 + distress * 0.2 }}></div>
                 <div className={`w-[600px] h-[600px] border-[2px] rounded-full animate-[spin_40s_linear_infinite_reverse]`}
                      style={{ borderColor: theme.primary, opacity: 0.2 + distress * 0.3 }}></div>
                 
                 {/* Floating Newspaper Clippings */}
                 <div className="absolute inset-0">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={`clip-${i}`}
                             className="absolute font-serif text-[10px] bg-[#f5f5f0] p-1 border border-black/20 shadow-sm animate-float"
                             style={{
                                 left: `${(i * 17) % 100}%`,
                                 top: `${(i * 23) % 100}%`,
                                 transform: `rotate(${(i * 45) % 360}deg)`,
                                 animationDelay: `${i * 0.5}s`,
                                 animationDuration: `${5 + (i % 3)}s`,
                                 opacity: 0.1 + distress * 0.4,
                                 filter: distress > 0.5 ? `hue-rotate(${distress * 180}deg)` : 'none'
                             }}>
                            {distress > 0.7 ? ["VOID", "EYE", "ROT", "OBEY", "DIE", "NULL"][i % 6] : ["CONFORM", "OBEY", "THE HIVE", "CITRUS", "VOID", "EYE"][i % 6]}
                        </div>
                    ))}
                 </div>
            </div>

            {/* Layer 3: Dynamic Watching Eyes */}
            <div className="absolute inset-0">
                {Array.from({ length: 8 + Math.floor(distress * 12) }).map((_, i) => {
                    const eyeX = (i * 12 + 8) % 100; 
                    const eyeY = ((i * 41) % 100); 
                    
                    const dx = (px * 100 - eyeX);
                    const dy = (py * 100 - eyeY);
                    const angle = Math.atan2(dy, dx);
                    const distance = Math.min(Math.sqrt(dx*dx + dy*dy) * 0.1, 6); 
                    
                    const pupilX = Math.cos(angle) * distance;
                    const pupilY = Math.sin(angle) * distance;
                    
                    return (
                        <div key={`watcher-${i}`} 
                             className="absolute transition-all duration-300"
                             style={{
                                 left: `${eyeX}%`,
                                 top: `${eyeY}%`,
                                 transform: `translate(-50%, -50%) scale(${1 + (i % 2) * 0.5 + distress})`,
                                 opacity: 0.1 + distress * 0.5
                             }}>
                            <svg width="60" height="40" viewBox="0 0 60 40" 
                                 className="animate-blink" 
                                 style={{ 
                                     animationDelay: `${(i * 0.7) % 5}s`, 
                                     animationDuration: `${3 + (i % 4)}s` 
                                 }}>
                                <path d="M0 20 Q30 0 60 20 Q30 40 0 20" fill={distress > 0.6 ? "#ffcccc" : "white"} stroke={theme.primary} strokeWidth="2" />
                                <circle cx={30 + pupilX} cy={20 + pupilY} r="8" fill={distress > 0.8 ? "red" : "black"} />
                                <circle cx={30 + pupilX + 2} cy={20 + pupilY - 2} r="2" fill="white" />
                                {(i % 3 === 0 || distress > 0.5) && <path d="M10,10 L50,10 M10,30 L50,30" stroke="red" strokeWidth="1" opacity={0.2 + distress * 0.5} />}
                            </svg>
                        </div>
                    );
                })}
            </div>

            {/* Layer 4: The Panopticon Searchlight */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle_at_center, transparent 0%, rgba(0,0,0,${0.6 + distress * 0.3}) ${80 - distress * 30}%)` }}></div>

            {/* Layer 5: Map Specific Decor */}
            {mapId === 'NURSERY' && (
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ff80ab 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            )}
            {mapId === 'QUARTERS' && (
                 <div className="absolute top-10 left-10 text-9xl font-horror opacity-10 text-white select-none">EYE EYE EYE</div>
            )}

             {/* Sanity Effects: Creepy Eyes appearing */}
             {sanityRatio < 0.6 && (
                 <div className="absolute inset-0">
                     {Array.from({ length: Math.floor(distress * 30) }).map((_, i) => (
                         <div key={i} 
                              className="absolute bg-white rounded-full animate-pulse"
                              style={{
                                  width: Math.random() * 20 + 5 + 'px',
                                  height: Math.random() * 20 + 5 + 'px',
                                  left: Math.random() * 100 + '%',
                                  top: Math.random() * 100 + '%',
                                  opacity: 0.3 + distress * 0.4
                              }}>
                                <div className="absolute inset-[30%] bg-black rounded-full" style={{ backgroundColor: distress > 0.8 ? 'red' : 'black' }}></div>
                         </div>
                     ))}
                 </div>
             )}
        </div>
    );
};

export const PostProcessingLayer = ({ corruption, hpRatio }: { corruption: number, hpRatio: number }) => {
    // corruption: 0 (Sweet) to 1 (Horror)
    // hpRatio: 1 (Healthy) to 0 (Dying)
    
    // Non-linear intensity for more dramatic effect at high levels
    const corruptionIntensity = Math.pow(corruption, 1.5);
    const distressIntensity = Math.pow(1 - hpRatio, 2);
    
    // Combined intensity for general distortion
    const totalIntensity = Math.max(corruptionIntensity, distressIntensity * 0.7);
    
    // Vignette calculation - deeper and more "constricting"
    // Low HP adds a red pulse to the vignette
    const vignetteIntensity = 0.3 + (corruptionIntensity * 0.7) + (distressIntensity * 0.2);
    const vignetteSize = 110 - (corruptionIntensity * 80) - (distressIntensity * 20); 
    
    // Color Grading
    // Sweet: Warm, high saturation
    // Horror: Cold, sickly green/blue, high contrast
    const hueRotate = corruptionIntensity * 160; // Up to 160 deg shift (towards sickly greens/blues)
    const saturate = 1.6 - (corruptionIntensity * 1.4) - (distressIntensity * 0.4); // 1.6 to 0.1
    const contrast = 1 + (corruptionIntensity * 2.2) + (distressIntensity * 0.5); // Very high contrast
    const brightness = 1.2 - (corruptionIntensity * 0.7) - (distressIntensity * 0.3); // Brighter at low corruption, dimmer at high

    // Noise Opacity - more "static"
    const noiseOpacity = 0.01 + (corruptionIntensity * 0.4) + (distressIntensity * 0.2);
    const noiseFrequency = 0.5 + (corruptionIntensity * 2.5) + (distressIntensity * 1.0);

    // Chromatic Aberration offset - more pronounced
    const chromOffset = (corruptionIntensity * 18) + (distressIntensity * 10); 

    // Glitch logic
    const isGlitching = corruption > 0.4 || hpRatio < 0.3;
    const glitchFrequency = corruption > 0.8 ? 0.08 : (hpRatio < 0.2 ? 0.12 : 0.25);

    return (
        <>
            {/* Base Color Grade & Vignette */}
            <div 
                className="fixed inset-0 pointer-events-none z-40 transition-all duration-700 ease-in-out mix-blend-multiply"
                style={{
                    background: `radial-gradient(circle, transparent ${vignetteSize}%, rgba(${Math.floor(20 + distressIntensity * 100)}, 5, 0, ${vignetteIntensity}) 100%)`,
                    filter: `hue-rotate(${hueRotate}deg) saturate(${saturate}) contrast(${contrast}) brightness(${brightness})`,
                }}
            />
            
            {/* Dissonance Overlay (Reddish pulse for low HP or high corruption) */}
            <div 
                className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 mix-blend-overlay ${hpRatio < 0.4 ? 'animate-pulse' : ''}`}
                style={{
                    backgroundColor: `rgba(${Math.floor(255 * (0.5 + distressIntensity * 0.5))}, 0, 0, ${totalIntensity * 0.4})`,
                    boxShadow: `inset 0 0 ${totalIntensity * 500}px rgba(180, 0, 0, ${totalIntensity * 0.8})`,
                    opacity: (corruption > 0.2 || hpRatio < 0.5) ? 1 : 0
                }}
            />

            {/* Film Grain / Static Noise */}
            <div className="grain-overlay pointer-events-none mix-blend-overlay z-50 fixed inset-0" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${noiseFrequency}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${noiseOpacity}'/%3E%3C/svg%3E")`,
                 }}>
            </div>

            {/* CRT Scanlines */}
            <div className={`scanlines pointer-events-none z-50 fixed inset-0 ${isGlitching ? 'animate-flicker' : ''}`}
                 style={{
                     opacity: 0.05 + (totalIntensity * 0.8),
                     backgroundSize: `100% ${Math.max(1, 4 - totalIntensity * 3)}px`,
                 }}>
            </div>

            {/* Chromatic Aberration - Split Layers */}
            {(corruption > 0.15 || hpRatio < 0.6) && (
                <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-screen opacity-70 overflow-hidden">
                     <div className="absolute inset-0 bg-red-600 mix-blend-screen"
                          style={{ 
                              transform: `translateX(${chromOffset}px)`, 
                              opacity: totalIntensity * 0.9,
                              animation: isGlitching ? `shake ${glitchFrequency}s infinite` : 'none'
                          }}></div>
                     <div className="absolute inset-0 bg-cyan-400 mix-blend-screen"
                          style={{ 
                              transform: `translateX(-${chromOffset}px)`, 
                              opacity: totalIntensity * 0.9,
                              animation: isGlitching ? `shake ${glitchFrequency}s infinite reverse` : 'none'
                          }}></div>
                </div>
            )}
            
            {/* VHS Tracking & Random Glitch Blocks */}
            {(corruption > 0.5 || hpRatio < 0.3) && (
                 <div className="fixed inset-0 pointer-events-none z-[55] overflow-hidden">
                      <div className="w-full h-[1px] bg-white/40 absolute animate-[float_2s_linear_infinite]" style={{ top: '30%', opacity: totalIntensity }}></div>
                      <div className="w-full h-[2px] bg-black/20 absolute animate-[float_3s_linear_infinite_reverse]" style={{ top: '80%', opacity: totalIntensity }}></div>
                      
                      {(corruption > 0.8 || hpRatio < 0.2) && (
                          <div className="absolute inset-0 bg-white/10 animate-glitch mix-blend-difference"></div>
                      )}
                 </div>
            )}
        </>
    );
};

export const DialogueBox = ({ speaker, text, options, onOption, typingText, corruption = 0, selectedIdx = 0 }: any) => {
    const isHorror = corruption > 0.6;
    const isDissonant = corruption > 0.3;

    return (
        <div className={`absolute bottom-4 left-4 right-4 md:left-20 md:right-20 min-h-[200px] z-50 ${isHorror ? 'animate-shake' : 'animate-float'}`}>
            {/* Collage Background Layers */}
            <div className={`absolute inset-0 bg-white transform rotate-1 border-4 border-black drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-colors duration-1000 ${isHorror ? 'bg-void-black' : ''}`} style={{ clipPath: 'polygon(2% 0%, 98% 2%, 100% 95%, 95% 100%, 0% 98%, 2% 5%)' }}></div>
            <div className={`absolute inset-0 transform -rotate-1 scale-[0.98] border-2 border-black opacity-90 transition-all duration-1000 ${isHorror ? 'bg-rotten-green' : (isDissonant ? 'bg-honey-light' : 'bg-sweet-pink')}`} style={{ clipPath: 'polygon(0% 2%, 100% 0%, 98% 100%, 2% 98%)' }}>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] mix-blend-overlay"></div>
                {isHorror && <div className="absolute inset-0 bg-red-500/20 animate-pulse mix-blend-color-burn"></div>}
            </div>
            
            {/* Content */}
            <div className={`relative p-8 font-story text-lg md:text-xl flex flex-col h-full justify-between transition-colors duration-1000 ${isHorror ? 'text-white' : 'text-void-black'}`}>
                <div>
                    {speaker && (
                        <div className={`inline-block border-2 border-black px-6 py-1.5 mb-3 transform -rotate-2 font-bold font-cute shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-colors duration-1000 ${isHorror ? 'bg-red-900 text-white' : 'bg-honey-main text-black'}`} style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                            {speaker}
                        </div>
                    )}
                    <p className={`leading-relaxed whitespace-pre-wrap min-h-[80px] ${isHorror ? 'font-horror text-2xl tracking-widest' : 'font-story'}`}>
                        {typingText}
                    </p>
                </div>

                {options && options.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-3">
                        {options.map((opt: any, idx: number) => {
                            const isSelected = selectedIdx === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => onOption(opt)}
                                    className={`text-left border-2 border-black p-3 transition-all duration-200 font-cute font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] group flex items-center ${
                                        isSelected 
                                            ? (isHorror ? 'bg-red-800 text-white translate-x-4 ring-2 ring-red-500' : 'bg-honey-main text-black translate-x-4 ring-2 ring-yellow-400')
                                            : (isHorror ? 'bg-black text-red-500 hover:translate-x-2' : 'bg-white text-black hover:translate-x-2')
                                    }`}
                                    style={{ clipPath: 'polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%)' }}
                                >
                                    <span className={`mr-3 transition-opacity flex items-center justify-center w-6 h-6 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${isHorror ? 'text-red-600' : 'text-rose-500'}`}>
                                        <DrawnIcon name={isHorror ? 'eye' : 'honey'} />
                                    </span>
                                    {opt.text}
                                </button>
                            );
                        })}
                    </div>
                )}
                
                {(!options || options.length === 0) && (
                     <div className="mt-4 flex items-center justify-end gap-2 text-sm opacity-70 animate-pulse font-cute">
                         <DrawnIcon name="sparkle" className="w-4 h-4" /> (点击继续)
                     </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className={`absolute -top-8 -right-8 w-24 h-24 transition-colors duration-1000 opacity-80 ${isHorror ? 'animate-spin-fast' : 'animate-spin-slow'}`}>
                {isHorror ? (
                    <WallEyeSVG corruption={corruption} />
                ) : (
                    <svg viewBox="0 0 100 100" className="w-full h-full text-honey-main drop-shadow-md">
                        <polygon points="50 5, 93 25, 93 75, 50 95, 7 75, 7 25" fill="currentColor" stroke="black" strokeWidth="4" />
                        <circle cx="50" cy="50" r="15" fill="black" />
                    </svg>
                )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 opacity-60">
                <svg viewBox="0 0 100 100" className={`w-full h-full transition-colors duration-1000 ${isHorror ? 'text-red-900' : 'text-rotten-green'}`}>
                    <polygon points="50 5, 93 25, 93 75, 50 95, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="10 5" className="animate-spin-slow" />
                </svg>
            </div>
        </div>
    );
};

export const EndingScreen = ({ 
    type, 
    onRestart,
    stats 
}: { 
    type: EndingType, 
    onRestart: () => void,
    stats?: { hp: number, rebel: number, items: string[] }
}) => {
    const [typedDesc, setTypedDesc] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    const getEndingDetails = (t: EndingType) => {
        switch(t) {
            case EndingType.CONSUMED: return { title: "LIQUEFACTION", sub: "液化", desc: "你不再拥有个体性。你已彻底融化在集体的甜蜜与虚无之中。", color: "#ffcc00", icon: "honey", stamp: "ASSIMILATED", stampColor: "text-red-700 border-red-700", anim: "animate-pulse" };
            case EndingType.DRONE: return { title: "ASSIMILATION", sub: "规训", desc: "你终于学会了停止思考。你成为了一颗完美、冰冷且盲目的齿轮。", color: "#888", icon: "gear", stamp: "APPROVED", stampColor: "text-green-800 border-green-800", anim: "animate-spin-slow" };
            case EndingType.ROYAL_JELLY: return { title: "SPECIMEN", sub: "标本", desc: "你的反叛被永远陈列在玻璃柜中，成为了供人观赏的标本。", color: "#e91e63", icon: "vial", stamp: "PRESERVED", stampColor: "text-purple-800 border-purple-800", anim: "animate-float" };
            case EndingType.EXILE: return { title: "EXILE", sub: "流放", desc: "死于寒冷的自由，胜过在温暖的囚禁中苟延残喘。", color: "#2196f3", icon: "snowflake", stamp: "DISPOSED", stampColor: "text-red-800 border-red-800", anim: "animate-wiggle" };
            case EndingType.MADNESS: return { title: "PARANOIA", sub: "偏执", desc: "眼睛……到处都是眼睛……它们在看着你，它们在你的脑海里……", color: "#f44336", icon: "eye", stamp: "QUARANTINED", stampColor: "text-red-600 border-red-600", anim: "animate-ping" };
            case EndingType.REVOLUTION: return { title: "ICONOCLASM", sub: "偶像破坏", desc: "高墙轰然倒塌。无尽的恐惧与绝对的自由在废墟上同时降临。", color: "#000", icon: "hammer", stamp: "BREACHED", stampColor: "text-red-700 border-red-700", anim: "animate-bounce" };
            case EndingType.MEMORIES: return { title: "AWAKENING", sub: "觉醒", desc: "你终于醒来。原来这一切，只是一场关于服从与遗忘的漫长噩梦。", color: "#fff", icon: "butterfly", stamp: "RECALLED", stampColor: "text-blue-800 border-blue-800", anim: "animate-pulse" };
            case EndingType.SABOTAGE: return { title: "SABOTAGE", sub: "寂静的崩塌", desc: "秩序在真相面前轰然瓦解。这不是一场革命，而是一场不可逆的集体性崩溃。", color: "#607d8b", icon: "chart", stamp: "TERMINATED", stampColor: "text-red-900 border-red-900", anim: "animate-pulse" };
            case EndingType.ASCENSION: return { title: "ASCENSION", sub: "升华", desc: "你不再反抗，也不再服从。你超越了规则，成为了光本身。", color: "#ffeb3b", icon: "sparkles", stamp: "TRANSCENDED", stampColor: "text-yellow-600 border-yellow-600", anim: "animate-spin-slow" };
            case EndingType.PANOPTICON: return { title: "BLIND FREEDOM", sub: "盲目的自由", desc: "监狱的墙壁依然高耸，但看守已经消失。你们在盲目的自由中继续狂欢。", color: "#9c27b0", icon: "bird", stamp: "UNCONTAINED", stampColor: "text-red-600 border-red-600", anim: "animate-float" };
            case EndingType.GHOST: return { title: "GHOST", sub: "幽灵", desc: "你不再被看见，也不再被需要。你在六边形的缝隙中，化作永恒徘徊的幽灵。", color: "#9e9e9e", icon: "ghost", stamp: "EXPUNGED", stampColor: "text-gray-800 border-gray-800", anim: "animate-pulse" };
            case EndingType.EXECUTED: return { title: "EXECUTED", sub: "处决", desc: "异端必须被抹除。你的生命在狂热的蜂拥中瞬间消散。", color: "#b71c1c", icon: "skull", stamp: "ERADICATED", stampColor: "text-red-900 border-red-900", anim: "animate-ping" };
            case EndingType.IMPRISONED: return { title: "IMPRISONED", sub: "监禁", desc: "你被关进了暗无天日的虫室，等待你的是无尽的清洗与重塑。", color: "#37474f", icon: "lock", stamp: "DETAINED", stampColor: "text-gray-900 border-gray-900", anim: "animate-pulse-slow" };
            default: return { title: "END", sub: "终结", desc: "", color: "#000", icon: "hourglass", stamp: "UNKNOWN", stampColor: "text-black border-black", anim: "" };
        }
    };

    const details = getEndingDetails(type);

    useEffect(() => {
        setTypedDesc("");
        setIsTyping(true);
        let i = 0;
        const targetText = details.desc;
        const timer = setInterval(() => {
            if (i < targetText.length) {
                setTypedDesc(targetText.substring(0, i + 1));
                if (i % 3 === 0) playSound('typewriter');
                i++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 50); // Typing speed
        return () => clearInterval(timer);
    }, [details.desc]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1a1a1a] font-ui overflow-hidden">
            {/* Collage Background Layers */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] mix-blend-overlay"></div>
            
            {/* Floating Scraps & Collage Elements */}
            <div className="absolute top-5 left-5 w-64 h-64 bg-[#e6e2d3] border border-black/20 transform -rotate-6 shadow-xl opacity-80 mix-blend-multiply">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]"></div>
                <div className="p-4 font-mono text-xs text-black/60">
                    <p>OBSERVATION LOG #8492</p>
                    <p>SUBJECT: WORKER-BEE-774</p>
                    <p>STATUS: COMPROMISED</p>
                    <div className="mt-4 border-t border-black/20 pt-2">
                        <p className="line-through">BEHAVIORAL ANOMALY DETECTED</p>
                        <p className="text-red-800 font-bold mt-2 animate-pulse">RECOMMEND IMMEDIATE ACTION</p>
                    </div>
                    <div className="mt-4 opacity-50 transform rotate-12 text-[8px]">
                        <p>THE EYE SEES ALL</p>
                        <p>THE COMB IS PERFECT</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 w-72 h-48 bg-[#d9d4c5] border border-black/30 transform rotate-3 shadow-2xl opacity-90 mix-blend-multiply flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"></div>
                <div className={`w-32 h-32 opacity-10 text-black transform -rotate-12 ${details.anim}`}>
                    <DrawnIcon name={details.icon} className="w-full h-full" />
                </div>
                <div className="relative z-10 text-center w-full">
                    <p className="font-mono text-sm text-black/70 border-b border-black/30 pb-1 mb-2 mx-4">APPENDIX C: ARTIFACTS</p>
                    <div className="flex flex-wrap justify-center gap-2 p-2">
                        {stats?.items.map((it, i) => (
                            <div key={i} className="bg-white/50 border border-black/20 p-1 shadow-sm transform rotate-1 hover:rotate-0 transition-transform">
                                <ItemIconSVG name={it} className="w-6 h-6 opacity-80" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Surrealist Eyes & Shapes */}
            <div className="absolute top-1/4 right-1/4 opacity-40 mix-blend-multiply animate-pulse" style={{ animationDuration: '3s' }}>
                <WallEyeSVG corruption={0.9} />
            </div>
            <div className="absolute bottom-1/3 left-1/4 opacity-30 mix-blend-multiply animate-bounce" style={{ animationDuration: '5s' }}>
                <div className="w-32 h-32 text-black">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-12">
                        <polygon points="50 5, 93 25, 93 75, 50 95, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <polygon points="50 15, 83 32, 83 68, 50 85, 17 68, 17 32" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="50" cy="50" r="5" fill="currentColor" />
                    </svg>
                </div>
            </div>
            
            {/* Additional Collage Elements */}
            <div className="absolute top-1/2 left-10 transform -translate-y-1/2 -rotate-12 opacity-50 mix-blend-multiply">
                <div className="w-40 h-8 bg-black text-white font-mono text-xs flex items-center justify-center tracking-widest">
                    [ REDACTED ]
                </div>
            </div>
            <div className="absolute bottom-20 left-1/3 transform rotate-6 opacity-30 mix-blend-multiply">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="black" strokeWidth="2" strokeDasharray="5,5" className="animate-spin-slow" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="black" strokeWidth="1" />
                </svg>
            </div>

            {/* Main Content Card - The "Report" */}
            <div className="relative z-10 p-8 bg-[#f4f1ea] border border-black/40 shadow-[10px_10px_0px_rgba(0,0,0,0.8)] max-w-2xl w-full mx-4 transform -rotate-1">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none"></div>
                
                {/* Tape pieces */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm border border-white/20 transform rotate-2 shadow-sm"></div>
                <div className="absolute -bottom-3 right-10 w-24 h-8 bg-white/40 backdrop-blur-sm border border-white/20 transform -rotate-3 shadow-sm"></div>
                <div className="absolute top-10 -left-4 w-12 h-6 bg-yellow-100/60 backdrop-blur-sm border border-black/10 transform -rotate-45 shadow-sm"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6">
                        <div>
                            <h2 className="font-mono text-2xl font-bold text-black tracking-widest">INCIDENT REPORT</h2>
                            <p className="font-mono text-xs text-black/60">HIVE MIND CONTROL AUTHORITY</p>
                        </div>
                        <div className="text-right font-mono text-xs text-black/60">
                            <p>DATE: [REDACTED]</p>
                            <p>FILE REF: {Math.floor(Math.random() * 9000) + 1000}-X</p>
                        </div>
                    </div>

                    {/* Title Area */}
                    <div className="text-center mb-8 relative">
                        <div className="text-5xl font-serif font-black text-black tracking-widest uppercase mb-2">
                            {details.title}
                        </div>
                        <div className="text-xl font-serif text-black/70 italic">
                            — {details.sub} —
                        </div>
                        
                        {/* The Stamp */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 border-4 px-4 py-1 text-4xl font-black tracking-widest opacity-80 mix-blend-multiply pointer-events-none z-20 ${details.stampColor}`}>
                            {details.stamp}
                        </div>
                    </div>
                    
                    {/* Description Typewriter */}
                    <div className="bg-[#e8e5dc] p-6 border border-black/20 mb-8 shadow-inner relative">
                        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/20"></div>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/20"></div>
                        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-black/20"></div>
                        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-black/20"></div>
                        
                        <p className="text-lg text-black font-mono leading-relaxed typewriter-text">
                            &gt; {typedDesc}
                            {isTyping && <span className="animate-pulse">_</span>}
                        </p>
                        <div className="absolute -right-4 -bottom-4 opacity-30 transform rotate-12">
                            <svg width="40" height="40" viewBox="0 0 40 40">
                                <path d="M0,40 L40,0" stroke="red" strokeWidth="2" />
                                <path d="M0,0 L40,40" stroke="red" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    {stats && (
                        <div className="grid grid-cols-2 gap-8 mb-10 font-cute text-sm text-black">
                            <div className="space-y-3">
                                <div className="flex justify-between items-end border-b border-black/30 pb-1">
                                    <span className="font-bold">最终理智 (SANITY):</span>
                                    <span className="text-xl text-sweet-pink">{stats.hp}%</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-black/30 pb-1">
                                    <span className="font-bold">异化指数 (DISSONANCE):</span>
                                    <span className="text-xl text-rotten-green">{stats.rebel}%</span>
                                </div>
                            </div>
                            <div className="space-y-2 relative">
                                <div className="font-bold border-b border-black/30 pb-1">回收碎片 (FRAGMENTS):</div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {stats.items.length > 0 ? stats.items.map((it, i) => (
                                        <span key={i} className="bg-honey-main text-black px-3 py-1 text-[11px] uppercase rounded-full border border-black shadow-sm">
                                            {it}
                                        </span>
                                    )) : <span className="text-black/50 italic">NONE FOUND</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Action */}
                    <div className="flex justify-center mt-8 pt-6 border-t-2 border-black border-dashed relative">
                        <button 
                            onClick={onRestart}
                            className="group relative px-10 py-4 bg-honey-main text-black font-cute font-bold text-xl transition-all hover:bg-sweet-pink hover:text-white hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.8)] rounded-2xl border-2 border-black flex items-center gap-2 mx-auto"
                        >
                            <DrawnIcon name="sparkle" className="w-5 h-5" /> [ 重新开始 / REBOOT ] <DrawnIcon name="sparkle" className="w-5 h-5" />
                        </button>
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-30 text-xs font-mono">
                            SYS.RST
                        </div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-30 text-xs font-mono">
                            V.1.0.4
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Visual Noise / Scratches Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/scratches.png')]"></div>
            
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>
    );
};

export const FogLayer = ({ corruption }: { corruption: number }) => {
    const density = 0.1 + (corruption * 0.6);
    // Color shifts towards darker, more desaturated tones at higher corruption
    const fogColor = corruption > 0.7 ? '#0a0a0a' : (corruption > 0.4 ? '#2a2a2a' : '#f0f0f0');
    
    return (
        <div className="fixed inset-0 z-[35] pointer-events-none overflow-hidden mix-blend-overlay" style={{ opacity: density }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <filter id="fogFilter" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="1">
                            <animate attributeName="baseFrequency" values="0.015;0.02;0.015" dur="30s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feGaussianBlur stdDeviation="2" />
                        <feComponentTransfer>
                            <feFuncA type="table" tableValues="0 0.8" />
                        </feComponentTransfer>
                    </filter>
                </defs>
                <rect width="100%" height="100%" fill={fogColor} filter="url(#fogFilter)" />
            </svg>
            {/* Ambient Lighting Gradient */}
            <div className="absolute inset-0" style={{ 
                background: corruption > 0.5 
                    ? `radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,${corruption * 0.8}) 100%)`
                    : `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)`
            }}></div>
        </div>
    );
};

export const SurrealOverlay = () => (
    <div className="absolute inset-0 z-40 pointer-events-none opacity-10 mix-blend-multiply overflow-hidden">
        <svg width="100%" height="100%">
            <pattern id="laceOverlay" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="2,2" />
                <path d="M0,50 L100,50 M50,0 L50,100" stroke="black" strokeWidth="0.2" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="black" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#laceOverlay)" />
        </svg>
    </div>
);
