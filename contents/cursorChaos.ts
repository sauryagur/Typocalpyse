import type { PlasmoCSConfig } from "plasmo"
import { ConfigManager, getChaosIntensity } from "~lib/config"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_end"
}

class CursorChaos {
  private isActive = false
  private intensity = 1 // Max chaos
  private wanderRadius = 100
  private intervalId: NodeJS.Timeout | null = null
  private style: HTMLStyleElement | null = null
  private cursorElement: HTMLElement | null = null

  private realMouseX = 0
  private realMouseY = 0

  constructor() {
    this.init()
  }

  private async init() {
    const configManager = ConfigManager.getInstance()
    await configManager.loadConfig()

    const config = configManager.getConfig()
    this.updateSettings(config.chaosLevel, config.features.wanderingCursor)

    configManager.onConfigChange((config) => {
      this.updateSettings(config.chaosLevel, config.features.wanderingCursor)
    })
  }

  private updateSettings(chaosLevel: number, enabled: boolean) {
    this.intensity = getChaosIntensity(chaosLevel)
    if (enabled && !this.isActive) {
      this.start()
    } else if (!enabled && this.isActive) {
      this.stop()
    }
  }

  private start() {
    if (this.isActive) return

    this.isActive = true
    this.injectStyles()
    this.createCursor()
    this.startChaos()
  }

  private stop() {
    this.isActive = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.removeStyles()
    this.removeCursor()
  }

  private injectStyles() {
    if (this.style) return
    this.style = document.createElement("style")
    this.style.textContent = `
      .chaos-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        pointer-events: none;
        z-index: 999999;
        background: radial-gradient(circle, #00ff41, transparent);
        border-radius: 50%;
        opacity: 0.6;
        will-change: transform, left, top;
      }

      body.cursor-chaos {
        cursor: none !important;
      }

      body.cursor-chaos * {
        cursor: none !important;
      }
    `
    document.head.appendChild(this.style)
  }

  private removeStyles() {
    if (this.style) {
      this.style.remove()
      this.style = null
    }
    document.body.classList.remove("cursor-chaos")
  }

  private createCursor() {
    if (this.cursorElement) return
    this.cursorElement = document.createElement("div")
    this.cursorElement.className = "chaos-cursor"
    document.body.appendChild(this.cursorElement)
    document.body.classList.add("cursor-chaos")
    document.addEventListener("mousemove", this.handleMouseMove)
  }

  private removeCursor() {
    if (this.cursorElement) {
      this.cursorElement.remove()
      this.cursorElement = null
    }
    document.removeEventListener("mousemove", this.handleMouseMove)
    document.body.classList.remove("cursor-chaos")
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.realMouseX = event.clientX
    this.realMouseY = event.clientY
  }

  private startChaos() {
    const fps = 60
    const interval = 1000 / fps

    this.intervalId = setInterval(() => {
      if (!this.cursorElement) return

      const jitterScale = this.wanderRadius * this.intensity
      const offsetX = (Math.random() - 0.5) * jitterScale * 2
      const offsetY = (Math.random() - 0.5) * jitterScale * 2

      const x = this.realMouseX + offsetX
      const y = this.realMouseY + offsetY

      this.cursorElement.style.left = `${x}px`
      this.cursorElement.style.top = `${y}px`
    }, interval)
  }
}

// Init
new CursorChaos()
