// Utility for creating DOM elements easily
export function el(tag: string, className = '', textContent = ''): HTMLElement {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

interface ButtonProps {
  text: string | HTMLElement;
  onClick: (e: MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'golden';
  className?: string;
  icon?: string;
}

export function Button(props: ButtonProps): HTMLElement {
  const baseClass = 'relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer text-center select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ' + (props.className || 'px-6 py-3 text-lg md:text-xl');
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#ff7c6b] via-[#ff9a76] to-[#ffb14d] text-white border-b-4 border-[#d9624d] shadow-[0_10px_18px_rgba(255,124,107,0.32)]',
    secondary: 'bg-white/90 hover:bg-white text-[#43393B] border-2 border-[#E7D7D0] border-b-4 border-b-[#D9C5C2] shadow-[0_10px_18px_rgba(112,78,68,0.08)]',
    danger: 'bg-gradient-to-r from-[#ff6666] to-[#eb4d4d] text-white border-b-4 border-[#c43737] shadow-[0_10px_18px_rgba(239,93,93,0.3)]',
    success: 'bg-gradient-to-r from-[#50c878] to-[#35b36d] text-white border-b-4 border-[#2a8d57] shadow-[0_10px_18px_rgba(80,200,120,0.32)]',
    golden: 'bg-gradient-to-r from-[#f9c74f] to-[#f7b32d] text-white border-b-4 border-[#d49413] shadow-[0_10px_18px_rgba(247,179,45,0.28)]'
  };

  const btnEl = el('button', `${baseClass} ${variants[props.variant || 'primary']}`);
  
  const contentEl = el('span', 'flex items-center justify-center gap-2');
  if (props.icon) {
    contentEl.appendChild(Icon(props.icon, 'w-6 h-6'));
  }
  
  if (typeof props.text === 'string') {
    const textSpan = el('span');
    textSpan.innerHTML = props.text;
    contentEl.appendChild(textSpan);
  } else {
    contentEl.appendChild(props.text);
  }
  btnEl.appendChild(contentEl);

  btnEl.addEventListener('click', (e) => {
    props.onClick(e);
  });

  return btnEl;
}

function Icon(iconName: string, className: string = 'w-6 h-6'): HTMLElement {
  const i = el('i', className);
  i.setAttribute('data-lucide', iconName);
  return i;
}

// Create a health tag badge element
export function HealthTag(tag: 'excellent' | 'good' | 'moderate' | 'avoid'): HTMLElement {
  const styles = {
    excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
    good: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    avoid: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  const labels = {
    excellent: '✅ ดีเยี่ยม',
    good: '👍 ดี',
    moderate: '👌 พอใช้',
    avoid: '⚠️ ควรเลี่ยง'
  };
  return el('span', `px-2 py-1 rounded-lg text-xs font-bold border ${styles[tag]} whitespace-nowrap`, labels[tag]);
}

// Create animated loading spinner
export function Spinner(size: 'sm' | 'md' | 'lg' = 'md'): HTMLElement {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-4', lg: 'w-12 h-12 border-4' };
  return el('div', `animate-spin rounded-full border-slate-300 border-t-blue-500 ${sizes[size]}`);
}

// Create nutrient chip (small pill with icon+value)
export function NutrientChip(icon: string, value: string, color: string = 'text-slate-300', bgClass: string = 'bg-white/10'): HTMLElement {
  const chip = el('div', `flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 shadow-sm backdrop-blur-sm ${bgClass}`);
  const i = el('span', 'text-sm drop-shadow-sm', icon);
  const v = el('span', `text-xs font-bold ${color}`, value);
  chip.appendChild(i);
  chip.appendChild(v);
  return chip;
}

// Create a modal overlay with backdrop
export function Modal(content: HTMLElement, onClose: () => void): HTMLElement {
  const backdrop = el('div', 'fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-[fadeIn_0.2s_ease-out]');
  backdrop.appendChild(content);
  backdrop.onclick = (e) => { if (e.target === backdrop) onClose(); };
  return backdrop;
}

// Create SVG circular progress ring
export function ProgressRing(percent: number, size: number = 40, color: string = '#1CB0F6', trackColor: string = '#334155'): SVGElement {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size.toString());
  svg.setAttribute("height", size.toString());
  svg.setAttribute("class", "transform -rotate-90");
  
  const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  track.setAttribute("cx", (size/2).toString());
  track.setAttribute("cy", (size/2).toString());
  track.setAttribute("r", radius.toString());
  track.setAttribute("fill", "transparent");
  track.setAttribute("stroke", trackColor);
  track.setAttribute("stroke-width", strokeWidth.toString());
  
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", (size/2).toString());
  circle.setAttribute("cy", (size/2).toString());
  circle.setAttribute("r", radius.toString());
  circle.setAttribute("fill", "transparent");
  circle.setAttribute("stroke", color);
  circle.setAttribute("stroke-width", strokeWidth.toString());
  circle.setAttribute("stroke-dasharray", circumference.toString());
  circle.setAttribute("stroke-dashoffset", offset.toString());
  circle.setAttribute("stroke-linecap", "round");
  circle.setAttribute("class", "transition-all duration-500 ease-out");
  
  svg.appendChild(track);
  svg.appendChild(circle);
  return svg;
}

export function showObjective(icon: string, title: string, description: string, btnText: string = 'เริ่มเลย! 🚀', onStart?: () => void) {
  const container = el('div', 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]');
  
  const card = el('div', 'bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-bounce-in border-4 border-indigo-50');
  
  const iconEl = el('div', 'text-7xl mb-4 drop-shadow-md animate-bounce');
  iconEl.textContent = icon;
  card.appendChild(iconEl);

  const titleEl = el('h2', 'text-3xl font-black text-indigo-600 mb-4 tracking-tight');
  titleEl.innerHTML = title;
  card.appendChild(titleEl);

  const descEl = el('p', 'text-lg text-slate-500 font-medium mb-8 leading-relaxed');
  descEl.innerHTML = description;
  card.appendChild(descEl);

  const btn = Button({
    text: btnText,
    variant: 'primary',
    className: 'w-full py-4 text-xl',
    onClick: () => {
      import('../audio/SoundManager').then(({ SoundManager }) => SoundManager.click());
      container.style.opacity = '0';
      container.style.transition = 'opacity 0.2s';
      setTimeout(() => {
        container.remove();
        if (onStart) onStart();
      }, 200);
    }
  });
  card.appendChild(btn);

  container.appendChild(card);
  document.body.appendChild(container);
}
