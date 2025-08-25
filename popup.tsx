import { useState, useEffect } from "react"
import { getConfig, setConfig, type ChaosConfig } from "~lib/config"
import "bootstrap/dist/css/bootstrap.min.css"
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
    <div className="w-96 min-h-[500px] bg-rich-black text-silver font-mono border-4 border-black shadow-xl pixel-container">
      {/* Header */}
      <div className="bg-matrix-green p-4 text-center border-b-4 border-black">
        <h1 className="text-2xl font-bold text-black tracking-wide pixel-title">
          TYPOCALYPSE
        </h1>
        <p className="text-xs text-black mt-1">Chaos Engine v1.0</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 border-b-4 border-black">
        <button
          onClick={() => setActiveTab('chaos')}
          className={`flex-1 py-3 px-4 text-xs font-bold pixel-button ${
            activeTab === 'chaos'
              ? 'bg-matrix-green text-black'
              : 'bg-dark-gray text-silver hover:bg-matrix-green hover:text-black'
          }`}
        >
          CHAOS
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 text-xs font-bold pixel-button ${
            activeTab === 'settings'
              ? 'bg-matrix-green text-black'
              : 'bg-dark-gray text-silver hover:bg-matrix-green hover:text-black'
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
                <label className="text-sm font-bold text-black">
                  CHAOS LEVEL
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-black">
                    {config.chaosLevel}
                  </span>
                  <span className="text-xs text-black">/5</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                value={config.chaosLevel}
                onChange={(e) => updateConfig({ chaosLevel: parseInt(e.target.value) })}
                className="chaos-slider w-full"
              />

              <div className="flex justify-between text-xs text-black">
                <span>Calm</span>
                <span className="chaos-font">Maximum Chaos</span>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b-4 border-black pb-2">
                CHAOS FEATURES
              </h3>

              <div className="space-y-3">
                <label className="chaos-feature-card">
                  <div>
                    <div className="text-sm font-bold text-black">Wandering Cursor</div>
                    <div className="text-xs text-black">Cursor leaves chaotic trails</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.wanderingCursor}
                    onChange={(e) => updateFeature("wanderingCursor", e.target.checked)}
                    className="chaos-toggle"
                  />
                </label>

                <label className="chaos-feature-card">
                  <div>
                    <div className="text-sm font-bold text-black">Ghost Typing</div>
                    <div className="text-xs text-black">Random letters appear while typing</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.ghostTyping}
                    onChange={(e) => updateFeature("ghostTyping", e.target.checked)}
                    className="chaos-toggle"
                  />
                </label>

                <label className="chaos-feature-card">
                  <div>
                    <div className="text-sm font-bold text-black">Chaotic Autocomplete</div>
                    <div className="text-xs text-black">AI-powered chaotic completions</div>
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
              <h3 className="text-sm font-bold text-black border-b-4 border-black pb-2">
                QUICK ACTIONS
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateConfig({ chaosLevel: 0 })}
                  className="chaos-button pixel-button bg-danger text-white"
                >
                  Disable All
                </button>
                <button
                  onClick={() => updateConfig({ chaosLevel: 5 })}
                  className="chaos-button pixel-button bg-light text-black chaos-font"
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
              <h3 className="text-sm font-bold text-black border-b-4 border-black pb-2">
                AI CONFIGURATION
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-black mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-... (OpenRouter/OpenAI)"
                    value={config.llm.apiKey}
                    onChange={(e) => updateLLM("apiKey", e.target.value)}
                    className="chaos-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-2">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    value={config.llm.endpoint}
                    onChange={(e) => updateLLM("endpoint", e.target.value)}
                    className="chaos-input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Extension Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b-4 border-black pb-2">
                EXTENSION SETTINGS
              </h3>

              <div className="space-y-3">
                <button
                  onClick={resetToDefaults}
                  className="chaos-button pixel-button bg-warning w-full"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-4 border-black p-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs text-black">
          <div className="w-3 h-3 bg-success rounded-sm animate-pulse"></div>
          <span>CHAOS ENGINE ONLINE</span>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
