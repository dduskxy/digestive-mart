import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import confetti from 'canvas-confetti';

export function renderSummaryReport(): HTMLElement {
  const container = el('div', 'w-full h-full min-h-screen bg-summary bg-cover bg-center bg-fixed flex flex-col items-center py-12 p-4 font-sans overflow-y-auto');
  const { player, cart } = store.state;
  
  SoundManager.playBGM('summary');
  SoundManager.fanfare();
  setTimeout(() => { confetti({ particleCount: 250, spread: 120, origin: { y: 0.3 }, colors: ['#FFCB08', '#58CC02', '#1CB0F6', '#FF4B4B', '#CE82FF'] }); }, 500);

  const card = el('div', 'bg-white/95 backdrop-blur-md w-full max-w-6xl rounded-[40px] border-b-8 border-gray-200 shadow-2xl p-8 md:p-12 flex flex-col items-center relative z-10');
  
  // Custom animation styles
  if (!document.getElementById('summary-animations')) {
    const style = document.createElement('style');
    style.id = 'summary-animations';
    style.textContent = `
      @keyframes dropInSummary {
        0% { transform: translateY(-150px) scale(0.5); opacity: 0; }
        70% { transform: translateY(20px) scale(1.1); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      .animate-drop-in {
        animation: dropInSummary 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    `;
    document.head.appendChild(style);
  }

  // 1. Hero Section
  const hero = el('div', 'flex flex-col items-center mb-12 w-full');
  
  const trophy = el('div', 'text-8xl md:text-9xl mb-6 drop-shadow-[0_0_30px_rgba(255,203,8,0.8)] animate-drop-in');
  trophy.textContent = '🏆';
  setTimeout(() => {
    trophy.classList.remove('animate-drop-in');
    trophy.classList.add('animate-bounce');
  }, 1000); // start bouncing after drop-in
  
  const title = el('h1', 'text-4xl md:text-5xl font-black text-[#4B4B4B] mb-4 text-center leading-tight');
  title.innerHTML = `🎉 ยอดเยี่ยม! <span class="text-5xl md:text-6xl inline-block ml-2 align-middle">${player.avatar}</span> <span class="text-[#1CB0F6]">${player.name || 'นักผจญภัย'}</span>!`;
  
  const starsContainer = el('div', 'flex gap-4 mb-6');
  for(let i=0; i<3; i++) {
    const star = el('div', 'text-6xl md:text-7xl text-yellow-400 drop-shadow-[0_4px_10px_rgba(250,204,21,0.5)] opacity-0 scale-50 transition-all duration-500 ease-out');
    star.textContent = '⭐';
    setTimeout(() => {
      star.classList.remove('opacity-0', 'scale-50');
      star.classList.add('opacity-100', 'scale-100');
    }, 300 + (i * 300));
    starsContainer.appendChild(star);
  }

  const subtitle = el('p', 'text-2xl md:text-3xl font-bold text-[#58CC02] text-center bg-green-50 px-8 py-4 rounded-3xl border-2 border-green-200 mt-2');
  subtitle.textContent = 'เธอพิชิตระบบย่อยอาหารสำเร็จแล้ว!';
  
  hero.appendChild(trophy);
  hero.appendChild(title);
  hero.appendChild(starsContainer);
  hero.appendChild(subtitle);
  card.appendChild(hero);

  if (cart.length > 0) {
    // Top Dashboard: Nutrition Dashboard (Rings)
    let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
    let excellentCount = 0, moderateCount = 0, avoidCount = 0;

    cart.forEach(item => {
      totalCals += item.calories;
      totalProtein += item.proteinG;
      totalCarbs += item.carbsG;
      totalFat += item.fatG;
      
      if (item.healthTag === 'excellent') excellentCount++;
      else if (item.healthTag === 'avoid') avoidCount++;
      else moderateCount++;
    });

    const maxCals = 2000;
    const maxProtein = 50;
    const maxCarbs = 250;
    const maxFat = 70;
    
    const dashboard = el('div', 'w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16');
    
    const createRing = (label: string, value: number, max: number, strokeColor: string, bgColor: string, unit: string) => {
      const box = el('div', `p-4 md:p-6 rounded-[30px] border-b-4 flex flex-col items-center shadow-sm relative ${bgColor}`);
      
      const pct = Math.min(value / max, 1.5); // cap at 1.5 for visuals
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (Math.min(pct, 1) * circumference);
      
      let badge = 'ดี ✅';
      let badgeClass = 'text-green-600 border-green-200';
      if (pct > 1.1) { badge = 'เกิน ⚠️'; badgeClass = 'text-red-600 border-red-200'; }
      else if (pct < 0.5) { badge = 'น้อย 🔽'; badgeClass = 'text-orange-500 border-orange-200'; }
      else if (pct >= 0.8 && pct <= 1.1) { badge = 'พอดี 👌'; badgeClass = 'text-blue-600 border-blue-200'; }

      box.innerHTML = `
        <h3 class="font-black text-lg md:text-xl mb-4 text-gray-700">${label}</h3>
        <div class="relative w-28 h-28 md:w-32 md:h-32 mb-4">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="#00000010" stroke-width="8"></circle>
            <circle class="ring-fill transition-all duration-1000 ease-out" cx="50" cy="50" r="${radius}" fill="transparent" stroke="${strokeColor}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="font-black text-2xl md:text-3xl" style="color:${strokeColor}">${value}</span>
            <span class="text-xs md:text-sm font-bold text-gray-500">${unit}</span>
          </div>
        </div>
        <div class="text-xs md:text-sm font-bold text-gray-500 mb-2">เป้าหมาย: ${max}</div>
        <div class="bg-white px-4 py-1.5 rounded-full font-black shadow-sm text-sm border-2 ${badgeClass}">${badge}</div>
      `;

      setTimeout(() => {
        const ring = box.querySelector('.ring-fill') as SVGCircleElement;
        if (ring) ring.style.strokeDashoffset = strokeDashoffset.toString();
      }, 1000);

      return box;
    };

    dashboard.appendChild(createRing('พลังงาน', totalCals, maxCals, '#F97316', 'bg-orange-50 border-orange-200', 'kcal'));
    dashboard.appendChild(createRing('โปรตีน', totalProtein, maxProtein, '#3B82F6', 'bg-blue-50 border-blue-200', 'g'));
    dashboard.appendChild(createRing('คาร์บ', totalCarbs, maxCarbs, '#22C55E', 'bg-green-50 border-green-200', 'g'));
    dashboard.appendChild(createRing('ไขมัน', totalFat, maxFat, '#EC4899', 'bg-pink-50 border-pink-200', 'g'));
    
    card.appendChild(dashboard);

    // Nutrition Analysis Section
    const analysisSection = el('div', 'w-full mb-16 bg-[#F4F4F4] rounded-[40px] p-6 md:p-12 border-b-8 border-gray-200 shadow-inner');
    const analysisTitle = el('h2', 'text-2xl md:text-4xl font-black text-center mb-8 text-[#4B4B4B]');
    analysisTitle.textContent = '📊 วิเคราะห์โภชนาการ';
    analysisSection.appendChild(analysisTitle);

    let score = (excellentCount * 30) + (moderateCount * 15) - (avoidCount * 20);
    score = Math.max(0, Math.min(100, score));
    let grade = 'D';
    let gradeColor = 'text-red-500';
    if (score >= 80) { grade = 'A'; gradeColor = 'text-green-500'; }
    else if (score >= 60) { grade = 'B'; gradeColor = 'text-blue-500'; }
    else if (score >= 40) { grade = 'C'; gradeColor = 'text-orange-500'; }

    const scoreCard = el('div', 'flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10 bg-white p-8 rounded-3xl shadow-sm border-4 border-gray-100');
    scoreCard.innerHTML = `
      <div class="flex flex-col items-center">
        <span class="text-xl md:text-2xl font-bold text-gray-500 mb-2">คะแนนโภชนาการ</span>
        <div class="text-6xl md:text-8xl font-black ${gradeColor} drop-shadow-sm">${score}<span class="text-3xl md:text-5xl text-gray-300">/100</span></div>
      </div>
      <div class="h-24 w-1 bg-gray-100 hidden md:block"></div>
      <div class="text-8xl md:text-[140px] leading-none font-black ${gradeColor} drop-shadow-md">${grade}</div>
    `;
    analysisSection.appendChild(scoreCard);

    const tipsContainer = el('div', 'grid grid-cols-1 md:grid-cols-3 gap-6');
    const createTip = (icon: string, text: string) => {
      const tipBox = el('div', 'bg-white p-6 rounded-3xl flex items-start gap-4 shadow-sm border-2 border-gray-100 hover:-translate-y-1 transition-transform');
      tipBox.innerHTML = `
        <div class="text-3xl md:text-4xl shrink-0">${icon}</div>
        <div class="font-bold text-gray-600 md:text-lg leading-relaxed">${text}</div>
      `;
      return tipBox;
    };

    if (excellentCount > avoidCount) {
      tipsContainer.appendChild(createTip('🌟', 'เลือกอาหารได้ยอดเยี่ยม! ร่างกายได้รับสารอาหารที่ดีมาก'));
    } else {
      tipsContainer.appendChild(createTip('💡', 'พยายามเน้นผักและผลไม้สดให้มากขึ้นนะ'));
    }

    if (avoidCount > 0) {
      tipsContainer.appendChild(createTip('⚠️', 'ลองลดอาหารไขมันสูงหรือของทอดดูนะ ลำไส้จะได้ทำงานง่ายขึ้น'));
    } else {
      tipsContainer.appendChild(createTip('💪', 'ไม่มีอาหารขยะเลย! ระบบขับถ่ายของเธอต้องทำงานได้ดีแน่ๆ'));
    }

    tipsContainer.appendChild(createTip('💧', 'อย่าลืมดื่มน้ำสะอาดเยอะๆ ช่วยให้ระบบย่อยอาหารทำงานสมบูรณ์'));
    
    analysisSection.appendChild(tipsContainer);
    card.appendChild(analysisSection);

    // Food Selection Review
    const reportTitle = el('h2', 'text-3xl md:text-4xl font-black text-[#58CC02] mb-8 w-full text-center');
    reportTitle.textContent = '🍽️ เมนูที่เธอเลือก';
    card.appendChild(reportTitle);

    const reportGrid = el('div', 'w-full flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-6 pb-8 md:pb-0 scroll-smooth snap-x');
    
    cart.forEach((item, index) => {
      let bgClass = 'bg-gray-50 border-gray-200';
      let tagText = '';
      let tagColor = '';
      let insight = 'ให้พลังงานแก่ร่างกาย';
      
      if (item.healthTag === 'excellent') { 
        bgClass = 'bg-green-50 border-green-200'; tagText = 'ดีเยี่ยม! ✅'; tagColor = 'text-green-700 bg-green-100'; 
        insight = 'มีวิตามินและไฟเบอร์สูง ช่วยระบบขับถ่าย!';
      }
      else if (item.healthTag === 'avoid') { 
        bgClass = 'bg-red-50 border-red-200'; tagText = 'ควรเลี่ยง ⚠️'; tagColor = 'text-red-700 bg-red-100'; 
        insight = 'ไขมันหรือน้ำตาลสูง ย่อยยากและทำให้อ้วนได้';
      }
      else { 
        bgClass = 'bg-blue-50 border-blue-200'; tagText = 'พอใช้ 👌'; tagColor = 'text-blue-700 bg-blue-100'; 
        insight = 'ให้พลังงานดี ควรกินในปริมาณที่พอเหมาะ';
      }

      const description = (item as any).description || insight;

      const row = el('div', `min-w-[280px] md:min-w-0 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] p-6 rounded-[30px] border-b-4 flex flex-col gap-4 shadow-sm transition-all duration-500 opacity-0 translate-y-10 snap-center ${bgClass}`);
      row.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="text-5xl md:text-6xl bg-white w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-sm border-4 border-white shrink-0">${item.emoji}</div>
          <div class="flex flex-col">
            <h3 class="text-xl md:text-2xl font-black text-[#4B4B4B] line-clamp-2">${item.nameTh}</h3>
            <span class="text-sm font-bold w-fit px-3 py-1 rounded-full mt-1 ${tagColor}">${tagText}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 text-xs md:text-sm font-bold mt-2">
          <span class="bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">🔥 ${item.calories}</span>
          <span class="bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">🥩 ${item.proteinG}</span>
          <span class="bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">🍚 ${item.carbsG}</span>
          <span class="bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">🧈 ${item.fatG}</span>
        </div>
        <div class="mt-2 text-sm font-bold text-gray-600 bg-white/50 p-4 rounded-2xl italic">
          💡 "${description}"
        </div>
      `;
      
      setTimeout(() => {
        row.classList.remove('opacity-0', 'translate-y-10');
      }, 1500 + (index * 150)); // Staggered appearance

      reportGrid.appendChild(row);
    });
    
    card.appendChild(reportGrid);
  } else {
    const emptyMsg = el('div', 'text-2xl text-gray-500 font-bold mb-8 text-center bg-gray-100 p-8 rounded-3xl w-full', 'เธอยังไม่ได้เลือกอาหารเลยนะ! 🛒');
    card.appendChild(emptyMsg);
  }

  // Action Buttons
  const actionContainer = el('div', 'flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mt-8 md:mt-12 w-full');
  
  const playAgainBtn = Button({
    text: '🔄 ลองอีกครั้ง',
    variant: 'primary',
    className: 'w-full sm:w-auto min-w-[240px] px-8 py-5 text-xl md:text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all',
    onClick: () => { SoundManager.click(); store.reset(); }
  });

  const shareBtn = Button({
    text: '📤 แชร์ผล',
    variant: 'secondary',
    className: 'w-full sm:w-auto min-w-[240px] px-8 py-5 text-xl md:text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all bg-white text-[#1CB0F6] border-4 border-[#1CB0F6]',
    onClick: () => { 
      SoundManager.click(); 
      alert('แชร์ผลสำเร็จ! (ฟังก์ชันจำลอง)'); 
    }
  });

  actionContainer.appendChild(playAgainBtn);
  actionContainer.appendChild(shareBtn);
  
  card.appendChild(actionContainer);
  
  container.appendChild(card);
  return container;
}