import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import confetti from 'canvas-confetti';
import { renderHygieneChoices, HygieneChoice } from './HygieneChoices';

export function renderHygiene(): HTMLElement {
  // Remove excessive top padding since Navbar is gone. Make it tight.
  const container = el('div', 'absolute inset-0 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-blue-100 to-cyan-50 flex flex-col items-center py-4 md:py-6 px-4 gap-4 font-["Kanit"] select-none');

  // Animated background bubbles using Tailwind arbitrary values or injected styles
  const bgLayer = el('div', 'absolute inset-0 overflow-hidden pointer-events-none');
  for(let i = 0; i < 20; i++) {
    const b = el('div', 'absolute rounded-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] backdrop-blur-sm animate-float');
    const size = 10 + Math.random() * 50;
    b.style.width = `${size}px`; 
    b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.bottom = `-${size + 50}px`;
    b.style.animationDuration = `${5 + Math.random() * 10}s`;
    b.style.animationDelay = `${Math.random() * 5}s`;
    bgLayer.appendChild(b);
  }
  container.appendChild(bgLayer);

  // Header Section
  const header = el('div', 'w-full max-w-2xl flex flex-col items-center z-10 mt-0 shrink-0');
  
  const title = el('h1', 'font-["Baloo_2"] text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-500 mb-2 drop-shadow-sm flex items-center gap-3');
  title.innerHTML = '🧼 ภารกิจล้างมือ!';
  header.appendChild(title);

  const progressContainer = el('div', 'bg-white/90 backdrop-blur-md px-6 py-2 md:px-8 md:py-3 rounded-full shadow-sm border border-blue-100 flex items-center gap-3');
  const progressText = el('p', 'text-xl md:text-2xl text-blue-500 font-bold transition-all duration-300');
  progressText.textContent = '0% สะอาด!';
  progressContainer.appendChild(progressText);
  header.appendChild(progressContainer);

  const gameWrapper = el('div', 'w-full flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 z-10 py-2');
  gameWrapper.style.display = 'none';

  // (choicesEl is appended later after variables are defined)

  gameWrapper.appendChild(header);

  // Game Area
  const gameAreaWrapper = el('div', 'relative flex items-center justify-center w-full z-20 shrink-0');
  const gameArea = el('div', 'relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-white/40 backdrop-blur-md border-8 border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center justify-center cursor-pointer overflow-visible transition-transform duration-200 active:scale-[0.98] touch-none');
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'absolute inset-0 w-full h-full -rotate-90 pointer-events-none');
  
  const circleProgress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleProgress.setAttribute('cx', '50%'); circleProgress.setAttribute('cy', '50%'); 
  circleProgress.setAttribute('r', '46%');
  circleProgress.setAttribute('fill', 'none'); 
  circleProgress.setAttribute('stroke', '#3b82f6');
  circleProgress.setAttribute('stroke-width', '16'); 
  circleProgress.setAttribute('stroke-dasharray', '289%');
  circleProgress.setAttribute('stroke-dashoffset', '289%'); 
  circleProgress.setAttribute('stroke-linecap', 'round');
  circleProgress.setAttribute('class', 'transition-all duration-300 ease-out');
  
  svg.appendChild(circleProgress); 
  gameArea.appendChild(svg);

  const handIcon = el('div', 'text-7xl sm:text-8xl md:text-[140px] pointer-events-none drop-shadow-xl z-20 transition-transform duration-300');
  handIcon.textContent = '🖐️';
  gameArea.appendChild(handIcon);

  const germs: HTMLElement[] = [];
  const totalGerms = 8;
  for(let i=0; i<totalGerms; i++) {
    const germ = el('div', 'absolute text-3xl sm:text-4xl md:text-5xl pointer-events-none z-30 transition-transform duration-300');
    germ.textContent = '🦠';
    const angle = Math.random() * Math.PI * 2;
    // Scale germ radius down so they don't overflow the 260px container
    const radius = 50 + Math.random() * 50;
    germ.style.transform = `translate(${Math.cos(angle)*radius}px, ${Math.sin(angle)*radius}px)`;
    germ.dataset.removed = "false";
    germs.push(germ);
    gameArea.appendChild(germ);
  }

  const bubblesContainer = el('div', 'absolute inset-0 pointer-events-none overflow-hidden rounded-full z-40');
  gameArea.appendChild(bubblesContainer);
  gameAreaWrapper.appendChild(gameArea);
  gameWrapper.appendChild(gameAreaWrapper);

  // Bottom Stats Area
  const bottomArea = el('div', 'w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[32px] p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white z-10 flex flex-col gap-4 mb-4 sm:mb-8');
  
  const statsRow = el('div', 'flex justify-center items-center px-4 mt-2');
  const germCountLabel = el('span', 'text-lg font-bold text-gray-600 flex items-center gap-2');
  germCountLabel.textContent = `🦠 เชื้อโรคเหลือ: ${totalGerms}`;
  
  statsRow.appendChild(germCountLabel);
  bottomArea.appendChild(statsRow);

  gameWrapper.appendChild(bottomArea);

  const state = { cleanliness: 0, isComplete: false, lastX: 0, lastY: 0 };
  let cleanSpeed = 1.5;
  let maxClean = 100;
  let currentChoiceId = 1;

  const choicesEl = renderHygieneChoices((choice: HygieneChoice) => {
    choicesEl.remove();
    currentChoiceId = choice.id;
    let instrText = 'ถูมือไปมาบนวงกลมเพื่อล้างเชื้อโรคออกให้หมด!';
    
    if (choice.id === 1) { cleanSpeed = 0.8; maxClean = 100; }
    else if (choice.id === 2) { cleanSpeed = 2.5; maxClean = 100; instrText = 'ถูเจลให้ทั่วมืออย่างรวดเร็ว!'; }
    else if (choice.id === 3) { cleanSpeed = 6.0; maxClean = 100; instrText = 'แตะหรือถูเพื่อพ่นสเปรย์ฆ่าเชื้อ!'; }
    else if (choice.id === 4) { cleanSpeed = 1.5; maxClean = 50; }
    else if (choice.id === 5) { cleanSpeed = 2.0; maxClean = 70; }
    
    if (choice.id === 6) {
      maxClean = 0;
      state.isComplete = true;
      progressText.textContent = '0% สะอาด!';
      progressText.style.color = '#ef4444';
      showCompletionModal();
    } else {
      import('../components/UI').then(({ showObjective }) => {
        showObjective('🖐️', 'ภารกิจล้างมือ', instrText, 'เริ่มเลย! 🚀', () => {
          gameWrapper.style.display = 'flex';
        });
      });
    }
  });
  container.appendChild(choicesEl);
  container.appendChild(gameWrapper);

  const createInteractBubble = (x: number, y: number) => {
    const bubble = el('div', 'absolute bg-white/80 rounded-full shadow-sm pointer-events-none');
    const size = 15 + Math.random() * 30;
    bubble.style.width = `${size}px`; 
    bubble.style.height = `${size}px`;
    const rect = gameArea.getBoundingClientRect();
    bubble.style.left = `${x - rect.left - size/2}px`; 
    bubble.style.top = `${y - rect.top - size/2}px`;
    bubblesContainer.appendChild(bubble);
    bubble.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
      { transform: `translate(${(Math.random()-0.5)*100}px, -150px) scale(1.5)`, opacity: 0 }
    ], { duration: 600 + Math.random() * 600, easing: 'ease-out' }).onfinish = () => bubble.remove();
  };

  const getProgressColor = (percent: number) => {
    if (percent < 40) return '#94a3b8'; // slate-400
    if (percent < 80) return '#3b82f6'; // blue-500
    return '#22c55e'; // green-500
  };

  const handleWash = (x: number, y: number) => {
    if (state.isComplete) return;
    const dx = x - state.lastX; 
    const dy = y - state.lastY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist > 5 || currentChoiceId === 3) {
      state.cleanliness = Math.min(maxClean, state.cleanliness + cleanSpeed);
      state.lastX = x; 
      state.lastY = y;
      
      const percent = state.cleanliness;
      progressText.textContent = `${Math.floor(percent)}% สะอาด!`;
      progressText.style.color = getProgressColor(percent);
      
      const offset = 289 - (percent / 100) * 289;
      circleProgress.setAttribute('stroke-dashoffset', `${offset}%`);
      circleProgress.setAttribute('stroke', getProgressColor(percent));
      
      handIcon.style.transform = `scale(${1 + (Math.sin(percent/3) * 0.08)})`;

      if (Math.random() > 0.6) createInteractBubble(x, y);

      const germsToKeep = Math.ceil(totalGerms * (1 - percent/100));
      germCountLabel.textContent = `🦠 เชื้อโรคเหลือ: ${germsToKeep}`;
      
      let removedCount = 0;
      germs.forEach((g) => {
        if (g.dataset.removed === "false" && removedCount < (totalGerms - germsToKeep)) {
          g.dataset.removed = "true";
          g.style.transform = `${g.style.transform} scale(2)`;
          g.style.opacity = '0';
          SoundManager.pop();
          removedCount++;
        }
      });

      if (percent >= maxClean && maxClean > 0) {
        state.isComplete = true;
        handIcon.style.transform = 'scale(1.1)';
        handIcon.style.filter = 'drop-shadow(0 0 30px rgba(74, 222, 128, 0.8))';
        SoundManager.fanfare();
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#3b82f6', '#22c55e', '#f59e0b', '#ffffff'] });
        setTimeout(() => showCompletionModal(), 1500);
      }
    }
  };

  let isWashing = false;
  gameArea.addEventListener('mousedown', (e) => { isWashing = true; state.lastX = e.clientX; state.lastY = e.clientY; });
  window.addEventListener('mouseup', () => { isWashing = false; handIcon.style.transform = 'scale(1)'; });
  gameArea.addEventListener('mousemove', (e) => { if (isWashing) handleWash(e.clientX, e.clientY); });
  
  gameArea.addEventListener('touchstart', (e) => { isWashing = true; state.lastX = e.touches[0].clientX; state.lastY = e.touches[0].clientY; e.preventDefault(); }, {passive: false});
  window.addEventListener('touchend', () => { isWashing = false; handIcon.style.transform = 'scale(1)'; });
  gameArea.addEventListener('touchmove', (e) => { if (isWashing) handleWash(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, {passive: false});

  const showCompletionModal = () => {
    const modalBg = el('div', 'fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 opacity-0 transition-opacity duration-500');
    
    const card = el('div', 'bg-white rounded-[32px] p-6 md:p-8 max-w-sm w-full text-center shadow-2xl transform scale-90 opacity-0 transition-all duration-500 flex flex-col items-center border border-white relative overflow-hidden');
    
    const starsContainer = el('div', 'flex gap-3 mb-4');
    const starsCount = state.cleanliness >= 80 ? 3 : (state.cleanliness >= 60 ? 2 : (state.cleanliness >= 40 ? 1 : 0));
    for(let i=0; i<3; i++) {
        const star = el('div', 'text-5xl md:text-6xl drop-shadow-md transition-all duration-300 opacity-0 transform translate-y-4');
        star.textContent = i < starsCount ? '⭐' : '⬛';
        if (i >= starsCount) star.style.filter = 'grayscale(100%) opacity(30%)';
        starsContainer.appendChild(star);
        setTimeout(() => {
            star.classList.remove('opacity-0', 'translate-y-4');
            star.classList.add('scale-110');
            setTimeout(() => star.classList.remove('scale-110'), 200);
            SoundManager.pop();
        }, 300 + (i * 200));
    }

    const titleColor = state.cleanliness >= 80 ? 'text-green-500' : (state.cleanliness >= 50 ? 'text-orange-500' : 'text-red-500');
    const mTitle = el('h2', `font-["Baloo_2"] text-4xl font-extrabold mb-4 ${titleColor}`, `สะอาด ${Math.floor(state.cleanliness)}%!`);
    
    let detailText = '';
    if (currentChoiceId === 1) detailText = 'เยี่ยมมาก! การล้างด้วยสบู่และน้ำ 20 วินาที ช่วยทำลายเกราะไขมันของเชื้อโรคและชะล้างออกได้หมดจด 100% ปลอดภัยที่สุดสำหรับการกินอาหาร 💯';
    else if (currentChoiceId === 2) detailText = 'ดีมาก! เจลแอลกอฮอล์ช่วยฆ่าเชื้อโรคได้ 100% อย่างรวดเร็ว เหมาะพกพา แต่ถ้ามือเปื้อนคราบมัน อาจจะออกไม่หมดนะ ✨';
    else if (currentChoiceId === 3) detailText = 'รวดเร็วทันใจ! สเปรย์แอลกอฮอล์ฆ่าเชื้อได้ไวและทำความสะอาดได้ 100% แต่ต้องฉีดให้ชุ่มพอและทั่วถึงทุกซอกนิ้ว 💦';
    else if (currentChoiceId === 4) detailText = 'ระวัง! การล้างน้ำเปล่าชะล้างฝุ่นออกได้บ้าง แต่ไม่สามารถทำลายเชื้อโรคที่เกาะติดผิวได้ ทำให้มือสะอาดได้เพียง 50% เท่านั้น ⚠️';
    else if (currentChoiceId === 5) detailText = 'พอใช้ได้! ทิชชูเปียกช่วยเช็ดคราบเปื้อนออกได้ดี แต่ไม่สามารถฆ่าเชื้อโรคฝังแน่นได้ทั้งหมด ทำให้สะอาดสูงสุดที่ 70% 🧻';
    else if (currentChoiceId === 6) detailText = 'อันตราย! การไม่ล้างมือเลย ทำให้เชื้อโรคทุกตัวพร้อมเข้าสู่ร่างกายผ่านอาหารที่คุณหยิบจับ เสี่ยงท้องเสียสูงมาก! 🦠';

    const descBox = el('p', 'text-gray-600 text-sm md:text-base mb-6 leading-relaxed font-medium bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-left');
    descBox.textContent = detailText;

    const btn = Button({
      text: 'ไปเลือกอาหารกัน! 🛒',
      variant: 'primary',
      className: 'w-full py-4 text-2xl font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1',
      onClick: () => {
        store.updateCleanlinessScore(state.cleanliness);
        store.setStageScore('02_Hygiene', state.cleanliness);
        store.setStage('03_Supermarket');
      }
    });

    card.appendChild(starsContainer); 
    card.appendChild(mTitle);
    card.appendChild(descBox);
    card.appendChild(btn);
    modalBg.appendChild(card); 
    container.appendChild(modalBg);
    
    requestAnimationFrame(() => { 
        modalBg.classList.remove('opacity-0'); 
        card.classList.remove('scale-90', 'opacity-0'); 
    });
  };

  const style = el('style');
  style.textContent = `
    @keyframes customFloatUp {
      0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-100vh) scale(1.5) rotate(360deg); opacity: 0; }
    }
    .animate-float {
      animation: customFloatUp 8s linear infinite;
    }
  `;
  container.appendChild(style);

  return container;
}
