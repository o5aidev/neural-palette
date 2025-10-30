/**
 * Mock AI Service for Testing
 */

import { AICompletionRequest, AICompletionResponse } from '../ai-service'

export class MockAIService {
  async complete(_request: AICompletionRequest): Promise<AICompletionResponse> {
    // Return mock response for testing
    return {
      content: JSON.stringify({
        sentiment: 'positive',
        confidence: 85
      }),
      model: 'mock-model',
      tokensUsed: 50,
      finishReason: 'stop',
      provider: 'openai'
    }
  }

  isAvailable(): boolean {
    return true
  }
}

export class MockAIServiceManager {
  private static instance: MockAIServiceManager

  private constructor() {}

  public static getInstance(): MockAIServiceManager {
    if (!MockAIServiceManager.instance) {
      MockAIServiceManager.instance = new MockAIServiceManager()
    }
    return MockAIServiceManager.instance
  }

  async complete(
    request: AICompletionRequest,
    _preferredProvider?: 'openai' | 'anthropic'
  ): Promise<AICompletionResponse> {
    // Extract sentiment analysis request
    const systemMessage = request.messages.find(m => m.role === 'system')?.content || ''
    const _userMessage = request.messages.find(m => m.role === 'user')?.content || ''

    // If this is a sentiment analysis request, return appropriate response
    if (systemMessage.includes('sentiment analysis')) {
      return {
        content: JSON.stringify({
          sentiment: 'positive',
          confidence: 85
        }),
        model: 'mock-model',
        tokensUsed: 50,
        finishReason: 'stop',
        provider: 'openai'
      }
    }

    // Default mock response
    return {
      content: 'Mock AI response',
      model: 'mock-model',
      tokensUsed: 100,
      finishReason: 'stop',
      provider: 'openai'
    }
  }
}

export const aiService = MockAIServiceManager.getInstance()
