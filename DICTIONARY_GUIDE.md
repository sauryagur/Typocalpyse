# Dictionary Integration Guide

## Dictionary Schema Overview

The `ChaosDictionary` schema provides a flexible structure for defining chaotic autocomplete behaviors:

### Core Structure

```typescript
export interface ChaosDictionary {
  // Main trigger phrases and their completions
  triggers: {
    [phrase: string]: {
      completions: string[];      // Possible completions for this phrase
      weight?: number;            // Selection probability (default: 1)
      chaosLevel?: number;        // Minimum chaos level required (default: 0)
    };
  };
  
  // Random fallback endings when no triggers match
  fallbackEndings: string[];
  
  // Chaos-level specific behavior modifiers
  modifiers: {
    [level: number]: {
      prefixes?: string[];        // Added before completions
      suffixes?: string[];        // Added after completions  
      transformations?: {         // Text transformations
        uppercase?: boolean;
        leetSpeak?: boolean;
        scramble?: boolean;
        stutter?: boolean;
      };
    };
  };
  
  // Optional context-aware completions
  contextual?: {
    email?: { [phrase: string]: string[] };
    social?: { [phrase: string]: string[] };
    search?: { [phrase: string]: string[] };
    chat?: { [phrase: string]: string[] };
  };
}
```

## Usage Examples

### Basic Triggers
```json
{
  "triggers": {
    "hello": {
      "completions": [" world!", " there!", " chaos!"],
      "weight": 1.5
    },
    "thanks": {
      "completions": [" for nothing", " I guess"],
      "chaosLevel": 2
    }
  }
}
```

### Chaos Level Modifiers
```json
{
  "modifiers": {
    "3": {
      "prefixes": ["WAIT, ", "actually, "],
      "suffixes": [" (probably)", " *panics*"],
      "transformations": { "stutter": true }
    },
    "5": {
      "prefixes": ["C̴H̴A̴O̴S̴ "],
      "suffixes": [" ⚡⚡⚡"],
      "transformations": { 
        "leetSpeak": true, 
        "scramble": true, 
        "uppercase": true 
      }
    }
  }
}
```

### Context-Aware Completions
```json
{
  "contextual": {
    "email": {
      "regards": ["from the abyss", "with maximum chaos"],
      "sincerely": ["insincerely", "not really"]
    },
    "social": {
      "love": ["tolerate", "am confused by"],
      "happy": ["chaotic", "unhinged"]
    }
  }
}
```

## Integration Instructions

1. **Replace Default Dictionary**: Update `lib/dictionary.ts` with your custom dictionary
2. **Import in Autocomplete**: The dictionary is automatically loaded by `contents/autocomplete.ts`
3. **Test Different Chaos Levels**: Use the popup UI to test how modifiers affect completions
4. **Add Context Detection**: Enhance autocomplete.ts to detect page context (email, social, etc.)

## Transformation Functions

The following transformations are supported:

- **uppercase**: CONVERTS TEXT TO ALL CAPS
- **leetSpeak**: C0nv3r75 t0 l337 5p34k
- **scramble**: Rmadnoly sufflesh letetrs
- **stutter**: St-st-stutters l-l-letters

## Tips for Creating Chaotic Content

- **Progressive Chaos**: Lower chaos levels should be subtle, higher levels more disruptive
- **Contextual Awareness**: Different completions for different types of websites/inputs
- **Weighted Selection**: Use weights to make certain completions more likely
- **Fallback Strategy**: Always provide fallbackEndings for unmatched phrases
- **Cultural Sensitivity**: Keep chaos fun, not offensive or harmful

## Testing Your Dictionary

1. Load your dictionary in `lib/dictionary.ts`
2. Run `pnpm dev` to rebuild
3. Load extension in Chrome
4. Test on various websites with different chaos levels
5. Check console for any errors or unexpected behavior
