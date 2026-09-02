// SoundManager.ts — Synthesized via Web Audio API (no external files)
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;

let currentBgmOscillators: OscillatorNode[] = [];
let currentBgmGain: GainNode | null = null;
let bgmFilter: BiquadFilterNode | null = null;

let masterVol = 1.0;
let musicVol = 0.3;
let sfxVol = 0.7;
let _isMuted = false;

function initAudio() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        masterGain = audioCtx.createGain();
        musicGain = audioCtx.createGain();
        sfxGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
        musicGain.connect(masterGain);
        sfxGain.connect(masterGain);
        updateVolumes();
        
        // Robustness against suspension
        const resumeAudio = () => {
          if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
        };
        window.addEventListener('click', resumeAudio, { once: true });
        window.addEventListener('keydown', resumeAudio, { once: true });
        window.addEventListener('touchstart', resumeAudio, { once: true });
      }
    } catch (e) {
      console.warn('Audio Context init failed', e);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {}); // handle silently if user hasn't interacted
  }
}

function updateVolumes() {
  if (!masterGain || !musicGain || !sfxGain) return;
  masterGain.gain.value = _isMuted ? 0 : masterVol;
  musicGain.gain.value = musicVol;
  sfxGain.gain.value = sfxVol;
}

interface SynthOptions {
  freq: number;
  type?: OscillatorType;
  types?: OscillatorType[];
  dur?: number;
  vol?: number;
  slideToFreq?: number;
  pitchMult?: number;
  pan?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  fmFreqMult?: number;
  fmAmount?: number;
}

function playSynth(opts: SynthOptions) {
  if (!audioCtx || !sfxGain || _isMuted) return;
  try {
    const dur = opts.dur || 0.1;
    const vol = opts.vol || 0.1;
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const panNode = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    if (opts.types && opts.types.length > 0) {
      osc.type = opts.types[0]; 
    } else {
      osc.type = opts.type || 'sine';
    }

    const freq = opts.freq * (opts.pitchMult || 1);
    osc.frequency.setValueAtTime(freq, t);
    
    if (opts.slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(opts.slideToFreq * (opts.pitchMult || 1), t + dur);
    }

    if (opts.fmFreqMult && opts.fmAmount) {
      const fmOsc = audioCtx.createOscillator();
      const fmGain = audioCtx.createGain();
      fmOsc.type = 'sine';
      fmOsc.frequency.value = freq * opts.fmFreqMult;
      fmGain.gain.value = opts.fmAmount;
      fmOsc.connect(fmGain);
      fmGain.connect(osc.frequency);
      fmOsc.start(t);
      fmOsc.stop(t + dur);
    }

    gain.gain.setValueAtTime(0, t);
    const a = opts.attack || 0.01;
    const d = opts.decay || 0.1;
    const s = opts.sustain || 0;
    const r = opts.release || 0.01;
    
    gain.gain.linearRampToValueAtTime(vol, t + a);
    if (s > 0) {
      gain.gain.exponentialRampToValueAtTime(vol * s, t + a + d);
      gain.gain.setValueAtTime(vol * s, t + dur - r);
      gain.gain.linearRampToValueAtTime(0, t + dur);
    } else {
      gain.gain.exponentialRampToValueAtTime(0.001, t + a + d);
    }

    osc.connect(gain);
    
    if (panNode && opts.pan !== undefined) {
      panNode.pan.value = Math.max(-1, Math.min(1, opts.pan));
      gain.connect(panNode);
      panNode.connect(sfxGain);
    } else {
      gain.connect(sfxGain);
    }

    osc.start(t);
    osc.stop(t + dur);
  } catch(e) {}
}

interface NoiseSynthOptions {
  dur?: number;
  vol?: number;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  pan?: number;
  attack?: number;
  release?: number;
}

function playNoiseSynth(opts: NoiseSynthOptions) {
  if (!audioCtx || !sfxGain || _isMuted) return;
  try {
    const dur = opts.dur || 0.1;
    const vol = opts.vol || 0.1;
    const t = audioCtx.currentTime;

    const bufferSize = audioCtx.sampleRate * dur;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = opts.filterType || 'lowpass';
    filter.frequency.value = opts.filterFreq || 1000;

    const gain = audioCtx.createGain();
    const panNode = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    gain.gain.setValueAtTime(0, t);
    const a = opts.attack || 0.02;
    const r = opts.release || 0.05;
    gain.gain.linearRampToValueAtTime(vol, t + a);
    gain.gain.setValueAtTime(vol, t + dur - r);
    gain.gain.linearRampToValueAtTime(0.001, t + dur);

    noiseSource.connect(filter);
    filter.connect(gain);
    
    if (panNode && opts.pan !== undefined) {
      panNode.pan.value = Math.max(-1, Math.min(1, opts.pan));
      gain.connect(panNode);
      panNode.connect(sfxGain);
    } else {
      gain.connect(sfxGain);
    }

    noiseSource.start(t);
  } catch(e) {}
}

export class SoundManager {
  // Volume controls
  static setMasterVolume(v: number) { masterVol = v; updateVolumes(); }
  static setSfxVolume(v: number) { sfxVol = v; updateVolumes(); }
  static setMusicVolume(v: number) { musicVol = v; updateVolumes(); }
  static get isMuted() { return _isMuted; }
  static setMute(m: boolean) { _isMuted = m; updateVolumes(); }
  static toggleMute(): boolean { _isMuted = !_isMuted; updateVolumes(); return _isMuted; }

  static init() { initAudio(); }

  // === SFX with combo / pitch shifting & spatial panning ===
  static click(combo: number = 1) { 
    playSynth({ freq: 600, type: 'sine', dur: 0.1, vol: 0.15, attack: 0.01, decay: 0.09, pitchMult: 1 + (combo - 1) * 0.05, fmFreqMult: 2, fmAmount: 100 }); 
  }
  static pop(combo: number = 1) { 
    playSynth({ freq: 400, type: 'sine', dur: 0.1, vol: 0.15, slideToFreq: 800, attack: 0.01, decay: 0.09, pitchMult: 1 + (combo - 1) * 0.05 }); 
  }
  static success(combo: number = 1) {
    const p = 1 + (combo - 1) * 0.1;
    playSynth({ freq: 440, type: 'sine', dur: 0.15, vol: 0.12, pitchMult: p });
    setTimeout(() => playSynth({ freq: 660, type: 'sine', dur: 0.2, vol: 0.14, pitchMult: p, fmFreqMult: 2, fmAmount: 200 }), 100);
    setTimeout(() => playSynth({ freq: 880, types: ['sine', 'triangle'], dur: 0.4, vol: 0.12, pitchMult: p, fmFreqMult: 3, fmAmount: 300 }), 200);
  }
  static error(combo: number = 1) {
    playSynth({ freq: 300, types: ['sawtooth', 'square'], dur: 0.25, vol: 0.1, attack: 0.05, decay: 0.1, sustain: 0.5, release: 0.1 });
    setTimeout(() => playSynth({ freq: 250, types: ['sawtooth', 'square'], dur: 0.35, vol: 0.1, attack: 0.05, decay: 0.1, sustain: 0.5, release: 0.2 }), 150);
  }
  static chew(combo: number = 1) { 
    playNoiseSynth({ dur: 0.15, vol: 0.08, filterType: 'lowpass', filterFreq: 800 * (1 + (combo - 1) * 0.1), pan: Math.random() * 0.6 - 0.3 }); 
  }
  static splash(combo: number = 1) { 
    playNoiseSynth({ dur: 0.3, vol: 0.1, filterType: 'bandpass', filterFreq: 600 * (1 + (combo - 1) * 0.1), pan: Math.random() * 0.8 - 0.4 }); 
  }
  static coin(combo: number = 1) { 
    playSynth({ freq: 1200, type: 'sine', dur: 0.15, vol: 0.12, pitchMult: 1 + (combo - 1) * 0.05, fmFreqMult: 2, fmAmount: 500, attack: 0.01, decay: 0.1, release: 0.05 }); 
  }
  static fart(combo: number = 1) { 
    playSynth({ freq: 100, types: ['sawtooth', 'triangle'], dur: 0.5, vol: 0.15, fmFreqMult: 0.5, fmAmount: 200, attack: 0.1, decay: 0.2, release: 0.2, pan: Math.random() * 0.4 - 0.2 }); 
  }

  // === New SFX ===
  static whoosh(combo: number = 1) { 
    playNoiseSynth({ dur: 0.25, vol: 0.08, filterType: 'highpass', filterFreq: 1000 * (1 + (combo - 1) * 0.1), pan: Math.random() * 0.6 - 0.3 }); 
  }
  static ding(combo: number = 1) { 
    playSynth({ freq: 1500, types: ['sine', 'triangle'], dur: 0.4, vol: 0.1, slideToFreq: 1000, pitchMult: 1 + (combo - 1) * 0.05, attack: 0.01, decay: 0.3, release: 0.1 }); 
  }
  static levelUp(combo: number = 1) {
    const p = 1 + (combo - 1) * 0.1;
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => playSynth({ freq: f, types: ['square', 'sine'], dur: 0.3, vol: 0.1, pitchMult: p, fmFreqMult: 1.5, fmAmount: 300 }), i * 120);
    });
  }
  static countdown(combo: number = 1) { 
    playSynth({ freq: 440, type: 'triangle', dur: 0.15, vol: 0.15, attack: 0.01, decay: 0.1, release: 0.05 }); 
  }
  static heartbeat(combo: number = 1) {
    playSynth({ freq: 80, type: 'sine', dur: 0.25, vol: 0.2, slideToFreq: 50, attack: 0.05, decay: 0.1, release: 0.1, pan: 0 });
    setTimeout(() => playSynth({ freq: 80, type: 'sine', dur: 0.35, vol: 0.2, slideToFreq: 50, attack: 0.05, decay: 0.1, release: 0.2, pan: 0 }), 200);
  }
  static gulp(combo: number = 1) {
    playSynth({ freq: 400, type: 'sine', dur: 0.15, vol: 0.12, slideToFreq: 200, attack: 0.05, decay: 0.1, release: 0.05, pan: -0.2 });
    setTimeout(() => playNoiseSynth({ dur: 0.15, vol: 0.08, filterType: 'lowpass', filterFreq: 300, pan: 0.2 }), 100);
  }
  static squish(combo: number = 1) { 
    playNoiseSynth({ dur: 0.2, vol: 0.1, filterType: 'bandpass', filterFreq: 1500 * (1 + (combo - 1) * 0.1), pan: Math.random() * 0.4 - 0.2 }); 
  }
  static sparkle(combo: number = 1) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playSynth({ freq: 2000 + Math.random() * 1000, type: 'sine', dur: 0.15, vol: 0.06, attack: 0.01, decay: 0.1, release: 0.05, pan: Math.random() * 0.8 - 0.4 }), i * 50);
    }
  }
  static drumroll(combo: number = 1) {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => playNoiseSynth({ dur: 0.05, vol: 0.06, filterType: 'lowpass', filterFreq: 400, pan: (i % 2 === 0) ? -0.2 : 0.2 }), i * 50);
    }
  }
  static fanfare(combo: number = 1) {
    [300, 400, 500].forEach((f, i) => setTimeout(() => playSynth({ freq: f, types: ['square', 'sawtooth'], dur: 0.25, vol: 0.1, attack: 0.05, decay: 0.1, release: 0.1 }), i * 180));
    setTimeout(() => playSynth({ freq: 800, types: ['square', 'sawtooth'], dur: 0.6, vol: 0.12, attack: 0.05, decay: 0.3, sustain: 0.5, release: 0.25, fmFreqMult: 2, fmAmount: 400 }), 540);
  }
  static water(combo: number = 1) { 
    playNoiseSynth({ dur: 0.4, vol: 0.08, filterType: 'bandpass', filterFreq: 800, pan: Math.random() * 0.6 - 0.3 }); 
  }
  static bubble(combo: number = 1) {
    playSynth({ freq: 600, type: 'sine', dur: 0.1, vol: 0.08, slideToFreq: 1200, attack: 0.02, decay: 0.05, release: 0.05, pan: Math.random() * 0.4 - 0.2 });
  }

  // === Dynamic Background Music ===
  static playBGM(mood: string) {
    return;
  }

  /**
   * Dynamically adjust the BGM lowpass filter.
   * @param intensity 0.0 (muffled) to 1.0 (open)
   */
  static setBgmFilter(intensity: number) {
    if (!bgmFilter || !audioCtx) return;
    const minFreq = 300;
    const maxFreq = 3000;
    const clamped = Math.max(0, Math.min(1, intensity));
    const targetFreq = minFreq + (maxFreq - minFreq) * clamped;
    bgmFilter.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.5);
  }

  static stopBGM() {
    if (!audioCtx || !currentBgmGain) return;
    try {
      currentBgmGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    } catch (_) { /* ignore */ }
    const oldOsc = currentBgmOscillators;
    setTimeout(() => oldOsc.forEach(o => { try { o.stop(); } catch (_) { } }), 600);
    currentBgmOscillators = [];
    currentBgmGain = null;
    bgmFilter = null;
  }
}