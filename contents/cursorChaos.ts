import type { PlasmoCSConfig } from "plasmo";
import { ConfigManager, getChaosIntensity } from "~lib/config";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_end",
};

class CursorChaos {
  private isActive = false;
  private intensity = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private style: HTMLStyleElement | null = null;
  private cursorElement: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    const configManager = ConfigManager.getInstance();
    await configManager.loadConfig();
    
    const config = configManager.getConfig();
    this.updateSettings(config.chaosLevel, config.features.wanderingCursor);

    // Listen for config changes
    configManager.onConfigChange((config) => {
      this.updateSettings(config.chaosLevel, config.features.wanderingCursor);
    });
  }

  private updateSettings(chaosLevel: number, enabled: boolean) {
    this.intensity = getChaosIntensity(chaosLevel);
    
    if (enabled && !this.isActive) {
      this.start();
    } else if (!enabled && this.isActive) {
      this.stop();
    }
  }

  private start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.injectStyles();
    this.createCursor();
    this.startChaos();
  }

  private stop() {
    this.isActive = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.removeStyles();
    this.removeCursor();
  }

  private injectStyles() {
    if (this.style) return;
    
    this.style = document.createElement("style");
    this.style.textContent = `
      .chaos-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        pointer-events: none;
        z-index: 999999;
        transition: transform 0.1s ease;
        background: radial-gradient(circle, #00ff41, transparent);
        border-radius: 50%;
        opacity: 0.6;
      }
      
      body.cursor-chaos {
        cursor: none !important;
      }
      
      body.cursor-chaos * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(this.style);
  }

  private removeStyles() {
    if (this.style) {
      this.style.remove();
      this.style = null;
    }
    
    document.body.classList.remove("cursor-chaos");
  }

  private createCursor() {
    if (this.cursorElement) return;
    
    this.cursorElement = document.createElement("div");
    this.cursorElement.className = "chaos-cursor";
    document.body.appendChild(this.cursorElement);
    document.body.classList.add("cursor-chaos");
    
    // Track real cursor position
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  private removeCursor() {
    if (this.cursorElement) {
      this.cursorElement.remove();
      this.cursorElement = null;
    }
    
    document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    document.body.classList.remove("cursor-chaos");
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.cursorElement) return;
    
    // Base position
    let x = event.clientX;
    let y = event.clientY;
    
    // Add chaos offset
    const maxOffset = 20 * this.intensity;
    const offsetX = (Math.random() - 0.5) * maxOffset;
    const offsetY = (Math.random() - 0.5) * maxOffset;
    
    x += offsetX;
    y += offsetY;
    
    this.cursorElement.style.left = `${x}px`;
    this.cursorElement.style.top = `${y}px`;
  }

  private startChaos() {
    if (this.intervalId) return;
    
    // Random jitter every 100-500ms based on chaos intensity
    const baseInterval = 300;
    const interval = baseInterval - (baseInterval * 0.7 * this.intensity);
    
    this.intervalId = setInterval(() => {
      if (!this.cursorElement) return;
      
      // Random additional jitter
      const jitterIntensity = 10 * this.intensity;
      const jitterX = (Math.random() - 0.5) * jitterIntensity;
      const jitterY = (Math.random() - 0.5) * jitterIntensity;
      
      const currentTransform = this.cursorElement.style.transform;
      this.cursorElement.style.transform = `${currentTransform} translate(${jitterX}px, ${jitterY}px)`;
      
      // Reset jitter after a short delay
      setTimeout(() => {
        if (this.cursorElement) {
          this.cursorElement.style.transform = currentTransform;
        }
      }, 50);
      
    }, interval);
  }
}

// Initialize when page loads
new CursorChaos();
