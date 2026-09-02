import { el } from '../components/UI';
import { SoundManager } from '../audio/SoundManager';

export interface HygieneChoice {
  id: number;
  icon: string;
  title: string;
  desc: string;
  titleColor: string;
}

export const choices: HygieneChoice[] = [
  { id: 1, icon: '💧 🧼', title: 'ล้างด้วยสบู่และน้ำ 20 วินาที', desc: 'สะอาดปลอดภัย กำจัดเชื้อโรคได้สมบูรณ์ที่สุด', titleColor: 'text-green-700' },
  { id: 2, icon: '🧴 ✨', title: 'ใช้เจลแอลกอฮอล์ล้างมือ', desc: 'สะดวก รวดเร็ว ลดเชื้อโรคได้อย่างดี', titleColor: 'text-blue-800' },
  { id: 3, icon: '💦 💨', title: 'สเปรย์แอลกอฮอล์ฆ่าเชื้อ', desc: 'พ่นทั่วฝ่ามือเพื่อฆ่าเชื้อโรคอย่างทั่วถึง', titleColor: 'text-teal-700' },
  { id: 4, icon: '🚿 💧', title: 'ล้างด้วยน้ำเปล่าอย่างเดียว', desc: 'ชะล้างสิ่งสกปรกทั่วไปออกได้บางส่วน', titleColor: 'text-blue-600' },
  { id: 5, icon: '🧻 ✨', title: 'ใช้ทิชชูเปียกเช็ดทำความสะอาด', desc: 'เช็ดคราบสกปรกภายนอกเบื้องต้น', titleColor: 'text-purple-700' },
  { id: 6, icon: '🖐️', title: 'ไม่ทำความสะอาดมือเลย', desc: 'เสี่ยงต่อสิ่งสกปรกเข้าสู่ร่างกายโดยตรง', titleColor: 'text-red-700' }
];

export function renderHygieneChoices(onSelect: (choice: HygieneChoice) => void): HTMLElement {
  const container = el('div', 'w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4 mt-20 z-20 relative');
  
  const title = el('h2', 'text-4xl font-extrabold text-blue-500 mb-8 font-["Baloo_2"] drop-shadow-sm', 'เลือกวิธีทำความสะอาดมือของคุณ');
  container.appendChild(title);

  const grid = el('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full');
  
  choices.forEach(choice => {
    const card = el('div', 'bg-white/95 backdrop-blur-sm border-2 border-blue-50 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between');
    card.onclick = () => {
      SoundManager.click();
      onSelect(choice);
    };

    const iconDiv = el('div', 'text-4xl mb-3');
    iconDiv.textContent = choice.icon;
    
    const titleEl = el('h3', `text-xl font-bold mb-2 ${choice.titleColor}`);
    titleEl.textContent = choice.title;
    
    const descEl = el('p', 'text-gray-500 text-sm font-medium');
    descEl.textContent = choice.desc;

    card.appendChild(iconDiv);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    
    grid.appendChild(card);
  });

  container.appendChild(grid);
  return container;
}
