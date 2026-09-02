import { store } from '../state/store';
import { el, Button, Modal, NutrientChip } from './UI';
import { SoundManager } from '../audio/SoundManager';
import { FoodItem } from '../data/foods';


const MAX_ITEMS = 5;

export function renderCartModal(onClose: () => void): HTMLElement {
  const cart = store.state.cart;
  const isReady = cart.length === MAX_ITEMS;

  const card = el('div', 'bg-white/90 backdrop-blur-xl w-full md:w-[600px] md:rounded-[32px] rounded-t-[32px] max-h-[90vh] flex flex-col shadow-2xl animate-[slideUp_0.3s_ease-out] border-4 border-white');
  
  // Header
  const header = el('div', 'p-6 flex justify-between items-center border-b border-orange-100 bg-white/50 rounded-t-[28px]');
  const titleContainer = el('div', 'flex items-center gap-3');
  const title = el('h2', 'text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 flex items-center gap-2 font-["Baloo_2"]', '🛒 ตะกร้าสินค้า');
  const progressText = el('div', 'text-sm font-bold text-slate-600 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200 flex items-center gap-2 shadow-sm');
  progressText.innerHTML = `<span class="w-2.5 h-2.5 rounded-full ${isReady ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-orange-500 animate-pulse'}"></span> ${cart.length}/${MAX_ITEMS} รายการ`;
  
  titleContainer.appendChild(title);
  titleContainer.appendChild(progressText);
  
  const closeBtn = el('button', 'w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-all font-bold text-xl shadow-sm', '✕');
  closeBtn.onclick = () => { SoundManager.click(); onClose(); };
  header.appendChild(titleContainer);
  header.appendChild(closeBtn);
  
  // Item List
  const content = el('div', 'flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-slate-50/50');
  
  if (cart.length === 0) {
    const empty = el('div', 'flex flex-col items-center justify-center h-64 text-slate-400 gap-4');
    const emptyIcon = el('div', 'text-7xl opacity-50 drop-shadow-sm', '🛒');
    const emptyText = el('div', 'font-black text-2xl text-slate-300', 'ตะกร้ายังว่างเปล่า');
    const emptySub = el('div', 'text-base font-medium', 'เลือกของกินอร่อยๆ ลงตะกร้าเลย!');
    empty.appendChild(emptyIcon); empty.appendChild(emptyText); empty.appendChild(emptySub);
    content.appendChild(empty);
  } else {
    cart.forEach((item, index) => {
      const row = el('div', 'group flex items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-300 hover:shadow-md transition-all relative');
      
      const iconWrap = el('div', 'text-5xl bg-gradient-to-br from-orange-50 to-rose-50 min-w-[80px] h-[80px] rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:scale-105 transition-transform', item.emoji);
      
      const info = el('div', 'flex-1 z-10 flex flex-col justify-center');
      const name = el('div', 'font-black text-xl text-slate-700', item.nameTh);
      info.appendChild(name);
      
      row.appendChild(iconWrap);
      row.appendChild(info);
      
      const removeBtn = el('button', 'absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-400 hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100 sm:opacity-100', '✕');
      removeBtn.onclick = () => {
        SoundManager.click();
        if(confirm(`นำ ${item.nameTh} ออกจากกระเป๋า?`)) {
          store.removeFromCart(index);
          // Modal will be re-rendered via store subscription in Supermarket
        }
      };
      row.appendChild(removeBtn);
      
      content.appendChild(row);
    });
  }
  
  // Progress Section (Slots only, no budget)
  const progressSection = el('div', 'p-4 md:p-6 bg-white/80 border-t border-orange-100 flex flex-col gap-4');
  
  const slotsContainer = el('div', 'flex justify-center gap-3 md:gap-5');
  for (let i = 0; i < MAX_ITEMS; i++) {
    const slot = el('div', 'w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all');
    if (i < cart.length) {
      slot.className += ' bg-gradient-to-br from-orange-100 to-rose-100 border-2 border-white shadow-md transform scale-110';
      slot.textContent = cart[i].emoji;
    } else {
      slot.className += ' border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300';
      slot.textContent = '🔒';
    }
    slotsContainer.appendChild(slot);
  }
  
  progressSection.appendChild(slotsContainer);
  
  // Footer
  const footer = el('div', 'p-5 md:p-6 bg-slate-50/80 border-t border-slate-100 md:rounded-b-[28px] flex flex-col gap-4');
  
  // No totals shown in footer anymore
  
  if (!isReady) {
    const notice = el('div', 'text-center text-sm font-bold text-orange-600 bg-orange-100 py-3 rounded-xl border border-orange-200 animate-pulse', `⚠️ เลือกอาหารให้ครบ 5 อย่าง! (ขาดอีก ${MAX_ITEMS - cart.length})`);
    footer.appendChild(notice);
  }
  
  const checkoutBtn = Button({
    text: isReady ? 'เริ่มย่อยอาหาร! 🚀' : 'เลือกอาหารต่อ',
    variant: isReady ? 'success' : 'secondary',
    className: 'w-full py-4 text-xl font-bold rounded-2xl ' + (isReady ? 'animate-[pulse_2s_ease-in-out_infinite] shadow-lg shadow-emerald-500/30' : 'opacity-70 grayscale'),
    onClick: () => {
      SoundManager.click();
      if (!isReady) {
        onClose();
        return;
      }
      SoundManager.success();
      onClose();
      SoundManager.stopBGM();
      store.setStage('04_DigestionJourney');
    }
  });
  
  footer.appendChild(checkoutBtn);
  
  card.appendChild(header); 
  card.appendChild(content); 
  card.appendChild(progressSection);
  card.appendChild(footer);
  
  const modal = Modal(card, onClose);
  modal.id = 'cart-modal-container';
  return modal;
}