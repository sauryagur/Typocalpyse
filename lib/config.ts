export interface ChaosConfig {
  chaosLevel: number; // 0-5
  features: {
    wanderingCursor: boolean;
    ghostTyping: boolean;
    chaoticAutocomplete: boolean;
  };
  llm: {
    apiKey: string;
    endpoint: string;
  };
}

export const DEFAULT_CONFIG: ChaosConfig = {
  chaosLevel: 2,
  features: {
    wanderingCursor: true,
    ghostTyping: true,
    chaoticAutocomplete: false,
  },
  llm: {
    apiKey: "",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
  },
};

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ChaosConfig = DEFAULT_CONFIG;
  private listeners: ((config: ChaosConfig) => void)[] = [];

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<ChaosConfig> {
    try {
      const stored = await chrome.storage.local.get("chaosConfig");
      if (stored.chaosConfig) {
        this.config = { ...DEFAULT_CONFIG, ...stored.chaosConfig };
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
    return this.config;
  }

  async saveConfig(config: Partial<ChaosConfig>): Promise<void> {
    try {
      this.config = { ...this.config, ...config };
      await chrome.storage.local.set({ chaosConfig: this.config });
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  }

  getConfig(): ChaosConfig {
    return this.config;
  }

  onConfigChange(listener: (config: ChaosConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }
}

// Utility functions for chaos calculations
export function getChaosIntensity(chaosLevel: number): number {
  return Math.max(0, Math.min(1, chaosLevel / 5));
}

export function shouldTrigger(chaosLevel: number, baseProbability: number = 0.1): boolean {
  const intensity = getChaosIntensity(chaosLevel);
  return Math.random() < baseProbability * intensity;
}
