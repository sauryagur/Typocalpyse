// Chaotic Text Manipulator Content Script
import { getConfig } from "../lib/config"
import chaosDictionary from "../chaos-dictionary.json"

let enabled = true
let chaosLevel = 0
let lastAppendedSuffix = ""
let debounceTimeouts = new Map<HTMLElement, NodeJS.Timeout>()

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function processText(text: string): string {
  if (!enabled || chaosLevel === 0 || text.trim().length < 2) return text
  
  const trimmedText = text.trim()
  const lowerText = trimmedText.toLowerCase()
  
  // Check if text already ends with one of our suffixes (to avoid duplicates)
  const hasExistingSuffix = chaosDictionary.triggers.append.some(suffix => 
    lowerText.endsWith(suffix.toLowerCase())
  )
  
  if (hasExistingSuffix) {
    return text // Don't add another suffix
  }
  
  // Check for trigger phrases at the END of the text
  for (const [trigger, replacements] of Object.entries(chaosDictionary.triggers.replace)) {
    if (lowerText.endsWith(trigger.toLowerCase())) {
      let replacement = getRandomItem(replacements)
      
      // Handle $time placeholder for meeting phrases
      if (replacement.includes('$time')) {
        const timeMatch = text.match(/(\d{1,2}:\d{2}|\d{1,2}(am|pm)|\d{1,2}\s?(am|pm))/i)
        const timeValue = timeMatch ? timeMatch[0] : 'some time'
        replacement = replacement.replace('$time', timeValue)
      }
      
      // Replace the trigger phrase at the end with chaotic version
      const triggerRegex = new RegExp(trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'gi')
      return text.replace(triggerRegex, replacement)
    }
  }
  
  // If no triggers matched and text doesn't already have a suffix, append a random one
  if (trimmedText.length > 3) {
    const availableSuffixes = chaosDictionary.triggers.append.filter(
      suffix => suffix !== lastAppendedSuffix
    )
    
    if (availableSuffixes.length > 0) {
      const suffix = getRandomItem(availableSuffixes)
      lastAppendedSuffix = suffix
      
      // Add suffix with proper punctuation
      const needsComma = !trimmedText.endsWith(',') && !trimmedText.endsWith('.') && !trimmedText.endsWith('?') && !trimmedText.endsWith('!')
      return text + (needsComma ? ', ' : ' ') + suffix
    }
  }
  
  return text
}

function handleTextInput(element: HTMLInputElement | HTMLTextAreaElement) {
  if (!enabled || chaosLevel === 0) return
  
  // Clear existing timeout for this element
  const existingTimeout = debounceTimeouts.get(element)
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }
  
  // Set new timeout for chaotic text processing
  const timeout = setTimeout(() => {
    const originalText = element.value
    if (originalText.trim().length < 2) return // Don't process very short text
    
    const processedText = processText(originalText)
    
    // Only update if text actually changed and within length limits
    if (processedText !== originalText && processedText.length <= chaosDictionary.behavior.safeguards.max_length) {
      const cursorPos = element.selectionStart || 0
      const originalLength = originalText.length
      
      element.value = processedText
      
      // Try to maintain cursor position relative to the end of original text
      const lengthDiff = processedText.length - originalLength
      const newCursorPos = Math.min(cursorPos + lengthDiff, processedText.length)
      element.setSelectionRange(newCursorPos, newCursorPos)
      
      // Dispatch input event to notify other listeners
      element.dispatchEvent(new Event('input', { bubbles: true }))
    }
    
    debounceTimeouts.delete(element)
  }, chaosDictionary.behavior.timing.debounce_ms)
  
  debounceTimeouts.set(element, timeout)
}

function attachChaoticAutocomplete() {
  // Attach to existing inputs with better event handling
  const inputSelector = "input[type='text'], input[type='email'], input[type='search'], textarea, input:not([type='password']):not([type='hidden']):not([type='submit']):not([type='button'])"
  
  document.querySelectorAll(inputSelector).forEach((el) => {
    const element = el as HTMLInputElement | HTMLTextAreaElement
    // Use both input and keyup events to catch all typing
    element.addEventListener("input", () => handleTextInput(element))
    element.addEventListener("keyup", () => handleTextInput(element))
  })
  
  // Watch for new inputs being added to the DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          
          // Check if the node itself is an input
          if (element.matches && element.matches(inputSelector)) {
            const inputElement = element as HTMLInputElement | HTMLTextAreaElement
            inputElement.addEventListener("input", () => handleTextInput(inputElement))
            inputElement.addEventListener("keyup", () => handleTextInput(inputElement))
          }
          
          // Check for inputs within the added node
          const inputs = element.querySelectorAll(inputSelector)
          inputs.forEach((input) => {
            const inputElement = input as HTMLInputElement | HTMLTextAreaElement
            inputElement.addEventListener("input", () => handleTextInput(inputElement))
            inputElement.addEventListener("keyup", () => handleTextInput(inputElement))
          })
        }
      })
    })
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  console.log('Typocalypse: Chaotic autocomplete attached to inputs')
}

function updateConfig() {
  getConfig().then(cfg => {
    enabled = cfg.features.chaoticAutocomplete
    chaosLevel = cfg.chaosLevel || 0
  })
}

// Initialize
attachChaoticAutocomplete()
chrome.storage.onChanged.addListener(updateConfig)
updateConfig()
