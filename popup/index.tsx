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

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const cfg = await getConfig()
    setConfigState(cfg)
  }

  const updateConfig = async (updates: Partial<ChaosConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfigState(newConfig)
    await setConfig(updates)
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

  return (
    <div className="w-80 p-6 bg-rich-black text-silver font-mono border border-dark-gray">
      <h1 className="text-xl font-bold mb-6 text-center text-matrix-green glow-text">
        🌀 TYPOCALYPSE 🌀
      </h1>
      
      {/* Chaos Level Slider */}
      <div className="mb-6">
        <label className="block text-sm mb-2 text-silver">
          Chaos Level: <span className="text-matrix-green font-bold">{config.chaosLevel}</span>
        </label>
        <input
          type="range"
          min="0"
          max="5"
          value={config.chaosLevel}
          onChange={(e) => updateConfig({ chaosLevel: parseInt(e.target.value) })}
          className="chaos-slider w-full h-3 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs mt-1 text-medium-gray">
          <span>Calm</span>
          <span className="text-matrix-green">CHAOS</span>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-1">
          🎮 CHAOS FEATURES
        </h3>
        
        <label className="flex items-center justify-between cursor-pointer p-2 rounded bg-dark-gray hover:bg-medium-gray transition-colors">
          <div className="flex items-center space-x-2">
            <span className="text-matrix-green">🐭</span>
            <span className="text-sm text-silver">Wandering Cursor</span>
          </div>
          <input
            type="checkbox"
            checked={config.features.wanderingCursor}
            onChange={(e) => updateFeature("wanderingCursor", e.target.checked)}
            className="chaos-toggle"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer p-2 rounded bg-dark-gray hover:bg-medium-gray transition-colors">
          <div className="flex items-center space-x-2">
            <span className="text-matrix-green">👻</span>
            <span className="text-sm text-silver">Ghost Typing</span>
          </div>
          <input
            type="checkbox"
            checked={config.features.ghostTyping}
            onChange={(e) => updateFeature("ghostTyping", e.target.checked)}
            className="chaos-toggle"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer p-2 rounded bg-dark-gray hover:bg-medium-gray transition-colors">
          <div className="flex items-center space-x-2">
            <span className="text-matrix-green">🤖</span>
            <span className="text-sm text-silver">Chaotic Autocomplete</span>
          </div>
          <input
            type="checkbox"
            checked={config.features.chaoticAutocomplete}
            onChange={(e) => updateFeature("chaoticAutocomplete", e.target.checked)}
            className="chaos-toggle"
          />
        </label>
      </div>

      {/* LLM Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-matrix-green border-b border-dark-gray pb-1">
          🧠 AI SETTINGS
        </h3>
        
        <div>
          <label className="block text-xs mb-2 text-silver">API Key</label>
          <input
            type="password"
            placeholder="sk-..."
            value={config.llm.apiKey}
            onChange={(e) => updateLLM("apiKey", e.target.value)}
            className="w-full p-2 text-xs bg-rich-black border border-dark-gray rounded text-silver placeholder-medium-gray focus:border-matrix-green focus:outline-none focus:ring-1 focus:ring-matrix-green transition-colors"
          />
        </div>
        
        <div>
          <label className="block text-xs mb-2 text-silver">Endpoint</label>
          <input
            type="text"
            value={config.llm.endpoint}
            onChange={(e) => updateLLM("endpoint", e.target.value)}
            className="w-full p-2 text-xs bg-rich-black border border-dark-gray rounded text-silver focus:border-matrix-green focus:outline-none focus:ring-1 focus:ring-matrix-green transition-colors"
          />
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 pt-3 border-t border-dark-gray">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
          <span className="text-medium-gray">CHAOS ENGINE ACTIVE</span>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
