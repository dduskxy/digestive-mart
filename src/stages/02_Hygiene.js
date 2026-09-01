import { store } from '../state/store.js';
import { el, Button, Card } from '../components/UI.js';
import { soundFx } from '../audio/sound.js';
import confetti from 'canvas-confetti';

export function renderHygiene() {
  const container = el('div', 'flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-teal-100 to-cyan-100 p-4 relative overflow-hidden');
  
  const header = el('div', 'text-center mb-8', [
    el('h2', 'text-3xl font-bold text-teal-800 mb-2', 'ก่อนทานอาหาร ต้องทำอย่างไร?'),
    el('p', 'text-gray-700', 'เลือกว่าคุณจะจัดการความสะอาดก่อนเข้ามินิมาร์ทอย่างไร')
  ]);

  let phase = 'choice'; // 'choice', 'washing', 'done'

  const contentArea = el('div', 'w-full max-w-2xl flex flex-col items-center');

  const renderContent = () => {
    contentArea.innerHTML = '';
    
    if (phase === 'choice') {
      const btnWash = Button({
        text: '🧼 ล้างมือให้สะอาด',
        variant: 'primary',
        className: 'w-full py-4 text-xl mb-4 bg-teal-500 hover:bg-teal-600',
        onClick: () => {
          soundFx.click();
          phase = 'washing';
          renderContent();
          startWashingMinigame();
        }
      });

      const btnNoWash = Button({
        text: '❌ ไม่ล้าง ขี้เกียจ',
        variant: 'secondary',
        className: 'w-full py-4 text-xl mb-4',
        onClick: () => {
          soundFx.error();
          store.updateStat('germRisk', 15);
          phase = 'done';
          renderContent();
        }
      });

      const btnFloor = Button({
        text: '🦠 หยิบของตกพื้นกินเลย',
        variant: 'danger',
        className: 'w-full py-4 text-xl',
        onClick: () => {
          soundFx.fart();
          store.updateStat('germRisk', 35);
          phase = 'done';
          renderContent();
        }
      });

      contentArea.appendChild(Card({
        content: [btnWash, btnNoWash, btnFloor]
      }));
    } else if (phase === 'washing') {
      contentArea.innerHTML = `
        <div class="text-center">
          <h3 class="text-2xl font-bold text-teal-700 mb-4">จิ้มฟองสบู่ให้แตกให้หมด!</h3>
          <div id="bubble-container" class="relative w-80 h-80 bg-blue-100 rounded-2xl border-4 border-teal-300 overflow-hidden mx-auto shadow-inner cursor-crosshair"></div>
        </div>
      `;
    } else if (phase === 'done') {
      const risk = store.state.stats.germRisk;
      let msg = '';
      if (risk === 0) msg = '✅ ยอดเยี่ยม! มือคุณสะอาดมาก ภูมิคุ้มกัน +20';
      else if (risk <= 15) msg = '⚠️ ระวัง! มีเชื้อโรคติดมือ เสี่ยงท้องเสีย +15%';
      else msg = '🚨 อันตราย! เชื้อโรคเต็มๆ เสี่ยงท้องร่วง +35%';

      contentArea.appendChild(Card({
        content: [
          el('h3', 'text-2xl font-bold mb-4 text-center text-gray-800', msg),
          Button({
            text: 'เข้าสู่ Digestion Mart 🛒',
            variant: 'primary',
            className: 'w-full py-4 text-xl',
            onClick: () => {
              soundFx.success();
              store.setStage('03_Supermarket');
            }
          })
        ]
      }));
    }
  };

  const startWashingMinigame = () => {
    setTimeout(() => {
      const bc = document.getElementById('bubble-container');
      if (!bc) return;
      
      let bubblesLeft = 10;
      
      const popBubble = (b) => {
        soundFx.pop();
        b.remove();
        bubblesLeft--;
        if (bubblesLeft <= 0) {
          store.updateStat('immunity', store.state.stats.immunity + 20);
          store.updateStat('germRisk', 0);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          soundFx.success();
          phase = 'done';
          renderContent();
        }
      };

      for (let i=0; i<10; i++) {
        const b = document.createElement('div');
        b.className = 'absolute bg-white/50 border-2 border-white rounded-full shadow cursor-pointer animate-float backdrop-blur-sm';
        const size = 30 + Math.random() * 30;
        b.style.width = `${size}px`;
        b.style.height = `${size}px`;
        b.style.left = `${Math.random() * 80}%`;
        b.style.top = `${Math.random() * 80}%`;
        b.style.animationDelay = `${Math.random()}s`;
        
        b.onmousedown = () => popBubble(b);
        // support touch
        b.ontouchstart = (e) => { e.preventDefault(); popBubble(b); };
        
        bc.appendChild(b);
      }
    }, 100);
  };

  renderContent();

  container.appendChild(header);
  container.appendChild(contentArea);

  return container;
}
