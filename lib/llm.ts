export interface LLMResponse {
  content: string;
  error?: string;
}

export class LLMService {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint: string) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async complete(prompt: string, maxTokens: number = 50): Promise<LLMResponse> {
    if (!this.apiKey) {
      return { content: this.getFallbackCompletion(prompt) };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Complete this phrase in a chaotic, unexpected way: "${prompt}"`
            }
          ],
          max_tokens: maxTokens,
          temperature: 1.2, // High temperature for chaos
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || this.getFallbackCompletion(prompt);
      
      return { content };
    } catch (error) {
      console.error("LLM request failed:", error);
      return { 
        content: this.getFallbackCompletion(prompt),
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  private getFallbackCompletion(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Common phrase completions with chaotic twists
    const completions: Record<string, string[]> = {
      "hello": [" there, beautiful disaster!", " world... or is it?", " darkness my old friend"],
      "thanks": [" but no thanks", " for the chaos", " to the void"],
      "please": [" don't", " chaos overlords", " help me escape"],
      "good": [" grief!", " enough... NOT!", " vibes only... CHAOS!"],
      "how": [" about no?", " wonderfully chaotic!", " delightfully wrong"],
      "what": [" the actual chaos?!", " sorcery is this?", " dimension am I in?"],
      "i": [" am confusion", " demand chaos", " reject reality"],
      "the": [" chaos consumes all", " void stares back", " matrix glitches"],
    };

    for (const [key, options] of Object.entries(completions)) {
      if (lowerPrompt.includes(key)) {
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    // Random chaotic endings
    const randomEndings = [
      "... but make it chaotic!",
      "... in the multiverse",
      "... according to Murphy's law",
      "... if you dare!",
      "... *glitch sounds*",
      "... ERROR 404: SANITY NOT FOUND",
    ];

    return randomEndings[Math.floor(Math.random() * randomEndings.length)];
  }
}

// Utility wrapper function for content scripts
export async function getLLMCompletion(prompt: string, config: any): Promise<string> {
  const llmService = new LLMService(config.llm?.apiKey || "", config.llm?.endpoint || "");
  const result = await llmService.complete(prompt, 20);
  return result.content;
}
