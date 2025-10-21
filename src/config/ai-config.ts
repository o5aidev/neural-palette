/**
 * AI Configuration
 * Centralized configuration for AI services (OpenAI, Anthropic)
 */

export interface AIProviderConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  baseURL?: string;
  organization?: string;
  maxRetries: number;
  timeout: number;
}

export interface AIModelConfig {
  // Text Generation Models
  textGeneration: {
    primary: string;
    fallback: string;
    maxTokens: number;
  };
  // Creative Generation Models
  creativeGeneration: {
    primary: string;
    fallback: string;
    maxTokens: number;
  };
  // Fan Interaction Models
  fanInteraction: {
    primary: string;
    fallback: string;
    maxTokens: number;
  };
  // Sentiment Analysis
  sentimentAnalysis: {
    primary: string;
    maxTokens: number;
  };
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
  tokensPerMinute: number;
  tokensPerDay: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // seconds
  maxSize: number; // items
}

export class AIConfig {
  private static instance: AIConfig;

  public readonly openai: AIProviderConfig;
  public readonly anthropic: AIProviderConfig;
  public readonly models: AIModelConfig;
  public readonly rateLimit: RateLimitConfig;
  public readonly cache: CacheConfig;
  public readonly defaultProvider: 'openai' | 'anthropic';

  private constructor() {
    // OpenAI Configuration
    this.openai = {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      organization: process.env.OPENAI_ORG_ID,
      baseURL: process.env.OPENAI_BASE_URL,
      maxRetries: 3,
      timeout: 60000, // 60 seconds
    };

    // Anthropic Configuration
    this.anthropic = {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.ANTHROPIC_BASE_URL,
      maxRetries: 3,
      timeout: 60000,
    };

    // Model Configuration
    this.models = {
      textGeneration: {
        primary: process.env.AI_TEXT_MODEL || 'gpt-4-turbo-preview',
        fallback: 'gpt-3.5-turbo',
        maxTokens: 2000,
      },
      creativeGeneration: {
        primary: process.env.AI_CREATIVE_MODEL || 'gpt-4-turbo-preview',
        fallback: 'gpt-3.5-turbo',
        maxTokens: 4000,
      },
      fanInteraction: {
        primary: process.env.AI_FAN_MODEL || 'claude-3-5-sonnet-20241022',
        fallback: 'claude-3-haiku-20240307',
        maxTokens: 1500,
      },
      sentimentAnalysis: {
        primary: process.env.AI_SENTIMENT_MODEL || 'gpt-3.5-turbo',
        maxTokens: 100,
      },
    };

    // Rate Limiting
    this.rateLimit = {
      requestsPerMinute: parseInt(process.env.AI_RPM || '60', 10),
      requestsPerDay: parseInt(process.env.AI_RPD || '10000', 10),
      tokensPerMinute: parseInt(process.env.AI_TPM || '90000', 10),
      tokensPerDay: parseInt(process.env.AI_TPD || '1000000', 10),
    };

    // Cache Configuration
    this.cache = {
      enabled: process.env.AI_CACHE_ENABLED !== 'false',
      ttl: parseInt(process.env.AI_CACHE_TTL || '3600', 10), // 1 hour default
      maxSize: parseInt(process.env.AI_CACHE_MAX_SIZE || '1000', 10),
    };

    // Default Provider
    this.defaultProvider = (process.env.AI_DEFAULT_PROVIDER as 'openai' | 'anthropic') || 'openai';
  }

  public static getInstance(): AIConfig {
    if (!AIConfig.instance) {
      AIConfig.instance = new AIConfig();
    }
    return AIConfig.instance;
  }

  public getProviderConfig(provider?: 'openai' | 'anthropic'): AIProviderConfig {
    const selectedProvider = provider || this.defaultProvider;
    return selectedProvider === 'openai' ? this.openai : this.anthropic;
  }

  public validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check API keys
    if (!this.openai.apiKey && !this.anthropic.apiKey) {
      errors.push('At least one AI provider API key must be configured');
    }

    if (this.defaultProvider === 'openai' && !this.openai.apiKey) {
      errors.push('OpenAI API key is required when set as default provider');
    }

    if (this.defaultProvider === 'anthropic' && !this.anthropic.apiKey) {
      errors.push('Anthropic API key is required when set as default provider');
    }

    // Validate rate limits
    if (this.rateLimit.requestsPerMinute <= 0) {
      errors.push('Rate limit requestsPerMinute must be positive');
    }

    if (this.rateLimit.tokensPerMinute <= 0) {
      errors.push('Rate limit tokensPerMinute must be positive');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const aiConfig = AIConfig.getInstance();
