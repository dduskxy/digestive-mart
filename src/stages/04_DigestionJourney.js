import { store } from '../state/store.js';
import { el, Button, Card } from '../components/UI.js';
import { soundFx } from '../audio/sound.js';
import confetti from 'canvas-confetti';

export function renderDigestionJourney() {
  const container = el('div', 'flex flex-col items-center justify-center h-full w-full bg-slate-900 text-white relative overflow-hidden p-4');
  
  const cart = store.state.cart;
  let subStage = 'mouth'; // mouth, esophagus, stomach, smallIntestine, largeIntestine
  
  // Aggregate stats
  const totalChewsNeeded = cart.reduce((sum, item) => sum + (item.chewFactor * 5), 0) || 10;
  const totalFat = cart.reduce((sum, item) => sum + item.fat, 0);
  const totalFiber = cart.reduce((sum, item) => sum + item.fiber, 0);
  const totalCarbs = cart.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = cart.reduce((sum, item) => sum + item.protein, 0);

  const contentArea = el('div', 'w-full max-w-3xl flex flex-col items-center z-10 transition-all duration-500');

  const renderSubStage = () => {
    contentArea.innerHTML = '';
    
    if (subStage === 'mouth') {
      let currentChews = 0;
      
      const title = el('h2', 'text-4xl font-bold mb-4 text-pink-300', '👄 ปากและฟัน (Mouth)');
      const desc = el('p', 'text-lg mb-8 text-center', `อาหารของคุณต้องเคี้ยวทั้งหมด ${totalChewsNeeded} ครั้ง!\nกดปุ่มรัวๆ หรือปุ่ม Spacebar เพื่อเคี้ยว`);
      
      const progressContainer = el('div', 'w-full bg-gray-700 rounded-full h-8 mb-8 overflow-hidden');
      const progressBar = el('div', 'bg-pink-500 h-8 transition-all duration-100', '');
      progressBar.style.width = '0%';
      progressContainer.appendChild(progressBar);
      
      const foodDisplay = el('div', 'text-6xl mb-8 animate-bounce', cart.map(i => i.icon).join(' '));

      const chewBtn = Button({
        text: '🦷 เคี้ยว! (Mash)',
        variant: 'primary',
        className: 'text-2xl py-4 px-12 bg-pink-600 hover:bg-pink-500',
        onClick: () => handleChew()
      });

      const handleChew = () => {
        if (currentChews >= totalChewsNeeded) return;
        currentChews++;
        soundFx.chew();
        progressBar.style.width = `${(currentChews / totalChewsNeeded) * 100}%`;
        foodDisplay.style.transform = `scale(${1 - (currentChews/totalChewsNeeded)*0.5}) rotate(${currentChews*10}deg)`;
        
        if (currentChews >= totalChewsNeeded) {
          soundFx.success();
          setTimeout(() => {
            subStage = 'esophagus';
            renderSubStage();
          }, 1000);
        }
      };

      const keyHandler = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handleChew();
        }
      };
      document.addEventListener('keydown', keyHandler);
      // Clean up keydown later (not strictly clean here but works for prototype)

      contentArea.appendChild(title);
      contentArea.appendChild(desc);
      contentArea.appendChild(foodDisplay);
      contentArea.appendChild(progressContainer);
      contentArea.appendChild(chewBtn);

    } else if (subStage === 'esophagus') {
      const title = el('h2', 'text-4xl font-bold mb-8 text-rose-300', '⏬ หลอดอาหาร (Esophagus)');
      const desc = el('p', 'text-lg mb-8 text-center', 'กล้ามเนื้อกำลังบีบตัวดันอาหารลงสู่กระเพาะ... (Peristalsis)');
      
      const tube = el('div', 'w-24 h-64 border-4 border-rose-400 rounded-full flex flex-col items-center justify-start overflow-hidden bg-rose-950 relative');
      const bolus = el('div', 'text-4xl absolute transition-all duration-[3000ms] ease-in-out', '🍲');
      bolus.style.top = '-50px';
      
      tube.appendChild(bolus);

      contentArea.appendChild(title);
      contentArea.appendChild(desc);
      contentArea.appendChild(tube);

      // Trigger animation
      setTimeout(() => {
        soundFx.splash();
        bolus.style.top = '250px';
      }, 100);

      setTimeout(() => {
        subStage = 'stomach';
        renderSubStage();
      }, 3000);

    } else if (subStage === 'stomach') {
      let acidLevel = 50 + (totalFat > 20 ? 30 : 0); // High fat = high acid
      
      const title = el('h2', 'text-4xl font-bold mb-4 text-yellow-400', '🍲 กระเพาะอาหาร (Stomach)');
      const desc = el('p', 'text-lg mb-8 text-center', `ไขมันเยอะทำให้กรดหลั่งมาก! รักษาสมดุลกรดให้อยู่ในโซนสีเขียว\n(กดเติมน้ำเพื่อเจือจาง)`);
      
      const gaugeContainer = el('div', 'w-full max-w-md bg-gray-700 rounded-full h-12 mb-8 relative border-4 border-gray-600 overflow-hidden');
      const gaugeFill = el('div', 'h-full transition-all duration-300', '');
      gaugeContainer.appendChild(gaugeFill);
      
      const updateGauge = () => {
        gaugeFill.style.width = `${Math.min(100, Math.max(0, acidLevel))}%`;
        if (acidLevel < 30) gaugeFill.className = 'h-full transition-all duration-300 bg-blue-500'; // Too dilute
        else if (acidLevel > 70) gaugeFill.className = 'h-full transition-all duration-300 bg-red-500'; // Too acidic
        else gaugeFill.className = 'h-full transition-all duration-300 bg-green-500'; // Perfect
      };
      updateGauge();

      const waterBtn = Button({
        text: '💧 ดื่มน้ำ (Dilute)',
        variant: 'primary',
        className: 'text-xl py-3 px-8 bg-cyan-600 mb-8',
        onClick: () => {
          soundFx.splash();
          acidLevel -= 10;
          updateGauge();
        }
      });

      contentArea.appendChild(title);
      contentArea.appendChild(desc);
      contentArea.appendChild(gaugeContainer);
      contentArea.appendChild(waterBtn);

      // Simulate churning over 5 seconds
      let ticks = 0;
      const interval = setInterval(() => {
        acidLevel += (Math.random() * 10) - 2; // slowly rises
        updateGauge();
        ticks++;
        if (ticks > 15) {
          clearInterval(interval);
          if (acidLevel > 80) store.updateStat('score', store.state.stats.score - 10);
          else if (acidLevel >= 30 && acidLevel <= 70) store.updateStat('score', store.state.stats.score + 20);
          
          soundFx.success();
          subStage = 'smallIntestine';
          renderSubStage();
        }
      }, 400);

    } else if (subStage === 'smallIntestine') {
      const title = el('h2', 'text-4xl font-bold mb-4 text-emerald-400', '🧬 ลำไส้เล็ก (Small Intestine)');
      const desc = el('p', 'text-lg mb-4 text-center', 'ดูดซึมสารอาหาร! เอาเมาส์ชี้/คลิกเพื่อเก็บสารอาหารที่ลอยมา');
      
      const gameArea = el('div', 'relative w-full max-w-2xl h-80 bg-emerald-950 border-4 border-emerald-700 rounded-2xl overflow-hidden cursor-crosshair');
      
      let collected = 0;
      const targetCollect = 15;
      
      const scoreDisplay = el('div', 'absolute top-2 left-2 text-xl font-bold text-emerald-200 z-20', `เก็บแล้ว: 0 / ${targetCollect}`);
      gameArea.appendChild(scoreDisplay);

      contentArea.appendChild(title);
      contentArea.appendChild(desc);
      contentArea.appendChild(gameArea);

      let active = true;
      const spawnNutrient = () => {
        if (!active) return;
        const types = ['🔹', '🔸', '🟢']; // Carbs, Protein, Fat
        const type = types[Math.floor(Math.random() * types.length)];
        const orb = el('div', 'absolute text-2xl animate-float cursor-pointer select-none transition-transform hover:scale-125', type);
        orb.style.left = `${Math.random() * 90}%`;
        orb.style.top = `${Math.random() * 90}%`;
        
        orb.onmouseover = orb.onmousedown = () => {
          if(!orb.parentNode) return;
          soundFx.coin();
          orb.remove();
          collected++;
          scoreDisplay.innerText = `เก็บแล้ว: ${collected} / ${targetCollect}`;
          store.incrementStat('energy', 5);
          
          if (collected >= targetCollect) {
            active = false;
            soundFx.success();
            store.updateStat('score', store.state.stats.score + 30);
            setTimeout(() => {
              subStage = 'largeIntestine';
              renderSubStage();
            }, 1000);
          }
        };
        gameArea.appendChild(orb);
        setTimeout(() => { if (orb.parentNode) orb.remove(); }, 2000); // Disappear if not caught
        
        setTimeout(spawnNutrient, 400);
      };
      spawnNutrient();

    } else if (subStage === 'largeIntestine') {
      const title = el('h2', 'text-4xl font-bold mb-4 text-amber-700', '💩 ลำไส้ใหญ่และการขับถ่าย (Excretion)');
      
      let msg = '';
      let icon = '';
      const germRisk = store.state.stats.germRisk;
      
      if (germRisk > 20) {
        msg = 'โอ๊ะโอ... คุณได้รับเชื้อโรคจากการไม่ดูแลความสะอาด ทำให้ท้องร่วง! (Diarrhea)';
        icon = '💦💩';
        soundFx.fart();
      } else if (totalFiber < 5) {
        msg = 'อูยยย... อาหารที่คุณเลือกมีไฟเบอร์น้อยเกินไป ทำให้ท้องผูก! (Constipation)';
        icon = '🪨💩';
        soundFx.error();
      } else {
        msg = 'ยอดเยี่ยม! ระบบขับถ่ายทำงานได้ดีเยี่ยม ได้รับอึทองคำ! (Healthy Stool)';
        icon = '✨💩✨';
        soundFx.success();
        confetti();
        store.updateStat('score', store.state.stats.score + 30);
      }

      contentArea.appendChild(title);
      contentArea.appendChild(el('div', 'text-8xl mb-8', icon));
      contentArea.appendChild(el('p', 'text-2xl text-center mb-8 max-w-lg', msg));
      
      contentArea.appendChild(Button({
        text: 'ดูรายงานสรุปผล 📊',
        variant: 'primary',
        className: 'text-2xl py-4 px-8',
        onClick: () => {
          soundFx.click();
          store.setStage('05_SummaryReport');
        }
      }));
    }
  };

  renderSubStage();
  container.appendChild(contentArea);
  
  return container;
}
