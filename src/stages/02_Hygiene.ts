import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import confetti from 'canvas-confetti';

export function renderHygiene(): HTMLElement {
  const styleId = 'hygiene-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes floatUp {
        0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
        20% { opacity: 0.8; }
        80% { opacity: 0.6; }
        100% { transform: translateY(-20vh) scale(1.5) rotate(360deg); opacity: 0; }
      }
      .bg-bubble {
        position: absolute;
        bottom: -50px;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.5) 40%, rgba(135,206,235,0.2) 80%, rgba(255,255,255,0.9));
        border-radius: 50%;
        box-shadow: inset -2px -2px 10px rgba(135,206,235,0.5), inset 2px 2px 10px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.5);
        pointer-events: none;
        animation: floatUp linear infinite;
        z-index: 1;
      }
      .bg-gradient-animated {
        background: linear-gradient(180deg, #89CFF0, #E0F6FF, #a0d8f1, #89CFF0);
        background-size: 100% 300%;
        animation: gradientMove 8s ease infinite;
      }
      @keyframes gradientMove {
        0% { background-position: 0% 0%; }
        50% { background-position: 0% 100%; }
        100% { background-position: 0% 0%; }
      }
      .bg-element {
        position: absolute;
        font-size: 5rem;
        opacity: 0.15;
        z-index: 0;
        pointer-events: none;
        animation: floatElement 6s ease-in-out infinite alternate;
      }
      @keyframes floatElement {
        0% { transform: translateY(0) rotate(-10deg); }
        100% { transform: translateY(-30px) rotate(10deg); }
      }
      .germ-explode {
        animation: explode 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
      }
      @keyframes explode {
        0% { transform: scale(1); opacity: 1; }
        40% { transform: scale(1.8); opacity: 0.9; }
        100% { transform: scale(0); opacity: 0; }
      }
      .bubble-ring {
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: inset 0 0 30px rgba(255,255,255,0.9), 0 0 20px rgba(135,206,235,0.4);
        border: 4px solid rgba(255,255,255,0.8);
        backdrop-filter: blur(2px);
      }
      .star-anim {
        animation: starPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        transform: scale(0);
      }
      @keyframes starPop {
        0% { transform: scale(0) rotate(-45deg); opacity: 0; }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .glowing-text {
        text-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px #FFD700;
      }
      .progress-transition {
        transition: stroke-dashoffset 0.1s ease-out, stroke 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  const container = el('div', 'w-full h-full relative overflow-hidden bg-gradient-animated flex flex-col items-center justify-between py-6 px-4 font-sans select-none');

  const observer = new MutationObserver((mutations) => {
    if (!document.body.contains(container)) {
      const styleEl = document.getElementById(styleId);
      if (styleEl) document.head.removeChild(styleEl);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Background elements
  const decor1 = el('div', 'bg-element top-[10%] left-[5%]'); decor1.textContent = '🧴';
  const decor2 = el('div', 'bg-element top-[60%] right-[5%]'); decor2.textContent = '💧';
  const decor3 = el('div', 'bg-element bottom-[15%] left-[10%]'); decor3.textContent = '🫧';
  decor2.style.animationDelay = '-2s'; decor3.style.animationDelay = '-4s';
  container.appendChild(decor1); container.appendChild(decor2); container.appendChild(decor3);

  // Animated background bubbles
  for(let i = 0; i < 15; i++) {
    const b = el('div', 'bg-bubble');
    const size = 20 + Math.random() * 60;
    b.style.width = `\${size}px`; b.style.height = `\${size}px`;
    b.style.left = `\${Math.random() * 100}%`;
    b.style.animationDuration = `\${4 + Math.random() * 6}s`;
    b.style.animationDelay = `\${Math.random() * 5}s`;
    container.appendChild(b);
  }

  // Header Section
  const header = el('div', 'w-full flex flex-col items-center z-10 relative mt-4');
  
  const stageBadge = el('div', 'absolute top-0 right-4 bg-white/90 px-4 py-1.5 rounded-full shadow-sm text-[#1CB0F6] font-bold border-2 border-[#1CB0F6]/20 backdrop-blur-sm');
  stageBadge.textContent = 'ด่าน 1 / 5';
  header.appendChild(stageBadge);

  const title = el('h1', 'text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md z-10 font-["Baloo_2"] flex items-center gap-2');
  title.style.textShadow = '0 4px 0 #1CB0F6, 0 8px 15px rgba(0,0,0,0.1)';
  title.textContent = '🧼 ภารกิจล้างมือ!';
  
  const progressText = el('p', 'text-2xl text-[#1CB0F6] font-extrabold bg-white/80 px-6 py-2 rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm');
  progressText.textContent = '0% สะอาด!';

  header.appendChild(title);
  header.appendChild(progressText);
  container.appendChild(header);

  // Game Area
  const gameAreaWrapper = el('div', 'relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex flex-col items-center justify-center z-20 my-auto');
  
  const gameArea = el('div', 'relative w-full h-full bubble-ring flex items-center justify-center cursor-pointer overflow-visible transition-transform active:scale-95');
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] -rotate-90 pointer-events-none drop-shadow-md');
  
  const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleBg.setAttribute('cx', '50%'); circleBg.setAttribute('cy', '50%'); circleBg.setAttribute('r', '44%');
  circleBg.setAttribute('fill', 'none'); circleBg.setAttribute('stroke', 'rgba(255,255,255,0.6)'); circleBg.setAttribute('stroke-width', '24');
  circleBg.setAttribute('stroke-linecap', 'round');

  const circleProgress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleProgress.setAttribute('cx', '50%'); circleProgress.setAttribute('cy', '50%'); circleProgress.setAttribute('r', '44%');
  circleProgress.setAttribute('fill', 'none'); circleProgress.setAttribute('stroke', '#E5E5E5');
  circleProgress.setAttribute('stroke-width', '24'); circleProgress.setAttribute('stroke-dasharray', '276%');
  circleProgress.setAttribute('stroke-dashoffset', '276%'); circleProgress.setAttribute('stroke-linecap', 'round');
  circleProgress.setAttribute('class', 'progress-transition');
  
  svg.appendChild(circleBg); svg.appendChild(circleProgress); gameArea.appendChild(svg);

  const handIcon = el('div', 'text-8xl md:text-[160px] transition-transform duration-200 pointer-events-none drop-shadow-xl z-20');
  handIcon.textContent = '🖐️';
  gameArea.appendChild(handIcon);

  const germs: HTMLElement[] = [];
  const totalGerms = 8;
  for(let i=0; i<totalGerms; i++) {
    const germ = el('div', 'absolute text-4xl pointer-events-none z-30 transition-all');
    germ.textContent = '🦠';
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 70;
    germ.style.transform = `translate(\${Math.cos(angle)*radius}px, \${Math.sin(angle)*radius}px)`;
    germ.dataset.removed = "false";
    germs.push(germ);
    gameArea.appendChild(germ);
  }

  const bubblesContainer = el('div', 'absolute inset-0 pointer-events-none overflow-hidden rounded-full z-40');
  gameArea.appendChild(bubblesContainer);
  gameAreaWrapper.appendChild(gameArea);
  container.appendChild(gameAreaWrapper);

  // Bottom Area
  const bottomArea = el('div', 'w-full max-w-md bg-white rounded-[30px] p-6 shadow-xl border-b-8 border-gray-200 z-10 flex flex-col gap-4 mb-4');
  
  const instrCard = el('div', 'bg-[#E0F6FF] text-[#1CB0F6] font-bold text-xl p-4 rounded-2xl text-center animate-pulse border-2 border-[#1CB0F6]/20');
  instrCard.textContent = 'ถูมือไปมาเพื่อล้างเชื้อโรค!';
  
  const statsRow = el('div', 'flex justify-between items-center px-2');
  const germCountLabel = el('span', 'text-lg font-bold text-gray-600');
  germCountLabel.textContent = `🦠 เชื้อโรคเหลือ: \${totalGerms} ตัว`;
  const xpBadge = el('span', 'text-lg font-bold text-[#FF9600] flex items-center gap-1');
  xpBadge.textContent = '⭐ +50 XP';
  
  statsRow.appendChild(germCountLabel);
  statsRow.appendChild(xpBadge);

  const xpProgressContainer = el('div', 'h-4 w-full bg-gray-100 rounded-full overflow-hidden');
  const xpProgressBar = el('div', 'h-full bg-[#FF9600] rounded-full transition-all duration-300 w-0');
  xpProgressContainer.appendChild(xpProgressBar);
  
  bottomArea.appendChild(instrCard);
  bottomArea.appendChild(statsRow);
  bottomArea.appendChild(xpProgressContainer);
  container.appendChild(bottomArea);

  const state = { cleanliness: 0, isComplete: false, lastX: 0, lastY: 0 };

  const createInteractBubble = (x: number, y: number) => {
    const bubble = el('div', 'absolute bg-blue-100/80 rounded-full border border-white backdrop-blur-sm shadow-sm');
    const size = 15 + Math.random() * 35;
    bubble.style.width = `\${size}px`; bubble.style.height = `\${size}px`;
    const rect = gameArea.getBoundingClientRect();
    bubble.style.left = `\${x - rect.left - size/2}px`; bubble.style.top = `\${y - rect.top - size/2}px`;
    bubblesContainer.appendChild(bubble);
    bubble.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
      { transform: `translate(\${(Math.random()-0.5)*120}px, -150px) scale(1.8)`, opacity: 0 }
    ], { duration: 800 + Math.random() * 800, easing: 'ease-out' }).onfinish = () => bubble.remove();
  };

  const getProgressColor = (percent: number) => {
    if (percent < 40) return '#AFAFAF';
    if (percent < 80) return '#1CB0F6';
    return '#58CC02';
  };

  const handleWash = (x: number, y: number) => {
    if (state.isComplete) return;
    const dx = x - state.lastX; const dy = y - state.lastY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 3) {
      state.cleanliness = Math.min(100, state.cleanliness + 2);
      state.lastX = x; state.lastY = y;
      
      const percent = state.cleanliness;
      progressText.textContent = `\${Math.floor(percent)}% สะอาด!`;
      
      const offset = 276 - (percent / 100) * 276;
      circleProgress.setAttribute('stroke-dashoffset', `\${offset}%`);
      circleProgress.setAttribute('stroke', getProgressColor(percent));
      
      xpProgressBar.style.width = `\${percent}%`;
      
      handIcon.style.transform = `scale(\${1 + (Math.sin(percent/5) * 0.05)})`;

      if (Math.random() > 0.5) createInteractBubble(x, y);

      const germsToKeep = Math.ceil(totalGerms * (1 - percent/100));
      germCountLabel.textContent = `🦠 เชื้อโรคเหลือ: \${germsToKeep} ตัว`;
      
      let removedCount = 0;
      germs.forEach((g) => {
        if (g.dataset.removed === "false" && removedCount < (totalGerms - germsToKeep)) {
          g.dataset.removed = "true";
          g.classList.add('germ-explode');
          SoundManager.pop();
          removedCount++;
        }
      });

      if (percent >= 100) {
        state.isComplete = true;
        handIcon.style.transform = 'scale(1)';
        SoundManager.fanfare();
        handIcon.textContent = '✨🖐️✨';
        handIcon.classList.add('animate-bounce');
        circleProgress.setAttribute('stroke', '#58CC02');
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#1CB0F6', '#58CC02', '#FFCB08', '#FFFFFF'] });
        setTimeout(() => showCompletionModal(), 1200);
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
    const modalBg = el('div', 'fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 opacity-0 transition-opacity duration-500');
    
    for (let i = 0; i < 20; i++) {
        const star = el('div', 'absolute text-yellow-300 text-2xl z-40');
        star.textContent = '✨';
        star.style.left = `\${10 + Math.random() * 80}%`;
        star.style.top = `\${10 + Math.random() * 80}%`;
        star.style.animation = `floatUp \${2 + Math.random() * 3}s linear infinite`;
        star.style.animationDelay = `\${Math.random() * 2}s`;
        modalBg.appendChild(star);
    }

    const card = el('div', 'bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl border-b-8 border-gray-200 transform scale-75 opacity-0 transition-all duration-500 flex flex-col items-center z-50 relative overflow-hidden');
    
    const cardDecor = el('div', 'absolute -top-10 -right-10 w-32 h-32 bg-[#FFCB08]/20 rounded-full blur-xl');
    card.appendChild(cardDecor);

    const starsContainer = el('div', 'flex gap-2 mb-6');
    for(let i=0; i<3; i++) {
        const star = el('div', 'text-6xl text-[#FFCB08] drop-shadow-md opacity-0');
        star.textContent = '⭐';
        starsContainer.appendChild(star);
        setTimeout(() => {
            star.classList.add('star-anim');
            SoundManager.pop();
        }, 300 + (i * 200));
    }

    const mTitle = el('h2', 'text-4xl font-black text-[#58CC02] mb-2 glowing-text mt-4', 'สะอาด 100%!');
    const xpReward = el('div', 'text-2xl font-bold text-[#FF9600] mb-8 mt-4 bg-[#FF9600]/10 px-6 py-2 rounded-full border-2 border-[#FF9600]/20 inline-block', '+50 XP ✨');
    
    const btn = Button({
      text: 'ไปกันเลย! 🛒',
      variant: 'primary',
      className: 'w-full py-5 text-2xl relative overflow-hidden group',
      onClick: () => { store.setStage('03_Supermarket'); }
    });
    
    const btnEffect = el('div', 'absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300');
    btn.appendChild(btnEffect);

    card.appendChild(starsContainer); card.appendChild(mTitle); card.appendChild(xpReward); card.appendChild(btn);
    modalBg.appendChild(card); container.appendChild(modalBg);
    
    requestAnimationFrame(() => { 
        modalBg.classList.remove('opacity-0'); 
        card.classList.remove('scale-75', 'opacity-0'); 
    });
  };

  return container;
}