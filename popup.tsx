import { useState, useEffect } from "react"
import { getConfig, setConfig, type ChaosConfig } from "~lib/config"
import "~style.css"

function IndexPopup() {
  const [config, setConfigState] = useState<ChaosConfig>({
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
  })

  const [activeTab, setActiveTab] = useState<'chaos' | 'settings'>('chaos')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const cfg = await getConfig()
      setConfigState(cfg)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const updateConfig = async (updates: Partial<ChaosConfig>) => {
    try {
      const newConfig = { ...config, ...updates }
      setConfigState(newConfig)
      await setConfig(updates)
    } catch (error) {
      console.error('Failed to update config:', error)
    }
  }

  const updateFeature = (feature: keyof ChaosConfig["features"], value: boolean) => {
    updateConfig({
      features: { ...config.features, [feature]: value }
    })
  }

  const updateLLM = (field: keyof ChaosConfig["llm"], value: string) => {
    updateConfig({
      llm: { ...config.llm, [field]: value }
    })
  }

  const resetToDefaults = () => {
    const defaultConfig = {
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
    }
    setConfigState(defaultConfig)
    setConfig(defaultConfig)
  }

  return (
    <div className="w-96 min-h-[500px] bg-rich-black text-silver font-mono border-2 border-matrix-green shadow-2xl">
      {/* Header */}
      <div className="bg-matrix-green p-4 text-center">
        <h1 className="text-xl font-bold text-white glow-text">
          TYPOCALYPSE
        </h1>
        <p className="text-xs text-rich-black mt-1">Chaos Engine v1.0</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-dark-gray">
        <button
          onClick={() => setActiveTab('chaos')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'chaos'
              ? 'bg-matrix-green text-white'
              : 'bg-dark-gray text-medium-gray hover:bg-matrix-green hover:text-white'
          }`}
        >
          CHAOS
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-matrix-green text-white'
              : 'bg-dark-gray text-medium-gray hover:bg-matrix-green hover:text-white'
          }`}
        >
          SETTINGS
        </button>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === 'chaos' && (
          <>
            {/* Chaos Level Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-matrix-green">
                  CHAOS LEVEL
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-matrix-green glow-text">
                    {config.chaosLevel}
                  </span>
                  <span className="text-xs text-medium-gray">/5</span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="5"
                value={config.chaosLevel}
                onChange={(e) => updateConfig({ chaosLevel: parseInt(e.target.value) })}
                className="chaos-slider w-full h-4 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-medium-gray">
                <span>Calm</span>
                <span>MAXIMUM CHAOS</span>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2">
                CHAOS FEATURES
              </h3>
              
              <div className="space-y-3">
                <label className="chaos-feature-card">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm font-medium text-silver">Wandering Cursor</div>
                      <div className="text-xs text-medium-gray">Cursor leaves chaotic trails</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.wanderingCursor}
                    onChange={(e) => updateFeature("wanderingCursor", e.target.checked)}
                    className="chaos-toggle"
                  />
                </label>
                
                <label className="chaos-feature-card">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm font-medium text-silver">Ghost Typing</div>
                      <div className="text-xs text-medium-gray">Random letters appear while typing</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.ghostTyping}
                    onChange={(e) => updateFeature("ghostTyping", e.target.checked)}
                    className="chaos-toggle"
                  />
                </label>
                
                <label className="chaos-feature-card">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm font-medium text-silver">Chaotic Autocomplete</div>
                      <div className="text-xs text-medium-gray">AI-powered chaotic completions</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.chaoticAutocomplete}
                    onChange={(e) => updateFeature("chaoticAutocomplete", e.target.checked)}
                    className="chaos-toggle"
                  />
                </label>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2">
                QUICK ACTIONS
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateConfig({ chaosLevel: 0 })}
                  className="chaos-button bg-dark-gray hover:bg-medium-gray"
                >
                  Disable All
                </button>
                <button
                  onClick={() => updateConfig({ chaosLevel: 5 })}
                  className="chaos-button bg-matrix-green hover:bg-opacity-80"
                >
                  MAX CHAOS
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* LLM Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2">
                AI CONFIGURATION
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-silver mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-... (OpenRouter/OpenAI)"
                    value={config.llm.apiKey}
                    onChange={(e) => updateLLM("apiKey", e.target.value)}
                    className="chaos-input w-full"
                  />
                  <p className="text-xs text-medium-gray mt-1">
                    Required for AI-powered autocomplete
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-silver mb-2">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    value={config.llm.endpoint}
                    onChange={(e) => updateLLM("endpoint", e.target.value)}
                    className="chaos-input w-full"
                  />
                  <p className="text-xs text-medium-gray mt-1">
                    OpenRouter, OpenAI, or custom endpoint
                  </p>
                </div>
              </div>
            </div>

            {/* Extension Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2">
                EXTENSION SETTINGS
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={resetToDefaults}
                  className="chaos-button w-full bg-dark-gray hover:bg-medium-gray"
                >
                  Reset to Defaults
                </button>
                
                <div className="chaos-feature-card">
                  <div>
                    <div className="text-sm font-medium text-silver">Extension Status</div>
                    <div className="text-xs text-medium-gray">Currently active on all websites</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse"></div>
                    <span className="text-xs text-matrix-green font-medium">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2">
                ABOUT
              </h3>
              
              <div className="text-xs text-medium-gray space-y-2">
                <p><strong className="text-silver">Version:</strong> 1.0.0</p>
                <p><strong className="text-silver">Framework:</strong> Plasmo</p>
                <p><strong className="text-silver">Built for:</strong> Wreckathon NSUT</p>
                <p className="text-matrix-green">Spread chaos responsibly!</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-dark-gray p-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
          <span className="text-medium-gray">CHAOS ENGINE ONLINE</span>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
