import { store } from '../state/store.js';
import { el, Button, Card } from '../components/UI.js';
import { soundFx } from '../audio/sound.js';
import { FOOD_DATABASE } from '../data/food.js';

export function renderSupermarket() {
  const container = el('div', 'flex h-full w-full bg-amber-50 p-4 gap-4 overflow-hidden flex-col md:flex-row');
  
  // Left: Shop Area
  const shopArea = el('div', 'flex-1 flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100');
  
  const shopHeader = el('div', 'p-4 bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md z-10 flex justify-between items-center', [
    el('h2', 'text-2xl font-bold', '🛒 Digestion Mart'),
    el('div', 'text-sm bg-white/20 px-3 py-1 rounded-full', `ผู้เล่น: ${store.state.player.avatar} ${store.state.player.name}`)
  ]);

  const searchBar = el('input', 'w-full p-3 border-b border-gray-200 focus:outline-none focus:bg-amber-50 transition-colors', '', {
    placeholder: '🔍 ค้นหาอาหาร...'
  });

  const categoryFilters = el('div', 'flex gap-2 p-3 overflow-x-auto bg-gray-50 border-b border-gray-200');
  const categories = ['ทั้งหมด', ...new Set(FOOD_DATABASE.map(f => f.category))];
  
  let currentFilter = 'ทั้งหมด';
  let currentSearch = '';

  const gridContainer = el('div', 'flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4');

  const renderGrid = () => {
    gridContainer.innerHTML = '';
    const filtered = FOOD_DATABASE.filter(f => {
      const matchCat = currentFilter === 'ทั้งหมด' || f.category === currentFilter;
      const matchSearch = f.name.includes(currentSearch);
      return matchCat && matchSearch;
    });

    filtered.forEach(f => {
      const itemCard = el('div', 'bg-white rounded-xl p-3 border-2 border-transparent hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center group', [
        el('div', 'text-5xl mb-2 group-hover:scale-110 transition-transform', f.icon),
        el('h4', 'font-bold text-gray-800 text-center text-sm', f.name),
        el('p', 'text-xs text-gray-500', `${f.calories} kcal`),
        Button({
          text: 'หยิบใส่ตะกร้า',
          variant: 'primary',
          className: 'mt-2 text-xs py-1 px-2 w-full opacity-0 group-hover:opacity-100 transition-opacity',
          onClick: (e) => {
            e.stopPropagation();
            if (store.state.cart.length < 4) {
              soundFx.click();
              store.addToCart(f);
              renderCart();
            } else {
              soundFx.error();
              alert('ตะกร้าเต็มแล้ว! (สูงสุด 4 ชิ้น)');
            }
          }
        })
      ]);
      gridContainer.appendChild(itemCard);
    });
  };

  searchBar.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderGrid();
  });

  const renderFilters = () => {
    categoryFilters.innerHTML = '';
    categories.forEach(c => {
      const btn = el('button', `whitespace-nowrap px-4 py-1 rounded-full text-sm font-medium transition-colors ${currentFilter === c ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, c, {
        onClick: () => {
          soundFx.click();
          currentFilter = c;
          renderFilters();
          renderGrid();
        }
      });
      categoryFilters.appendChild(btn);
    });
  };

  shopArea.appendChild(shopHeader);
  shopArea.appendChild(searchBar);
  shopArea.appendChild(categoryFilters);
  shopArea.appendChild(gridContainer);

  // Right: Cart Area
  const cartArea = el('div', 'w-full md:w-80 flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100');
  
  const cartHeader = el('div', 'p-4 bg-gray-800 text-white shadow-md z-10', [
    el('h3', 'text-xl font-bold', '🧺 ตะกร้าของคุณ')
  ]);

  const cartList = el('div', 'flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50');
  const cartSummary = el('div', 'p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]');

  const renderCart = () => {
    cartList.innerHTML = '';
    const cart = store.state.cart;
    
    if (cart.length === 0) {
      cartList.innerHTML = '<p class="text-gray-400 text-center mt-10">ยังไม่มีของในตะกร้า<br>(เลือกได้สูงสุด 4 ชิ้น)</p>';
    } else {
      cart.forEach((item, index) => {
        const itemEl = el('div', 'flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-fade-in', [
          el('div', 'flex items-center gap-3', [
            el('span', 'text-2xl', item.icon),
            el('div', '', [
              el('p', 'font-bold text-sm', item.name),
              el('p', 'text-xs text-gray-500', `${item.calories} kcal`)
            ])
          ]),
          el('button', 'text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors', '❌', {
            onClick: () => {
              soundFx.pop();
              const newCart = [...store.state.cart];
              newCart.splice(index, 1);
              store.update({ cart: newCart });
              renderCart();
            }
          })
        ]);
        cartList.appendChild(itemEl);
      });
    }

    // Calc Summary
    const totalCals = cart.reduce((sum, item) => sum + item.calories, 0);
    const totalFiber = cart.reduce((sum, item) => sum + item.fiber, 0);

    cartSummary.innerHTML = `
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1"><span class="text-gray-600">พลังงานรวม:</span> <span class="font-bold ${totalCals > 1000 ? 'text-red-500' : 'text-gray-800'}">${totalCals} kcal</span></div>
        <div class="flex justify-between text-sm mb-2"><span class="text-gray-600">ไฟเบอร์รวม:</span> <span class="font-bold text-green-600">${totalFiber.toFixed(1)} g</span></div>
        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(100, (cart.length / 4) * 100)}%"></div>
        </div>
        <p class="text-xs text-center text-gray-500">${cart.length} / 4 ชิ้น</p>
      </div>
    `;

    const checkoutBtn = Button({
      text: 'จ่ายเงิน & เริ่มย่อย! 🍽️',
      variant: 'success',
      className: 'w-full py-3 text-lg ' + (cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'),
      onClick: () => {
        if (cart.length > 0) {
          soundFx.coin();
          store.setStage('04_DigestionJourney');
        } else {
          soundFx.error();
        }
      }
    });

    cartSummary.appendChild(checkoutBtn);
  };

  cartArea.appendChild(cartHeader);
  cartArea.appendChild(cartList);
  cartArea.appendChild(cartSummary);

  renderFilters();
  renderGrid();
  renderCart();

  container.appendChild(shopArea);
  container.appendChild(cartArea);

  return container;
}
