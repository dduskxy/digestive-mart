export function el(tag, className = '', content = '', attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (Array.isArray(content)) {
    content.forEach(child => child && element.appendChild(child));
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  }
  
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  }
  return element;
}

export function Button({ text, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-md'
  };
  
  return el('button', 
    `px-4 py-2 rounded-lg font-bold transition-transform transform hover:scale-105 active:scale-95 ${variants[variant]} ${className}`, 
    text, 
    { onClick }
  );
}

export function Card({ title, content, className = '' }) {
  return el('div', `glass-panel p-6 rounded-2xl ${className}`, [
    title ? el('h3', 'text-xl font-bold mb-4', title) : null,
    ...(Array.isArray(content) ? content : [content])
  ]);
}
