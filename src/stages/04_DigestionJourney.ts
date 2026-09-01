import { el } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import { store } from '../state/store';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function renderDigestionJourney(): HTMLElement {
  const container = el('div', 'w-full h-screen bg-digestion bg-cover bg-center flex overflow-hidden font-sans select-none relative text-gray-800');
  SoundManager.playBGM('digestion');

  // Background overlay & particles
  const overlay = el('div', 'absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-0 animate-pulse');
  container.appendChild(overlay);

  // Particles
  for (let i = 0; i < 20; i++) {
    const particle = el('div', 'absolute w-3 h-3 bg-white/20 rounded-full z-0 pointer-events-none blur-sm');
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 2 + 0.5
    });
    gsap.to(particle, {
      y: `-=${100 + Math.random() * 200}`,
      x: `+=${(Math.random() - 0.5) * 100}`,
      duration: 5 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    container.appendChild(particle);
  }

  // Top Progress Bar
  const topProgressContainer = el('div', 'absolute top-0 left-0 w-full h-3 bg-gray-200 z-50 shadow-md');
  const topProgressBar = el('div', 'h-full bg-green-500 w-0 transition-all duration-300 ease-out');
  topProgressContainer.appendChild(topProgressBar);
  container.appendChild(topProgressContainer);

  // Layout Container
  const layout = el('div', 'w-full h-full flex flex-row z-10 p-4 md:p-8 gap-4 pointer-events-none');
  container.appendChild(layout);

  // Left Panel: Phase Progress Tracker
  const leftPanel = el('div', 'w-1/4 h-full hidden md:flex flex-col justify-center items-end pr-8 border-r-2 border-white/20 pointer-events-auto');
  const steps = ['ปาก (Mouth)', 'หลอดอาหาร', 'กระเพาะอาหาร', 'ลำไส้เล็ก'];
  const stepElements: HTMLElement[] = [];
  
  steps.forEach((text) => {
    const stepEl = el('div', 'flex items-center gap-4 my-6 opacity-40 transition-opacity duration-300');
    const label = el('span', 'text-xl font-bold text-white text-right drop-shadow-md', text);
    const dot = el('div', 'w-6 h-6 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border-4 border-gray-400');
    stepEl.appendChild(label);
    stepEl.appendChild(dot);
    stepElements.push(stepEl);
    leftPanel.appendChild(stepEl);
  });
  
  const updateStepper = (phase: number) => {
    stepElements.forEach((el, i) => {
      if (i === phase || (phase > 2 && i === 3)) {
        el.classList.remove('opacity-40');
        el.classList.add('opacity-100');
        el.lastElementChild!.classList.add('border-green-400');
        el.lastElementChild!.classList.remove('border-gray-400');
        el.lastElementChild!.classList.add('scale-125');
      } else {
        el.classList.add('opacity-40');
        el.classList.remove('opacity-100');
        el.lastElementChild!.classList.remove('border-green-400');
        el.lastElementChild!.classList.add('border-gray-400');
        el.lastElementChild!.classList.remove('scale-125');
      }
    });
  };

  // Right Panel: Educational Info
  const rightPanel = el('div', 'w-1/4 h-full hidden md:flex flex-col justify-center pl-8 border-l-2 border-white/20 text-white drop-shadow-lg pointer-events-auto');
  const eduTitle = el('h2', 'text-3xl font-black mb-4 text-[#FFD700]');
  eduTitle.textContent = 'เกร็ดความรู้';
  const eduIcon = el('div', 'text-6xl mb-4');
  const eduFact = el('p', 'text-xl font-semibold leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/20 backdrop-blur-sm');
  rightPanel.appendChild(eduTitle);
  rightPanel.appendChild(eduIcon);
  rightPanel.appendChild(eduFact);

  const updateEducation = (phase: number) => {
    gsap.fromTo([eduIcon, eduFact], { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 });
    if (phase === 0) {
      eduIcon.textContent = '🦷';
      eduFact.textContent = 'ฟัน ช่วยบดอาหารให้ละเอียด เพื่อให้กระเพาะย่อยได้ง่ายขึ้น';
    } else if (phase === 1) {
      eduIcon.textContent = '🧪';
      eduFact.textContent = 'กระเพาะอาหาร ผลิตน้ำย่อยสลายอาหาร และบีบรัดตัวเพื่อคลุกเคล้าอาหาร';
    } else if (phase === 2) {
      eduIcon.textContent = '🧬';
      eduFact.textContent = 'ลำไส้เล็ก ดูดซึมสารอาหารเข้าสู่ร่างกาย ผ่านผนังลำไส้ที่ยาวมาก!';
    }
  };

  // Center: Main Game Area (The Journey)
  const centerArea = el('div', 'flex-1 h-full relative overflow-hidden flex flex-col items-center pt-10 pointer-events-auto');
  
  // Camera/Track container that moves up to simulate going down
  const trackContainer = el('div', 'absolute top-0 w-full flex flex-col items-center');
  centerArea.appendChild(trackContainer);

  const instructionBox = el('div', 'absolute top-20 z-50 bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-xl border-2 border-[#FF4B4B] text-2xl font-bold text-[#FF4B4B] pointer-events-none');
  instructionBox.textContent = 'คลิกเพื่อเคี้ยวอาหาร!';
  centerArea.appendChild(instructionBox);

  // Status/Counter Bar UI
  const counterContainer = el('div', 'absolute bottom-20 z-50 flex flex-col items-center bg-white/95 p-4 rounded-3xl shadow-2xl min-w-[250px]');
  const counterText = el('div', 'text-2xl font-black text-gray-700 mb-2');
  counterText.textContent = 'คลิก 0/10 ครั้ง';
  const powerBarBg = el('div', 'w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner');
  const powerBarFill = el('div', 'h-full bg-gradient-to-r from-yellow-400 to-red-500 w-0 transition-all duration-200');
  powerBarBg.appendChild(powerBarFill);
  counterContainer.appendChild(counterText);
  counterContainer.appendChild(powerBarBg);
  centerArea.appendChild(counterContainer);

  layout.appendChild(leftPanel);
  layout.appendChild(centerArea);
  layout.appendChild(rightPanel);

  // --- Organs Visuals ---

  // Mouth
  const mouthSection = el('div', 'w-full h-screen flex justify-center items-start pt-32 relative');
  const mouthVisual = el('div', 'w-72 h-48 bg-pink-200 rounded-[80px] border-8 border-pink-400 shadow-[inset_0_-20px_30px_rgba(200,0,0,0.3)] flex justify-center items-center relative overflow-hidden');
  const teethTop = el('div', 'absolute top-0 w-full h-8 bg-white opacity-80 z-10 shadow-sm border-b-2 border-gray-200');
  const teethBottom = el('div', 'absolute bottom-0 w-full h-8 bg-white opacity-80 z-10 shadow-sm border-t-2 border-gray-200');
  mouthVisual.appendChild(teethTop);
  mouthVisual.appendChild(teethBottom);
  mouthSection.appendChild(mouthVisual);

  // Esophagus tube connecting Mouth and Stomach
  const tubeContainer = el('div', 'w-full h-64 flex justify-center -my-10 relative z-0');
  const tubeVisual = el('div', 'w-24 h-full bg-pink-300 border-x-8 border-pink-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]');
  tubeContainer.appendChild(tubeVisual);

  // Stomach
  const stomachSection = el('div', 'w-full h-screen flex justify-center items-center relative');
  const stomachVisual = el('div', 'w-[350px] h-[300px] bg-[#ff8c69] border-[10px] border-[#d35400] relative overflow-hidden shadow-[inset_0_-40px_50px_rgba(200,0,0,0.4)]');
  stomachVisual.style.borderRadius = '50% 70% 60% 40% / 60% 50% 70% 50%';
  
  // Acid Waves
  const acidVisual = el('div', 'absolute bottom-0 w-full h-[10%] bg-gradient-to-t from-green-600 to-green-400 opacity-80 transition-all duration-300 rounded-b-[40%]');
  stomachVisual.appendChild(acidVisual);
  stomachSection.appendChild(stomachVisual);

  // Tube to Intestine
  const tube2Container = el('div', 'w-full h-40 flex justify-center -my-10 relative z-0');
  const tube2Visual = el('div', 'w-20 h-full bg-orange-300 border-x-8 border-orange-500 shadow-inner');
  tube2Container.appendChild(tube2Visual);

  // Intestine
  const intestineSection = el('div', 'w-full h-screen flex justify-center items-center relative');
  const intestineVisual = el('div', 'w-[450px] h-[350px] bg-[#f9ca24] rounded-[100px] border-[12px] border-[#f0932b] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] relative p-8 flex flex-wrap justify-center items-center gap-4');
  intestineSection.appendChild(intestineVisual);

  trackContainer.appendChild(mouthSection);
  trackContainer.appendChild(tubeContainer);
  trackContainer.appendChild(stomachSection);
  trackContainer.appendChild(tube2Container);
  trackContainer.appendChild(intestineSection);

  // The Food Payload
  const food = el('div', 'absolute text-[80px] z-30 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] cursor-pointer transform-origin-center transition-transform hover:scale-110');
  food.textContent = store.state.cart[0]?.emoji || '🍔';
  trackContainer.appendChild(food);

  // Initial Food Positioning (Inside Mouth)
  gsap.set(food, { y: 180 });

  let state = 0; // 0: Mouth, 1: Stomach, 2: Intestine, 3: Done
  updateStepper(0);
  updateEducation(0);

  const setProgress = (percent: number) => {
    topProgressBar.style.width = `${percent}%`;
  };

  // --- Phase 0: Mouth (Chewing) ---
  let chews = 0;
  const chewTarget = 10;
  
  food.onclick = () => {
    if (state !== 0) return;
    chews++;
    SoundManager.chew();
    
    // UI Update
    counterText.textContent = `คลิก ${chews}/${chewTarget} ครั้ง`;
    powerBarFill.style.width = `${(chews / chewTarget) * 100}%`;
    setProgress((chews / chewTarget) * 33);
    
    // Bounce/Squish Animation
    gsap.to(food, { 
      scaleX: 1.3, scaleY: 0.7, 
      duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" 
    });

    if (chews >= chewTarget) {
      state = 1; // Transition to Stomach
      food.textContent = '🥣';
      instructionBox.textContent = 'วนเมาส์ในกระเพาะ!';
      counterText.textContent = 'วนเมาส์ 0/30 ครั้ง';
      powerBarFill.style.width = '0%';
      powerBarFill.className = 'h-full bg-gradient-to-r from-green-400 to-blue-500 w-0 transition-all duration-200';
      
      SoundManager.gulp();
      updateStepper(1);
      
      // Move camera to Stomach
      gsap.to(trackContainer, { y: -window.innerHeight, duration: 2, ease: "power2.inOut" });
      
      // Move food through esophagus to stomach
      gsap.to(food, {
        y: 180 + window.innerHeight, // target stomach area in track
        scaleX: 1, scaleY: 1,
        rotation: 360,
        duration: 2,
        ease: "power1.inOut",
        onComplete: () => {
          SoundManager.splash();
          updateEducation(1);
          updateStepper(2); // In Stomach
        }
      });
    }
  };

  // --- Phase 1: Stomach (Mixing) ---
  let mixCount = 0;
  const mixTarget = 30;
  let lastX = 0;
  
  stomachVisual.onmousemove = (e) => {
    if (state !== 1) return;
    if (Math.abs(e.clientX - lastX) > 20) {
      mixCount++;
      lastX = e.clientX;
      
      // UI Update
      counterText.textContent = `วนเมาส์ ${mixCount}/${mixTarget} ครั้ง`;
      powerBarFill.style.width = `${(mixCount / mixTarget) * 100}%`;
      setProgress(33 + (mixCount / mixTarget) * 33);
      
      // Acid rises
      acidVisual.style.height = `${10 + (mixCount / mixTarget) * 70}%`;
      
      // Food mixing animation
      gsap.to(food, { 
        rotation: `+=${30}`, 
        x: (Math.random()-0.5)*50, 
        y: 180 + window.innerHeight + (Math.random()-0.5)*30,
        duration: 0.2 
      });
      
      if (Math.random() > 0.7) SoundManager.bubble();
      
      if (mixCount >= mixTarget) {
        state = 2; // Transition to Intestine
        food.textContent = '🟢';
        instructionBox.textContent = 'คลิกเก็บสารอาหาร!';
        counterText.textContent = 'สารอาหาร 0/8';
        powerBarFill.style.width = '0%';
        powerBarFill.className = 'h-full bg-gradient-to-r from-blue-400 to-purple-500 w-0 transition-all duration-200';
        
        SoundManager.success();
        
        // Move camera to Intestine
        gsap.to(trackContainer, { y: -window.innerHeight * 2, duration: 2, ease: "power2.inOut" });
        
        // Move food to Intestine
        gsap.to(food, {
          y: 180 + window.innerHeight * 2,
          x: 0,
          scale: 0.8,
          duration: 2,
          ease: "power2.inOut",
          onComplete: () => {
            updateEducation(2);
            updateStepper(3);
            spawnNutrients();
          }
        });
      }
    }
  };
  
  stomachVisual.ontouchmove = (e) => {
    e.preventDefault();
    stomachVisual.onmousemove!(new MouseEvent('mousemove', { clientX: e.touches[0].clientX }));
  };

  // --- Phase 2: Intestine (Absorption) ---
  let collected = 0;
  const targetNutrients = 8;
  
  const spawnNutrients = () => {
    const nutrientData = [
      { icon: '⚡', color: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
      { icon: '💪', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
      { icon: '🛡️', color: 'bg-green-500', shadow: 'shadow-green-500/50' },
      { icon: '💧', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' },
      { icon: '⚡', color: 'bg-orange-500', shadow: 'shadow-orange-500/50' },
      { icon: '💪', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
      { icon: '🛡️', color: 'bg-green-500', shadow: 'shadow-green-500/50' },
      { icon: '💧', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/50' }
    ];
    
    gsap.to(food, { opacity: 0.2, duration: 0.5 });
    
    nutrientData.forEach((data, i) => {
      const nut = el('div', `absolute w-16 h-16 rounded-full ${data.color} ${data.shadow} shadow-lg border-2 border-white flex justify-center items-center text-2xl cursor-pointer hover:scale-110 transition-transform z-40`);
      nut.textContent = data.icon;
      
      const angle = (i / targetNutrients) * Math.PI * 2;
      const radius = 80 + Math.random() * 40;
      const nx = Math.cos(angle) * radius;
      const ny = Math.sin(angle) * radius;
      
      gsap.set(nut, { x: nx, y: ny, scale: 0 });
      intestineVisual.appendChild(nut);
      
      gsap.to(nut, { scale: 1, duration: 0.5, delay: i * 0.1, ease: "back.out(1.5)" });
      
      gsap.to(nut, {
        y: ny - 15,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      nut.onclick = (e) => {
        SoundManager.ding();
        collected++;
        
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { 
            x: e.clientX / window.innerWidth, 
            y: e.clientY / window.innerHeight 
          }
        });
        
        counterText.textContent = `สารอาหาร ${collected}/${targetNutrients}`;
        powerBarFill.style.width = `${(collected / targetNutrients) * 100}%`;
        setProgress(66 + (collected / targetNutrients) * 34);
        
        gsap.to(nut, { 
          y: ny - 100, opacity: 0, scale: 1.5, duration: 0.4, 
          onComplete: () => nut.remove() 
        });
        
        if (collected >= targetNutrients) {
          finishDigestion();
        }
      };
    });
  };

  const finishDigestion = () => {
    if (state === 3) return;
    state = 3;
    instructionBox.textContent = 'เสร็จสมบูรณ์!';
    
    gsap.to(food, { opacity: 1, duration: 0.5 });
    food.textContent = '💩';
    
    gsap.to(food, {
      y: 180 + window.innerHeight * 2 + 300,
      scale: 1.5,
      rotation: 0,
      duration: 1.5,
      ease: "power3.in",
      onComplete: () => {
        SoundManager.fart();
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.8 }, zIndex: 1000 });
        setTimeout(() => {
          SoundManager.stopBGM();
          store.setStage('05_SummaryReport');
        }, 2500);
      }
    });
  };

  return container;
}