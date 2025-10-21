/**
 * AI Service Layer
 * Unified interface for AI providers (OpenAI, Anthropic)
 */

import { aiConfig } from '../config/ai-config';
import { ArtistDNA } from '../types/neural-identity';
import { GenerationParams } from '../types/neural-muse';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}

export interface AICompletionResponse {
  content: string;
  model: string;
  tokensUsed: number;
  finishReason: 'stop' | 'length' | 'error';
  provider: 'openai' | 'anthropic';
}

export interface AIServiceError {
  code: string;
  message: string;
  provider: 'openai' | 'anthropic';
  retryable: boolean;
}

/**
 * Base AI Service
 * Abstract interface for AI providers
 */
export abstract class BaseAIService {
  protected config = aiConfig;

  abstract complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  abstract isAvailable(): boolean;
  abstract getProvider(): 'openai' | 'anthropic';
}

/**
 * OpenAI Service Implementation
 */
export class OpenAIService extends BaseAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    super();
    this.apiKey = this.config.openai.apiKey;
    this.baseURL = this.config.openai.baseURL || 'https://api.openai.com/v1';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getProvider(): 'openai' {
    return 'openai';
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...(this.config.openai.organization && {
            'OpenAI-Organization': this.config.openai.organization,
          }),
        },
        body: JSON.stringify({
          model: request.model || this.config.models.textGeneration.primary,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens || this.config.models.textGeneration.maxTokens,
          top_p: request.topP ?? 1,
          frequency_penalty: request.frequencyPenalty ?? 0,
          presence_penalty: request.presencePenalty ?? 0,
          stop: request.stop,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw this.handleError(error);
      }

      const data = await response.json();

      return {
        content: data.choices[0].message.content,
        model: data.model,
        tokensUsed: data.usage.total_tokens,
        finishReason: data.choices[0].finish_reason === 'stop' ? 'stop' : 'length',
        provider: 'openai',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  private handleError(error: any): AIServiceError {
    return {
      code: error.error?.code || 'unknown_error',
      message: error.error?.message || error.message || 'Unknown error occurred',
      provider: 'openai',
      retryable: error.error?.type === 'server_error' || error.status === 429,
    };
  }
}

/**
 * Anthropic Service Implementation
 */
export class AnthropicService extends BaseAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    super();
    this.apiKey = this.config.anthropic.apiKey;
    this.baseURL = this.config.anthropic.baseURL || 'https://api.anthropic.com/v1';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getProvider(): 'anthropic' {
    return 'anthropic';
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      // Convert messages to Anthropic format
      const systemMessage = request.messages.find(m => m.role === 'system');
      const conversationMessages = request.messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: request.model || this.config.models.fanInteraction.primary,
          messages: conversationMessages,
          ...(systemMessage && { system: systemMessage.content }),
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens || this.config.models.fanInteraction.maxTokens,
          top_p: request.topP ?? 1,
          stop_sequences: request.stop,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw this.handleError(error);
      }

      const data = await response.json();

      return {
        content: data.content[0].text,
        model: data.model,
        tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
        finishReason: data.stop_reason === 'end_turn' ? 'stop' : 'length',
        provider: 'anthropic',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  private handleError(error: any): AIServiceError {
    return {
      code: error.error?.type || 'unknown_error',
      message: error.error?.message || error.message || 'Unknown error occurred',
      provider: 'anthropic',
      retryable: error.error?.type === 'overloaded_error' || error.status === 429,
    };
  }
}

/**
 * AI Service Manager
 * Manages multiple AI providers with fallback support
 */
export class AIServiceManager {
  private static instance: AIServiceManager;
  private services: Map<'openai' | 'anthropic', BaseAIService>;
  private requestCount = 0;
  private tokenCount = 0;
  private lastResetTime = Date.now();

  private constructor() {
    this.services = new Map();
    this.services.set('openai', new OpenAIService());
    this.services.set('anthropic', new AnthropicService());
  }

  public static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  /**
   * Complete AI request with automatic fallback
   */
  async complete(
    request: AICompletionRequest,
    preferredProvider?: 'openai' | 'anthropic'
  ): Promise<AICompletionResponse> {
    // Check rate limits
    this.checkRateLimits();

    const provider = preferredProvider || aiConfig.defaultProvider;
    const primaryService = this.services.get(provider);
    const fallbackProvider = provider === 'openai' ? 'anthropic' : 'openai';
    const fallbackService = this.services.get(fallbackProvider);

    try {
      if (primaryService?.isAvailable()) {
        const response = await this.executeWithRetry(primaryService, request);
        this.trackUsage(response.tokensUsed);
        return response;
      }
    } catch (error: any) {
      console.warn(`Primary provider (${provider}) failed:`, error.message);
    }

    // Fallback to alternative provider
    if (fallbackService?.isAvailable()) {
      console.log(`Falling back to ${fallbackProvider}`);
      const response = await this.executeWithRetry(fallbackService, request);
      this.trackUsage(response.tokensUsed);
      return response;
    }

    throw new Error('No AI providers available');
  }

  /**
   * Build prompt with Artist DNA context
   */
  buildArtistContextPrompt(artistDNA: ArtistDNA, task: string): string {
    const style = {
      tone: artistDNA.communicationStyle.tone,
      emojiUsage: artistDNA.communicationStyle.emojiUsage,
      responseLength: artistDNA.communicationStyle.responseLength,
    };

    const values = artistDNA.values;
    const themes = artistDNA.creativeStyle.visualThemes;

    return `You are an AI assistant representing the artist "${artistDNA.name}".

Artist Bio: ${artistDNA.bio}

Artistic Vision: ${artistDNA.values.artisticVision}

Communication Style:
- Tone: ${style.tone}
- Emoji Usage: ${style.emojiUsage}
- Response Length: ${style.responseLength}

Core Values: ${values.coreValues.join(', ')}
Visual Themes: ${themes.join(', ')}

Fan Relationship Philosophy: ${artistDNA.values.fanRelationshipPhilosophy}

Task: ${task}

Please respond in a way that reflects this artist's unique voice and values.`;
  }

  /**
   * Convert GenerationParams to AICompletionRequest
   */
  paramsToRequest(params: GenerationParams): Partial<AICompletionRequest> {
    return {
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      topP: params.topP,
      frequencyPenalty: params.frequencyPenalty,
      presencePenalty: params.presencePenalty,
    };
  }

  private async executeWithRetry(
    service: BaseAIService,
    request: AICompletionRequest,
    retries = 3
  ): Promise<AICompletionResponse> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await service.complete(request);
      } catch (error: any) {
        if (!error.retryable || attempt === retries - 1) {
          throw error;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Max retries exceeded');
  }

  private checkRateLimits(): void {
    const now = Date.now();
    const minuteElapsed = (now - this.lastResetTime) / 60000;

    if (minuteElapsed >= 1) {
      this.requestCount = 0;
      this.tokenCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= aiConfig.rateLimit.requestsPerMinute) {
      throw new Error('Rate limit exceeded: too many requests per minute');
    }

    if (this.tokenCount >= aiConfig.rateLimit.tokensPerMinute) {
      throw new Error('Rate limit exceeded: too many tokens per minute');
    }
  }

  private trackUsage(tokens: number): void {
    this.requestCount++;
    this.tokenCount += tokens;
  }
}

// Export singleton instance
export const aiService = AIServiceManager.getInstance();
