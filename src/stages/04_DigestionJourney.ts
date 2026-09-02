import { el, Button, showObjective } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import { store } from '../state/store';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export default function renderDigestionJourney(): HTMLElement {
  const container = el('div', 'w-full h-[100dvh] bg-pink-100 flex overflow-hidden font-sans select-none relative text-gray-800');
  SoundManager.playBGM('digestion');

  const cart = store.state.cart;
  if (!cart || cart.length === 0) {
    const errorMsg = el('div', 'w-full h-full flex justify-center items-center text-2xl font-bold', 'ไม่พบอาหารในตะกร้า!');
    container.appendChild(errorMsg);
    return container;
  }

  // --- UI Elements ---
  const topProgressContainer = el('div', 'absolute top-0 left-0 w-full h-4 bg-gray-200 z-50 shadow-md');
  const topProgressBar = el('div', 'h-full bg-green-500 w-0 transition-all duration-300 ease-out');
  topProgressContainer.appendChild(topProgressBar);
  container.appendChild(topProgressContainer);

  const setProgress = (percent: number) => {
    topProgressBar.style.width = `${percent}%`;
  };

  const instructionBox = el('div', 'absolute top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-primary text-xl md:text-2xl font-bold text-primary pointer-events-none text-center min-w-[280px] opacity-0 transition-opacity duration-300');
  container.appendChild(instructionBox);

  // Layout Container for phases
  const phaseContainer = el('div', 'w-full h-full relative transition-colors duration-1000');
  container.appendChild(phaseContainer);

  // Items State
  let chewedCount = 0;
  const totalChewsNeededPerItem = 3;
  let itemsChewed = 0;

  // Visual Items
  const foodElements: { el: HTMLElement, state: string, chews: number, x: number, y: number, vx: number, vy: number }[] = [];

  const updateInstruction = (text: string) => {
    instructionBox.classList.remove('opacity-0');
    instructionBox.textContent = text;
    gsap.fromTo(instructionBox, { scale: 1.2 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  };

  // ---------------------------------------------------------
  // PHASE 1: MOUTH (Chewing)
  // ---------------------------------------------------------
  const initMouthPhase = () => {
    phaseContainer.className = 'w-full h-full relative transition-colors duration-1000 bg-pink-200 shadow-[inset_0_0_50px_rgba(200,0,0,0.2)]';
    updateInstruction('คลิกเพื่อเคี้ยวอาหารทุกชิ้น!');
    setProgress(10);

    // Teeth Visuals
    const topTeeth = el('div', 'absolute top-0 left-0 w-full h-20 bg-white shadow-md z-40 flex justify-around p-2 gap-1 rounded-b-3xl');
    const bottomTeeth = el('div', 'absolute bottom-0 left-0 w-full h-20 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex justify-around p-2 gap-1 rounded-t-3xl');
    for (let i = 0; i < 10; i++) {
      topTeeth.appendChild(el('div', 'w-1/12 h-full bg-gray-50 rounded-b-full shadow-inner border border-gray-200'));
      bottomTeeth.appendChild(el('div', 'w-1/12 h-full bg-gray-50 rounded-t-full shadow-inner border border-gray-200'));
    }
    phaseContainer.appendChild(topTeeth);
    phaseContainer.appendChild(bottomTeeth);

    // Animate Teeth Chattering (simulating mouth open)
    gsap.fromTo(topTeeth, { y: -80 }, { y: 0, duration: 1, ease: 'bounce.out' });
    gsap.fromTo(bottomTeeth, { y: 80 }, { y: 0, duration: 1, ease: 'bounce.out' });

    // Spawn Food Items
    cart.forEach((item, index) => {
      const food = el('div', 'absolute text-6xl md:text-8xl drop-shadow-xl cursor-pointer transition-transform hover:scale-110 z-30 select-none');
      food.textContent = item.emoji;
      
      const x = (window.innerWidth / 2) + (Math.random() - 0.5) * (window.innerWidth * 0.5);
      const y = (window.innerHeight / 2) + (Math.random() - 0.5) * (window.innerHeight * 0.3);
      
      gsap.set(food, { x, y, scale: 0, rotation: Math.random() * 360 });
      gsap.to(food, { scale: 1, duration: 0.5, delay: index * 0.2, ease: 'back.out(1.5)' });

      phaseContainer.appendChild(food);

      const foodData = { el: food, state: 'raw', chews: 0, x, y, vx: 0, vy: 0 };
      foodElements.push(foodData);

      food.onpointerdown = (e) => {
        if (foodData.state !== 'raw') return;
        foodData.chews++;
        SoundManager.chew();

        // Crumbs effect
        confetti({
          particleCount: 15,
          spread: 80,
          origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
          colors: ['#fde047', '#d97706', '#ffffff', '#86efac'],
          gravity: 1.5,
          scalar: 0.7,
          ticks: 60
        });

        // Chew animation
        gsap.to(food, { scaleX: 1.3, scaleY: 0.7, duration: 0.1, yoyo: true, repeat: 1 });
        
        // Chomp teeth to the middle of the screen
        const chompDistance = window.innerHeight / 2 - 80;
        gsap.to(topTeeth, { y: chompDistance, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.in' });
        gsap.to(bottomTeeth, { y: -chompDistance, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.in' });

        // Update visual based on chews
        food.style.filter = `blur(${foodData.chews}px)`;
        food.style.transform = `scale(${1 - (foodData.chews * 0.1)})`;

        if (foodData.chews >= totalChewsNeededPerItem) {
          foodData.state = 'chewed';
          food.textContent = '🥣';
          food.style.filter = 'none';
          gsap.to(food, { scale: 0.8, duration: 0.3, ease: 'back.out(2)' });
          itemsChewed++;
          setProgress(10 + (itemsChewed / cart.length) * 20);

          if (itemsChewed >= cart.length) {
            setTimeout(transitionToStomach, 1000);
          }
        }
      };
    });
  };

  // ---------------------------------------------------------
  // PHASE 2: STOMACH (Churning)
  // ---------------------------------------------------------
  let stomachMixCount = 0;
  const totalStomachMixes = 40;

  const transitionToStomach = () => {
    SoundManager.gulp();
    updateInstruction('ถูกกลืนลงกระเพาะอาหารแล้ว!');
    
    // Clear mouth visuals, animate fall
    phaseContainer.innerHTML = '';
    phaseContainer.className = 'w-full h-full relative transition-colors duration-1000 bg-orange-400 shadow-[inset_0_0_80px_rgba(150,0,0,0.4)]';
    
    // Background Stomach details
    const acidPool = el('div', 'absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-green-500 to-green-400/80 z-10 transition-all duration-300');
    phaseContainer.appendChild(acidPool);

    // Add items back and animate falling
    foodElements.forEach((f, i) => {
      f.el.onpointerdown = null; // remove chew event
      phaseContainer.appendChild(f.el);
      const targetY = window.innerHeight - 150 - (Math.random() * 50);
      gsap.fromTo(f.el, 
        { y: -100, x: window.innerWidth / 2 + (Math.random()-0.5)*100 },
        { y: targetY, duration: 1 + Math.random()*0.5, delay: i*0.1, ease: 'bounce.out', onComplete: () => {
          f.y = targetY; // store position
        }}
      );
    });

    setTimeout(() => {
      updateInstruction('ลากเมาส์/นิ้ว เพื่อย่อยอาหาร!');
      initStomachMixing(acidPool);
    }, 2000);
  };

  const initStomachMixing = (acidPool: HTMLElement) => {
    let lastX = 0;
    let lastY = 0;

    const onMove = (clientX: number, clientY: number) => {
      if (stomachMixCount >= totalStomachMixes) return;
      
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        stomachMixCount++;
        lastX = clientX;
        lastY = clientY;

        setProgress(30 + (stomachMixCount / totalStomachMixes) * 30);
        acidPool.style.height = `${20 + (stomachMixCount / totalStomachMixes) * 60}%`;

        // Toss food items around (squishy effect)
        foodElements.forEach(f => {
          gsap.to(f.el, {
            x: `+=${dx * 0.5 + (Math.random()-0.5)*30}`,
            y: `+=${dy * 0.5 + (Math.random()-0.5)*30}`,
            rotation: `+=${dx}`,
            scaleX: 0.7 + Math.random() * 0.6,
            scaleY: 0.7 + Math.random() * 0.6,
            duration: 0.3,
            ease: 'power1.out'
          });
        });

        // Acid bubbles effect
        if (Math.random() > 0.6) {
          const bubble = el('div', 'absolute w-6 h-6 rounded-full bg-green-300 opacity-60 z-20 pointer-events-none drop-shadow-md');
          bubble.style.left = `${clientX}px`;
          bubble.style.top = `${clientY}px`;
          phaseContainer.appendChild(bubble);
          gsap.to(bubble, {
            y: `-=${80 + Math.random()*50}`,
            x: `+=${(Math.random()-0.5)*40}`,
            scale: 2,
            opacity: 0,
            duration: 0.6 + Math.random()*0.4,
            onComplete: () => bubble.remove()
          });
        }

        if (stomachMixCount % 3 === 0) SoundManager.bubble();
        if (Math.random() > 0.7) SoundManager.squish();
        if (Math.random() > 0.8) SoundManager.water();

        if (stomachMixCount >= totalStomachMixes) {
          phaseContainer.onpointermove = null;
          // morph food into chyme
          foodElements.forEach(f => {
            f.state = 'chyme';
            f.el.textContent = '🟢';
            gsap.to(f.el, { scale: 0.6, backgroundColor: 'rgba(74, 222, 128, 0.5)', borderRadius: '50%', duration: 1 });
          });
          setTimeout(transitionToIntestine, 1500);
        }
      }
    };

    phaseContainer.onpointerdown = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };
    phaseContainer.onpointermove = (e) => {
      if (e.buttons > 0 || e.pointerType === 'touch') {
        onMove(e.clientX, e.clientY);
      }
    };
  };

  // ---------------------------------------------------------
  // PHASE 3: SMALL INTESTINE (Absorption)
  // ---------------------------------------------------------
  let nutrientsCollected = 0;
  const totalNutrients = cart.length * 3; // 3 nutrients per item

  const transitionToIntestine = () => {
    SoundManager.splash();
    updateInstruction('เดินทางสู่ลำไส้เล็ก!');
    
    phaseContainer.innerHTML = '';
    phaseContainer.className = 'w-full h-full relative transition-colors duration-1000 bg-yellow-200 overflow-hidden';
    
    // Add Villi (Intestine walls)
    const topWall = el('div', 'absolute top-0 left-0 w-full h-16 bg-red-300 flex justify-around opacity-50');
    const bottomWall = el('div', 'absolute bottom-0 left-0 w-full h-16 bg-red-300 flex justify-around opacity-50');
    for (let i = 0; i < 20; i++) {
      const vTop = el('div', 'w-8 h-full bg-red-400 rounded-b-full drop-shadow-md');
      const vBot = el('div', 'w-8 h-full bg-red-400 rounded-t-full drop-shadow-md');
      topWall.appendChild(vTop);
      bottomWall.appendChild(vBot);
      
      gsap.to(vTop, { rotation: (Math.random()-0.5)*30, transformOrigin: "top center", duration: 1+Math.random(), repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(vBot, { rotation: (Math.random()-0.5)*30, transformOrigin: "bottom center", duration: 1+Math.random(), repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    phaseContainer.appendChild(topWall);
    phaseContainer.appendChild(bottomWall);

    setTimeout(() => {
      updateInstruction('คลิกเก็บสารอาหารให้หมด!');
      initIntestineAbsorption();
    }, 1500);
  };

  const initIntestineAbsorption = () => {
    // Spawn Chyme flowing left to right
    foodElements.forEach((f, i) => {
      f.el.textContent = '🟢';
      phaseContainer.appendChild(f.el);
      
      const startY = window.innerHeight/2 + (Math.random()-0.5)*100;
      gsap.fromTo(f.el, 
        { x: -100, y: startY }, 
        { x: window.innerWidth + 100, duration: 10 + Math.random()*5, delay: i * 0.5, ease: 'linear', repeat: -1 }
      );
    });

    // Spawn Nutrients based on cart items
    let nutrientIcons = ['⚡', '💪', '🛡️', '💧'];
    
    for (let i = 0; i < totalNutrients; i++) {
      const nut = el('div', 'absolute w-16 h-16 rounded-full bg-white shadow-lg border-4 border-yellow-400 flex justify-center items-center text-3xl cursor-pointer hover:scale-110 transition-transform z-40');
      nut.textContent = nutrientIcons[i % nutrientIcons.length];
      
      const startX = Math.random() * (window.innerWidth - 100) + 50;
      const startY = Math.random() * (window.innerHeight - 200) + 100;
      
      gsap.set(nut, { x: startX, y: startY, scale: 0 });
      phaseContainer.appendChild(nut);
      
      gsap.to(nut, { scale: 1, duration: 0.5, delay: i * 0.2 + 2, ease: "back.out(1.5)" });
      gsap.to(nut, {
        y: startY + (Math.random()-0.5)*40,
        x: startX + (Math.random()-0.5)*40,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      nut.onpointerdown = (e) => {
        if (nut.dataset.collected === 'true') return;
        nut.dataset.collected = 'true';
        
        SoundManager.ding();
        nutrientsCollected++;
        
        confetti({
          particleCount: 15, spread: 40,
          origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
        });
        
        setProgress(60 + (nutrientsCollected / totalNutrients) * 40);
        
        gsap.to(nut, { 
          y: -50, x: window.innerWidth / 2, opacity: 0, scale: 2, duration: 0.5, ease: 'power2.in',
          onComplete: () => nut.remove() 
        });
        
        if (nutrientsCollected >= totalNutrients) {
          finishDigestion();
        }
      };
    }
  };

  // ---------------------------------------------------------
  // PHASE 4: FINISH (Poop)
  // ---------------------------------------------------------
  const finishDigestion = () => {
    updateInstruction('ย่อยสมบูรณ์!');
    
    const digestionScore = Math.min(100, Math.round((nutrientsCollected / totalNutrients) * 100));
    store.setStageScore('04_DigestionJourney', digestionScore);
    store.updateCleanlinessScore(Math.min(100, Math.max(store.state.progress.cleanlinessScore, digestionScore)));

    // Create a giant poop
    const poop = el('div', 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[150px] z-50 drop-shadow-2xl');
    poop.textContent = '💩';
    gsap.set(poop, { scale: 0 });
    phaseContainer.appendChild(poop);

    gsap.to(poop, { 
      scale: 1, rotation: 360, duration: 1.5, ease: 'elastic.out(1, 0.3)',
      onComplete: () => {
        SoundManager.fart();
        
        // Screen shake effect for impact
        gsap.to(container, { x: 15, y: 10, duration: 0.05, yoyo: true, repeat: 9, clearProps: 'all' });
        
        // Add a pulsing animation to the poop
        gsap.to(poop, { scale: 1.1, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, zIndex: 1000 });
        
        const btnWrapper = el('div', 'absolute bottom-20 left-1/2 transform -translate-x-1/2 z-[100]');
        const nextBtn = Button({
          text: 'ไปดูผลสรุปเลย!',
          variant: 'primary',
          className: 'text-2xl px-8 py-4 animate-bounce shadow-2xl',
          onClick: () => {
            SoundManager.stopBGM();
            store.setStage('05_SummaryReport');
          }
        });
        btnWrapper.appendChild(nextBtn);
        
        phaseContainer.style.pointerEvents = 'none'; // Prevent any stray listeners from blocking
        container.appendChild(btnWrapper);
      }
    });
  };

  setTimeout(() => {
    showObjective('🧬', 'เข้าสู่ระบบย่อยอาหาร!', 'เราจะมาย่อยอาหาร 5 ชิ้นที่คุณเลือกมาทีละส่วน ตั้งแต่ปาก กระเพาะ ไปจนถึงลำไส้ เตรียมตัวให้พร้อม!', 'เริ่มย่อยเลย! 🚀', () => {
      initMouthPhase();
    });
  }, 100);

  return container;
}