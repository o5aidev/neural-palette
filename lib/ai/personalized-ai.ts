/**
 * Next.js wrapper for Personalized AI Service
 */

import type { PersonalizedGenerationRequest } from '@/src/services/personalized-ai.service'

// Re-export types from src
export type { PersonalizedGenerationRequest, PersonalizedGenerationResponse } from '@/src/services/personalized-ai.service'
export type { AIMessage, AICompletionRequest } from '@/src/services/ai-service'

// Dynamic import to avoid issues with module resolution
export async function getPersonalizedAI() {
  const { PersonalizedAIService } = await import('@/src/services/personalized-ai.service')
  return PersonalizedAIService.getInstance()
}

export async function generateWithAI(request: PersonalizedGenerationRequest) {
  const personalizedAI = await getPersonalizedAI()
  return await personalizedAI.generateCreative(request)
}
