import Chart from 'chart.js/auto';
import { store } from '../state/store.js';
import { el, Button, Card } from '../components/UI.js';
import { soundFx } from '../audio/sound.js';
import confetti from 'canvas-confetti';

export function renderSummaryReport() {
  const container = el('div', 'flex flex-col items-center p-8 min-h-full w-full bg-slate-50 text-gray-800 overflow-y-auto');
  
  // Play confetti on load
  setTimeout(() => confetti({ particleCount: 150, spread: 100 }), 300);
  
  const cart = store.state.cart;
  const stats = store.state.stats;
  
  const totalCals = cart.reduce((sum, item) => sum + item.calories, 0);
  const totalFiber = cart.reduce((sum, item) => sum + item.fiber, 0);
  const totalCarbs = cart.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = cart.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = cart.reduce((sum, item) => sum + item.fat, 0);

  // Verdict Logic
  let verdict = '';
  if (stats.germRisk > 20) verdict = '🚨 ระบบย่อยติดขัดจากเชื้อโรค! คราวหน้าอย่าลืมล้างมือก่อนทานนะ';
  else if (totalFiber < 5) verdict = '⚠️ ท้องผูก! ขาดกากใยอาหาร (ควรเพิ่มผักผลไม้)';
  else if (totalCals > 1200) verdict = '🔥 พลังงานล้นหลาม! อาจทำให้จุกเสียดหรืออ้วนได้';
  else if (totalProtein < 10) verdict = '💪 ขาดโปรตีน! ร่างกายอาจซ่อมแซมส่วนที่สึกหรอได้ช้า';
  else verdict = '🏆 ยอดนักกินสมดุล! ระบบย่อยอาหารทำงานได้อย่างสมบูรณ์แบบ';

  const finalScore = Math.max(0, Math.min(100, stats.score + (totalFiber >= 5 ? 20 : 0)));

  // Update Leaderboard
  const lbKey = 'dm_leaderboard';
  let leaderboard = JSON.parse(localStorage.getItem(lbKey) || '[]');
  leaderboard.push({
    name: store.state.player.name,
    avatar: store.state.player.avatar,
    score: finalScore,
    date: new Date().toLocaleDateString()
  });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5); // Keep top 5
  localStorage.setItem(lbKey, JSON.stringify(leaderboard));

  const header = el('div', 'text-center mb-8', [
    el('h1', 'text-4xl font-extrabold text-blue-600 mb-2', 'ผลประเมินสุขภาพของคุณ'),
    el('h2', 'text-2xl text-gray-600', `${store.state.player.avatar} ${store.state.player.name}`)
  ]);

  const scoreCard = Card({
    className: 'w-full max-w-4xl flex flex-col md:flex-row gap-8 mb-8',
    content: [
      el('div', 'flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0', [
        el('p', 'text-gray-500 text-lg uppercase tracking-wider', 'คะแนนสุขภาพรวม'),
        el('div', `text-7xl font-black my-4 ${finalScore >= 80 ? 'text-green-500' : finalScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`, `${finalScore}/100`),
        el('p', 'text-xl font-bold text-center mt-2 px-4 text-blue-800 bg-blue-100 py-2 rounded-lg', verdict)
      ]),
      el('div', 'flex-1 relative w-full h-64 flex justify-center', [
        el('canvas', '', '', { id: 'radarChart' })
      ])
    ]
  });

  const detailsGrid = el('div', 'grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-8');
  const addStatCard = (label, val, unit) => {
    detailsGrid.appendChild(el('div', 'bg-white p-4 rounded-xl shadow border border-gray-100 flex flex-col items-center text-center', [
      el('span', 'text-gray-400 text-sm mb-1', label),
      el('span', 'text-2xl font-bold text-gray-800', `${val.toFixed(1)} ${unit}`)
    ]));
  };
  addStatCard('พลังงาน', totalCals, 'kcal');
  addStatCard('คาร์บ', totalCarbs, 'g');
  addStatCard('โปรตีน', totalProtein, 'g');
  addStatCard('ไขมัน', totalFat, 'g');

  // Leaderboard Section
  const lbCard = Card({
    className: 'w-full max-w-4xl mb-8',
    title: '🏆 Hall of Fame (Top 5)',
    content: leaderboard.map((l, i) => el('div', 'flex justify-between items-center py-3 border-b border-gray-100 last:border-0', [
      el('div', 'flex items-center gap-4', [
        el('span', 'text-xl font-bold text-gray-400 w-6', `#${i+1}`),
        el('span', 'text-2xl', l.avatar),
        el('span', 'font-medium text-gray-800', l.name)
      ]),
      el('div', 'font-bold text-blue-600', `${l.score} pts`)
    ]))
  });

  const resetBtn = Button({
    text: '🔄 เล่นอีกครั้ง',
    variant: 'primary',
    className: 'text-xl py-3 px-8 mb-12',
    onClick: () => {
      soundFx.click();
      store.clearCart();
      store.resetDigestion();
      store.update({ stats: { ...store.state.stats, score: 0, germRisk: 0, immunity: 50, energy: 0, fiber: 0 } });
      store.setStage('01_Welcome');
    }
  });

  container.appendChild(header);
  container.appendChild(scoreCard);
  container.appendChild(detailsGrid);
  container.appendChild(lbCard);
  container.appendChild(resetBtn);

  // Render Chart after DOM insertion
  setTimeout(() => {
    const ctx = document.getElementById('radarChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['คาร์โบไฮเดรต', 'โปรตีน', 'ไขมัน', 'ไฟเบอร์'],
          datasets: [{
            label: 'สัดส่วนสารอาหาร',
            data: [totalCarbs, totalProtein, totalFat, totalFiber * 5], // Multiply fiber just for scale visibility
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { r: { beginAtZero: true, suggestedMax: 50 } }
        }
      });
    }
  }, 100);

  return container;
}
