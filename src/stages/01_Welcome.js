import { store } from '../state/store.js';
import { el, Button, Card } from '../components/UI.js';
import { soundFx } from '../audio/sound.js';

export function renderWelcome() {
  const container = el('div', 'flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-100 to-green-100 p-4');
  
  const title = el('h1', 'text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 mb-2', 'Digestion Mart');
  const subtitle = el('h2', 'text-xl md:text-2xl font-bold text-gray-700 mb-8', 'มินิมาร์ทนักย่อยผจญภัย');

  const avatars = ['👦', '👧', '👨', '👩', '🐱', '🐶', '🤖', '👽'];
  let selectedAvatar = store.state.player.avatar || '👦';
  
  const avatarGrid = el('div', 'grid grid-cols-4 gap-4 mb-6');
  
  const renderAvatars = () => {
    avatarGrid.innerHTML = '';
    avatars.forEach(a => {
      const btn = el('button', 
        `text-4xl p-2 rounded-xl transition-all ${selectedAvatar === a ? 'bg-blue-200 scale-110 shadow-lg' : 'hover:bg-white/50 hover:scale-105'}`, 
        a, 
        {
          onClick: () => {
            soundFx.pop();
            selectedAvatar = a;
            renderAvatars();
          }
        }
      );
      avatarGrid.appendChild(btn);
    });
  };
  renderAvatars();

  const nameInput = el('input', 'px-4 py-3 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none mb-6 w-64 text-center', '', {
    placeholder: 'ใส่ชื่อของคุณ...',
    value: store.state.player.name
  });

  const startBtn = Button({
    text: 'เริ่มการผจญภัย!',
    variant: 'primary',
    className: 'text-xl px-8 py-4',
    onClick: () => {
      if (!nameInput.value.trim()) {
        soundFx.error();
        nameInput.classList.add('border-red-500', 'animate-pulse');
        setTimeout(() => nameInput.classList.remove('border-red-500', 'animate-pulse'), 1000);
        return;
      }
      soundFx.success();
      store.setPlayer(nameInput.value.trim(), selectedAvatar);
      store.setStage('02_Hygiene');
    }
  });

  const card = Card({
    className: 'flex flex-col items-center max-w-lg w-full',
    content: [
      el('p', 'text-gray-600 mb-4 text-center', 'เลือกตัวละครและตั้งชื่อของคุณก่อนเริ่มซื้ออาหาร!'),
      avatarGrid,
      nameInput,
      startBtn
    ]
  });

  container.appendChild(title);
  container.appendChild(subtitle);
  container.appendChild(card);

  return container;
}
