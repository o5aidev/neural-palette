/**
 * Neural Muse API
 *
 * AI創作支援の API エンドポイント
 */

import type {
  CreativeSession,
  CreateCreativeSessionInput,
  UpdateCreativeSessionInput,
  CreativeSessionFilter,
  GenerationResult,
  GenerateRequest,
  Inspiration,
  CreateInspirationInput,
  InspirationFilter,
  PromptTemplate,
  CreatePromptTemplateInput,
  CreativeStats,
} from '../types/neural-muse.js';
import { NeuralMuseStoragePrisma } from '../storage/neural-muse.storage.prisma.js';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateCreateCreativeSessionInput,
  validateUpdateCreativeSessionInput,
  validateGenerateRequest,
  validateCreateInspirationInput,
  validateCreatePromptTemplateInput,
} from '../validation/neural-muse.validator.js';
import type { ApiResponse } from './neural-identity.api.js';
import { personalizedAI } from '../services/personalized-ai.service.js';
import { aiCache } from '../services/ai-cache.service.js';
import { NeuralIdentityStoragePrisma } from '../storage/neural-identity.storage.prisma.js';

const prisma = new PrismaClient();
const storage = new NeuralMuseStoragePrisma(prisma);
const identityStorage = new NeuralIdentityStoragePrisma();

// ============================================================================
// Creative Session API
// ============================================================================

/**
 * 創作セッションを作成
 */
export async function createCreativeSession(
  input: CreateCreativeSessionInput
): Promise<ApiResponse<CreativeSession>> {
  try {
    validateCreateCreativeSessionInput(input);
    const session = await storage.createCreativeSession(input);
    return {
      success: true,
      data: session,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create creative session',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 創作セッションを取得
 */
export async function getCreativeSession(
  id: string
): Promise<ApiResponse<CreativeSession | null>> {
  try {
    const session = await storage.getCreativeSession(id);
    return {
      success: true,
      data: session,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get creative session',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 創作セッションを更新
 */
export async function updateCreativeSession(
  id: string,
  input: UpdateCreativeSessionInput
): Promise<ApiResponse<CreativeSession>> {
  try {
    validateUpdateCreativeSessionInput(input);
    const session = await storage.updateCreativeSession(id, input);
    return {
      success: true,
      data: session,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update creative session',
        code: 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 創作セッションを削除
 */
export async function deleteCreativeSession(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteCreativeSession(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete creative session',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * 創作セッションを検索
 */
export async function findCreativeSessions(
  filter?: CreativeSessionFilter
): Promise<ApiResponse<CreativeSession[]>> {
  try {
    const sessions = await storage.findCreativeSessions(filter);
    return {
      success: true,
      data: sessions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find creative sessions',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Generation API
// ============================================================================

/**
 * AI生成を実行（実際のAI統合）
 */
export async function generateContent(
  request: GenerateRequest
): Promise<ApiResponse<GenerationResult>> {
  try {
    validateGenerateRequest(request);

    // Get session to extract artistId
    const session = await storage.getCreativeSession(request.sessionId);
    if (!session) {
      throw new Error('Creative session not found');
    }

    // Get artist DNA
    const artistDNA = await identityStorage.findById(session.artistId);
    if (!artistDNA) {
      throw new Error('Artist DNA not found');
    }

    // Check cache first
    const cacheKey = aiCache.getCompletion({
      artistId: session.artistId,
      prompt: request.prompt,
      type: request.type,
      params: request.params,
    });

    let aiResponse;
    if (cacheKey) {
      aiResponse = cacheKey;
      console.log('[Neural Muse] Using cached AI response');
    } else {
      // Generate with personalized AI
      aiResponse = await personalizedAI.generateCreative({
        artistDNA,
        prompt: request.prompt,
        type: request.type,
        params: request.params,
      });

      // Cache the response
      aiCache.cacheCompletion(
        {
          artistId: session.artistId,
          prompt: request.prompt,
          type: request.type,
          params: request.params,
        },
        aiResponse,
        3600 // 1 hour TTL
      );
    }

    // Save generation result
    const generationData = {
      sessionId: request.sessionId,
      type: request.type,
      prompt: request.prompt,
      result: aiResponse.content,
      params: request.params || session.defaultParams,
      tokensUsed: aiResponse.tokensUsed,
      model: aiResponse.model,
      confidence: aiResponse.confidence,
      isSelected: false,
    };

    const result = await storage.addGenerationResult(request.sessionId, generationData);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate content',
        code: 'GENERATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 生成結果のフィードバックを更新
 */
export async function updateGenerationFeedback(
  id: string,
  feedback: { rating?: number; feedback?: string; isSelected?: boolean }
): Promise<ApiResponse<GenerationResult>> {
  try {
    const result = await storage.updateGenerationResult(id, feedback);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update feedback',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

// ============================================================================
// Inspiration API
// ============================================================================

/**
 * インスピレーションを作成
 */
export async function createInspiration(
  input: CreateInspirationInput
): Promise<ApiResponse<Inspiration>> {
  try {
    validateCreateInspirationInput(input);
    const inspiration = await storage.createInspiration(input);
    return {
      success: true,
      data: inspiration,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create inspiration',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * インスピレーションを取得
 */
export async function getInspiration(
  id: string
): Promise<ApiResponse<Inspiration | null>> {
  try {
    const inspiration = await storage.getInspiration(id);
    return {
      success: true,
      data: inspiration,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get inspiration',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * インスピレーションを検索
 */
export async function findInspirations(
  filter?: InspirationFilter
): Promise<ApiResponse<Inspiration[]>> {
  try {
    const inspirations = await storage.findInspirations(filter);
    return {
      success: true,
      data: inspirations,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find inspirations',
        code: 'FIND_FAILED',
      },
    };
  }
}

/**
 * インスピレーションを削除
 */
export async function deleteInspiration(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteInspiration(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete inspiration',
        code: 'DELETE_FAILED',
      },
    };
  }
}

// ============================================================================
// Prompt Template API
// ============================================================================

/**
 * プロンプトテンプレートを作成
 */
export async function createPromptTemplate(
  input: CreatePromptTemplateInput
): Promise<ApiResponse<PromptTemplate>> {
  try {
    validateCreatePromptTemplateInput(input);
    const template = await storage.createPromptTemplate(input);
    return {
      success: true,
      data: template,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create prompt template',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * プロンプトテンプレートを取得
 */
export async function getPromptTemplate(
  id: string
): Promise<ApiResponse<PromptTemplate | null>> {
  try {
    const template = await storage.getPromptTemplate(id);
    return {
      success: true,
      data: template,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get prompt template',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * プロンプトテンプレートを検索
 */
export async function findPromptTemplates(filter?: any): Promise<ApiResponse<PromptTemplate[]>> {
  try {
    const templates = await storage.findPromptTemplates(filter);
    return {
      success: true,
      data: templates,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find prompt templates',
        code: 'FIND_FAILED',
      },
    };
  }
}

/**
 * テンプレート使用数を増やす
 */
export async function incrementTemplateUsage(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.incrementTemplateUsage(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to increment template usage',
        code: 'INCREMENT_FAILED',
      },
    };
  }
}

// ============================================================================
// Stats API
// ============================================================================

/**
 * 創作統計を取得
 */
export async function getCreativeStats(
  artistId: string
): Promise<ApiResponse<CreativeStats>> {
  try {
    const stats = await storage.getCreativeStats(artistId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get creative stats',
        code: 'GET_STATS_FAILED',
      },
    };
  }
}
