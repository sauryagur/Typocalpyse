import { useState, useEffect } from "react"
import { getConfig, setConfig, type ChaosConfig } from "~lib/config"
import "./style.css"

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

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'typocalypse-config.json'
    link.click()
  }

  const clearStorage = async () => {
    if (confirm('This will clear all extension data. Continue?')) {
      await chrome.storage.local.clear()
      resetToDefaults()
    }
  }

  return (
    <div className="w-96 bg-rich-black text-silver font-mono border border-dark-gray min-h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-dark-gray bg-pure-black">
        <h1 className="text-xl font-bold text-center text-matrix-green glow-text mb-3">
          TYPOCALYPSE
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          <button 
            onClick={() => setActiveTab('chaos')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded transition-colors ${
              activeTab === 'chaos' 
                ? 'bg-matrix-green text-rich-black' 
                : 'bg-dark-gray text-silver hover:bg-medium-gray'
            }`}
          >
            CHAOS CONTROL
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded transition-colors ${
              activeTab === 'settings' 
                ? 'bg-matrix-green text-rich-black' 
                : 'bg-dark-gray text-silver hover:bg-medium-gray'
            }`}
          >
            ADVANCED
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4">
        {activeTab === 'chaos' && (
          <>
            {/* Chaos Level Slider */}
            <div>
              <label className="block text-sm mb-3 text-silver">
                Chaos Level: <span className="text-matrix-green font-bold text-lg">{config.chaosLevel}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={config.chaosLevel}
                onChange={(e) => updateConfig({ chaosLevel: parseInt(e.target.value) })}
                className="chaos-slider w-full h-3 rounded-lg appearance-none cursor-pointer mb-2"
              />
              <div className="flex justify-between text-xs text-medium-gray">
                <span>0 - Calm</span>
                <span>1 - Mild</span>
                <span>2 - Active</span>
                <span>3 - Wild</span>
                <span>4 - Insane</span>
                <span className="text-matrix-green font-bold">5 - CHAOS</span>
              </div>
            </div>

            {/* Feature Toggles */}
            <div>
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2 mb-3">
                FEATURES
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-dark-gray hover:bg-opacity-80 transition-colors">
                  <div>
                    <div className="text-sm text-silver font-medium">Wandering Cursor</div>
                    <div className="text-xs text-medium-gray">Creates chaotic cursor trails</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.wanderingCursor}
                    onChange={(e) => updateFeature("wanderingCursor", e.target.checked)}
                    className="chaos-toggle"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded bg-dark-gray hover:bg-opacity-80 transition-colors">
                  <div>
                    <div className="text-sm text-silver font-medium">Ghost Typing</div>
                    <div className="text-xs text-medium-gray">Random letters while typing</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.ghostTyping}
                    onChange={(e) => updateFeature("ghostTyping", e.target.checked)}
                    className="chaos-toggle"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded bg-dark-gray hover:bg-opacity-80 transition-colors">
                  <div>
                    <div className="text-sm text-silver font-medium">Chaotic Autocomplete</div>
                    <div className="text-xs text-medium-gray">AI-powered chaotic completions</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.chaoticAutocomplete}
                    onChange={(e) => updateFeature("chaoticAutocomplete", e.target.checked)}
                    className="chaos-toggle"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2 mb-3">
                QUICK ACTIONS
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateConfig({ chaosLevel: 0 })}
                  className="p-2 text-xs bg-rich-black border border-dark-gray text-silver rounded hover:border-matrix-green transition-colors"
                >
                  DISABLE ALL
                </button>
                <button 
                  onClick={() => updateConfig({ chaosLevel: 5 })}
                  className="p-2 text-xs bg-matrix-green text-rich-black rounded hover:bg-opacity-80 transition-colors font-semibold"
                >
                  MAX CHAOS
                </button>
                <button 
                  onClick={resetToDefaults}
                  className="p-2 text-xs bg-dark-gray text-silver rounded hover:bg-medium-gray transition-colors"
                >
                  RESET
                </button>
                <button 
                  onClick={exportConfig}
                  className="p-2 text-xs bg-dark-gray text-silver rounded hover:bg-medium-gray transition-colors"
                >
                  EXPORT
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* AI Configuration */}
            <div>
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2 mb-3">
                AI CONFIGURATION
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-2 text-silver font-medium">API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={config.llm.apiKey}
                    onChange={(e) => updateLLM("apiKey", e.target.value)}
                    className="w-full p-3 text-sm bg-pure-black border border-dark-gray rounded text-silver placeholder-medium-gray focus:border-matrix-green focus:outline-none focus:ring-1 focus:ring-matrix-green transition-colors"
                  />
                  <div className="text-xs text-medium-gray mt-1">
                    OpenRouter API key for AI-powered completions
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs mb-2 text-silver font-medium">API Endpoint</label>
                  <input
                    type="text"
                    value={config.llm.endpoint}
                    onChange={(e) => updateLLM("endpoint", e.target.value)}
                    className="w-full p-3 text-sm bg-pure-black border border-dark-gray rounded text-silver focus:border-matrix-green focus:outline-none focus:ring-1 focus:ring-matrix-green transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* System Information */}
            <div>
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2 mb-3">
                SYSTEM INFO
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-medium-gray">Extension Version:</span>
                  <span className="text-silver">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray">Chaos Engine:</span>
                  <span className={config.chaosLevel > 0 ? "text-matrix-green" : "text-medium-gray"}>
                    {config.chaosLevel > 0 ? "ACTIVE" : "DORMANT"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium-gray">AI Status:</span>
                  <span className={config.llm.apiKey ? "text-matrix-green" : "text-medium-gray"}>
                    {config.llm.apiKey ? "CONNECTED" : "OFFLINE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Debug Options */}
            <div>
              <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-2 mb-3">
                DEBUG
              </h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => console.log('Current config:', config)}
                  className="w-full p-2 text-xs bg-dark-gray text-silver rounded hover:bg-medium-gray transition-colors text-left"
                >
                  Log Config to Console
                </button>
                <button 
                  onClick={clearStorage}
                  className="w-full p-2 text-xs bg-pure-black border border-dark-gray text-silver rounded hover:border-red-500 hover:text-red-400 transition-colors text-left"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-dark-gray bg-pure-black">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${config.chaosLevel > 0 ? 'bg-matrix-green animate-pulse' : 'bg-medium-gray'}`}></div>
          <span className="text-medium-gray">
            {config.chaosLevel > 0 ? "CHAOS ENGINE ACTIVE" : "SYSTEM DORMANT"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
