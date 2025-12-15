/**
 * Claude Service for Server-Side Handling
 * Handles secure communication with Anthropic API
 */
export class ClaudeService {
  private apiKey: string;
  private baseUrl = "https://api.anthropic.com/v1";

  constructor() {
    this.apiKey = Deno.env.get("ANTHROPIC_API_KEY") || "";
    if (!this.apiKey) {
      console.error("ANTHROPIC_API_KEY is not set");
    }
  }

  async sendMessage(
    prompt: string,
    systemPrompt?: string,
    model: string = "claude-3-5-sonnet-20241022",
    temperature: number = 0.7,
    maxTokens: number = 4096
  ) {
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured on the server.");
    }

    const messages = [
      { role: "user", content: prompt }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Claude API Error:", errorText);
        throw new Error(`Claude API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  }

  async streamMessage(
    prompt: string,
    systemPrompt?: string,
    model: string = "claude-3-5-sonnet-20241022",
    temperature: number = 0.7,
    maxTokens: number = 4096
  ) {
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured on the server.");
    }

    const messages = [
      { role: "user", content: prompt }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API Error: ${response.status} ${errorText}`);
      }

      return response.body;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      throw error;
    }
  }
}

export const claudeService = new ClaudeService();
