import { store } from '../state/store';
import { el, Button, Modal, HealthTag, NutrientChip } from './UI';
import { SoundManager } from '../audio/SoundManager';
import { FoodItem } from '../data/foods';

const MAX_BUDGET = 500;
const MAX_ITEMS = 5;

export function renderCartModal(onClose: () => void): HTMLElement {
  const cart = store.state.cart;
  const isReady = cart.length === MAX_ITEMS;

  const card = el('div', 'bg-slate-900 w-full md:w-[600px] md:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out] border border-slate-700/50');
  
  // Header
  const header = el('div', 'p-5 flex justify-between items-center border-b border-slate-800 bg-slate-800/30 rounded-t-3xl');
  const titleContainer = el('div', 'flex items-center gap-3');
  const title = el('h2', 'text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 flex items-center gap-2', '🎒 กระเป๋าเสบียง');
  const progressText = el('div', 'text-sm font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2');
  progressText.innerHTML = `<span class="w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}"></span> ${cart.length}/${MAX_ITEMS} รายการ`;
  
  titleContainer.appendChild(title);
  titleContainer.appendChild(progressText);
  
  const closeBtn = el('button', 'w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all font-bold text-xl', '✕');
  closeBtn.onclick = () => { SoundManager.click(); onClose(); };
  header.appendChild(titleContainer);
  header.appendChild(closeBtn);
  
  // Item List
  const content = el('div', 'flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-slate-900/50');
  
  if (cart.length === 0) {
    const empty = el('div', 'flex flex-col items-center justify-center h-64 text-slate-500 gap-4');
    const emptyIcon = el('div', 'text-6xl opacity-30 drop-shadow-lg', '🎒');
    const emptyText = el('div', 'font-bold text-xl text-slate-400', 'กระเป๋ายังว่างเปล่า');
    const emptySub = el('div', 'text-sm', 'เลือกเสบียงที่มีประโยชน์เพื่อออกเดินทาง!');
    empty.appendChild(emptyIcon); empty.appendChild(emptyText); empty.appendChild(emptySub);
    content.appendChild(empty);
  } else {
    cart.forEach((item, index) => {
      const row = el('div', 'group flex items-start sm:items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all shadow-sm animate-[fadeIn_0.3s_ease-out] relative');
      
      const healthColors = {
        excellent: 'bg-green-500/20 border-green-500/50',
        moderate: 'bg-blue-500/20 border-blue-500/50',
        avoid: 'bg-red-500/20 border-red-500/50'
      };
      
      const iconWrap = el('div', `text-5xl ${healthColors[item.healthTag]} min-w-[80px] h-[80px] rounded-2xl flex items-center justify-center shadow-inner border`, item.emoji);
      
      const info = el('div', 'flex-1 z-10 flex flex-col gap-2');
      const headerRow = el('div', 'flex justify-between items-start');
      const name = el('div', 'font-bold text-xl text-slate-100', item.nameTh);
      const price = el('div', 'font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 text-sm flex items-center gap-1', `🪙 ${item.price} G`);
      headerRow.appendChild(name); headerRow.appendChild(price);
      
      const tagsRow = el('div', 'flex flex-wrap items-center gap-2');
      tagsRow.appendChild(HealthTag(item.healthTag));
      tagsRow.appendChild(NutrientChip('⚡', `${item.calories} kcal`, 'text-amber-300'));
      tagsRow.appendChild(NutrientChip('💪', `${item.proteinG}g`, 'text-rose-300'));
      tagsRow.appendChild(NutrientChip('🌾', `${item.carbsG}g`, 'text-orange-300'));
      tagsRow.appendChild(NutrientChip('🧈', `${item.fatG}g`, 'text-yellow-300'));
      
      info.appendChild(headerRow);
      info.appendChild(tagsRow);
      
      row.appendChild(iconWrap);
      row.appendChild(info);
      
      const removeBtn = el('button', 'absolute -top-3 -right-3 w-8 h-8 bg-slate-800 border-2 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500 hover:bg-slate-900 rounded-full flex items-center justify-center shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100 sm:opacity-100', '✕');
      removeBtn.onclick = () => {
        SoundManager.click();
        if(confirm(`นำ ${item.nameTh} ออกจากกระเป๋า?`)) {
          store.removeFromCart(index);
          const modalNode = document.getElementById('cart-modal-container');
          if(modalNode) modalNode.replaceWith(renderCartModal(onClose));
        }
      };
      row.appendChild(removeBtn);
      
      content.appendChild(row);
    });
  }
  
  // Progress Section (Slots & Budget)
  const progressSection = el('div', 'p-4 md:p-6 bg-slate-900 border-t border-slate-800 flex flex-col gap-4');
  
  const slotsContainer = el('div', 'flex justify-center gap-2 md:gap-4');
  for (let i = 0; i < MAX_ITEMS; i++) {
    const slot = el('div', 'w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl transition-all');
    if (i < cart.length) {
      slot.className += ' bg-slate-800 border-2 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      slot.textContent = cart[i].emoji;
    } else {
      slot.className += ' border-2 border-dashed border-slate-700 bg-slate-800/30 text-slate-600 opacity-50';
      slot.textContent = '🔒';
    }
    slotsContainer.appendChild(slot);
  }
  
  const totalSpent = cart.reduce((sum, item) => sum + item.price, 0);
  const budgetBarWrap = el('div', 'flex flex-col gap-1 w-full max-w-md mx-auto');
  const budgetLabels = el('div', 'flex justify-between text-xs font-bold text-slate-400');
  const spentLabel = el('span', '', `จ่ายไป: ${totalSpent} G`);
  const remainLabel = el('span', 'text-amber-400', `เหลือ: ${MAX_BUDGET - totalSpent} G`);
  budgetLabels.appendChild(spentLabel); budgetLabels.appendChild(remainLabel);
  
  const barBg = el('div', 'w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700');
  const percent = Math.min(100, (totalSpent / MAX_BUDGET) * 100);
  let barColor = 'bg-amber-400';
  if (percent > 80) barColor = 'bg-orange-500';
  if (percent >= 100) barColor = 'bg-red-500';
  const barFill = el('div', `h-full ${barColor} transition-all duration-300`);
  barFill.style.width = `${percent}%`;
  barBg.appendChild(barFill);
  budgetBarWrap.appendChild(budgetLabels); budgetBarWrap.appendChild(barBg);
  
  progressSection.appendChild(slotsContainer);
  progressSection.appendChild(budgetBarWrap);
  
  // Footer
  const footer = el('div', 'p-5 md:p-6 bg-slate-800/80 border-t border-slate-700 md:rounded-b-3xl flex flex-col gap-4');
  
  const totals = el('div', 'flex flex-wrap justify-center gap-3 text-xs md:text-sm font-bold bg-slate-900/50 p-3 rounded-xl border border-slate-700/50');
  const tCal = cart.reduce((sum, item) => sum + item.calories, 0);
  const tPro = cart.reduce((sum, item) => sum + item.proteinG, 0);
  const tCarb = cart.reduce((sum, item) => sum + item.carbsG, 0);
  const tFat = cart.reduce((sum, item) => sum + item.fatG, 0);
  
  const totalTitle = el('span', 'text-slate-400 mr-2', 'รวมพลังงาน:');
  totals.appendChild(totalTitle);
  totals.appendChild(el('span', 'text-amber-300', `⚡ ${tCal} kcal`));
  totals.appendChild(el('span', 'text-slate-500', '|'));
  totals.appendChild(el('span', 'text-rose-300', `💪 ${tPro}g`));
  totals.appendChild(el('span', 'text-slate-500', '|'));
  totals.appendChild(el('span', 'text-orange-300', `🌾 ${tCarb}g`));
  totals.appendChild(el('span', 'text-slate-500', '|'));
  totals.appendChild(el('span', 'text-yellow-300', `🧈 ${tFat}g`));
  
  footer.appendChild(totals);
  
  if (!isReady) {
    const notice = el('div', 'text-center text-sm font-bold text-amber-500 bg-amber-500/10 py-2 rounded-xl border border-amber-500/20 animate-pulse', `⚠️ เลือกเสบียงให้ครบ 5 อย่าง! (ขาดอีก ${MAX_ITEMS - cart.length})`);
    footer.appendChild(notice);
  }
  
  const checkoutBtn = Button({
    text: isReady ? 'ออกเดินทาง! 🚀' : 'เลือกเสบียงต่อ',
    variant: isReady ? 'success' : 'secondary',
    className: 'w-full py-4 text-xl font-bold shadow-lg ' + (isReady ? 'animate-[pulse_2s_ease-in-out_infinite]' : 'opacity-70 grayscale'),
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