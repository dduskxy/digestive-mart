import { foods } from '../data/foods';
import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import { renderCartModal } from '../components/CartModal';

const MAX_BUDGET = 500;
const MAX_ITEMS = 5;

export function renderSupermarket(): HTMLElement {
  const container = el('div', 'w-full h-full min-h-screen relative flex flex-col font-sans text-slate-100 overflow-hidden');
  
  // Background
  const bg = el('div', 'absolute inset-0 z-0 bg-[url("supermarket_bg.jpg")] bg-cover bg-center');
  const overlay = el('div', 'absolute inset-0 z-0 bg-slate-900/85 backdrop-blur-sm');
  container.appendChild(bg);
  container.appendChild(overlay);

  const contentWrapper = el('div', 'relative z-10 flex flex-col h-full w-full max-h-screen');

  SoundManager.playBGM('supermarket');

  // Header
  const header = el('div', 'w-full p-4 md:p-6 border-b border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 bg-slate-900/50 backdrop-blur-md');
  
  const titleGroup = el('div', 'flex items-center gap-3 self-start md:self-auto');
  const title = el('h1', 'text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-["Baloo_2"] drop-shadow-sm leading-none pt-1', '🏪 ร้านค้าเสบียง');
  titleGroup.appendChild(title);

  // Search bar
  const searchBar = el('div', 'relative w-full md:w-1/3 flex items-center');
  const searchInput = el('input', 'w-full bg-slate-800/80 border border-slate-600 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all');
  (searchInput as HTMLInputElement).placeholder = 'ค้นหาสินค้า...';
  const searchIcon = el('span', 'absolute left-3 text-slate-400', '🔍');
  searchBar.appendChild(searchIcon);
  searchBar.appendChild(searchInput);

  const statsGroup = el('div', 'flex items-center gap-4 self-end md:self-auto');

  // Budget Display
  const budgetDisplay = el('div', 'flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 shadow-inner transition-colors duration-300');
  const coinIcon = el('span', 'text-xl drop-shadow-md', '🪙');
  const budgetText = el('span', 'text-lg md:text-xl font-bold font-mono transition-colors duration-300');
  
  budgetDisplay.appendChild(coinIcon);
  budgetDisplay.appendChild(budgetText);

  // Header Cart Button
  const headerCartBtn = el('button', 'relative bg-slate-800/80 p-3 rounded-full border border-slate-600 hover:bg-slate-700 transition-colors flex items-center justify-center');
  const headerCartIcon = el('span', 'text-2xl', '🛒');
  const headerCartBadge = el('span', 'absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 transition-all duration-300');
  
  headerCartBtn.appendChild(headerCartIcon);
  headerCartBtn.appendChild(headerCartBadge);
  
  statsGroup.appendChild(budgetDisplay);
  statsGroup.appendChild(headerCartBtn);

  header.appendChild(titleGroup);
  header.appendChild(searchBar);
  header.appendChild(statsGroup);
  contentWrapper.appendChild(header);

  // Filter Bar
  const filterContainer = el('div', 'w-full p-4 flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth shrink-0 border-b border-white/5');
  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '🍽️' },
    { id: 'fruit', name: 'ผลไม้', icon: '🍎' },
    { id: 'vegetable', name: 'ผัก', icon: '🥦' },
    { id: 'protein', name: 'โปรตีน', icon: '🥩' },
    { id: 'carb', name: 'แป้ง', icon: '🌾' },
    { id: 'fat', name: 'ไขมัน', icon: '🧈' },
    { id: 'drink', name: 'เครื่องดื่ม', icon: '🥤' },
    { id: 'snack', name: 'ขนม', icon: '🍬' }
  ];

  let currentCat = 'all';
  const grid = el('div', 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-4 md:p-6 pb-32');

  const updateStats = () => {
    const totalSpent = store.state.cart.reduce((sum, item) => sum + item.price, 0);
    const remaining = MAX_BUDGET - totalSpent;
    budgetText.textContent = String(remaining) + ' G';
    
    // Budget colors
    if (remaining > 250) {
      budgetText.className = 'text-lg md:text-xl font-bold font-mono transition-colors duration-300 text-green-400';
    } else if (remaining > 100) {
      budgetText.className = 'text-lg md:text-xl font-bold font-mono transition-colors duration-300 text-yellow-400';
    } else {
      budgetText.className = 'text-lg md:text-xl font-bold font-mono transition-colors duration-300 text-red-400';
    }

    const itemCount = store.state.cart.length;
    headerCartBadge.textContent = String(itemCount);
    floatingCartBadge.textContent = String(itemCount) + '/' + String(MAX_ITEMS);
    
    if (itemCount === MAX_ITEMS) {
      headerCartBtn.classList.add('animate-pulse', 'border-emerald-500', 'bg-emerald-500/20');
      floatingCartBtn.classList.remove('from-indigo-600', 'to-indigo-800');
      floatingCartBtn.classList.add('from-emerald-500', 'to-emerald-700', 'animate-pulse', 'shadow-[0_0_20px_rgba(16,185,129,0.5)]');
    } else {
      headerCartBtn.classList.remove('animate-pulse', 'border-emerald-500', 'bg-emerald-500/20');
      floatingCartBtn.classList.add('from-indigo-600', 'to-indigo-800');
      floatingCartBtn.classList.remove('from-emerald-500', 'to-emerald-700', 'animate-pulse', 'shadow-[0_0_20px_rgba(16,185,129,0.5)]');
    }
  };

  const getHealthTagData = (tag: string) => {
    if (tag === 'excellent') return { text: 'ดีเยี่ยม ✅', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (tag === 'avoid') return { text: 'ควรเลี่ยง ⚠️', cls: 'bg-red-500/20 text-red-400 border-red-500/30' };
    return { text: 'พอใช้ 👌', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  };

  const renderGrid = () => {
    grid.innerHTML = '';
    const filtered = currentCat === 'all' ? foods : foods.filter(f => f.category === currentCat);
    
    const totalSpent = store.state.cart.reduce((sum, item) => sum + item.price, 0);
    const remaining = MAX_BUDGET - totalSpent;

    filtered.forEach(food => {
      const isAffordable = food.price <= remaining;
      const isFull = store.state.cart.length >= MAX_ITEMS;
      const canBuy = isAffordable && !isFull;

      const card = el('div', 'group relative bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-between cursor-pointer border border-slate-700 transition-all duration-300 shadow-xl overflow-hidden');
      
      if (canBuy) {
        card.classList.add('hover:border-emerald-400', 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)]', 'hover:-translate-y-2');
      }

      // Price Tag
      const priceTag = el('div', 'absolute top-3 right-3 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-600 text-amber-400 text-sm font-bold font-mono flex items-center gap-1 z-10 shadow-md');
      priceTag.innerHTML = '🪙 ' + food.price;
      
      // Health Badge
      const healthData = getHealthTagData(food.healthTag || 'moderate');
      const healthBadge = el('div', `absolute top-3 left-3 px-2 py-1 rounded-lg border text-[10px] font-bold z-10 shadow-md ${healthData.cls}`);
      healthBadge.textContent = healthData.text;
      
      // Center Emoji
      const emojiBg = el('div', 'w-24 h-24 mt-6 mb-4 rounded-full bg-slate-700/50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner border border-slate-600/50');
      const emoji = el('div', 'text-6xl drop-shadow-2xl transform transition-transform duration-300 group-hover:rotate-12', food.emoji);
      emojiBg.appendChild(emoji);
      
      const name = el('h3', 'font-bold text-base md:text-lg text-slate-100 text-center mb-2 line-clamp-1 w-full', food.nameTh);
      
      // Nutrition row
      const nutritionRow = el('div', 'flex gap-2 w-full justify-center mb-4 text-[10px] md:text-xs text-slate-300');
      const calPill = el('span', 'bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700', `🔥 ${food.calories}kcal`);
      const protPill = el('span', 'bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700', `🥩 ${food.proteinG || 0}g`);
      const carbPill = el('span', 'bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700', `🌾 ${food.carbsG || 0}g`);
      nutritionRow.appendChild(calPill);
      nutritionRow.appendChild(protPill);
      nutritionRow.appendChild(carbPill);
      
      // Add button
      const addBtn = el('button', `w-full py-2 rounded-xl font-bold transition-colors ${canBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-700 text-slate-500 border border-slate-600'}`);
      addBtn.textContent = 'เพิ่มในตะกร้า +';
      
      card.appendChild(priceTag);
      card.appendChild(healthBadge);
      card.appendChild(emojiBg);
      card.appendChild(name);
      card.appendChild(nutritionRow);
      card.appendChild(addBtn);

      // Unavailable overlay
      if (!canBuy) {
        const overlay = el('div', 'absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 rounded-2xl');
        const cross = el('div', 'text-6xl text-red-500 drop-shadow-lg opacity-80', '❌');
        const reason = el('div', 'text-white font-bold mt-2 px-3 py-1 bg-red-500/80 rounded-full text-sm', isFull ? 'ตะกร้าเต็ม' : 'เงินไม่พอ');
        overlay.appendChild(cross);
        overlay.appendChild(reason);
        card.appendChild(overlay);
        card.classList.add('grayscale-[30%]');
      }

      card.onclick = (e) => {
        if (!canBuy) {
          SoundManager.error();
          card.classList.add('animate-shake');
          setTimeout(() => card.classList.remove('animate-shake'), 500);
          return;
        }
        
        SoundManager.coin();
        
        // Add to cart animation flash
        card.classList.add('bg-emerald-900/80', 'border-emerald-400');
        setTimeout(() => card.classList.remove('bg-emerald-900/80', 'border-emerald-400'), 300);
        
        // Fly animation
        const clone = emoji.cloneNode(true) as HTMLElement;
        const rect = emoji.getBoundingClientRect();
        clone.style.position = 'fixed';
        clone.style.left = String(rect.left) + 'px';
        clone.style.top = String(rect.top) + 'px';
        clone.style.zIndex = '100';
        clone.style.transition = 'all 0.6s cubic-bezier(0.2, 1, 0.3, 1)';
        document.body.appendChild(clone);
        
        requestAnimationFrame(() => {
          const targetRect = floatingCartBtn.getBoundingClientRect();
          clone.style.left = String(targetRect.left + targetRect.width/2 - 20) + 'px';
          clone.style.top = String(targetRect.top + targetRect.height/2 - 20) + 'px';
          clone.style.transform = 'scale(0.1)';
          clone.style.opacity = '0';
        });
        setTimeout(() => clone.remove(), 600);
        
        store.addToCart(food);
      };
      grid.appendChild(card);
    });
  };

  categories.forEach(cat => {
    const btn = el('button', 'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border');
    const updateBtnStyle = () => {
      if (currentCat === cat.id) { 
        btn.className = 'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border border-emerald-400 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      } else { 
        btn.className = 'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border border-slate-600 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200';
      }
    };
    
    updateBtnStyle();
    
    const icon = el('span', 'text-lg', cat.icon);
    const text = el('span', '', cat.name);
    btn.appendChild(icon);
    btn.appendChild(text);
    
    btn.onclick = () => {
      SoundManager.click();
      currentCat = cat.id;
      Array.from(filterContainer.children).forEach((c: any) => {
        // Reset all siblings loosely
        c.className = 'flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all border border-slate-600 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200';
      });
      updateBtnStyle(); // apply active style to this btn
      renderGrid();
    };
    filterContainer.appendChild(btn);
  });

  const scrollArea = el('div', 'flex-1 overflow-y-auto scroll-smooth');
  scrollArea.appendChild(filterContainer);
  scrollArea.appendChild(grid);
  contentWrapper.appendChild(scrollArea);
  
  // Floating Action Cart Button
  const floatingCartBtn = el('button', 'fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-30 flex items-center justify-center group border border-white/20');
  const floatingCartIcon = el('span', 'text-3xl drop-shadow-md group-hover:-rotate-12 transition-transform', '🛒');
  const floatingCartBadge = el('div', 'absolute -top-2 -right-2 bg-red-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-full border-2 border-slate-900 shadow-lg');
  
  floatingCartBtn.appendChild(floatingCartIcon);
  floatingCartBtn.appendChild(floatingCartBadge);
  
  contentWrapper.appendChild(floatingCartBtn);
  container.appendChild(contentWrapper);

  let modalEl: HTMLElement | null = null;
  const openCart = () => {
    SoundManager.click();
    if (!modalEl) {
      modalEl = renderCartModal(() => { modalEl?.remove(); modalEl = null; });
      container.appendChild(modalEl);
    }
  };

  headerCartBtn.onclick = openCart;
  floatingCartBtn.onclick = openCart;

  const onStoreUpdate = () => {
    updateStats();
    renderGrid(); 
    if (modalEl) {
      modalEl.remove();
      modalEl = renderCartModal(() => { modalEl?.remove(); modalEl = null; });
      container.appendChild(modalEl);
    }
  };
  
  const unsubscribe = store.subscribe(onStoreUpdate);
  updateStats();

  // Initial render
  renderGrid();
  
  // Clean up function if container is removed
  container.addEventListener('DOMNodeRemoved', (e) => {
    if (e.target === container) {
      unsubscribe();
    }
  });

  return container;
}