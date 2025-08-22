// Ghost Typing Content Script
import { getConfig } from "../lib/config"

let enabled = true
let chaosLevel = 0
const letters = "abcdefghijklmnopqrstuvwxyz"

function randomChar() {
  return letters[Math.floor(Math.random() * letters.length)]
}

function injectGhostInput(input: HTMLInputElement | HTMLTextAreaElement) {
  if (!enabled || chaosLevel === 0) return
  if (Math.random() > 0.01 * chaosLevel) return
  const pos = input.selectionStart || 0
  const val = input.value
  const char = randomChar()
  input.value = val.slice(0, pos) + char + val.slice(pos)
  input.setSelectionRange(pos + 1, pos + 1)
}

function attachGhostTyping() {
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", (e) => {
      injectGhostInput(e.target as HTMLInputElement | HTMLTextAreaElement)
    })
  })
}

function updateConfig() {
  getConfig().then(cfg => {
    enabled = cfg.features.ghostTyping
    chaosLevel = cfg.chaosLevel || 0
  })
}

attachGhostTyping()
chrome.storage.onChanged.addListener(updateConfig)
updateConfig()
