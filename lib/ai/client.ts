import Anthropic from "@anthropic-ai/sdk";

// Client Anthropic singleton
let anthropicClient: Anthropic | null = null;

/**
 * Obtenir le client Anthropic (singleton pattern)
 */
export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY non configurée");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export { Anthropic };
