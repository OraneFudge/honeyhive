// Simple synth to avoid external assets

let audioCtx: AudioContext | null = null;

export const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export let currentBgmLevel = 0;
let bgmInterval: number | null = null;
let bgmStep = 0;
let bgmPlaying = false;

const bgmMelody = [
  // Phrase 1: Eerie music box in A minor (8 beats)
  [440.00, 0.4], [523.25, 0.4], [659.25, 0.8], 
  [622.25, 0.8], [659.25, 0.8], 
  [523.25, 0.4], [440.00, 0.4], [329.63, 0.8],

  // Phrase 2 (8 beats)
  [440.00, 0.4], [523.25, 0.4], [493.88, 0.8], 
  [523.25, 0.8], [440.00, 1.6],

  // Phrase 3: A rising variation (8 beats)
  [659.25, 0.4], [783.99, 0.4], [987.77, 0.8], 
  [932.33, 0.8], [987.77, 0.8], 
  [783.99, 0.4], [659.25, 0.4], [493.88, 0.8],

  // Phrase 4: Resolution (8 beats)
  [659.25, 0.4], [783.99, 0.4], [698.46, 0.8], 
  [659.25, 0.8], [440.00, 1.6],
];

export const setBgmCorruption = (level: number) => {
  currentBgmLevel = level;
};

export const startBGM = () => {
  if (bgmPlaying) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
      ctx.resume();
  }
  bgmPlaying = true;
  
  const playNextNote = () => {
    if (!bgmPlaying) return;
    const note = bgmMelody[bgmStep % bgmMelody.length];
    bgmStep++;

    let freq = note[0];
    const duration = note[1];
    
    // Corruption effects
    const corruptionLevel = currentBgmLevel;
    
    // Pitch shifts lower as corruption increases (up to 1 octave down)
    const pitchDrop = 1 - (corruptionLevel * 0.5); 
    freq *= pitchDrop;
    
    // Sometimes drop notes if corrupted
    const shouldPlay = Math.random() > (corruptionLevel * 0.5);
    
    // Slow down tempo as corruption increases (up to 3x slower)
    const slowDown = 1 + (corruptionLevel * 2);
    const actualDuration = duration * slowDown;

    if (shouldPlay) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Corrupt waveform
      osc.type = corruptionLevel > 0.7 ? 'sawtooth' : (corruptionLevel > 0.4 ? 'square' : 'triangle');
      
      // Detune based on corruption
      if (corruptionLevel > 0) {
          freq *= (1 + (Math.random() - 0.5) * corruptionLevel * 0.1); 
      }
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Very low volume for background music (much smaller than player move)
      let vol = 0.005; 
      if (corruptionLevel > 0.5) {
          vol += Math.random() * 0.01 * corruptionLevel; // Jittery volume
      }
      
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + actualDuration * (1 - corruptionLevel * 0.3));
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + actualDuration);
    }
    
    // Glitchy timing based on corruption
    const nextTime = (actualDuration * 1000) * (1 + (Math.random() - 0.5) * corruptionLevel * 0.3);
    bgmInterval = window.setTimeout(playNextNote, nextTime);
  };
  
  playNextNote();
};

export const stopBGM = () => {
  bgmPlaying = false;
  if (bgmInterval !== null) {
    clearTimeout(bgmInterval);
    bgmInterval = null;
  }
};

let bossBgmPlaying = false;
let bossBgmInterval: number | null = null;
let bossBgmStep = 0;

// Grotesque, fast-paced battle music
const bossMelody = [
    [100, 0.15], [80, 0.15], [120, 0.15], [80, 0.15],
    [100, 0.15], [150, 0.15], [120, 0.15], [180, 0.15],
    [90, 0.15], [75, 0.15], [110, 0.15], [75, 0.15],
    [90, 0.15], [140, 0.15], [110, 0.15], [160, 0.15],
    [50, 0.3], [60, 0.3], [70, 0.3], [80, 0.3],
    [200, 0.1], [300, 0.1], [150, 0.1], [250, 0.1],
    [50, 0.3], [40, 0.3], [30, 0.3], [20, 0.3]
];

export const startBossBGM = () => {
    if (bossBgmPlaying) return;
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    bossBgmPlaying = true;
    bossBgmStep = 0;

    const playNextNote = () => {
        if (!bossBgmPlaying) return;
        const note = bossMelody[bossBgmStep % bossMelody.length];
        bossBgmStep++;

        let freq = note[0];
        const duration = note[1];

        // Introduce some chaotic/grotesque shifting
        freq *= 1 + (Math.random() - 0.5) * 0.1;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Harsh waveforms for the battle feel
        osc.type = (bossBgmStep % 4 === 0) ? 'sawtooth' : 'square';
        
        // Add FM synthesis for grotesque metal sound (we approximate by rapid detune)
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

        const vol = 0.015; // Low volume, but noticeable
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);

        // Sub bass layer
        if (bossBgmStep % 2 === 0) {
            const sub = ctx.createOscillator();
            const subGain = ctx.createGain();
            sub.type = 'triangle';
            sub.frequency.setValueAtTime(freq / 2, ctx.currentTime);
            subGain.gain.setValueAtTime(0.02, ctx.currentTime);
            subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.8);
            sub.connect(subGain);
            subGain.connect(ctx.destination);
            sub.start(ctx.currentTime);
            sub.stop(ctx.currentTime + duration);
        }

        const nextTime = (duration * 1000); // 1000ms base
        bossBgmInterval = window.setTimeout(playNextNote, nextTime);
    }
    playNextNote();
};

export const stopBossBGM = () => {
    bossBgmPlaying = false;
    if (bossBgmInterval !== null) {
        clearTimeout(bossBgmInterval);
        bossBgmInterval = null;
    }
};

export const playSound = (type: 'move' | 'select' | 'error' | 'bee' | 'horror' | 'typewriter' | 'execution', corruptionLevel: number = 0) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const now = ctx.currentTime;

  // Add distortion node if corruption is high
  let finalNode: AudioNode = gain;
  if (corruptionLevel > 0.3) {
    const distortion = ctx.createWaveShaper();
    const amount = corruptionLevel * 50; // 0 to 50
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';
    gain.connect(distortion);
    finalNode = distortion;
  }

  finalNode.connect(ctx.destination);

  switch (type) {
    case 'execution': {
      // Heavy bass boom with distortion
      osc.type = 'square';
      osc.frequency.setValueAtTime(150 + corruptionLevel * 100, now); // Sharpness increases with corruption
      osc.frequency.exponentialRampToValueAtTime(10, now + 2.0); // Drops to sub bass
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 2.0);
      
      const execOsc2 = ctx.createOscillator();
      execOsc2.type = 'sawtooth';
      execOsc2.frequency.setValueAtTime(200 + corruptionLevel * 300, now); // Twisted and distorted high pitch
      execOsc2.frequency.exponentialRampToValueAtTime(20, now + 1.5);
      
      const lfoExec = ctx.createOscillator();
      const lfoGainExec = ctx.createGain();
      lfoExec.type = 'triangle';
      lfoExec.frequency.value = 8 + corruptionLevel * 25; // Flutter increases with corruption
      lfoGainExec.gain.value = 50 + corruptionLevel * 150;
      
      lfoExec.connect(lfoGainExec);
      lfoGainExec.connect(execOsc2.frequency);
      
      execOsc2.connect(gain);
      
      lfoExec.start(now);
      lfoExec.stop(now + 2.0);
      execOsc2.start(now);
      execOsc2.stop(now + 2.0);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 2.0);
      break;
    }

    case 'move': {
      // Base freq 300, drops to 100 with corruption
      const baseFreq = 300 - (corruptionLevel * 200);
      const endFreq = 100 - (corruptionLevel * 80);
      
      // Waveform changes from sine -> triangle -> sawtooth based on corruption
      osc.type = corruptionLevel > 0.7 ? 'sawtooth' : (corruptionLevel > 0.4 ? 'triangle' : 'sine');
      
      osc.frequency.setValueAtTime(baseFreq, now);
      
      // Add vibrato/tremolo if corruption is high
      if (corruptionLevel > 0.2) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.type = 'sine';
          lfo.frequency.value = 10 + corruptionLevel * 30; // Faster shaking
          lfoGain.gain.value = corruptionLevel * 50; // Wider frequency swing
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + 0.15 + corruptionLevel * 0.1);
      }

      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + 0.1);
      
      const vol = 0.1 + (corruptionLevel * 0.1); // Slightly louder when corrupted
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1 + (corruptionLevel * 0.1));
      
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.15 + (corruptionLevel * 0.1));
      break;
    }

    case 'select': {
      const baseFreq = 600 - (corruptionLevel * 400);
      const endFreq = 800 - (corruptionLevel * 600);
      
      osc.type = corruptionLevel > 0.5 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(Math.max(50, endFreq), now + 0.1);
      
      if (corruptionLevel > 0.4) {
          // Add a dissonant second oscillator
          const osc2 = ctx.createOscillator();
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(baseFreq * 0.85, now); // Detuned
          osc2.frequency.linearRampToValueAtTime(Math.max(40, endFreq * 0.85), now + 0.1);
          osc2.connect(gain);
          osc2.start(now);
          osc2.stop(now + 0.2 + (corruptionLevel * 0.2));
      }

      const vol = 0.1 + (corruptionLevel * 0.1);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2 + (corruptionLevel * 0.2));
      
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.2 + (corruptionLevel * 0.2));
      break;
    }

    case 'bee':
      osc.type = 'sawtooth';
      const freq = 150 + Math.random() * 50 - (corruptionLevel * 50);
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
      
    case 'typewriter':
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 - (corruptionLevel * 400), now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.03);
      break;

    case 'error':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100 - (corruptionLevel * 50), now);
      osc.frequency.linearRampToValueAtTime(50 - (corruptionLevel * 20), now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
      
    case 'horror':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 1.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      
      if (corruptionLevel > 0) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.type = 'sine';
          lfo.frequency.value = 5 + corruptionLevel * 20;
          lfoGain.gain.value = 20 + corruptionLevel * 50;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + 1.5);
      }
      
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 1.5);
      break;
  }
};
