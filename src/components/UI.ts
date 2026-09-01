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
  const baseClass = 'relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-150 hover:brightness-110 active:translate-y-1 active:border-b-0 cursor-pointer text-center select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 ' + (props.className || 'px-6 py-3 text-lg md:text-xl');
  
  const variants = {
    primary: 'bg-gradient-to-b from-[#1CB0F6] to-[#1899D6] text-white border-b-4 border-[#127DAF] shadow-sm',
    secondary: 'bg-white hover:bg-gray-50 text-[#4B4B4B] border-2 border-gray-200 border-b-4 border-b-gray-300',
    danger: 'bg-gradient-to-b from-[#FF4B4B] to-[#EA2B2B] text-white border-b-4 border-[#C81A1A] shadow-sm',
    success: 'bg-gradient-to-b from-[#58CC02] to-[#46A302] text-white border-b-4 border-[#357A01] shadow-sm',
    golden: 'bg-gradient-to-b from-amber-400 to-amber-500 text-white border-b-4 border-amber-600 shadow-sm'
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
export function HealthTag(tag: 'excellent' | 'moderate' | 'avoid'): HTMLElement {
  const styles = {
    excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
    moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    avoid: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  const labels = {
    excellent: '✅ ดีเยี่ยม',
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
export function NutrientChip(icon: string, value: string, color: string = 'text-slate-300'): HTMLElement {
  const chip = el('span', `flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-full text-xs font-bold border border-slate-700 ${color} whitespace-nowrap shadow-sm`);
  chip.innerHTML = `<span>${icon}</span> <span>${value}</span>`;
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
