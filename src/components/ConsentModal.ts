/**
 * ConsentModal: Shown once after player enters name in Stage 1.
 * 
 * Thai UI explaining:
 * - What the camera will be used for (all stages)
 * - That it's completely optional
 * - That nothing is uploaded; only local avatar/victory images stored
 * - Two clear buttons: "อนุญาต" (Allow) and "เล่นแบบไม่ใช้กล้อง" (Play without camera)
 */

import { store } from '../state/store';
import { cameraInput } from '../services/CameraInputProvider';

export class ConsentModal {
  private container: HTMLDivElement;
  private onClose: (() => void) | null = null;

  constructor(onClose?: () => void) {
    this.onClose = onClose || null;
    this.container = document.createElement('div');
    this.render();
  }

  private render() {
    this.container.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-center';
    
    const modalContent = document.createElement('div');
    modalContent.className = `
      bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-lg
      p-8 rounded-3xl border-4 border-white/80
      shadow-[0_0_40px_rgba(255,138,101,0.3)]
      max-w-sm w-full mx-4
      text-center
      animate-bounce-in
    `;
    
    const icon = document.createElement('div');
    icon.className = 'text-8xl mb-4 animate-float';
    icon.textContent = '📷';
    
    const title = document.createElement('h2');
    title.className = 'text-3xl font-black text-[#FF8A65] mb-4 drop-shadow-sm font-["Baloo_2"]';
    title.textContent = '📸 กล้องเพื่อเล่นได้สนุกยิ่งขึ้น';
    
    const description = document.createElement('div');
    description.className = 'text-base text-[#4E342E] mb-6 space-y-3 font-["Kanit"]';
    description.innerHTML = `
      <p class="font-semibold mb-3">
        🎮 <strong>กล้องจะช่วยเพิ่มความสนุกให้กับเกมนี้!</strong>
      </p>
      <p class="text-sm leading-relaxed">
        ✅ ใช้กับทุกด่านเกมเพื่อควบคุมตัวละคร
      </p>
      <p class="text-sm leading-relaxed">
        ✅ ถ่ายรูปอวตารให้สวยๆ ได้เลย
      </p>
      <p class="text-sm leading-relaxed">
        ✅ <strong>ข้อมูลทั้งหมดเก็บในอุปกรณ์ของคุณ ไม่มีการอัปโหลด</strong>
      </p>
      <p class="text-xs text-gray-600 mt-3 italic">
        💡 <em>หากปฏิเสธ คุณสามารถเล่นเกมได้ปกติอย่างเต็มที่</em>
      </p>
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-col gap-3 mt-8';
    
    // Allow Camera Button
    const allowBtn = document.createElement('button');
    allowBtn.className = `
      w-full py-4 px-6 rounded-2xl font-black text-lg
      bg-gradient-to-r from-[#FF8A65] to-[#FF6347]
      text-white shadow-[0_0_20px_rgba(255,138,101,0.4)]
      hover:shadow-[0_0_30px_rgba(255,138,101,0.6)] hover:scale-105
      active:scale-95 transition-all duration-200
      font-["Baloo_2"]
    `;
    allowBtn.innerHTML = '✅ อนุญาตใช้กล้อง';
    allowBtn.addEventListener('click', () => this.handleAllow());
    
    // Deny Camera Button
    const denyBtn = document.createElement('button');
    denyBtn.className = `
      w-full py-4 px-6 rounded-2xl font-bold text-lg
      bg-gray-200 text-gray-800
      border-2 border-gray-300
      hover:bg-gray-300 hover:scale-105
      active:scale-95 transition-all duration-200
      font-["Kanit"]
    `;
    denyBtn.innerHTML = '❌ เล่นแบบไม่ใช้กล้อง';
    denyBtn.addEventListener('click', () => this.handleDeny());
    
    buttonContainer.appendChild(allowBtn);
    buttonContainer.appendChild(denyBtn);
    
    modalContent.appendChild(icon);
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(buttonContainer);
    
    this.container.appendChild(modalContent);
    
    // Prevent closing by clicking outside
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        e.preventDefault();
      }
    });
  }

  private async handleAllow() {
    // Update store consent
    store.setCameraConsent(true);
    store.setConsentShown(true);
    
    // Request camera access
    const granted = await cameraInput.requestCamera();
    if (granted) {
      store.setCameraPermission('granted');
      store.setCameraActive(true);
      console.log('[ConsentModal] Camera access granted');
    } else {
      // Permission denied by user or browser
      store.setCameraPermission('denied');
      console.warn('[ConsentModal] Camera access denied');
    }
    
    this.close();
  }

  private handleDeny() {
    // User opted for non-camera gameplay
    store.setCameraConsent(false);
    store.setConsentShown(true);
    store.setCameraPermission('denied');
    console.log('[ConsentModal] User chose non-camera gameplay');
    
    this.close();
  }

  public mount(parent: HTMLElement = document.body) {
    parent.appendChild(this.container);
  }

  public close() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.onClose) {
      this.onClose();
    }
  }

  public unmount() {
    this.close();
  }
}
