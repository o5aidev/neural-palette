/**
 * Neural Echo API
 *
 * ファン交流AIの API エンドポイント
 */

import type {
  FanProfile,
  CreateFanProfileInput,
  FanProfileFilter,
  ConversationThread,
  CreateConversationThreadInput,
  ConversationThreadFilter,
  Message,
  AddMessageInput,
  GenerateResponseRequest,
  ResponseTemplate,
  CreateResponseTemplateInput,
  ResponseConfig,
  EchoStats,
} from '../types/neural-echo.js';
import { NeuralEchoStoragePrisma } from '../storage/neural-echo.storage.prisma.js';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateCreateFanProfileInput,
  validateCreateConversationThreadInput,
  validateAddMessageInput,
  validateGenerateResponseRequest,
  validateCreateResponseTemplateInput,
  validateResponseConfig,
} from '../validation/neural-echo.validator.js';
import type { ApiResponse } from './neural-identity.api.js';
import { personalizedAI } from '../services/personalized-ai.service.js';
import { aiCache } from '../services/ai-cache.service.js';
import { NeuralIdentityStoragePrisma } from '../storage/neural-identity.storage.prisma.js';
import type { AIMessage } from '../services/ai-service.js';

const prisma = new PrismaClient();
const storage = new NeuralEchoStoragePrisma(prisma);
const identityStorage = new NeuralIdentityStoragePrisma(prisma);

// ============================================================================
// Fan Profile API
// ============================================================================

/**
 * ファンプロファイルを作成
 */
export async function createFanProfile(
  input: CreateFanProfileInput
): Promise<ApiResponse<FanProfile>> {
  try {
    validateCreateFanProfileInput(input);
    const profile = await storage.createFanProfile(input);
    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create fan profile',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * ファンプロファイルを取得
 */
export async function getFanProfile(
  id: string
): Promise<ApiResponse<FanProfile | null>> {
  try {
    const profile = await storage.getFanProfile(id);
    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get fan profile',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * ファンプロファイルを更新
 */
export async function updateFanProfile(
  id: string,
  updates: Partial<FanProfile>
): Promise<ApiResponse<FanProfile>> {
  try {
    const profile = await storage.updateFanProfile(id, updates);
    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update fan profile',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

/**
 * ファンプロファイルを検索
 */
export async function findFanProfiles(
  filter?: FanProfileFilter
): Promise<ApiResponse<FanProfile[]>> {
  try {
    const profiles = await storage.findFanProfiles(filter);
    return {
      success: true,
      data: profiles,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find fan profiles',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Conversation Thread API
// ============================================================================

/**
 * 会話スレッドを作成
 */
export async function createConversationThread(
  input: CreateConversationThreadInput
): Promise<ApiResponse<ConversationThread>> {
  try {
    validateCreateConversationThreadInput(input);
    const thread = await storage.createConversationThread(input);
    return {
      success: true,
      data: thread,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create conversation thread',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 会話スレッドを取得
 */
export async function getConversationThread(
  id: string
): Promise<ApiResponse<ConversationThread | null>> {
  try {
    const thread = await storage.getConversationThread(id);
    return {
      success: true,
      data: thread,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get conversation thread',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 会話スレッドを更新
 */
export async function updateConversationThread(
  id: string,
  updates: Partial<ConversationThread>
): Promise<ApiResponse<ConversationThread>> {
  try {
    const thread = await storage.updateConversationThread(id, updates);
    return {
      success: true,
      data: thread,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update conversation thread',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

/**
 * 会話スレッドを検索
 */
export async function findConversationThreads(
  filter?: ConversationThreadFilter
): Promise<ApiResponse<ConversationThread[]>> {
  try {
    const threads = await storage.findConversationThreads(filter);
    return {
      success: true,
      data: threads,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find conversation threads',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Message API
// ============================================================================

/**
 * メッセージを追加
 */
export async function addMessage(input: AddMessageInput): Promise<ApiResponse<Message>> {
  try {
    validateAddMessageInput(input);
    const message = await storage.addMessage(input);
    return {
      success: true,
      data: message,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to add message',
        code: 'ADD_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * メッセージを更新（フィードバック用）
 */
export async function updateMessage(
  id: string,
  updates: {
    rating?: number;
    wasEdited?: boolean;
    editedContent?: string;
    rejectionReason?: string;
  }
): Promise<ApiResponse<Message>> {
  try {
    const message = await storage.updateMessage(id, updates);
    return {
      success: true,
      data: message,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update message',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

// ============================================================================
// AI Response Generation API
// ============================================================================

/**
 * AI応答を生成（実際のAI統合）
 */
export async function generateResponse(
  request: GenerateResponseRequest
): Promise<ApiResponse<Message>> {
  try {
    validateGenerateResponseRequest(request);

    // Get conversation thread
    const thread = await storage.getConversationThread(request.threadId);
    if (!thread) {
      throw new Error('Conversation thread not found');
    }

    // Get artist DNA
    const artistDNA = await identityStorage.getArtistDNA(thread.artistId);
    if (!artistDNA) {
      throw new Error('Artist DNA not found');
    }

    // Analyze fan message sentiment first
    const sentimentResult = await personalizedAI.analyzeSentiment(request.fanMessage);

    // Get conversation history
    const messages = await storage.getThreadMessages(request.threadId);
    const conversationHistory: AIMessage[] = messages
      .slice(-5) // Last 5 messages for context
      .map(m => ({
        role: m.role === 'fan' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }));

    // Check cache first
    const cacheKey = aiCache.getCompletion({
      artistId: thread.artistId,
      fanMessage: request.fanMessage,
      sentiment: sentimentResult.sentiment,
      historyLength: conversationHistory.length,
    });

    let aiResponse;
    if (cacheKey) {
      aiResponse = cacheKey;
      console.log('[Neural Echo] Using cached AI response');
    } else {
      // Generate personalized fan response
      aiResponse = await personalizedAI.generateFanResponse(
        artistDNA,
        request.fanMessage,
        conversationHistory,
        sentimentResult.sentiment
      );

      // Cache the response (shorter TTL for conversations)
      aiCache.cacheCompletion(
        {
          artistId: thread.artistId,
          fanMessage: request.fanMessage,
          sentiment: sentimentResult.sentiment,
          historyLength: conversationHistory.length,
        },
        aiResponse,
        1800 // 30 minutes TTL
      );
    }

    // Save AI response as message
    const message = await storage.addMessage({
      threadId: request.threadId,
      role: 'ai',
      content: aiResponse.content,
      sentiment: sentimentResult.sentiment,
      confidence: aiResponse.confidence,
      metadata: {
        generatedPrompt: request.fanMessage,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        provider: aiResponse.provider,
        sentimentConfidence: sentimentResult.confidence,
      },
    });

    // Update thread status and sentiment
    await storage.updateConversationThread(request.threadId, {
      status: request.autoSend ? 'sent' : 'generated',
      sentiment: sentimentResult.sentiment,
    });

    // Update fan profile sentiment history
    const fan = await storage.getFanProfile(thread.fanId);
    if (fan) {
      const sentimentHistory = JSON.parse(fan.sentimentHistory);
      sentimentHistory.push(sentimentResult.sentiment);

      await storage.updateFanProfile(thread.fanId, {
        lastInteractionAt: new Date(),
        totalInteractions: fan.totalInteractions + 1,
        sentimentHistory: JSON.stringify(sentimentHistory.slice(-10)), // Keep last 10
      });
    }

    return {
      success: true,
      data: message,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate response',
        code: 'GENERATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

// ============================================================================
// Response Template API
// ============================================================================

/**
 * 応答テンプレートを作成
 */
export async function createResponseTemplate(
  input: CreateResponseTemplateInput
): Promise<ApiResponse<ResponseTemplate>> {
  try {
    validateCreateResponseTemplateInput(input);
    const template = await storage.createResponseTemplate(input);
    return {
      success: true,
      data: template,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create response template',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 応答テンプレートを取得
 */
export async function getResponseTemplate(
  id: string
): Promise<ApiResponse<ResponseTemplate | null>> {
  try {
    const template = await storage.getResponseTemplate(id);
    return {
      success: true,
      data: template,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get response template',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 応答テンプレートを検索
 */
export async function findResponseTemplates(
  filter?: any
): Promise<ApiResponse<ResponseTemplate[]>> {
  try {
    const templates = await storage.findResponseTemplates(filter);
    return {
      success: true,
      data: templates,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find response templates',
        code: 'FIND_FAILED',
      },
    };
  }
}

/**
 * テンプレート使用数を増やす
 */
export async function incrementResponseTemplateUsage(id: string): Promise<ApiResponse<void>> {
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
// Response Config API
// ============================================================================

/**
 * 応答設定を作成または更新
 */
export async function upsertResponseConfig(
  config: Partial<ResponseConfig> & { artistId: string }
): Promise<ApiResponse<ResponseConfig>> {
  try {
    validateResponseConfig(config);
    const responseConfig = await storage.upsertResponseConfig(config);
    return {
      success: true,
      data: responseConfig,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to upsert response config',
        code: 'UPSERT_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 応答設定を取得
 */
export async function getResponseConfig(
  artistId: string
): Promise<ApiResponse<ResponseConfig | null>> {
  try {
    const config = await storage.getResponseConfig(artistId);
    return {
      success: true,
      data: config,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get response config',
        code: 'GET_FAILED',
      },
    };
  }
}

// ============================================================================
// Stats API
// ============================================================================

/**
 * 交流統計を取得
 */
export async function getEchoStats(artistId: string): Promise<ApiResponse<EchoStats>> {
  try {
    const stats = await storage.getEchoStats(artistId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get echo stats',
        code: 'GET_STATS_FAILED',
      },
    };
  }
}
