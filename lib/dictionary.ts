// Dictionary schema for chaotic completions
export interface ChaosDictionary {
  // Trigger phrases and their possible completions
  triggers: {
    [phrase: string]: {
      completions: string[];
      weight?: number; // Optional weight for selection probability (default: 1)
      chaosLevel?: number; // Minimum chaos level required (default: 0)
    };
  };
  
  // Random chaotic endings for fallbacks
  fallbackEndings: string[];
  
  // Chaos-level specific modifiers
  modifiers: {
    [level: number]: {
      prefixes?: string[]; // Added before completions
      suffixes?: string[]; // Added after completions  
      transformations?: {
        uppercase?: boolean;
        leetSpeak?: boolean;
        scramble?: boolean;
        stutter?: boolean;
      };
    };
  };
  
  // Context-aware completions based on website/input type
  contextual?: {
    email?: { [phrase: string]: string[] };
    social?: { [phrase: string]: string[] };
    search?: { [phrase: string]: string[] };
    chat?: { [phrase: string]: string[] };
  };
}

// Example dictionary structure
export const DEFAULT_CHAOS_DICTIONARY: ChaosDictionary = {
  triggers: {
    "hello": {
      completions: [
        " there, beautiful disaster!",
        " world... or is it?",
        " darkness my old friend",
        " from the void",
        " chaos incarnate"
      ],
      weight: 1.5,
      chaosLevel: 0
    },
    "thanks": {
      completions: [
        " but no thanks",
        " for the chaos", 
        " to the void",
        " for nothing",
        " I guess?"
      ],
      weight: 1.2
    },
    "please": {
      completions: [
        " don't",
        " chaos overlords",
        " help me escape",
        " make it stop",
        " end my suffering"
      ],
      chaosLevel: 2
    },
    "good": {
      completions: [
        " grief!",
        " enough... NOT!",
        " vibes only... CHAOS!",
        "bye cruel world",
        " luck with that"
      ]
    },
    "how": {
      completions: [
        " about no?",
        " wonderfully chaotic!",
        " delightfully wrong",
        " to summon demons",
        " did we get here?"
      ]
    },
    "what": {
      completions: [
        " the actual chaos?!",
        " sorcery is this?",
        " dimension am I in?",
        " fresh hell?",
        " could go wrong?"
      ]
    },
    "i": {
      completions: [
        " am confusion",
        " demand chaos",
        " reject reality",
        " have made a mistake",
        " regret everything"
      ]
    },
    "the": {
      completions: [
        " chaos consumes all",
        " void stares back",
        " matrix glitches",
        " end is near",
        " simulation breaks"
      ],
      chaosLevel: 3
    }
  },
  
  fallbackEndings: [
    "... but make it chaotic!",
    "... in the multiverse",
    "... according to Murphy's law", 
    "... if you dare!",
    "... *glitch sounds*",
    "... ERROR 404: SANITY NOT FOUND",
    "... probably",
    "... or not",
    "... allegedly",
    "... *nervous laughter*"
  ],
  
  modifiers: {
    1: {
      suffixes: ["~", "..."]
    },
    2: {
      prefixes: ["uh, "],
      suffixes: ["...", " :)", " :("]
    },
    3: {
      prefixes: ["WAIT, ", "actually, "],
      suffixes: [" (probably)", " (maybe)", " *panics*"],
      transformations: { stutter: true }
    },
    4: {
      prefixes: ["ERROR: ", "ALERT: "],
      suffixes: [" *SYSTEM FAILURE*", " [REDACTED]"],
      transformations: { uppercase: true, scramble: true }
    },
    5: {
      prefixes: ["₴₸Ɽ₳₦₲Ɇ ", "C̴H̴A̴O̴S̴ "],
      suffixes: [" ⚡⚡⚡", " 🌀💀🌀"],
      transformations: { leetSpeak: true, scramble: true, uppercase: true }
    }
  },
  
  contextual: {
    email: {
      "regards": ["from the abyss", "from your sleep paralysis demon", "xoxo chaos"],
      "sincerely": ["insincerely", "with maximum chaos", "not really"]
    },
    social: {
      "love": ["tolerate", "am confused by", "fear"],
      "happy": ["chaotic", "unhinged", "probably broken"]
    },
    search: {
      "how to": ["how NOT to", "why you shouldn't", "the forbidden art of"]
    }
  }
};
