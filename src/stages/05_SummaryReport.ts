import { store } from '../state/store';
import { el, Button } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

export function renderSummaryReport(): HTMLElement {
  const container = el('div', 'absolute inset-0 bg-gradient-to-br from-[#ffd194] via-[#ff9a9e] to-[#fecfef] flex flex-col items-center py-12 p-4 font-sans overflow-y-auto text-slate-800');
  const { player, cart } = store.state;

  // Floating Background Elements
  const createFloatItem = (emoji: string, size: string, duration: number, delay: number, startX: string, startY: string) => {
    const item = el('div', `absolute text-${size} opacity-40 select-none pointer-events-none`);
    item.textContent = emoji;
    item.style.left = startX;
    item.style.top = startY;
    gsap.to(item, { y: '+=60', x: '+=20', rotation: 15, duration: duration, yoyo: true, repeat: -1, delay: delay, ease: 'sine.inOut' });
    return item;
  };
  container.appendChild(createFloatItem('🎉', '6xl', 4, 0, '15%', '10%'));
  container.appendChild(createFloatItem('🧬', '8xl', 6, 1, '80%', '20%'));
  container.appendChild(createFloatItem('🍎', '5xl', 5, 0.5, '10%', '60%'));
  container.appendChild(createFloatItem('🌟', '7xl', 7, 2, '85%', '70%'));
  container.appendChild(createFloatItem('💖', '6xl', 4.5, 1.5, '50%', '85%'));

  const summaryScore = Math.min(
    100,
    Math.round(
      (store.state.progress.cleanlinessScore * 0.35) +
      (store.state.progress.stageScores['02_Hygiene'] * 0.15) +
      (store.state.progress.stageScores['03_Supermarket'] * 0.2) +
      (store.state.progress.stageScores['04_DigestionJourney'] * 0.3)
    )
  );
  store.setStageScore('05_SummaryReport', summaryScore);

  SoundManager.playBGM('summary');
  SoundManager.fanfare();
  setTimeout(() => { confetti({ particleCount: 300, spread: 160, origin: { y: 0.2 }, colors: ['#ffb703', '#fb8500', '#8338ec', '#ff006e', '#3a86ff'] }); }, 500);

  // Main Card with Glassmorphism
  const card = el('div', 'bg-white/90 backdrop-blur-2xl w-full max-w-6xl rounded-[40px] border-[6px] border-white/60 shadow-[0_30px_60px_-15px_rgba(200,50,50,0.3)] p-8 md:p-12 flex flex-col items-center relative z-10');
  
  // 1. Hero Section
  const hero = el('div', 'flex flex-col items-center mb-16 w-full');
  
  const avatarWrapper = el('div', 'relative mb-6');
  const avatar = el('div', 'text-7xl md:text-8xl drop-shadow-2xl bg-gradient-to-br from-amber-100 to-yellow-300 w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 border-white shadow-xl z-10 relative');
  avatar.textContent = player.avatar;
  avatarWrapper.appendChild(avatar);
  
  const badge = el('div', 'absolute -bottom-4 -right-4 text-5xl drop-shadow-lg z-20 animate-bounce');
  badge.textContent = '🏅';
  avatarWrapper.appendChild(badge);

  gsap.fromTo(avatarWrapper, { y: -50, scale: 0.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' });
  
  const title = el('h1', 'text-4xl md:text-6xl font-black text-rose-600 mb-4 text-center tracking-tight drop-shadow-sm');
  title.innerHTML = `เก่งมาก! <span class="text-amber-500">${player.name || 'นักสำรวจ'}</span>`;
  
  const subtitle = el('p', 'text-xl md:text-2xl font-bold text-slate-600 text-center max-w-2xl leading-relaxed');
  subtitle.textContent = 'คุณคือสุดยอดผู้เชี่ยวชาญด้านระบบย่อยอาหาร! มาดูผลลัพธ์ของสิ่งที่คุณกินเข้าไปกันเถอะ';
  
  hero.appendChild(avatarWrapper);
  hero.appendChild(title);
  hero.appendChild(subtitle);
  card.appendChild(hero);

  if (cart.length > 0) {
    // 2. Health App Style Dashboard
    let totalCals = 0, totalProtein = 0, totalSugar = 0, totalFat = 0;

    cart.forEach(item => {
      totalCals += item.calories;
      totalProtein += item.proteinG;
      totalSugar += item.sugarG;
      totalFat += item.fatG;
    });

    const maxCals = 1800;
    const maxProtein = 45;
    const maxSugar = 24;
    const maxFat = 60;
    
    const dashboardTitle = el('h2', 'text-2xl font-bold text-slate-700 w-full mb-2 flex items-center gap-2');
    dashboardTitle.innerHTML = `<span class="text-3xl">📊</span> ภาพรวมสารอาหาร`;
    
    const dashboardSub = el('p', 'text-sm text-slate-500 mb-6 font-medium');
    dashboardSub.textContent = '*ปริมาณแนะนำสำหรับเด็กวัย 9-12 ปี';
    
    card.appendChild(dashboardTitle);
    card.appendChild(dashboardSub);

    const dashboard = el('div', 'w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16');
    
    const createStatCard = (label: string, value: number, max: number, colorPrefix: string, icon: string, unit: string) => {
      const box = el('div', `p-5 md:p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group`);
      
      const pct = Math.min(value / max, 1.5);
      const pctDisplay = Math.min(Math.round((value / max) * 100), 150);
      
      // Determine status
      let statusColor = 'text-emerald-500';
      let statusBg = 'bg-emerald-50';
      let statusText = 'พอดี';
      
      if (pct > 1.1) {
        statusColor = 'text-rose-500';
        statusBg = 'bg-rose-50';
        statusText = 'เกิน';
      } else if (pct < 0.4) {
        statusColor = 'text-amber-500';
        statusBg = 'bg-amber-50';
        statusText = 'น้อย';
      }

      // We use predefined Tailwind color classes but map them carefully.
      // Color maps for progress bars
      const bgColors: Record<string, string> = {
        'orange': 'bg-orange-500',
        'blue': 'bg-blue-500',
        'emerald': 'bg-emerald-500',
        'purple': 'bg-purple-500'
      };
      
      const lightBgColors: Record<string, string> = {
        'orange': 'bg-orange-50',
        'blue': 'bg-blue-50',
        'emerald': 'bg-emerald-50',
        'purple': 'bg-purple-50'
      };

      const iconColors: Record<string, string> = {
        'orange': 'text-orange-500',
        'blue': 'text-blue-500',
        'emerald': 'text-emerald-500',
        'purple': 'text-purple-500'
      };

      box.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl ${lightBgColors[colorPrefix]} flex items-center justify-center ${iconColors[colorPrefix]} text-xl">
              ${icon}
            </div>
            <h3 class="font-bold text-slate-600">${label}</h3>
          </div>
          <div class="px-2.5 py-1 rounded-lg ${statusBg} ${statusColor} text-xs font-bold">
            ${statusText}
          </div>
        </div>
        
        <div class="flex items-end gap-1 mb-3 mt-auto">
          <span class="font-black text-3xl md:text-4xl text-slate-800">${value.toFixed(0)}</span>
          <span class="text-sm font-semibold text-slate-400 mb-1">${unit}</span>
        </div>
        
        <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full ${bgColors[colorPrefix]} progress-bar w-0 transition-all duration-1000 ease-out" data-width="${Math.min(pct * 100, 100)}%"></div>
        </div>
        <div class="text-xs text-slate-400 mt-2 text-right">เป้าหมาย: ${max} ${unit}</div>
      `;

      setTimeout(() => {
        const bar = box.querySelector('.progress-bar') as HTMLDivElement;
        if (bar) bar.style.width = bar.getAttribute('data-width') || '0%';
      }, 300);

      return box;
    };

    dashboard.appendChild(createStatCard('พลังงาน', totalCals, maxCals, 'orange', '🔥', 'kcal'));
    dashboard.appendChild(createStatCard('โปรตีน', totalProtein, maxProtein, 'blue', '🥩', 'g'));
    dashboard.appendChild(createStatCard('น้ำตาล', totalSugar, maxSugar, 'emerald', '🍬', 'g'));
    dashboard.appendChild(createStatCard('ไขมัน', totalFat, maxFat, 'purple', '🥑', 'g'));
    
    card.appendChild(dashboard);

    // 3. Bento Box Style Food Items
    const bentoTitle = el('h2', 'text-2xl font-bold text-slate-700 w-full mb-6 flex items-center gap-2 mt-4');
    bentoTitle.innerHTML = `<span class="text-3xl">🍱</span> เจาะลึกเมนูของเธอ`;
    card.appendChild(bentoTitle);

    const bentoGrid = el('div', 'w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-16');
    
    cart.forEach((item, index) => {
      const bentoCard = el('div', 'bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 opacity-0');
      
      const benefits: string[] = item.benefits && item.benefits.length > 0 ? item.benefits : ['ทานได้ในปริมาณที่เหมาะสม'];
      const warnings: string[] = item.warnings && item.warnings.length > 0 ? item.warnings : ['ย่อยง่าย เป็นมิตรต่อกระเพาะ'];

      let healthBadge = '';
      if (item.healthTag === 'excellent' || item.healthTag === 'good') {
        healthBadge = '<span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full shrink-0">✨ อาหารดี</span>';
      } else {
        healthBadge = '<span class="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-full shrink-0">⚠️ ควรระวัง</span>';
      }

      bentoCard.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-slate-100 shrink-0">
            ${item.emoji}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-xl font-bold text-slate-800 truncate">${item.nameTh}</h3>
              ${healthBadge}
            </div>
            <p class="text-sm text-slate-400 font-medium truncate">${item.nameEn}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">🔥 ${item.calories} kcal</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">🥩 ${item.proteinG} g</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">🍬 ${item.sugarG} g</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">🥑 ${item.fatG} g</span>
            </div>
          </div>
        </div>
        
        <div class="bg-slate-50 rounded-2xl p-4 flex-1 flex flex-col gap-3">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-emerald-500">✨</span>
              <h4 class="font-bold text-sm text-slate-700">ข้อดี</h4>
            </div>
            <ul class="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-emerald-400">
              ${benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
          <div class="w-full h-px bg-slate-200 my-1"></div>
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="text-rose-500">⚠️</span>
              <h4 class="font-bold text-sm text-slate-700">ข้อควรระวัง</h4>
            </div>
            <ul class="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-rose-400">
              ${warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      
      gsap.to(bentoCard, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.15, ease: 'power2.out', startAt: { y: 20 } });
      bentoGrid.appendChild(bentoCard);
    });
    
    card.appendChild(bentoGrid);
  } else {
    const emptyMsg = el('div', 'text-xl text-slate-400 font-bold mb-12 text-center bg-white border border-dashed border-slate-300 p-12 rounded-3xl w-full flex flex-col items-center gap-4');
    emptyMsg.innerHTML = `<span class="text-5xl">🛒</span> <span>เธอยังไม่ได้เลือกอาหารเลยนะ!</span>`;
    card.appendChild(emptyMsg);
  }

  // 4. Interactive Quiz Section (Modern)
  const quizSection = el('div', 'w-full bg-indigo-50/50 rounded-[32px] p-6 md:p-10 mb-12 border border-indigo-100');
  
  const quizHeader = el('div', 'flex items-center gap-3 mb-8 justify-center');
  quizHeader.innerHTML = `<span class="text-3xl">🧠</span> <h2 class="text-2xl font-bold text-indigo-900">ทดสอบความรู้</h2>`;
  quizSection.appendChild(quizHeader);

  const questions = [
    {
      q: 'ด่านแรกของระบบย่อยอาหารคืออะไร?',
      choices: ['หลอดอาหาร', 'ปากและฟัน', 'กระเพาะอาหาร'],
      ans: 1
    },
    {
      q: 'อาหารประเภทใดที่ทำให้ลำไส้ต้องทำงานหนัก ย่อยยาก?',
      choices: ['อาหารที่มีกากใยสูง', 'อาหารไขมันสูง / ของทอด', 'ผลไม้สด'],
      ans: 1
    },
    {
      q: 'สารอาหารส่วนใหญ่ถูกดูดซึมเข้าสู่ร่างกายที่อวัยวะใด?',
      choices: ['ลำไส้เล็ก', 'ลำไส้ใหญ่', 'ตับ'],
      ans: 0
    },
    {
      q: 'น้ำดีที่สร้างจากตับ ช่วยในการย่อยสารอาหารประเภทใด?',
      choices: ['โปรตีน', 'คาร์โบไฮเดรต', 'ไขมัน'],
      ans: 2
    },
    {
      q: 'อวัยวะใดทำหน้าที่ดูดซึมน้ำกลับ และเก็บกากอาหารเตรียมขับถ่าย?',
      choices: ['กระเพาะอาหาร', 'ลำไส้ใหญ่', 'ลำไส้เล็ก'],
      ans: 1
    }
  ];

  let currentQ = 0;
  const quizContainer = el('div', 'flex flex-col items-center w-full max-w-2xl mx-auto min-h-[250px]');
  quizSection.appendChild(quizContainer);

  const renderQuestion = () => {
    quizContainer.innerHTML = '';
    if (currentQ >= questions.length) {
      quizContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in">
          <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-4 text-emerald-500 shadow-inner">✓</div>
          <h3 class="text-2xl font-bold text-slate-800 mb-2">ยอดเยี่ยมมาก!</h3>
          <p class="text-slate-500 font-medium">ตอบคำถามถูกต้องทั้งหมด</p>
        </div>
      `;
      SoundManager.levelUp();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 }, zIndex: 100 });
      return;
    }

    const qData = questions[currentQ];
    
    // Progress indicator
    const progressDiv = el('div', 'flex gap-2 mb-6');
    questions.forEach((_, idx) => {
      const dot = el('div', `w-2.5 h-2.5 rounded-full transition-colors ${idx === currentQ ? 'bg-indigo-500 w-6' : idx < currentQ ? 'bg-emerald-400' : 'bg-indigo-200'}`);
      progressDiv.appendChild(dot);
    });
    quizContainer.appendChild(progressDiv);

    const qText = el('h3', 'text-xl md:text-2xl font-bold text-slate-800 mb-8 text-center', qData.q);
    quizContainer.appendChild(qText);

    const choicesGrid = el('div', 'flex flex-col w-full gap-3');
    qData.choices.forEach((choice, idx) => {
      const btn = el('button', 'w-full bg-white text-slate-700 font-bold py-4 px-6 rounded-2xl border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm text-lg text-left flex items-center justify-between group');
      btn.innerHTML = `
        <span>${choice}</span>
        <div class="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"></div>
      `;
      
      btn.onclick = () => {
        // Disable all buttons
        const allBtns = choicesGrid.querySelectorAll('button');
        allBtns.forEach(b => {
          (b as HTMLButtonElement).disabled = true;
          b.classList.add('opacity-70');
        });

        if (idx === qData.ans) {
          SoundManager.success();
          btn.classList.remove('opacity-70', 'hover:border-indigo-200', 'hover:bg-indigo-50', 'text-slate-700', 'border-transparent');
          btn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-700', 'shadow-md', 'scale-[1.02]');
          btn.innerHTML = `<span>${choice}</span><span class="text-emerald-500 text-xl font-black">✓</span>`;
          setTimeout(() => {
            currentQ++;
            renderQuestion();
          }, 1200);
        } else {
          SoundManager.error();
          btn.classList.remove('opacity-70', 'hover:border-indigo-200', 'hover:bg-indigo-50', 'text-slate-700', 'border-transparent');
          btn.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-700', 'animate-shake');
          btn.innerHTML = `<span>${choice}</span><span class="text-rose-500 text-xl font-black">✕</span>`;
          setTimeout(() => {
            allBtns.forEach(b => {
              (b as HTMLButtonElement).disabled = false;
              b.classList.remove('opacity-70');
            });
            btn.classList.remove('bg-rose-50', 'border-rose-500', 'text-rose-700', 'animate-shake');
            btn.classList.add('text-slate-700', 'border-transparent');
            btn.innerHTML = `<span>${choice}</span><div class="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"></div>`;
          }, 800);
        }
      };
      choicesGrid.appendChild(btn);
    });
    quizContainer.appendChild(choicesGrid);
  };
  renderQuestion();
  card.appendChild(quizSection);

  // Custom CSS for animations
  if (!document.getElementById('summary-styles')) {
    const style = document.createElement('style');
    style.id = 'summary-styles';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        50% { transform: translateX(6px); }
        75% { transform: translateX(-6px); }
      }
      .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    `;
    document.head.appendChild(style);
  }

  // 5. Action Buttons (Modernized)
  const actionContainer = el('div', 'flex flex-col sm:flex-row justify-center items-center gap-4 w-full mt-4');
  
  const playAgainBtn = Button({
    text: 'เริ่มต้นการผจญภัยใหม่',
    variant: 'primary',
    className: 'w-full sm:w-auto min-w-[250px] px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all bg-indigo-600 text-white',
    onClick: () => { SoundManager.click(); store.reset(); }
  });

  actionContainer.appendChild(playAgainBtn);
  card.appendChild(actionContainer);
  
  container.appendChild(card);
  return container;
}