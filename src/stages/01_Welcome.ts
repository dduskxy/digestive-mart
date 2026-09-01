import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import { ConsentModal } from '../components/ConsentModal';

export default function renderWelcome(): HTMLElement {
  // Main container
  // Using bg-welcome (assume defined in backgrounds.css) and full screen styles
  const container = el('div', 'w-full h-full min-h-screen bg-welcome flex flex-col md:flex-row items-center justify-center relative overflow-hidden font-sans font-["Baloo_2"]');

  // Inject custom styles for animations
  const style = el('style');
  style.textContent = `
    @keyframes gradient-text {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-text {
      background: linear-gradient(to right, #FF6B6B, #4ECDC4, #45B7D1, #FF6B6B);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradient-text 4s ease infinite;
    }
    @keyframes wavy {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-wavy {
      display: inline-block;
      animation: wavy 2s ease-in-out infinite;
    }
    @keyframes float-item {
      0% { transform: translateY(100vh) rotate(0deg) scale(0.8); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-20vh) rotate(360deg) scale(1.2); opacity: 0; }
    }
    .floating-item {
      position: absolute;
      animation: float-item linear infinite;
      z-index: 1;
    }
    @keyframes pulse-aura {
      0% { box-shadow: 0 0 0 0 rgba(28, 176, 246, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(28, 176, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(28, 176, 246, 0); }
    }
    .pulse-aura {
      animation: pulse-aura 2s infinite;
    }
    @keyframes particle-burst {
      0% { transform: scale(1) translate(0, 0); opacity: 1; }
      100% { transform: scale(0) translate(var(--tx), var(--ty)); opacity: 0; }
    }
    .particle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #FFF;
      border-radius: 50%;
      pointer-events: none;
      animation: particle-burst 0.6s ease-out forwards;
    }
    @keyframes button-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,107,107,0.5); }
      50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(255,142,83,0.8); }
    }
    .start-btn-anim {
      background: linear-gradient(135deg, #FF6B6B, #FF8E53);
      animation: button-pulse 2s infinite;
      border: 4px solid white;
    }
    .start-btn-anim:hover {
      animation: none;
      transform: scale(1.1);
      box-shadow: 0 0 50px rgba(255,142,83,1);
    }
    .input-glow:focus {
      box-shadow: 0 0 25px rgba(255, 107, 107, 0.6);
      border-color: #FF6B6B;
    }
  `;
  container.appendChild(style);

  // Floating decorations overlay
  const foods = ['🍎', '🥦', '🥕', '🍊', '🥛', '🍗', '✨', '🫧'];
  for (let i = 0; i < 20; i++) {
    const food = el('div', 'floating-item text-4xl md:text-6xl drop-shadow-lg');
    food.textContent = foods[Math.floor(Math.random() * foods.length)];
    food.style.left = `${Math.random() * 100}%`;
    food.style.animationDuration = `${10 + Math.random() * 15}s`;
    food.style.animationDelay = `${Math.random() * -20}s`;
    container.appendChild(food);
  }

  // Layout Panels
  const leftPanel = el('div', 'w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 z-10');
  const rightPanel = el('div', 'w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 z-10');

  // ==== LEFT PANEL: Character Showcase ====
  const charShowcase = el('div', 'bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-4 border-white/50');
  
  const charLabel = el('h2', 'text-2xl md:text-3xl font-black text-[#FF6B6B] mb-8 drop-shadow-sm');
  charLabel.textContent = 'เลือกตัวละครของคุณ';

  const previewArea = el('div', 'flex flex-col items-center mb-8 relative');
  const avatarPreview = el('div', 'text-9xl p-8 bg-gradient-to-br from-white to-blue-50 rounded-full pulse-aura border-4 border-white');
  
  const avatars = ['👦', '👧', '🧑', '🤖', '🐶', '🐱'];
  let selectedAvatar = avatars[0];
  avatarPreview.textContent = selectedAvatar;

  // Circular/Hexagonal Grid layout (flex wrap for simplicity but nicely styled)
  const avatarContainer = el('div', 'grid grid-cols-3 gap-4 w-full');
  
  const updateAvatar = () => {
    avatarPreview.textContent = selectedAvatar;
    // trigger a bounce on change
    avatarPreview.classList.remove('animate-bounce');
    void avatarPreview.offsetWidth; // trigger reflow
    avatarPreview.classList.add('animate-bounce');
  };

  avatars.forEach(av => {
    const btn = el('button', 'text-4xl p-4 bg-white/90 rounded-2xl hover:scale-110 hover:-translate-y-2 hover:bg-white hover:shadow-xl transition-all duration-300 active:scale-90 border-b-4 border-gray-200');
    btn.textContent = av;
    btn.onclick = () => {
      SoundManager.click();
      selectedAvatar = av;
      updateAvatar();
    };
    avatarContainer.appendChild(btn);
  });

  previewArea.appendChild(avatarPreview);
  charShowcase.appendChild(charLabel);
  charShowcase.appendChild(previewArea);
  charShowcase.appendChild(avatarContainer);
  leftPanel.appendChild(charShowcase);

  // ==== RIGHT PANEL: Title & Actions ====
  
  const titleContainer = el('div', 'text-center mb-12');
  const title = el('h1', 'text-6xl md:text-8xl font-black animate-gradient-text drop-shadow-lg mb-4');
  title.textContent = '🍽️ Digestion Mart';
  
  const subtitleContainer = el('div', 'text-3xl md:text-4xl font-black text-[#4E342E] drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] flex justify-center gap-2');
  const subText = 'มินิมาร์ทนักย่อยอาหารผจญภัย!';
  subText.split('').forEach((char, i) => {
    const span = el('span', 'animate-wavy inline-block');
    span.textContent = char;
    span.style.animationDelay = `${i * 0.1}s`;
    if(char === ' ') span.innerHTML = '&nbsp;';
    subtitleContainer.appendChild(span);
  });

  titleContainer.appendChild(title);
  titleContainer.appendChild(subtitleContainer);

  const actionContainer = el('div', 'bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-4 border-white/50');
  
  // Name Input
  const inputWrapper = el('div', 'relative w-full mb-8');
  const nameInput = el('input', 'input-glow w-full px-6 py-5 rounded-3xl bg-white/90 border-4 border-transparent text-[#4B4B4B] font-black text-2xl text-center focus:outline-none transition-all shadow-inner placeholder-gray-400');
  (nameInput as HTMLInputElement).type = 'text';
  (nameInput as HTMLInputElement).placeholder = 'ชื่อของคุณ...';
  (nameInput as HTMLInputElement).value = store.state.player.name || '';
  inputWrapper.appendChild(nameInput);

  // Start Button
  const startBtnWrapper = el('div', 'relative w-full mb-8');
  const startBtn = el('button', 'start-btn-anim w-full rounded-full text-white font-black text-4xl py-6 px-8 shadow-2xl transition-all relative overflow-hidden');
  startBtn.textContent = 'เริ่มผจญภัย! 🚀';
  
  startBtn.onclick = (e) => {
    SoundManager.success();
    // Particle burst effect
    const rect = startBtn.getBoundingClientRect();
    for(let i=0; i<20; i++) {
      const p = el('div', 'particle');
      p.style.left = `\${e.clientX - rect.left}px`;
      p.style.top = `\${e.clientY - rect.top}px`;
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
      p.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
      startBtn.appendChild(p);
    }
    
    setTimeout(() => {
      const name = (nameInput as HTMLInputElement).value.trim() || 'นักผจญภัย';
      store.update({ player: { ...store.state.player, name, avatar: selectedAvatar } });
      
      // Show ConsentModal FIRST before proceeding to next stage
      if (!store.state.camera.consentShown) {
        const consentModal = new ConsentModal(() => {
          // After consent is handled, move to next stage
          store.setStage('02_Hygiene');
        });
        consentModal.mount();
      } else {
        // If consent was already shown in this session, skip it
        store.setStage('02_Hygiene');
      }
    }, 600); // wait for burst
  };
  startBtnWrapper.appendChild(startBtn);

  // Menu Options
  const menuOptions = el('div', 'flex gap-4 w-full justify-center');
  
  const createMenuBtn = (text: string, onClick: () => void) => {
    const btn = el('button', 'flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-2 rounded-2xl shadow border-b-4 border-gray-200 hover:-translate-y-1 transition-all text-sm md:text-base');
    btn.textContent = text;
    btn.onclick = () => {
      SoundManager.click();
      onClick();
    };
    return btn;
  };

  menuOptions.appendChild(createMenuBtn('📖 วิธีเล่น', () => alert('วิธีเล่น: เลือกอาหารที่มีประโยชน์!')));
  menuOptions.appendChild(createMenuBtn('🏆 ความสำเร็จ', () => alert('ความสำเร็จ (เร็วๆนี้)')));
  menuOptions.appendChild(createMenuBtn('🔊 เสียง', () => {
    alert('สลับเสียง (เปิด/ปิด)');
  }));

  actionContainer.appendChild(inputWrapper);
  actionContainer.appendChild(startBtnWrapper);
  actionContainer.appendChild(menuOptions);

  rightPanel.appendChild(titleContainer);
  rightPanel.appendChild(actionContainer);

  container.appendChild(leftPanel);
  container.appendChild(rightPanel);

  return container;
}