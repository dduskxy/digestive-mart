import { marketFoods, FoodItem } from '../data/foods';
import { store } from '../state/store';
import { el, Button, showObjective } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import { renderCartModal } from '../components/CartModal';

const MAX_ITEMS = 5;

export function renderSupermarket(): HTMLElement {
  const container = el('div', 'w-full h-full min-h-screen relative flex flex-col font-sans text-slate-800 overflow-hidden bg-gradient-to-br from-[#f6f9ff] via-[#fff5e6] to-[#ffe6ef]');
  
  // Animated Background Blobs
  const createBlob = (className: string) => el('div', className);
  container.appendChild(createBlob('absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#ffc470]/30 blur-3xl mix-blend-multiply animate-blob'));
  container.appendChild(createBlob('absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#70d6ff]/30 blur-3xl mix-blend-multiply animate-blob animation-delay-2000'));
  container.appendChild(createBlob('absolute top-[20%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-[#ff9ec6]/30 blur-3xl mix-blend-multiply animate-blob animation-delay-4000'));

  const contentWrapper = el('div', 'relative z-10 flex flex-col h-full w-full max-h-screen');

  SoundManager.playBGM('supermarket');

  // Compact Filter Bar (Sticky)
  const filterContainer = el('div', 'w-full px-4 py-3 pt-20 flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth shrink-0 bg-white/40 backdrop-blur-md shadow-sm z-20 sticky top-0');

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '✨' },
    { id: 'fruit', name: 'ผลไม้', icon: '🍎' },
    { id: 'vegetable', name: 'ผัก', icon: '🥦' },
    { id: 'protein', name: 'โปรตีน', icon: '🥩' },
    { id: 'carb', name: 'ข้าว/แป้ง', icon: '🌾' },
    { id: 'fat', name: 'ไขมัน', icon: '🥑' },
    { id: 'drink', name: 'น้ำ', icon: '🥤' },
    { id: 'snack', name: 'ขนม', icon: '🍩' }
  ];

  let currentCat = 'all';
  let currentItems: FoodItem[] = [];

  const updateFilteredItems = () => {
    let filtered = currentCat === 'all'
      ? marketFoods
      : marketFoods.filter((f) => f.category === currentCat);
    currentItems = [...filtered].sort(() => Math.random() - 0.5);
  };

  categories.forEach(cat => {
    const btn = el('button', 'flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2');
    const updateBtnStyle = () => {
      if (currentCat === cat.id) { 
        btn.className = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-sm whitespace-nowrap transition-all border-2 border-orange-400 bg-orange-50 text-orange-600 shadow-md scale-105';
      } else { 
        btn.className = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2 border-white bg-white/80 text-slate-500 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200';
      }
    };
    updateBtnStyle();
    btn.innerHTML = `<span>${cat.icon}</span><span>${cat.name}</span>`;
    
    btn.onclick = () => {
      SoundManager.click();
      currentCat = cat.id;
      Array.from(filterContainer.children).forEach((c: any) => {
        c.className = 'flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2 border-white bg-white/80 text-slate-500 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200';
      });
      updateBtnStyle();
      updateFilteredItems();
      renderGrid();
    };
    filterContainer.appendChild(btn);
  });

  contentWrapper.appendChild(filterContainer);

  const grid = el('div', 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-4 md:p-8 pb-32');

  const updateStats = () => {
    const itemCount = store.state.cart.length;
    floatingCartBadge.textContent = String(itemCount) + '/' + String(MAX_ITEMS);
    
    if (itemCount === MAX_ITEMS) {
      floatingCartBtn.classList.remove('from-orange-500', 'to-rose-500');
      floatingCartBtn.classList.add('from-emerald-500', 'to-teal-500', 'animate-pulse', 'shadow-[0_0_30px_rgba(16,185,129,0.5)]');
    } else {
      floatingCartBtn.classList.add('from-orange-500', 'to-rose-500');
      floatingCartBtn.classList.remove('from-emerald-500', 'to-teal-500', 'animate-pulse', 'shadow-[0_0_30px_rgba(16,185,129,0.5)]');
    }
  };

  const renderGrid = () => {
    grid.innerHTML = '';

    if (currentItems.length === 0) {
      const noRes = el('div', 'col-span-full flex flex-col items-center justify-center p-10 text-slate-400');
      noRes.innerHTML = `<span class="text-4xl mb-3">🥺</span><span class="font-bold">ไม่พบของกินที่คุณหา</span>`;
      grid.appendChild(noRes);
      return;
    }

    currentItems.forEach(food => {
      const isFull = store.state.cart.length >= MAX_ITEMS;
      const canBuy = !isFull;

      const card = el('div', 'group relative bg-white/80 backdrop-blur-xl rounded-[32px] p-5 flex flex-col items-center justify-between cursor-pointer border-2 border-white transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden');
      
      if (canBuy) {
        card.classList.add('hover:border-orange-300', 'hover:-translate-y-2');
      }
      
      const emojiBg = el('div', 'w-24 h-24 mt-4 mb-6 rounded-full bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner border-4 border-white');
      const emoji = el('div', 'text-6xl drop-shadow-xl transform transition-transform duration-300 group-hover:rotate-12', food.emoji);
      emojiBg.appendChild(emoji);
      
      const name = el('h3', 'font-black text-lg md:text-xl text-slate-700 text-center mb-4 line-clamp-1 w-full', food.nameTh);
      
      const addBtn = el('button', `w-full py-3 rounded-2xl font-bold text-lg transition-all ${canBuy ? 'bg-orange-100 text-orange-600 border-2 border-orange-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 group-hover:shadow-lg' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`);
      addBtn.textContent = 'ใส่ตะกร้า +';
      
      card.appendChild(emojiBg);
      card.appendChild(name);
      card.appendChild(addBtn);

      // Unavailable overlay - only if cart full
      if (!canBuy) {
        const overlay = el('div', 'absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 rounded-[32px]');
        const cross = el('div', 'text-6xl drop-shadow-lg opacity-90', '🛒');
        const reason = el('div', 'text-white font-black mt-3 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-full text-sm shadow-lg', 'ตะกร้าเต็มแล้ว!');
        overlay.appendChild(cross);
        overlay.appendChild(reason);
        card.appendChild(overlay);
        card.classList.add('grayscale-[20%]', 'opacity-80');
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
        card.classList.add('bg-orange-100', 'border-orange-400');
        setTimeout(() => card.classList.remove('bg-orange-100', 'border-orange-400'), 300);
        
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

  const scrollArea = el('div', 'flex-1 overflow-y-auto scroll-smooth');
  scrollArea.appendChild(grid);
  contentWrapper.appendChild(scrollArea);
  
  // Floating Action Cart Button
  const floatingCartBtn = el('button', 'fixed bottom-8 right-8 bg-gradient-to-br from-orange-500 to-rose-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-30 flex items-center justify-center group border-4 border-white');
  const floatingCartIcon = el('span', 'text-4xl drop-shadow-md group-hover:-rotate-12 transition-transform', '🛒');
  const floatingCartBadge = el('div', 'absolute -top-3 -right-3 bg-slate-800 text-white text-sm font-black px-3 py-1.5 rounded-full border-2 border-white shadow-xl');
  
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
  updateFilteredItems();
  renderGrid();
  
  // Show objective modal when entering
  setTimeout(() => {
    showObjective('🛒', 'เลือกซื้ออาหาร', 'เลือกอาหารที่คุณชื่นชอบทั้งหมด 5 ชิ้น เพื่อนำเข้าสู่ระบบย่อยอาหาร!', 'ไปช้อปกันเลย! 🚀');
  }, 100);
  
  // Clean up function if container is removed
  container.addEventListener('DOMNodeRemoved', (e) => {
    if (e.target === container) {
      unsubscribe();
    }
  });

  return container;
}