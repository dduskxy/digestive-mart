import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import gsap from 'gsap';

export default function renderWelcome(): HTMLElement {
  const container = el('div', 'absolute inset-0 overflow-y-auto bg-gradient-to-b from-[#ff9a8b] via-[#ff6a88] to-[#ff99ac] font-sans');

  // Floating Organic Background Elements
  const createFloatItem = (emoji: string, size: string, duration: number, delay: number, startX: string, startY: string) => {
    const item = el('div', `absolute text-${size} opacity-30 select-none`);
    item.textContent = emoji;
    item.style.left = startX;
    item.style.top = startY;
    gsap.to(item, {
      y: '+=50',
      x: '+=30',
      rotation: 20,
      duration: duration,
      yoyo: true,
      repeat: -1,
      delay: delay,
      ease: 'sine.inOut'
    });
    return item;
  };

  container.appendChild(createFloatItem('🍎', '6xl', 4, 0, '10%', '20%'));
  container.appendChild(createFloatItem('🦠', '5xl', 5, 1, '80%', '15%'));
  container.appendChild(createFloatItem('💧', '7xl', 6, 2, '20%', '70%'));
  container.appendChild(createFloatItem('🥩', '6xl', 4.5, 0.5, '75%', '80%'));
  container.appendChild(createFloatItem('🦷', '5xl', 5.5, 1.5, '50%', '10%'));
  container.appendChild(createFloatItem('🧬', '8xl', 7, 0, '85%', '45%'));

  // Main content shell
  const shell = el('div', 'relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-8 px-4 py-8');

  // Hero Section
  const hero = el('div', 'text-center flex flex-col items-center animate-[slideUp_0.8s_ease-out] mt-4');
  
  const iconWrap = el('div', 'w-24 h-24 md:w-40 md:h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-6xl md:text-8xl shadow-[0_0_40px_rgba(255,255,255,0.4)] mb-4 md:mb-6 border-4 border-white/40 drop-shadow-2xl');
  iconWrap.textContent = '👅';
  gsap.to(iconWrap, { scale: 1.05, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  hero.appendChild(iconWrap);

  const title = el('h1', 'font-black text-5xl md:text-8xl text-white drop-shadow-[0_4px_4px_rgba(200,30,50,0.6)] mb-2 md:mb-4 tracking-tight');
  title.innerHTML = `Body <span class="text-[#ffe066]">Quest</span>`;
  hero.appendChild(title);

  const subtitle = el('p', 'text-lg md:text-3xl font-bold text-white/90 drop-shadow-md max-w-2xl leading-relaxed mb-4 md:mb-8');
  subtitle.textContent = 'เตรียมตัวให้พร้อม! เรากำลังจะย่อส่วนเข้าสู่ "ระบบย่อยอาหาร" อันน่าทึ่งของมนุษย์';
  hero.appendChild(subtitle);

  // Form Card
  const formCard = el('div', 'w-full max-w-3xl rounded-[40px] bg-white/95 p-6 md:p-12 shadow-[0_30px_60px_-15px_rgba(200,30,50,0.4)] backdrop-blur-xl border-8 border-white/50 flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-8');
  
  // Left: Avatar
  const avatarSection = el('div', 'flex flex-col items-center w-full md:w-1/2');
  const avatarHeader = el('h3', 'text-base md:text-lg font-black text-rose-500 mb-2 md:mb-4 uppercase tracking-widest');
  avatarHeader.textContent = 'เลือกนักสำรวจ';
  avatarSection.appendChild(avatarHeader);

  const previewContainer = el('div', 'mx-auto mb-4 md:mb-6 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-[32px] bg-gradient-to-br from-rose-100 to-orange-100 shadow-inner border-4 border-rose-200');
  const avatarPreview = el('div', 'text-6xl md:text-7xl transition-transform duration-300 drop-shadow-xl');
  avatarPreview.textContent = '👦';
  previewContainer.appendChild(avatarPreview);
  avatarSection.appendChild(previewContainer);

  const avatars = ['👦', '👧', '🧑', '🤖', '🐶', '👽'];
  let selectedAvatar = avatars[0];

  const avatarGrid = el('div', 'grid grid-cols-3 gap-2 w-full max-w-[240px]');
  const buttons: HTMLElement[] = [];
  
  avatars.forEach((av) => {
    const btn = el('button', 'flex h-12 md:h-14 w-full items-center justify-center rounded-2xl bg-white border-2 border-slate-200 text-3xl transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 shadow-sm');
    btn.textContent = av;
    if (av === selectedAvatar) {
        btn.classList.add('border-rose-500', 'bg-rose-100', 'scale-110', 'shadow-md');
        btn.classList.remove('border-slate-200', 'bg-white');
    }
    btn.onclick = () => {
      SoundManager.click();
      selectedAvatar = av;
      avatarPreview.textContent = selectedAvatar;
      gsap.fromTo(avatarPreview, { scale: 0.5, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' });

      buttons.forEach(b => {
        if (b.textContent === selectedAvatar) {
            b.className = 'flex h-12 md:h-14 w-full items-center justify-center rounded-2xl bg-rose-100 border-2 border-rose-500 text-3xl transition-all duration-200 scale-110 shadow-md';
        } else {
            b.className = 'flex h-12 md:h-14 w-full items-center justify-center rounded-2xl bg-white border-2 border-slate-200 text-3xl transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 shadow-sm';
        }
      });
    };
    buttons.push(btn);
    avatarGrid.appendChild(btn);
  });
  avatarSection.appendChild(avatarGrid);
  
  // Right: Name & Start
  const formSection = el('div', 'flex flex-col w-full md:w-1/2 gap-4 md:gap-6');
  
  const nameInputWrapper = el('div', 'w-full');
  const nameLabel = el('label', 'block mb-2 text-base md:text-lg font-black text-rose-500 uppercase tracking-widest pl-1');
  nameLabel.textContent = 'ชื่อของคุณ';
  nameInputWrapper.appendChild(nameLabel);

  const nameInput = el('input', 'w-full rounded-[24px] border-4 border-rose-100 bg-rose-50/50 px-4 py-3 md:px-6 md:py-5 text-xl md:text-2xl font-black text-rose-900 outline-none transition-all focus:border-rose-400 focus:bg-white text-center placeholder-rose-300 shadow-inner');
  (nameInput as HTMLInputElement).type = 'text';
  (nameInput as HTMLInputElement).placeholder = 'พิมพ์ชื่อ... (ไม่ระบุก็ได้)';
  (nameInput as HTMLInputElement).value = store.state.player.name || '';
  nameInputWrapper.appendChild(nameInput);
  formSection.appendChild(nameInputWrapper);

  const startBtn = Button({
    text: 'ออกผจญภัย! 🚀',
    variant: 'primary',
    className: 'w-full py-4 md:py-5 text-2xl md:text-3xl font-black rounded-[24px] shadow-[0_10px_25px_rgba(244,63,94,0.4)] animate-bounce',
    onClick: () => {
      const inputVal = (nameInput as HTMLInputElement).value.trim() || 'นักสำรวจ';
      SoundManager.success();
      store.setPlayer(inputVal, selectedAvatar);
      store.setStage('02_Hygiene');
    }
  });
  formSection.appendChild(startBtn);

  formCard.appendChild(avatarSection);
  formCard.appendChild(formSection);

  shell.appendChild(hero);
  shell.appendChild(formCard);
  container.appendChild(shell);

  return container;
}