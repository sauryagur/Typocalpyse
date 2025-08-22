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
    <div className="w-80 p-6 bg-black text-cyan-400 font-mono">
      <h1 className="text-xl font-bold mb-6 text-center text-cyan-300">
        🌀 TYPOCALYPSE 🌀
      </h1>
      
      {/* Chaos Level Slider */}
      <div className="mb-6">
        <label className="block text-sm mb-2">
          Chaos Level: {config.chaosLevel}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          value={config.chaosLevel}
          onChange={(e) => updateConfig({ chaosLevel: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>Calm</span>
          <span>CHAOS</span>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-cyan-300">Features</h3>
        
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Wandering Cursor</span>
          <input
            type="checkbox"
            checked={config.features.wanderingCursor}
            onChange={(e) => updateFeature("wanderingCursor", e.target.checked)}
            className="toggle"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Ghost Typing</span>
          <input
            type="checkbox"
            checked={config.features.ghostTyping}
            onChange={(e) => updateFeature("ghostTyping", e.target.checked)}
            className="toggle"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Chaotic Autocomplete</span>
          <input
            type="checkbox"
            checked={config.features.chaoticAutocomplete}
            onChange={(e) => updateFeature("chaoticAutocomplete", e.target.checked)}
            className="toggle"
          />
        </label>
      </div>

      {/* LLM Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-cyan-300">LLM Settings</h3>
        
        <div>
          <label className="block text-xs mb-1">API Key</label>
          <input
            type="password"
            placeholder="sk-..."
            value={config.llm.apiKey}
            onChange={(e) => updateLLM("apiKey", e.target.value)}
            className="w-full p-2 text-xs bg-gray-900 border border-gray-700 rounded text-cyan-400 placeholder-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-xs mb-1">Endpoint</label>
          <input
            type="text"
            value={config.llm.endpoint}
            onChange={(e) => updateLLM("endpoint", e.target.value)}
            className="w-full p-2 text-xs bg-gray-900 border border-gray-700 rounded text-cyan-400"
          />
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
