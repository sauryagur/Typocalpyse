// Ghost Typing Content Script
import { getConfig } from "../lib/config"

let enabled = true
let chaosLevel = 0
const chaosChars = "~!@#$%^&*()_+-=[]{}|;:,.<>?"
const letters = "abcdefghijklmnopqrstuvwxyz"

function getRandomChar() {
  // Mix of letters and chaos characters based on chaos level
  if (chaosLevel > 3 && Math.random() < 0.3) {
    return chaosChars[Math.floor(Math.random() * chaosChars.length)]
  }
  return letters[Math.floor(Math.random() * letters.length)]
}

function shouldInjectGhost(): boolean {
  // Probability increases with chaos level
  const baseChance = 0.02 // 2% base chance
  const chaosProbability = baseChance * (chaosLevel / 5)
  return Math.random() < chaosProbability
}

function injectGhostChar(input: HTMLInputElement | HTMLTextAreaElement) {
  if (!enabled || chaosLevel === 0 || !shouldInjectGhost()) return
  
  const pos = input.selectionStart || input.value.length
  const val = input.value
  const char = getRandomChar()
  
  // Don't inject if text is too long
  if (val.length > 250) return
  
  // Insert random character at cursor position
  const newValue = val.slice(0, pos) + char + val.slice(pos)
  input.value = newValue
  
  // Move cursor after the injected character
  const newPos = pos + 1
  input.setSelectionRange(newPos, newPos)
  
  // Dispatch input event
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function attachGhostTyping() {
  // Use event delegation for better performance
  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement
    
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const inputElement = target as HTMLInputElement | HTMLTextAreaElement
      
      // Skip password fields and other sensitive inputs
      if (inputElement.type === 'password' || inputElement.type === 'credit-card') {
        return
      }
      
      // Add a small delay to avoid interfering with normal typing
      setTimeout(() => {
        injectGhostChar(inputElement)
      }, 100 + Math.random() * 200) // Random delay 100-300ms
    }
  })
}

function updateConfig() {
  getConfig().then(cfg => {
    enabled = cfg.features.ghostTyping
    chaosLevel = cfg.chaosLevel || 0
  })
}

// Initialize
attachGhostTyping()
chrome.storage.onChanged.addListener(updateConfig)
updateConfig()
