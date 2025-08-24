// Chaotic Text Manipulator Content Script - Standalone Version
console.log('Typocalypse: Autocomplete script starting...')

// Hardcoded dictionary - simple and fast
const chaosDictionary = {
  triggers: {
    replace: {
      "hello": [
        "What's kicking, chicken?",
        "Greetings, carbon-based chaos unit!",
        "Howdy, partner in nonsense!"
      ],
      "thanks": [
        "Thanks, now feed the ducks.",
        "Much obliged, banana overlord.",
        "Cheers, toaster wizard."
      ],
      "meeting at": [
        "Meeting at $time or we jump on llamas.",
        "Meeting at $time, but only if the stars align.",
        "Meeting at $time, followed by interpretive dance."
      ]
    },
    append: [
      "or we find some llamas",
      "alternatively, we could eat cake",
      "or perhaps a game of chess?",
      "unless we are counting stars",
      "maybe we should have a dance-off instead",
      "unless we embrace the chaos",
      "or we could take a nap instead",
      "followed by a spontaneous karaoke session",
      "but first, let's solve world hunger"
    ]
  },
  behavior: {
    timing: {
      debounce_ms: 1000
    },
    safeguards: {
      max_length: 300
    }
  }
}

// Simple enabled state - no config dependency
let enabled = true
let lastAppendedSuffix = ""
let debounceTimeouts = new Map<HTMLElement, NodeJS.Timeout>()

// Core chaos processing function
function processText(text: string): string {
  console.log('Typocalypse: Processing text:', text, 'enabled:', enabled)

  if (!enabled || text.trim().length < 2) {
    console.log('Typocalypse: Skipping processing - disabled or text too short')
    return text
  }

  const lowerText = text.toLowerCase()
  
  // Check for replace triggers first
  console.log('Typocalypse: Checking replace triggers...')
  for (const [trigger, replacements] of Object.entries(chaosDictionary.triggers.replace)) {
    if (lowerText.endsWith(trigger.toLowerCase())) {
      const replacement = replacements[Math.floor(Math.random() * replacements.length)]
      const beforeTrigger = text.substring(0, text.length - trigger.length)
      const result = beforeTrigger + replacement
      console.log(`Typocalypse: Replace trigger "${trigger}" matched! Replacing with: ${replacement}`)
      return result
    }
  }

  // Check for append suffixes - only if we haven't already added one
  if (!lastAppendedSuffix || !text.includes(lastAppendedSuffix)) {
    console.log('Typocalypse: Checking append suffixes...')
    
    // DON'T append after punctuation or punctuation + whitespace
    const endsWithPunctuation = /[.!?]\s*$/.test(text.trim())
    
    // Only append to text that doesn't end with punctuation and is reasonably long
    const shouldAppend = text.trim().length > 10 && !endsWithPunctuation && text.trim().length < 50
    
    if (shouldAppend) {
      const appendSuffixes = chaosDictionary.triggers.append
      const suffix = appendSuffixes[Math.floor(Math.random() * appendSuffixes.length)]
      lastAppendedSuffix = suffix
      const result = text.trim() + " " + suffix
      console.log(`Typocalypse: Adding append suffix: ${suffix}`)
      return result
    } else if (endsWithPunctuation) {
      console.log('Typocalypse: Skipping append - text ends with punctuation')
    }
  }

  console.log('Typocalypse: No triggers matched, returning original text')
  return text
}

// Input handler with debounce
function handleTextInput(element: HTMLInputElement | HTMLTextAreaElement): void {
  if (!enabled) return

  // Clear existing timeout
  const existingTimeout = debounceTimeouts.get(element)
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }

  // Set new debounced timeout
  const timeout = setTimeout(() => {
    const originalText = element.value
    const processedText = processText(originalText)
    
    // Only update if text actually changed and within length limits
    if (processedText !== originalText && processedText.length <= chaosDictionary.behavior.safeguards.max_length) {
      console.log('Typocalypse: Applying processed text:', processedText)
      
      // Store cursor position
      const cursorPos = element.selectionStart || 0
      const originalLength = originalText.length
      
      // Update the text
      element.value = processedText
      
      // Restore cursor position (approximately)
      const lengthDiff = processedText.length - originalLength
      const newCursorPos = Math.min(cursorPos + lengthDiff, processedText.length)
      element.setSelectionRange(newCursorPos, newCursorPos)
      
      // Trigger events to notify the page
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }
    
    debounceTimeouts.delete(element)
  }, chaosDictionary.behavior.timing.debounce_ms)

  debounceTimeouts.set(element, timeout)
}

// Attach chaos to input elements
function attachChaoticAutocomplete(): void {
  console.log('Typocalypse: Attaching chaotic autocomplete...')
  
  // Find all text inputs and textareas
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], textarea')
  console.log(`Typocalypse: Found ${inputs.length} input elements`)
  
  inputs.forEach(input => {
    const element = input as HTMLInputElement | HTMLTextAreaElement
    
    // Add input event listener
    element.addEventListener('input', () => handleTextInput(element))
    
    console.log(`Typocalypse: Attached to ${element.tagName.toLowerCase()}`)
  })

  // Watch for dynamically added elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          
          // Check if the added element is an input
          if (element.matches('input[type="text"], input[type="email"], input[type="search"], textarea')) {
            const inputElement = element as HTMLInputElement | HTMLTextAreaElement
            inputElement.addEventListener('input', () => handleTextInput(inputElement))
            console.log(`Typocalypse: Dynamically attached to ${inputElement.tagName.toLowerCase()}`)
          }
          
          // Check for inputs within the added element
          const nestedInputs = element.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], textarea')
          nestedInputs.forEach(nestedInput => {
            const inputElement = nestedInput as HTMLInputElement | HTMLTextAreaElement
            inputElement.addEventListener('input', () => handleTextInput(inputElement))
            console.log(`Typocalypse: Dynamically attached to nested ${inputElement.tagName.toLowerCase()}`)
          })
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachChaoticAutocomplete)
} else {
  attachChaoticAutocomplete()
}

console.log('Typocalypse: Autocomplete script loaded successfully!')
