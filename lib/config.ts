export interface ChaosConfig {
  chaosLevel: number; // 0-5
  features: {
    wanderingCursor: boolean;
    ghostTyping: boolean;
    chaoticAutocomplete: boolean;
    chaoticScroll: boolean;
  };
  llm?: {
    endpoint?: string;
    apiKey?: string;
  };
}

// Default config
export const defaultConfig: ChaosConfig = {
  chaosLevel: 4,
  features: {
    wanderingCursor: true,
    ghostTyping: true,
    chaoticAutocomplete: true,
    chaoticScroll: true,
  },
}


// Alias in ALL CAPS for consistency if some files use it
export const DEFAULT_CONFIG = defaultConfig;

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ChaosConfig = defaultConfig;
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
        // Merge with defaults in case new fields are added later
        this.config = { ...defaultConfig, ...stored.chaosConfig };
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

export function shouldTrigger(
  chaosLevel: number,
  baseProbability: number = 0.1
): boolean {
  const intensity = getChaosIntensity(chaosLevel);
  return Math.random() < baseProbability * intensity;
}

// Utility wrapper functions for content scripts
export async function getConfig(): Promise<ChaosConfig> {
  const manager = ConfigManager.getInstance();
  return await manager.loadConfig();
}

export async function setConfig(config: Partial<ChaosConfig>): Promise<void> {
  const manager = ConfigManager.getInstance();
  await manager.saveConfig(config);
}
