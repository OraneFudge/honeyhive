import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { getCtx, startBossBGM, stopBossBGM, stopBGM } from '../services/audioService';

interface BossFightProps {
    onWin: () => void;
    onLose: () => void;
}

export const BossFight: React.FC<BossFightProps> = ({ onWin, onLose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hp, setHp] = useState(100);
    const [bossHp, setBossHp] = useState(1000);
    const [energy, setEnergy] = useState(0);
    const [shieldUses, setShieldUses] = useState(3);

    useEffect(() => {
        stopBGM();
        startBossBGM();
        return () => {
            stopBossBGM();
        };
    }, []);

    // Using ref for mutable game state
    const state = useRef({
        player: { x: 400, y: 500, speed: 5.5, size: 4, isShielding: false, shieldUses: 3, shieldTimer: 0 },
        keys: { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, q: false, e: false, e_prev: false, ' ': false },
        bullets: [] as any[],
        playerBullets: [] as any[],
        items: [] as any[], // Healing flowers
        itemSpawnTimer: 5.0,
        boss: { x: 400, y: 100, baseY: 100, width: 80, height: 100, attackTimer: 0, state: 'idle', targetX: 400, targetY: 100, dashVelY: 0 },
        particles: [] as any[],
        telegraphs: [] as any[],
        lastTick: performance.now(),
        hp: 100,
        bossHp: 1000,
        energy: 0,
        gameOver: false,
        cinematic: null as 'win' | 'lose' | null,
        cinematicTimer: 0
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (state.current.keys.hasOwnProperty(e.key) || e.key === ' ' || e.key.toLowerCase() === 'q' || e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'd') {
                state.current.keys[e.key === ' ' ? ' ' : e.key] = true;
                if (e.key.toLowerCase() === 'q') state.current.keys.q = true;
                if (e.key.toLowerCase() === 'e') state.current.keys.e = true;
                if (e.key.toLowerCase() === 'w') state.current.keys.w = true;
                if (e.key.toLowerCase() === 'a') state.current.keys.a = true;
                if (e.key.toLowerCase() === 's') state.current.keys.s = true;
                if (e.key.toLowerCase() === 'd') state.current.keys.d = true;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (state.current.keys.hasOwnProperty(e.key) || e.key === ' ' || e.key.toLowerCase() === 'q' || e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'd') {
                state.current.keys[e.key === ' ' ? ' ' : e.key] = false;
                if (e.key.toLowerCase() === 'q') state.current.keys.q = false;
                if (e.key.toLowerCase() === 'e') state.current.keys.e = false;
                if (e.key.toLowerCase() === 'w') state.current.keys.w = false;
                if (e.key.toLowerCase() === 'a') state.current.keys.a = false;
                if (e.key.toLowerCase() === 's') state.current.keys.s = false;
                if (e.key.toLowerCase() === 'd') state.current.keys.d = false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let reqId: number;

        const update = () => {
            if (state.current.gameOver) return;

            const s = state.current;
            const now = performance.now();
            const dt = Math.min((now - s.lastTick) / 1000, 0.1);
            s.lastTick = now;

            // Boss logic helpers
            const playPew = () => {
                const actx = getCtx();
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(800 + Math.random()*200, actx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, actx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.02, actx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start();
                osc.stop(actx.currentTime + 0.1);
            };

            const playDash = () => {
                const actx = getCtx();
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, actx.currentTime);
                osc.frequency.linearRampToValueAtTime(50, actx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.05, actx.currentTime);
                gain.gain.linearRampToValueAtTime(0.001, actx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start();
                osc.stop(actx.currentTime + 0.3);
            };

            const playMoveStep = () => {
                const actx = getCtx();
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, actx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, actx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.01, actx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.start();
                osc.stop(actx.currentTime + 0.05);
            };
            
            // Player Movement
            let dx = 0;
            let dy = 0;
            if (s.keys.w || s.keys.ArrowUp) dy -= 1;
            if (s.keys.s || s.keys.ArrowDown) dy += 1;
            if (s.keys.a || s.keys.ArrowLeft) dx -= 1;
            if (s.keys.d || s.keys.ArrowRight) dx += 1;
            
            if (dx !== 0 && dy !== 0) {
                const len = Math.sqrt(dx*dx + dy*dy);
                dx /= len; dy /= len;
            }
            
            // Movement particle trail
            if (dx !== 0 || dy !== 0) {
                if (Math.random() < 0.3) {
                    s.particles.push({ 
                        type: 'trail',
                        x: s.player.x + (Math.random()-0.5)*10, 
                        y: s.player.y + (Math.random()-0.5)*10, 
                        vx: -dx * 2 + (Math.random()-0.5)*2, 
                        vy: -dy * 2 + (Math.random()-0.5)*2, 
                        life: 0.3, 
                        color: 'rgba(255, 200, 0, 0.5)' 
                    });
                }
                
                // Audio feedback for move step (throttle slightly using lastTick trick or random)
                if (Math.random() < 0.15) {
                    playMoveStep();
                }
            }
            
            // Shield
            if (s.player.shieldTimer > 0) {
                s.player.shieldTimer -= dt;
                s.player.isShielding = true;
            } else {
                s.player.isShielding = false;
            }

            if (s.keys.e && !s.keys.e_prev) {
                if (s.player.shieldUses > 0 && s.player.shieldTimer <= 0) {
                    s.player.shieldUses -= 1;
                    s.player.shieldTimer = 2.0; // 2 seconds of invincibility
                    
                    // Shield sound
                    const actx = getCtx();
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, actx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1000, actx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.05, actx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.3);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start();
                    osc.stop(actx.currentTime + 0.3);
                }
            }
            s.keys.e_prev = !!s.keys.e;
            
            const speed = s.player.isShielding ? s.player.speed * 0.45 : s.player.speed;
            s.player.x += dx * speed * dt * 60;
            s.player.y += dy * speed * dt * 60;
            
            s.player.x = Math.max(s.player.size, Math.min(800 - s.player.size, s.player.x));
            s.player.y = Math.max(s.player.size, Math.min(600 - s.player.size, s.player.y));

            // Player Attack
            if (s.keys.q && Math.random() < 0.25) { // Increased fire rate slightly
                s.playerBullets.push({ x: s.player.x, y: s.player.y - 15, vx: (Math.random() - 0.5)*2, vy: -15, width: 4, height: 16 });
                playPew();
                // Recoil effect
                s.player.y += 1; 
                s.particles.push({ type: 'muzzle', x: s.player.x, y: s.player.y - 15, vx: 0, vy: 0, life: 0.1, color: 'white' });
            }

            // Ultimate Attack
            if (s.keys[' '] && s.energy >= 100) {
                s.energy = 0;
                s.bullets = []; // Clear all enemy bullets
                s.telegraphs = []; // Clear telegraphs
                s.bossHp -= 200; // Big damage: 20% of 1000
                
                // Screen flash effect (render later)
                s.particles.push({ type: 'flash', life: 1.0 });
                // Extra ultimate effect particles
                for (let i=0; i<50; i++) {
                    s.particles.push({
                        type: 'normal',
                        x: Math.random() * 800,
                        y: Math.random() * 600,
                        vx: (Math.random()-0.5)*10,
                        vy: (Math.random()-0.5)*10,
                        life: 1.0,
                        color: 'white'
                    });
                }
            }

            // Boss Logic
            s.boss.attackTimer -= dt;
            
            const hpRatioBoss = Math.max(0, s.bossHp / 1000);
            const bossBrokenness = 1.0 - hpRatioBoss;
            
            if (s.boss.state === 'idle') {
                if (bossBrokenness < 0.3) {
                    s.boss.targetX = 400 + Math.sin(now / 1500) * 250;
                    s.boss.targetY = 120 + Math.sin(now / 750) * 40;
                } else if (bossBrokenness < 0.7) {
                    s.boss.targetX = 400 + Math.sin(now / 1000) * 300 + Math.cos(now/500)*50;
                    s.boss.targetY = 150 + Math.sin(now / 500) * 80;
                } else { // Extreme randomness
                    if (Math.random() < 0.05) {
                        s.boss.targetX = s.player.x + (Math.random()-0.5)*200;
                        s.boss.targetY = 100 + Math.random()*200;
                    }
                    // Jitter
                    s.boss.targetX += (Math.random()-0.5)*50;
                    s.boss.targetY += (Math.random()-0.5)*30;
                }
                
                s.boss.x += (s.boss.targetX - s.boss.x) * (0.03 + bossBrokenness * 0.05);
                s.boss.y += (s.boss.targetY - s.boss.y) * (0.03 + bossBrokenness * 0.05);
                
                if (s.boss.attackTimer <= 0) {
                    const rand = Math.random();
                    if (rand < 0.4 - bossBrokenness*0.1) {
                        s.boss.state = 'shoot';
                        s.boss.attackTimer = 2.0 - bossBrokenness; // shoots less duration, but more often
                    } else if (rand < 0.7 - bossBrokenness*0.1) {
                        s.boss.state = 'telegraph';
                        s.boss.attackTimer = 1.6 - bossBrokenness*0.5;
                        // Create telegraphs
                        let numTelegraphs = 1 + Math.floor(bossBrokenness * 3);
                        for(let i=0; i<numTelegraphs; i++) {
                            s.telegraphs.push({ x: s.player.x - 75 + (Math.random()-0.5)*200, y: 0, width: 150, height: 600, delay: 1.0 - bossBrokenness*0.3, active: false });
                        }
                    } else {
                        s.boss.state = 'dash_prep';
                        s.boss.attackTimer = 1.2 - bossBrokenness*0.4;
                        s.boss.dashVelY = -5; // initial windup
                    }
                }
            } else if (s.boss.state === 'shoot') {
                s.boss.targetX = s.player.x;
                s.boss.x += (s.boss.targetX - s.boss.x) * (0.01 + bossBrokenness * 0.04); 
                
                // Jitter while shooting
                if (bossBrokenness > 0.5) {
                     s.boss.x += (Math.random() - 0.5) * 10;
                     s.boss.y += (Math.random() - 0.5) * 10;
                }
                
                if (Math.random() < 0.12 + bossBrokenness*0.1) { // Faster bullet emission
                    let bulletCount = 8 + Math.floor(bossBrokenness * 8); // Up to 16 bullets
                    for (let i=0; i<bulletCount; i++) {
                        let spray = bossBrokenness > 0.6 ? (Math.random() - 0.5) * Math.PI : 0;
                        const angle = (i / bulletCount) * Math.PI * 2 + (now / 1000) + spray;
                        let bSpeed = 3.5 + bossBrokenness*2;
                        s.bullets.push({ 
                            x: s.boss.x, 
                            y: s.boss.y + 40, 
                            vx: Math.cos(angle) * bSpeed, 
                            vy: Math.sin(angle) * bSpeed, 
                            radius: 6, 
                            isBoss: true 
                        });
                    }
                    s.particles.push({ type: 'muzzle', x: s.boss.x, y: s.boss.y + 40, life: 0.1 });
                }
                
                if (s.boss.attackTimer <= 0) {
                    s.boss.state = 'idle';
                    s.boss.attackTimer = (1.0 + Math.random()) * (1.0 - bossBrokenness*0.5);
                }
            } else if (s.boss.state === 'telegraph') {
                // Stay still and vibrate
                s.boss.x += (Math.random() - 0.5) * 4;
                s.boss.y += (Math.random() - 0.5) * 4;
                
                if (s.boss.attackTimer <= 0) {
                    s.boss.state = 'idle';
                    s.boss.attackTimer = 0.8;
                }
            } else if (s.boss.state === 'dash_prep') {
                // Pull back windup
                s.boss.y += s.boss.dashVelY;
                s.boss.dashVelY *= 0.9;
                
                // Shake
                s.boss.x += (Math.random() - 0.5) * 10;
                
                // Suck in particles
                if (Math.random() < 0.8) { // Increased spawn rate
                    for (let i = 0; i < 3; i++) {
                        const ang = Math.random() * Math.PI * 2;
                        const dist = 150 + Math.random() * 50;
                        s.particles.push({
                             type: 'windup',
                             x: s.boss.x + Math.cos(ang) * dist,
                             y: s.boss.y + Math.sin(ang) * dist,
                             vx: -Math.cos(ang) * 12,
                             vy: -Math.sin(ang) * 12,
                             life: 0.8,
                             color: i % 2 === 0 ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                        });
                    }
                }

                if (s.boss.attackTimer <= 0) {
                    s.boss.state = 'dash';
                    s.boss.dashVelY = 20; // explosive dash speed
                    playDash();
                }
            } else if (s.boss.state === 'dash') {
                s.boss.y += s.boss.dashVelY * dt * 60;
                
                // Trails
                s.particles.push({ 
                    type: 'trail',
                    x: s.boss.x + (Math.random()-0.5)*40, 
                    y: s.boss.y - 40, 
                    vx: 0, 
                    vy: -5, 
                    life: 0.5, 
                    color: 'rgba(255, 0, 0, 0.5)' 
                });

                if (s.boss.y > 700) {
                    s.boss.state = 'dash_return';
                    s.boss.y = -100;
                    s.boss.x = 400; // Reset center for return
                    
                    // Flash and big particle explosion at the bottom
                    s.particles.push({ type: 'flash', life: 0.5 });
                    for(let i=0; i<30; i++) {
                        s.particles.push({
                            type: 'normal',
                            x: s.boss.x + (Math.random()-0.5) * 200,
                            y: 600,
                            vx: (Math.random()-0.5)*20,
                            vy: -Math.random()*15,
                            life: 1.0,
                            color: Math.random() > 0.5 ? 'red' : 'yellow'
                        });
                    }
                }
            } else if (s.boss.state === 'dash_return') {
                s.boss.y += (100 - s.boss.y) * 0.05;
                if (s.boss.y > 90) {
                    s.boss.state = 'idle';
                    s.boss.attackTimer = 1.0;
                }
            }

            // Update Telegraphs
            for (let i = s.telegraphs.length - 1; i >= 0; i--) {
                const tg = s.telegraphs[i];
                if (!tg.active && tg.delay > 0) {
                    tg.delay -= dt;
                    if (tg.delay <= 0) {
                        tg.active = true;
                        tg.delay = 0.5; // Hit duration
                    }
                } else if (tg.active) {
                    tg.delay -= dt;
                    if (tg.delay <= 0) {
                        s.telegraphs.splice(i, 1);
                        s.boss.state = 'idle';
                    }
                }
            }

            // Update Bullets
            // Player bullets
            for (let i = s.playerBullets.length - 1; i >= 0; i--) {
                const b = s.playerBullets[i];
                b.x += b.vx;
                b.y += b.vy;
                if (b.y < -50 || b.y > 650 || b.x < -50 || b.x > 850) {
                    s.playerBullets.splice(i, 1);
                    continue;
                }
                // Hit boss
                if (b.x > s.boss.x - 40 && b.x < s.boss.x + 40 && b.y > s.boss.y - 50 && b.y < s.boss.y + 50) {
                    s.bossHp -= 1;
                    s.energy = Math.min(100, s.energy + 0.5);
                    s.playerBullets.splice(i, 1);
                    s.particles.push({ x: b.x, y: b.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 0.5, color: 'white' });
                }
            }

            // Boss bullets
            for (let i = s.bullets.length - 1; i >= 0; i--) {
                const b = s.bullets[i];
                b.x += b.vx;
                b.y += b.vy;
                if (b.y < -50 || b.y > 650 || b.x < -50 || b.x > 850) {
                    s.bullets.splice(i, 1);
                    continue;
                }
                
                // Hit player
                const dist = Math.hypot(b.x - s.player.x, b.y - s.player.y);
                if (dist < s.player.size + b.radius) {
                    if (!s.player.isShielding) {
                        s.hp -= 5;
                        s.energy = Math.min(100, s.energy + 5); // Gain energy on hit too
                    }
                    s.bullets.splice(i, 1);
                }
            }

            // Boss Dash hit check
            if (s.boss.state === 'dash') {
                if (Math.abs(s.player.x - s.boss.x) < 40 + s.player.size && Math.abs(s.player.y - s.boss.y) < 50 + s.player.size) {
                    if (!s.player.isShielding) s.hp -= 10;
                    s.boss.y += 50; // Push boss down past to avoid multi-hit
                }
            }

            // Telegraph hit check
            for (const tg of s.telegraphs) {
                if (tg.active) {
                    if (s.player.x > tg.x && s.player.x < tg.x + tg.width) {
                        if (!s.player.isShielding) s.hp -= 1; // DoT
                    }
                }
            }

            // Update particles
            for (let i = s.particles.length - 1; i >= 0; i--) {
                const p = s.particles[i];
                if (p.type !== 'flash') {
                    p.x += p.vx;
                    p.y += p.vy;
                }
                p.life -= dt;
                if (p.life <= 0) {
                    s.particles.splice(i, 1);
                }
            }

            // Update Items (Healing Flowers)
            s.itemSpawnTimer -= dt;
            if (s.itemSpawnTimer <= 0) {
                s.items.push({
                    x: Math.random() * 700 + 50,
                    y: -50,
                    radius: 15,
                    color: `hsl(${Math.random() * 360}, 80%, 65%)`
                });
                s.itemSpawnTimer = 4 + Math.random() * 6; // Spawn every 4-10s
            }

            for (let i = s.items.length - 1; i >= 0; i--) {
                const it = s.items[i];
                it.y += 2 + Math.sin(now / 500); // Slow oscillating drift
                it.x += Math.cos(now / 1000) * 0.5;
                
                // Magnetic pull and Collision with player
                const dist = Math.hypot(it.x - s.player.x, it.y - s.player.y);
                if (dist < 60) { // Magnetic radius
                    it.x += (s.player.x - it.x) * 0.08;
                    it.y += (s.player.y - it.y) * 0.08;
                }
                
                if (dist < s.player.size + it.radius + 15) { // Increased pickup radius
                    s.hp = Math.min(100, s.hp + 15);
                    s.items.splice(i, 1);
                    
                    // Healing sound
                    const actx = getCtx();
                    const osc = actx.createOscillator();
                    const gain = actx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, actx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(880, actx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.05, actx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.3);
                    osc.connect(gain);
                    gain.connect(actx.destination);
                    osc.start();
                    osc.stop(actx.currentTime + 0.3);
                    
                    // Healing particles
                    for(let j=0; j<12; j++){
                        s.particles.push({
                            type: 'normal',
                            x: it.x,
                            y: it.y,
                            vx: (Math.random()-0.5)*6,
                            vy: (Math.random()-0.5)*6,
                            life: 0.8,
                            color: it.color
                        });
                    }
                    continue;
                }

                if (it.y > 650) s.items.splice(i, 1);
            }

            setHp(s.hp);
            setBossHp(s.bossHp);
            setEnergy(s.energy);
            setShieldUses(s.player.shieldUses);

            if (!s.cinematic) {
                if (s.hp <= 0) {
                    s.cinematic = 'lose';
                    s.cinematicTimer = 2.5; // Longer for the "charge" drama
                    s.boss.state = 'final_charge';
                    // Stop bullets for focus
                    s.bullets = [];

                    // Echoing horror jump scare sound
                    const actx = getCtx();
                    
                    // Master compressor and delay network for massive reverb/echo
                    const delay = actx.createDelay();
                    delay.delayTime.value = 0.15;
                    const feedback = actx.createGain();
                    feedback.gain.value = 0.7; // Echo tail
                    const compressor = actx.createDynamicsCompressor();
                    
                    delay.connect(feedback);
                    feedback.connect(delay);
                    delay.connect(compressor);
                    
                    const masterGain = actx.createGain();
                    compressor.connect(masterGain);
                    masterGain.connect(actx.destination);
                    masterGain.gain.setValueAtTime(0.8, actx.currentTime);

                    const osc1 = actx.createOscillator();
                    const osc2 = actx.createOscillator();
                    const lfo = actx.createOscillator();
                    const oscGain = actx.createGain();
                    const lfoGain = actx.createGain();
                    
                    osc1.type = 'sawtooth';
                    osc1.frequency.setValueAtTime(80, actx.currentTime);
                    osc1.frequency.exponentialRampToValueAtTime(1, actx.currentTime + 3.0);
                    
                    osc2.type = 'square';
                    osc2.frequency.setValueAtTime(180, actx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(5, actx.currentTime + 3.0);
                    
                    lfo.type = 'sine';
                    lfo.frequency.value = 30;
                    lfoGain.gain.value = 100;
                    lfo.connect(lfoGain);
                    lfoGain.connect(osc1.frequency);
                    lfoGain.connect(osc2.frequency);

                    oscGain.gain.setValueAtTime(0, actx.currentTime);
                    oscGain.gain.linearRampToValueAtTime(1.0, actx.currentTime + 0.1);
                    oscGain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 3.0);
                    
                    osc1.connect(oscGain);
                    osc2.connect(oscGain);
                    
                    // Route to both dry and wet (delay) 
                    oscGain.connect(compressor);
                    oscGain.connect(delay);
                    
                    osc1.start();
                    osc2.start();
                    lfo.start();
                    osc1.stop(actx.currentTime + 3.0);
                    osc2.stop(actx.currentTime + 3.0);
                    lfo.stop(actx.currentTime + 3.0);

                } else if (s.bossHp <= 0) {
                    s.cinematic = 'win';
                    s.cinematicTimer = 3.0; // Explosion duration
                    s.boss.state = 'disintegrate';
                    s.bullets = [];

                    // Boss explode sound (Divine/Shatter + delay)
                    const actx = getCtx();
                    const masterGain = actx.createGain();
                    
                    const delay = actx.createDelay();
                    delay.delayTime.value = 0.2;
                    const feedback = actx.createGain();
                    feedback.gain.value = 0.5;
                    delay.connect(feedback);
                    feedback.connect(delay);
                    delay.connect(masterGain);

                    masterGain.connect(actx.destination);
                    masterGain.gain.value = 0.7;

                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => {
                            const osc = actx.createOscillator();
                            const gain = actx.createGain();
                            osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
                            
                            const freqBase = 100 + (Math.random() * 400);
                            osc.frequency.setValueAtTime(freqBase * 2, actx.currentTime);
                            osc.frequency.exponentialRampToValueAtTime(10, actx.currentTime + 1.2);
                            
                            gain.gain.setValueAtTime(0.8, actx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 1.2);
                            
                            osc.connect(gain);
                            gain.connect(masterGain);
                            gain.connect(delay); // Send to reverb/delay
                            
                            osc.start();
                            osc.stop(actx.currentTime + 1.2);
                        }, i * 200 + (Math.random() * 100)); // Staggered explosions
                    }
                    
                    // Add a deep sub-bass boom
                    const subOsc = actx.createOscillator();
                    const subGain = actx.createGain();
                    subOsc.type = 'sine';
                    subOsc.frequency.setValueAtTime(150, actx.currentTime);
                    subOsc.frequency.exponentialRampToValueAtTime(10, actx.currentTime + 3.0);
                    subGain.gain.setValueAtTime(1.0, actx.currentTime);
                    subGain.gain.linearRampToValueAtTime(0, actx.currentTime + 3.0);
                    subOsc.connect(subGain);
                    subGain.connect(masterGain);
                    subOsc.start();
                    subOsc.stop(actx.currentTime + 3.0);
                }
            }

            if (s.cinematic) {
                s.cinematicTimer -= dt;
                if (s.cinematicTimer <= 0) {
                    s.gameOver = true;
                    if (s.cinematic === 'win') onWin();
                    else onLose();
                }

                // Disintegrate effect (Victory)
                if (s.cinematic === 'win') {
                    // Lots of tiny glowing particles flying outwards
                    for(let i=0; i<8; i++) {
                        s.particles.push({
                            type: 'normal',
                            x: s.boss.x + (Math.random()-0.5)*150,
                            y: s.boss.y + (Math.random()-0.5)*150,
                            vx: (Math.random()-0.5)*40,
                            vy: (Math.random()-0.5)*40 - 20, // drift up
                            life: 2.0,
                            color: Math.random() > 0.5 ? '#ffffff' : '#ffeeaa'
                        });
                    }
                    // Streaking divine light rays
                    if (Math.random() < 0.4) {
                        s.particles.push({
                            type: 'dash', // reuse dash particle style
                            x: s.boss.x + (Math.random()-0.5)*200,
                            y: s.boss.y + (Math.random()-0.5)*200,
                            vx: 0,
                            vy: -50 - Math.random()*50,
                            life: 1.0,
                            color: 'rgba(255, 255, 200, 0.8)'
                        });
                    }
                    if (Math.random() < 0.3) {
                         s.particles.push({ type: 'flash', life: 0.3 }); // frequent big flashes
                    }
                }

                // Charge effect (Loss)
                if (s.cinematic === 'lose') {
                   // Move boss to look like it's eating the camera
                   s.boss.x += (s.player.x - s.boss.x) * 0.1;
                   s.boss.y += (s.player.y - s.boss.y) * 0.1;
                   
                   const progress = 1.0 - (s.cinematicTimer / 2.5);
                   if (Math.random() < progress) {
                        // Glitchy horror particles
                        for(let i=0; i<Math.floor(progress * 5); i++) {
                            s.particles.push({
                                type: 'normal',
                                x: s.boss.x + (Math.random()-0.5)*800,
                                y: s.boss.y + (Math.random()-0.5)*600,
                                vx: (Math.random()-0.5)*500,
                                vy: (Math.random()-0.5)*500,
                                life: 0.1 + Math.random()*0.2,
                                color: Math.random() > 0.3 ? 'rgba(255,0,0,0.8)' : 'black'
                            });
                        }
                   }
                }
            }

            draw(ctx, s);

            reqId = requestAnimationFrame(update);
        };

        const draw = (ctx: CanvasRenderingContext2D, s: typeof state.current) => {
            const now = performance.now();

            const hpRatioBoss = Math.max(0, s.bossHp / 1000);
            const bossBrokenness = 1.0 - hpRatioBoss;

            // Set canvas fonts and styles up front
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            // Helper for rough scribbles
            const drawScribbles = (x: number, y: number, radius: number, count: number, style: string) => {
                ctx.save();
                ctx.strokeStyle = style;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    const ang = Math.random() * Math.PI * 2;
                    const r = Math.random() * radius;
                    if (i === 0) ctx.moveTo(x + Math.cos(ang)*r, y + Math.sin(ang)*r);
                    else ctx.lineTo(x + Math.cos(ang)*r, y + Math.sin(ang)*r);
                }
                ctx.stroke();
                ctx.restore();
            };

            // Background - Sickly, corrupted honey -> transitioning to nightmare blood
            const bgR = Math.floor(20 + bossBrokenness * 80);
            const bgG = Math.floor(10 - bossBrokenness * 10);
            const bgB = 0;
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`; // Dark brown/amber -> dark meat
            ctx.fillRect(0, 0, 800, 600);
            
            // Collage-like textured background layer 1
            ctx.globalCompositeOperation = 'source-over';
            for (let i = 0; i < 5 + bossBrokenness * 5; i++) {
                const color1 = `rgba(${50 + bossBrokenness*150}, 20, 0, ${0.4 + bossBrokenness*0.3})`;
                const color2 = `rgba(${255 - bossBrokenness*100}, ${180 - bossBrokenness*180}, 0, 0.05)`;
                ctx.fillStyle = i % 2 === 0 ? color1 : color2;
                ctx.beginPath();
                ctx.moveTo(Math.sin(now/1000 + i) * 200 + 400, Math.cos(now/800 + i) * 200 + 300);
                ctx.lineTo(Math.cos(now/1200 - i) * 300 + 400, Math.sin(now/1500 + i) * 300 + 300);
                ctx.lineTo(Math.sin(now/900 + i*2) * 400 + 400, Math.cos(now/1100 - i*2) * 300 + 300);
                ctx.fill();
            }

            // Strange scribbles in background
            ctx.strokeStyle = `rgba(255, ${200 - bossBrokenness*150}, ${100 - bossBrokenness*100}, ${0.05 + bossBrokenness*0.1})`;
            ctx.lineWidth = 1 + bossBrokenness * 3;
            ctx.beginPath();
            for (let i = 0; i < 40 + bossBrokenness * 40; i++) {
                ctx.lineTo(Math.sin(i * 1.5 + now / 2500) * 800 + (Math.random()-0.5)*bossBrokenness*50, Math.cos(i * 2.1 + now / 2700) * 600 + (Math.random()-0.5)*bossBrokenness*50);
            }
            ctx.stroke();

            // Draw Telegraphs
            for (const tg of s.telegraphs) {
                if (tg.active) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                    ctx.fillRect(tg.x, tg.y, tg.width, tg.height);
                    
                    // Add harsh scrabble lines
                    for(let i=0; i<20; i++) {
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.lineWidth = Math.random() * 5 + 1;
                        ctx.beginPath();
                        ctx.moveTo(tg.x + Math.random()*tg.width, tg.y + Math.random()*tg.height);
                        ctx.lineTo(tg.x + Math.random()*tg.width, tg.y + Math.random()*tg.height);
                        ctx.stroke();
                    }

                    // Bleeding edges
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
                    for(let i=0; i<5; i++) {
                        ctx.fillRect(tg.x - Math.random()*20, tg.y, tg.width + Math.random()*40, tg.height);
                    }
                } else {
                    const ratio = 1.0 - tg.delay / 1.0; // 0 to 1 as it approaches active
                    ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + ratio * 0.3})`;
                    ctx.fillRect(tg.x, tg.y, tg.width, tg.height);
                    
                    // Crosshatch texture for the warning area
                    ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + ratio * 0.5})`;
                    ctx.lineWidth = 1 + ratio * 2;
                    ctx.beginPath();
                    for(let x=tg.x; x<tg.x+tg.width; x+=10) {
                        ctx.moveTo(x, tg.y);
                        // Make zigzag pattern
                        const steps = 10;
                        for(let st=1; st<=steps; st++) {
                            const yy = tg.y + (tg.height / steps) * st;
                            const xx = x - (tg.height / steps) * st + (Math.random()-0.5) * 10 * ratio; // increasing glitch
                            ctx.lineTo(xx, yy);
                        }
                    }
                    ctx.stroke();

                    // Glitchy exclamation that scales up
                    ctx.fillStyle = `rgba(255, 255, 0, ${Math.random() > 0.1 ? 0.8 : 0.2})`;
                    ctx.font = `bold ${30 + ratio*20}px sans-serif`;
                    // Draw slightly offset to track player's y level
                    const yText = s.player.y;
                    ctx.fillText('!', tg.x + tg.width/2 - 10, yText);
                    ctx.fillText('!', tg.x + tg.width/2 - 10 + (Math.random()-0.5)*(5 + ratio*15), yText + (Math.random()-0.5)*(5 + ratio*15));
                }
            }

            // Draw Boss
            ctx.save();
            ctx.translate(s.boss.x, s.boss.y);
            
            if (s.cinematic === 'win') {
                const progress = 1.0 - (s.cinematicTimer / 3.0);
                
                // Extremely bright glowing shaking
                const shake = Math.pow(progress, 2) * 20;
                ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
                
                // Exploding light beams from behind boss
                ctx.save();
                for (let i=0; i<12; i++) {
                     const a = (i/12) * Math.PI*2 + now/(200 - progress*150);
                     ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
                     ctx.beginPath();
                     ctx.moveTo(0,0);
                     ctx.lineTo(Math.cos(a - 0.1)*1000, Math.sin(a - 0.1)*1000);
                     ctx.lineTo(Math.cos(a + 0.1)*1000, Math.sin(a + 0.1)*1000);
                     ctx.fill();
                }
                ctx.restore();

                ctx.globalAlpha = 1.0 - Math.pow(progress, 2);
                ctx.globalCompositeOperation = 'hard-light'; // Gives a blown-out look as it fades
            } else if (s.cinematic === 'lose') {
                const progress = 1.0 - (s.cinematicTimer / 2.5);
                const zoomScale = 1 + Math.pow(progress, 3) * 50; // Massive outer zoom
                
                // Erratic shake effect
                const shakeIntensity = Math.pow(progress, 2) * 20; // Reduced from 50
                ctx.translate(
                    (Math.random() - 0.5) * shakeIntensity,
                    (Math.random() - 0.5) * shakeIntensity
                );
                
                // Center scaling relative to the boss
                ctx.scale(zoomScale, zoomScale);
                
                if (progress > 0.8) {
                    // Handled later via full-screen overlay, but we can do extra effects here if we want
                }
            }
            
            if (s.boss.state === 'dash_prep') {
                ctx.rotate(Math.sin(now/20) * 0.1);
                
                // Terrifying red/black radiating aura behind boss
                ctx.save();
                const pulse = Math.abs(Math.sin(now / 50));
                ctx.globalAlpha = 0.5 + pulse * 0.5;
                ctx.shadowColor = 'red';
                ctx.shadowBlur = 40 + pulse * 40;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.beginPath();
                ctx.arc(0, 0, 150 + pulse * 50, 0, Math.PI * 2);
                ctx.fill();

                // Spiky energy ring
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 4 + pulse * 4;
                ctx.beginPath();
                for (let i = 0; i < 30; i++) {
                    const ang = (i / 30) * Math.PI * 2 + (now / 100);
                    const r = 120 + Math.random() * 80 * pulse;
                    if (i === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
                    else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
            
            // --- GEKIDAN INU CURRY WINGS ---
            // Draw multiple layered, strange, long eye-wings
            const drawEyeWing = (scaleX: number, angleOffset: number, phase: number, color1: string, color2: string, brokenness: number) => {
                ctx.save();
                
                let currentAngleOffset = angleOffset;
                let flapAnim = Math.sin(now/200 + phase) * 0.1;
                
                if (s.boss.state === 'dash_prep') {
                    flapAnim = Math.sin(now/30 + phase) * 0.3; // frantic flapping
                } else if (s.boss.state === 'dash') {
                    currentAngleOffset += 1.0; // fold back wings during dash
                    flapAnim = 0;
                } else if (s.boss.state === 'shoot') {
                    flapAnim = Math.sin(now/50 + phase) * 0.2; // faster flap while shooting
                }

                if (brokenness > 0) {
                     flapAnim += Math.sin(now/(20 + brokenness*10) + phase*2) * 0.05 * brokenness; // jitter
                     currentAngleOffset += brokenness * (Math.random() * 0.1 - 0.05);
                }

                ctx.rotate(currentAngleOffset + flapAnim);
                ctx.scale(scaleX, 1);
                
                // Collage Drop Shadow
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 5 * scaleX;
                ctx.shadowOffsetY = 10;

                // Wing Base (Sclera cutout)
                ctx.fillStyle = s.boss.state === 'dash_prep' ? '#ffdddd' : '#fdfbf7'; // red flush when winding up
                if (brokenness > 0.5) ctx.fillStyle = '#eedddd';
                if (brokenness > 0.8) ctx.fillStyle = '#bb9999';

                ctx.strokeStyle = '#220000';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                
                // Add jagged edges to simulate torn paper
                ctx.lineTo(20, -15);
                ctx.lineTo(40, -40 + brokenness * 20); // degenerate
                // Wiggle points slightly for organic/stop-motion feel
                const wiggle = Math.sin(now/100 + phase) * (2 + brokenness * 5);
                ctx.lineTo(60, -25 + wiggle);
                ctx.lineTo(90, -30 - wiggle - brokenness * 15);
                ctx.lineTo(120, -10 + wiggle);
                ctx.lineTo(150, 20);
                
                if (brokenness > 0.7 && Math.sin(now/200 + phase) > 0) {
                     // Sometimes glitch out a huge hole
                     ctx.lineTo(110, 10);
                }

                ctx.lineTo(130, 25 - wiggle);
                ctx.lineTo(100, 30 + wiggle);
                ctx.lineTo(60, 45);
                ctx.lineTo(40, 20);
                ctx.lineTo(20, 15);
                ctx.closePath();
                ctx.fill();
                
                // Clear shadow for inner details
                ctx.shadowColor = 'transparent';
                ctx.stroke();

                // Abstract veins/textures/scribbles
                ctx.strokeStyle = `rgba(200,30,30,${0.6 + brokenness*0.4})`;
                ctx.beginPath();
                for(let i=0; i<5 + brokenness*5; i++) {
                   ctx.moveTo(20 + i*15, -10 + (Math.random()-0.5)*10);
                   ctx.lineTo(100, 5 + i*2 + (Math.random()-0.5)*10*brokenness);
                }
                ctx.stroke();

                drawScribbles(75, 0, 30, 15, `rgba(0,0,0,${0.8 + brokenness*0.2})`);

                if (brokenness < 0.9) {
                    // Iris (drawn like a layered cutout)
                    ctx.fillStyle = color1;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.ellipse(75, Math.sin(now/100)*brokenness*5, 18 - brokenness*5, 28, Math.sin(now/500)*0.2 + brokenness*Math.random()*0.2, 0, Math.PI*2);
                    ctx.fill();
                    ctx.stroke();

                    // Pupil
                    ctx.fillStyle = color2;
                    ctx.beginPath();
                    // Star/cross pupil
                    let focus = s.boss.state === 'dash_prep' ? 1.5 : 1; // pupil dilates
                    ctx.scale(focus, focus);
                    ctx.moveTo(75/focus, -20); ctx.lineTo(77/focus, -5); ctx.lineTo(90/focus, 0);
                    ctx.lineTo(77/focus, 5); ctx.lineTo(75/focus, 20); ctx.lineTo(73/focus, 5);
                    ctx.lineTo(60/focus, 0); ctx.lineTo(73/focus, -5); ctx.closePath();
                    ctx.fill();
                } else {
                     // Dead eye socket
                     ctx.fillStyle = '#110000';
                     ctx.beginPath();
                     ctx.ellipse(75, 0, 15, 20, 0, 0, Math.PI*2);
                     ctx.fill();
                     drawScribbles(75, 0, 20, 25, 'rgba(200,0,0,0.8)');
                }
                
                ctx.restore();
            };

            const hpRatio = Math.max(0, s.bossHp / 1000);
            const brokenness = 1.0 - hpRatio;

            // Left Wings
            drawEyeWing(-1, -0.2, 0, '#ff0055', '#ffff00', brokenness);
            drawEyeWing(-0.8, -0.6, 1, '#00ffff', '#ff0000', brokenness);
            drawEyeWing(-0.9, 0.2, 2, '#ffcc00', '#000000', brokenness > 0.4 ? brokenness : 0);

            // Right Wings
            drawEyeWing(1, 0.2, 0, '#ff0055', '#ffff00', brokenness);
            drawEyeWing(0.8, 0.6, 1, '#00ffff', '#ff0000', brokenness);
            drawEyeWing(0.9, -0.2, 2, '#ffcc00', '#000000', brokenness > 0.4 ? brokenness : 0);

            // Strange Halos/Scrapbook gears behind head
            ctx.save();
            ctx.rotate(now/1000);
            ctx.strokeStyle = '#777';
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.arc(0, -10, 60, 0, Math.PI*2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // --- GIANT GROTESQUE EYE HEAD ---
            // Scaled and breathing
            const breath = Math.sin(now/400) * 0.05;
            let finalScale = 1 + breath;
            
            ctx.scale(finalScale, finalScale);
            ctx.save();

            // Head Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 15;

            // Eyeball Base (Torn paper circle)
            ctx.fillStyle = brokenness > 0.6 ? '#eecbcb' : '#fdf8f5'; // get bloodier
            if (brokenness > 0.8) ctx.fillStyle = '#cc8888';
            ctx.strokeStyle = '#331111';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            const isLosing = s.cinematic === 'lose';
            
            for(let i=0; i<20 + brokenness*10; i++) {
                const a = (i/(20 + brokenness*10)) * Math.PI*2;
                let r = 45;
                if (!isLosing) {
                    r += Math.random()*4;
                    if (brokenness > 0) {
                         r += (Math.random() - 0.5) * 15 * brokenness; // jagged edge
                    }
                } else {
                    // Smooth, intense stare outline
                    r = 48 + Math.sin(a * 5 + now/300) * 2;
                }
                if(i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
                else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
            }
            ctx.closePath();
            ctx.fill();
            ctx.shadowColor = 'transparent'; // Remove shadow for rest
            ctx.stroke();
            ctx.restore();

            // Sclera Veins (Red pulsating roots)
            ctx.strokeStyle = `rgba(200, 20, 20, ${0.6 + brokenness*0.4})`;
            ctx.lineWidth = 1.5 + brokenness * 2;
            for (let i = 0; i < 12 + brokenness * 10; i++) {
                ctx.beginPath();
                const a = (i / (12 + brokenness * 10)) * Math.PI*2 + now/(2000 - brokenness*1000);
                let startR = 40;
                if (!isLosing) {
                    startR += Math.random()*5*brokenness;
                } else {
                    startR += 5; // Intense dilated look
                }
                ctx.moveTo(Math.cos(a)*startR, Math.sin(a)*startR);
                ctx.quadraticCurveTo(
                    Math.cos(a + 0.2)*(25 - brokenness*10), Math.sin(a + 0.2)*(25 - brokenness*10),
                    Math.cos(a)*15, Math.sin(a)*15
                );
                ctx.stroke();
            }

            // Iris (multicolored, spinning slightly)
            const trackAngle = Math.atan2(s.player.y - s.boss.y, s.player.x - s.boss.x);
            let eyeLookX = Math.cos(trackAngle) * 10;
            let eyeLookY = Math.sin(trackAngle) * 10;
            
            if (brokenness > 0.5 && !isLosing) {
                // twitchy eye
                eyeLookX += (Math.random() - 0.5) * 10 * brokenness;
                eyeLookY += (Math.random() - 0.5) * 10 * brokenness;
            } else if (isLosing) {
                // Stop twitching and stare out of the screen
                eyeLookX = 0;
                eyeLookY = 0;
            }

            const gradient = ctx.createRadialGradient(eyeLookX, eyeLookY, 5, eyeLookX, eyeLookY, 25);
            gradient.addColorStop(0, brokenness > 0.7 && !isLosing ? '#ff0000' : '#55ffaa');
            gradient.addColorStop(0.5, brokenness > 0.8 && !isLosing ? '#550000' : '#0088cc');
            gradient.addColorStop(1, '#001133');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(eyeLookX, eyeLookY, 25 - brokenness*5, 25 - brokenness*5, 0, 0, Math.PI*2);
            ctx.fill();

            // Pupil tracking player / Staring at user
            ctx.fillStyle = '#000';
            ctx.beginPath();
            if (isLosing) {
                // Pupils dilate perfectly round staring out
                const dilate = 6 + Math.sin(now/50)*2;
                ctx.ellipse(eyeLookX, eyeLookY, dilate, dilate, 0, 0, Math.PI*2);
            } else {
                ctx.ellipse(eyeLookX, eyeLookY, 4 + brokenness*5, 18 - brokenness*5, trackAngle + Math.PI/2 + (Math.random()-0.5)*brokenness, 0, Math.PI*2);
            }
            ctx.fill();
            
            // Multiple erratic pupils at high brokenness
            if (brokenness > 0.6 && !isLosing) {
                for(let i=0; i<3; i++) {
                     ctx.beginPath();
                     ctx.ellipse(
                         eyeLookX + (Math.random()-0.5)*20, 
                         eyeLookY + (Math.random()-0.5)*20, 
                         2 + Math.random()*3, 
                         10 + Math.random()*5, 
                         Math.random()*Math.PI*2, 0, Math.PI*2
                     );
                     ctx.fill();
                }
            }
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath();
            ctx.ellipse(eyeLookX - 8, eyeLookY - 8, 5, 8, trackAngle + Math.PI/4, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath();
            ctx.ellipse(eyeLookX + 8, eyeLookY + 8, 2, 3, trackAngle, 0, Math.PI*2);
            ctx.fill();

            drawScribbles(0, 0, 40, 25, `rgba(0,0,0,${0.3 + brokenness * 0.4})`);
            
            // Extra dripping blood holes
            if (brokenness > 0.4) {
                 for (let i = 0; i < 3 + brokenness*5; i++) {
                      ctx.fillStyle = 'rgba(100, 0, 0, 0.8)';
                      ctx.beginPath();
                      const bx = (Math.random() - 0.5) * 60;
                      const by = (Math.random() - 0.5) * 60;
                      ctx.arc(bx, by, Math.random()*8 + 2, 0, Math.PI*2);
                      ctx.fill();
                      
                      // Drip
                      ctx.beginPath();
                      ctx.moveTo(bx - 2, by);
                      ctx.quadraticCurveTo(bx, by + 20 + Math.random()*40*brokenness, bx + 2, by);
                      ctx.fill();
                 }
            }

            ctx.restore();

            // Draw Player Bullets
            ctx.fillStyle = '#ffcc00';
            for (const b of s.playerBullets) {
                ctx.fillRect(b.x - b.width/2, b.y - b.height/2, b.width, b.height);
            }

            // Draw Boss Bullets (scissors and abstract shapes)
            for (let i = 0; i < s.bullets.length; i++) {
                const b = s.bullets[i];
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(Math.atan2(b.vy, b.vx)); // Point in direction of velocity
                
                if (bossBrokenness > 0.6 && i % 3 === 0) {
                     // Draw corrupted jagged blood spike
                     ctx.fillStyle = '#660000';
                     ctx.strokeStyle = '#ff0000';
                     ctx.lineWidth = 1.5;
                     ctx.beginPath();
                     ctx.moveTo(15 + Math.random()*5, 0);
                     ctx.lineTo(-5, -8 - Math.random()*5);
                     ctx.lineTo(-8, 0);
                     ctx.lineTo(-5, 8 + Math.random()*5);
                     ctx.closePath();
                     ctx.fill();
                     ctx.stroke();
                     
                     // Trail dot
                     ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                     ctx.beginPath(); ctx.arc(-15, 0, 2, 0, Math.PI*2); ctx.fill();
                } else {
                     // Normal scissor
                     ctx.fillStyle = '#dd0033';
                     ctx.strokeStyle = '#000';
                     ctx.lineWidth = 1;
                     ctx.beginPath();
                     ctx.moveTo(10 + bossBrokenness*5, 0);
                     ctx.lineTo(-5, -5 - bossBrokenness*2);
                     ctx.lineTo(-10, 0);
                     ctx.lineTo(-5, 5 + bossBrokenness*2);
                     ctx.closePath();
                     ctx.fill();
                     ctx.stroke();

                     // Eye in the middle of bullet
                     ctx.fillStyle = bossBrokenness > 0.8 ? '#ffaaaa' : '#fff';
                     ctx.beginPath(); ctx.arc(0, 0, 3 + bossBrokenness, 0, Math.PI*2); ctx.fill();
                     ctx.fillStyle = '#000';
                     ctx.beginPath(); ctx.arc(0, 0, 1.5 + bossBrokenness, 0, Math.PI*2); ctx.fill();
                }
                ctx.restore();
            }

            // Draw Items (Flowers)
            s.items.forEach(it => {
                ctx.save();
                ctx.translate(it.x, it.y);
                ctx.rotate(now / 800);
                
                // Petals
                ctx.fillStyle = it.color;
                const petalCount = 6;
                for (let i = 0; i < petalCount; i++) {
                    ctx.rotate((Math.PI * 2) / petalCount);
                    ctx.beginPath();
                    // Each petal is an ellipse
                    ctx.ellipse(it.radius * 0.7, 0, it.radius * 0.7, it.radius * 0.4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Petal outline
                    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                // Center
                ctx.fillStyle = '#fff380';
                ctx.beginPath();
                ctx.arc(0, 0, it.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.stroke();
                
                ctx.restore();
            });

            // Draw Player
            ctx.save();
            ctx.translate(s.player.x, s.player.y);
            
            if (s.player.isShielding) {
                ctx.fillStyle = 'rgba(0, 200, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(0, 0, 22, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Add some shield energy ring effect
                ctx.beginPath();
                ctx.arc(0, 0, 22 - (Math.random()*2), 0, Math.PI * 2);
                ctx.stroke();
            }

            // Citrus Head Base Render (Separated from Hitbox Size)
            const renderSize = 12;
            ctx.fillStyle = '#ffb300';
            ctx.beginPath();
            ctx.arc(0, 0, renderSize, 0, Math.PI * 2);
            ctx.fill();
            // Leaf
            ctx.fillStyle = '#4caf50';
            ctx.beginPath();
            ctx.moveTo(0, -renderSize);
            ctx.quadraticCurveTo(-10, -renderSize - 10, -5, -renderSize - 5);
            ctx.fill();

            // Draw pure hitbox core so player knows where the actual danger is
            if (s.player.isShielding) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(0, 0, s.player.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // Draw Particles
            for (const p of s.particles) {
                if (p.type === 'flash') {
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                    ctx.fillRect(0, 0, 800, 600);
                } else if (p.type === 'muzzle') {
                    ctx.fillStyle = `rgba(255, 255, 100, ${p.life * 10})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.life * 40, 0, Math.PI*2);
                    ctx.fill();
                } else if (p.type === 'trail') {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life * 3;
                    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
                    ctx.globalAlpha = 1.0;
                } else {
                    ctx.fillStyle = p.color || 'white';
                    ctx.globalAlpha = p.life * 2;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2 + p.life*2, 0, Math.PI*2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                }
            }
            
            // Blackout at the end of loss cinematic
            if (s.cinematic === 'lose') {
                const progress = 1.0 - (s.cinematicTimer / 2.5);
                
                // Blood vignette creeping in
                const r0 = Math.max(0, 400 - progress*400);
                const r1 = Math.max(0, 600 - progress*200);
                const grad = ctx.createRadialGradient(400, 300, r0, 400, 300, r1);
                grad.addColorStop(0, 'rgba(100, 0, 0, 0)');
                grad.addColorStop(1, `rgba(150, 0, 0, ${progress})`);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 800, 600);

                // Intense inverted glitching
                if (progress > 0.6) {
                     if (Math.random() < progress*0.5) {
                          ctx.globalCompositeOperation = 'difference';
                          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                          ctx.fillRect(0, 0, 800, 600);
                          ctx.globalCompositeOperation = 'source-over';
                     }
                }
                
                // Horror teeth/mouth closing over the screen
                if (progress > 0.4) {
                    ctx.fillStyle = 'black';
                    const mouthOpe = Math.max(0, 1.0 - (progress - 0.4) / 0.6); // 1.0 to 0.0
                    for(let i=-2; i<12; i++) {
                         // Top teeth
                         ctx.beginPath();
                         ctx.moveTo(i*80 + 40, 300 * (1 - mouthOpe) - 100);
                         ctx.lineTo(i*80 + 0, 0);
                         ctx.lineTo(i*80 + 80, 0);
                         ctx.fill();
                         
                         // Bottom teeth
                         ctx.beginPath();
                         ctx.moveTo(i*80 + 80, 300 + 300 * mouthOpe + 100);
                         ctx.lineTo(i*80 + 40, 600);
                         ctx.lineTo(i*80 + 120, 600);
                         ctx.fill();
                    }
                }

                if (progress > 0.8) {
                    const blackAlpha = (progress - 0.8) / 0.2;
                    ctx.fillStyle = `rgba(0, 0, 0, ${blackAlpha})`;
                    ctx.fillRect(0, 0, 800, 600);
                }
            }
        };

        reqId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(reqId);
    }, [onWin, onLose]);

    return (
        <div className="relative w-[800px] h-[600px] font-ui touch-none select-none">
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="absolute inset-0 block mix-blend-screen"
                style={{ filter: 'contrast(1.2) sepia(0.3) saturate(1.5)' }}
            />
            {/* HUD */}
            <div className="absolute top-4 left-4 text-orange-200 text-lg opacity-80 mix-blend-difference">
                <p>W/A/S/D: 移动</p>
                <p>Q: 攻击</p>
                <p>E: 护盾 ({shieldUses}/3) - 2秒无敌</p>
                <p>Space: 大招 (清屏 + 20% 伤害 | {Math.floor((energy / 100) * 100)}%)</p>
            </div>
            
            <div className="absolute bottom-4 left-4 w-64">
                <div className="text-orange-200 mb-1 opacity-80 mix-blend-difference font-bold">HP: {Math.max(0, Math.floor(hp))} / 100</div>
                <div className="w-full h-4 bg-gray-900 border border-orange-900 outline outline-1 outline-orange-600/50">
                    <div className="h-full bg-orange-500 shadow-[0_0_10px_#f97316]" style={{ width: `${Math.max(0, hp)}%` }}></div>
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 w-64 text-right">
                <div className="text-blue-200 mb-1 opacity-80 mix-blend-difference font-bold">能量: {Math.floor(energy)}%</div>
                <div className="w-full h-4 bg-gray-900 border border-blue-900 outline outline-1 outline-blue-600/50">
                    <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" style={{ width: `${energy}%` }}></div>
                </div>
                {energy >= 100 && <div className="text-yellow-300 font-bold animate-pulse mt-1 drop-shadow-md">SPACE: 大招就绪</div>}
            </div>
            
            {/* Boss HP */}
            <div className="absolute top-4 right-8 w-64 text-right">
                <div className="text-red-400 mb-1 font-cute text-2xl drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">MOTHER HP: {Math.floor(bossHp)}</div>
                <div className="w-full h-4 bg-gray-900 border border-red-900 outline outline-1 outline-red-600/50 skew-x-[-10deg]">
                    <div className="h-full bg-red-600 shadow-[0_0_10px_#dc2626] transition-all" style={{ width: `${Math.max(0, (bossHp/1000)*100)}%` }}></div>
                </div>
            </div>
        </div>
    );
};
