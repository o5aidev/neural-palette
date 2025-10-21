/**
 * Personalized AI Service
 * AI generation with Artist DNA-based personalization
 */

import { aiService, AIMessage, AICompletionRequest } from './ai-service';
import { ArtistDNA } from '../types/neural-identity';
import { CreativeType, GenerationParams } from '../types/neural-muse';
import { SentimentType } from '../types/neural-echo';

export interface PersonalizedGenerationRequest {
  artistDNA: ArtistDNA;
  prompt: string;
  type: CreativeType | 'fan_response';
  params?: Partial<GenerationParams>;
  context?: string;
}

export interface PersonalizedGenerationResponse {
  content: string;
  model: string;
  tokensUsed: number;
  confidence: number; // 0-100
  provider: 'openai' | 'anthropic';
}

/**
 * Personalized AI Service
 * Generates content tailored to artist's DNA
 */
export class PersonalizedAIService {
  private static instance: PersonalizedAIService;

  private constructor() {}

  public static getInstance(): PersonalizedAIService {
    if (!PersonalizedAIService.instance) {
      PersonalizedAIService.instance = new PersonalizedAIService();
    }
    return PersonalizedAIService.instance;
  }

  /**
   * Generate creative content with artist DNA
   */
  async generateCreative(
    request: PersonalizedGenerationRequest
  ): Promise<PersonalizedGenerationResponse> {
    const systemPrompt = this.buildSystemPrompt(request.artistDNA, request.type);
    const userPrompt = this.enhancePrompt(request.prompt, request.artistDNA, request.type);

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    if (request.context) {
      messages.push({
        role: 'user',
        content: `Additional Context: ${request.context}`,
      });
    }

    const aiRequest: AICompletionRequest = {
      messages,
      temperature: request.params?.temperature ?? 0.8,
      maxTokens: request.params?.maxTokens ?? 2000,
      topP: request.params?.topP ?? 0.9,
      frequencyPenalty: request.params?.frequencyPenalty ?? 0.3,
      presencePenalty: request.params?.presencePenalty ?? 0.3,
    };

    const response = await aiService.complete(aiRequest);

    return {
      content: response.content,
      model: response.model,
      tokensUsed: response.tokensUsed,
      confidence: this.calculateConfidence(response),
      provider: response.provider,
    };
  }

  /**
   * Generate fan interaction response
   */
  async generateFanResponse(
    artistDNA: ArtistDNA,
    fanMessage: string,
    conversationHistory: AIMessage[] = [],
    sentiment?: SentimentType
  ): Promise<PersonalizedGenerationResponse> {
    const systemPrompt = this.buildFanResponseSystemPrompt(artistDNA, sentiment);

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: fanMessage },
    ];

    const aiRequest: AICompletionRequest = {
      messages,
      temperature: 0.7,
      maxTokens: this.getResponseLength(artistDNA.communicationStyle.responseLength),
      topP: 0.9,
    };

    // Prefer Anthropic for fan interactions (better at conversation)
    const response = await aiService.complete(aiRequest, 'anthropic');

    return {
      content: response.content,
      model: response.model,
      tokensUsed: response.tokensUsed,
      confidence: this.calculateConfidence(response),
      provider: response.provider,
    };
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: SentimentType;
    confidence: number;
  }> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: `You are a sentiment analysis expert. Analyze the sentiment of the following text and respond with ONLY a JSON object in this exact format:
{
  "sentiment": "excited" | "happy" | "neutral" | "concerned" | "frustrated" | "angry" | "supportive",
  "confidence": <number between 0 and 100>
}`,
      },
      { role: 'user', content: text },
    ];

    const response = await aiService.complete({
      messages,
      temperature: 0.1,
      maxTokens: 100,
    });

    try {
      const result = JSON.parse(response.content);
      return {
        sentiment: result.sentiment as SentimentType,
        confidence: Math.min(100, Math.max(0, result.confidence)),
      };
    } catch {
      // Fallback to neutral if parsing fails
      return {
        sentiment: 'neutral',
        confidence: 50,
      };
    }
  }

  /**
   * Generate variations of content
   */
  async generateVariations(
    artistDNA: ArtistDNA,
    originalContent: string,
    count: number = 3
  ): Promise<string[]> {
    const variations: string[] = [];

    for (let i = 0; i < count; i++) {
      const request: PersonalizedGenerationRequest = {
        artistDNA,
        prompt: `Create a variation of this content while maintaining the same core message and artistic voice:\n\n${originalContent}`,
        type: 'concept',
        params: {
          temperature: 0.8 + (i * 0.1), // Increase temperature for more variation
        },
      };

      const response = await this.generateCreative(request);
      variations.push(response.content);
    }

    return variations;
  }

  /**
   * Build system prompt based on artist DNA
   */
  private buildSystemPrompt(artistDNA: ArtistDNA, type: CreativeType | 'fan_response'): string {
    const coreValues = artistDNA.values.coreValues;
    const visualThemes = artistDNA.creativeStyle.visualThemes;
    const musicGenres = artistDNA.creativeStyle.musicGenres;

    let typeSpecificGuidance = '';
    switch (type) {
      case 'lyrics':
        typeSpecificGuidance = `Focus on lyrical composition that reflects the music genres: ${musicGenres.join(', ')}`;
        break;
      case 'melody':
        typeSpecificGuidance = `Create melodic ideas that complement ${musicGenres.join(', ')}`;
        break;
      case 'artwork':
        typeSpecificGuidance = `Design artwork concepts incorporating visual themes: ${visualThemes.join(', ')}`;
        break;
      case 'concept':
        typeSpecificGuidance = `Develop creative concepts aligned with core values`;
        break;
      case 'story':
        typeSpecificGuidance = `Craft compelling storytelling with emotional resonance`;
        break;
      case 'fan_response':
        typeSpecificGuidance = `Respond authentically to fan interaction`;
        break;
    }

    return `You are a creative AI assistant for the artist "${artistDNA.name}".

ARTIST PROFILE:
Bio: ${artistDNA.bio}
Artistic Vision: ${artistDNA.values.artisticVision}
Writing Style: ${artistDNA.creativeStyle.writingStyle}

CREATIVE IDENTITY:
Visual Themes: ${visualThemes.join(', ')}
Music Genres: ${musicGenres.join(', ')}
Core Values: ${coreValues.join(', ')}

COMMUNICATION STYLE:
- Tone: ${artistDNA.communicationStyle.tone}
- Emoji Usage: ${artistDNA.communicationStyle.emojiUsage}
- Response Length: ${artistDNA.communicationStyle.responseLength}

TASK: ${typeSpecificGuidance}

IMPORTANT:
- Maintain the artist's unique voice and perspective
- Reflect their core values in all content
- Match their communication style (tone, emoji usage, length)
- Create authentic content that feels true to the artist's identity`;
  }

  /**
   * Build system prompt for fan responses
   */
  private buildFanResponseSystemPrompt(
    artistDNA: ArtistDNA,
    sentiment?: SentimentType
  ): string {
    const coreValues = artistDNA.values.coreValues;

    let sentimentGuidance = '';
    if (sentiment) {
      switch (sentiment) {
        case 'excited':
        case 'positive':
          sentimentGuidance = 'Match their positive energy with enthusiasm';
          break;
        case 'negative':
        case 'critical':
          sentimentGuidance = 'Respond with empathy and understanding';
          break;
        case 'supportive':
          sentimentGuidance = 'Express gratitude and appreciation';
          break;
        case 'curious':
          sentimentGuidance = 'Provide thoughtful and informative responses';
          break;
        default:
          sentimentGuidance = 'Respond warmly and authentically';
      }
    }

    return `You are responding to a fan on behalf of the artist "${artistDNA.name}".

ARTIST PROFILE:
Fan Relationship Philosophy: ${artistDNA.values.fanRelationshipPhilosophy}
Core Values: ${coreValues.join(', ')}

COMMUNICATION STYLE:
- Tone: ${artistDNA.communicationStyle.tone}
- Emoji Usage: ${artistDNA.communicationStyle.emojiUsage}
- Response Length: ${artistDNA.communicationStyle.responseLength}

${sentiment ? `FAN SENTIMENT: ${sentiment}\nGUIDANCE: ${sentimentGuidance}` : ''}

IMPORTANT:
- Be authentic and true to the artist's voice
- Build genuine connection with the fan
- Reflect the artist's values and philosophy
- ${this.getEmojiGuidance(artistDNA.communicationStyle.emojiUsage)}
- Keep responses ${artistDNA.communicationStyle.responseLength}`;
  }

  /**
   * Enhance user prompt with context
   */
  private enhancePrompt(
    prompt: string,
    artistDNA: ArtistDNA,
    type: CreativeType | 'fan_response'
  ): string {
    const colorPalette = artistDNA.creativeStyle.colorPalette;

    let enhancement = prompt;

    // Add visual context for visual types
    if (['artwork', 'concept'].includes(type) && colorPalette.length > 0) {
      enhancement += `\n\nSuggested color palette: ${colorPalette.join(', ')}`;
    }

    return enhancement;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(response: any): number {
    // Base confidence on finish reason and content length
    let confidence = 80;

    if (response.finishReason === 'length') {
      confidence -= 20; // Penalize truncated responses
    }

    if (response.content.length < 50) {
      confidence -= 10; // Penalize very short responses
    }

    return Math.min(100, Math.max(0, confidence));
  }

  /**
   * Get max tokens based on response length preference
   */
  private getResponseLength(preference: string): number {
    switch (preference) {
      case 'concise':
        return 300;
      case 'moderate':
        return 800;
      case 'detailed':
        return 1500;
      default:
        return 800;
    }
  }

  /**
   * Get emoji usage guidance
   */
  private getEmojiGuidance(usage: string): string {
    switch (usage) {
      case 'frequent':
        return 'Use emojis frequently to add expressiveness';
      case 'moderate':
        return 'Use emojis occasionally where appropriate';
      case 'minimal':
        return 'Use emojis sparingly, only when they add value';
      case 'none':
        return 'Do not use emojis';
      default:
        return 'Use emojis moderately';
    }
  }
}

// Export singleton instance
export const personalizedAI = PersonalizedAIService.getInstance();
