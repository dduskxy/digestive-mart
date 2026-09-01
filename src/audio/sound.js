import { Howl } from 'howler';

// Using web audio API for quick synthetic sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, type, duration, vol=0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

export const soundFx = {
  click: () => playTone(600, 'sine', 0.1),
  pop: () => playTone(800, 'sine', 0.05),
  success: () => {
    playTone(440, 'sine', 0.1);
    setTimeout(() => playTone(660, 'sine', 0.2), 100);
  },
  error: () => {
    playTone(300, 'sawtooth', 0.2);
    setTimeout(() => playTone(250, 'sawtooth', 0.3), 150);
  },
  chew: () => playTone(150, 'square', 0.1, 0.05),
  splash: () => playTone(200, 'triangle', 0.3, 0.1),
  coin: () => playTone(1200, 'sine', 0.1),
  fart: () => playTone(100, 'sawtooth', 0.5, 0.2)
};
