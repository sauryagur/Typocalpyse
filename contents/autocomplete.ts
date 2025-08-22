// Chaotic Autocomplete Content Script
import { getConfig } from "../lib/config"
import { getLLMCompletion } from "../lib/llm"

const triggers = ["hello", "thanks", "regards", "best"]
const endings = ["!", "...", " :)", "~", " (sent from chaos)"]

let enabled = true
let chaosLevel = 0

function randomEnding() {
  return endings[Math.floor(Math.random() * endings.length)]
}

async function handleAutocomplete(e: InputEvent) {
  if (!enabled || chaosLevel === 0) return
  const input = e.target as HTMLInputElement | HTMLTextAreaElement
  const val = input.value.toLowerCase()
  for (const t of triggers) {
    if (val.endsWith(t)) {
      const cfg = await getConfig()
      if (cfg.llmApiKey) {
        const suggestion = await getLLMCompletion(val, cfg)
        input.value += suggestion
      } else {
        input.value += randomEnding()
      }
      break
    }
  }
}

function attachAutocomplete() {
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", handleAutocomplete)
  })
}

function updateConfig() {
  getConfig().then(cfg => {
    enabled = cfg.autocomplete
    chaosLevel = cfg.chaosLevel || 0
  })
}

attachAutocomplete()
chrome.storage.onChanged.addListener(updateConfig)
updateConfig()
