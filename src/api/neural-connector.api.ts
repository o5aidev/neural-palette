/**
 * Neural Connector API
 *
 * SNS連携の API エンドポイント
 */

import type {
  SocialConnection,
  CreateSocialConnectionInput,
  SocialConnectionFilter,
  SocialPost,
  CreateSocialPostInput,
  UpdateSocialPostInput,
  SocialPostFilter,
} from '../types/neural-connector.js';
import { NeuralConnectorStoragePrisma } from '../storage/neural-connector.storage.prisma.js';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateCreateSocialConnectionInput,
  validateCreateSocialPostInput,
  validateUpdateSocialPostInput,
} from '../validation/neural-connector.validator.js';
import type { ApiResponse } from './neural-identity.api.js';

const prisma = new PrismaClient();
const storage = new NeuralConnectorStoragePrisma(prisma);

// ============================================================================
// Social Connection API
// ============================================================================

/**
 * SNSアカウント接続を作成
 */
export async function createSocialConnection(
  input: CreateSocialConnectionInput
): Promise<ApiResponse<SocialConnection>> {
  try {
    validateCreateSocialConnectionInput(input);
    const connection = await storage.createSocialConnection(input);
    return {
      success: true,
      data: connection,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to create social connection',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * SNSアカウント接続を取得
 */
export async function getSocialConnection(
  id: string
): Promise<ApiResponse<SocialConnection | null>> {
  try {
    const connection = await storage.getSocialConnection(id);
    return {
      success: true,
      data: connection,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to get social connection',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * SNSアカウント接続を更新
 */
export async function updateSocialConnection(
  id: string,
  updates: Partial<SocialConnection>
): Promise<ApiResponse<SocialConnection>> {
  try {
    const connection = await storage.updateSocialConnection(id, updates);
    return {
      success: true,
      data: connection,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to update social connection',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

/**
 * SNSアカウント接続を削除
 */
export async function deleteSocialConnection(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteSocialConnection(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to delete social connection',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * SNSアカウント接続を検索
 */
export async function findSocialConnections(
  filter?: SocialConnectionFilter
): Promise<ApiResponse<SocialConnection[]>> {
  try {
    const connections = await storage.findSocialConnections(filter);
    return {
      success: true,
      data: connections,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to find social connections',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Social Post API
// ============================================================================

/**
 * SNS投稿を作成
 */
export async function createSocialPost(
  input: CreateSocialPostInput
): Promise<ApiResponse<SocialPost>> {
  try {
    validateCreateSocialPostInput(input);
    const post = await storage.createSocialPost(input);
    return {
      success: true,
      data: post,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create social post',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * SNS投稿を取得
 */
export async function getSocialPost(
  id: string
): Promise<ApiResponse<SocialPost | null>> {
  try {
    const post = await storage.getSocialPost(id);
    return {
      success: true,
      data: post,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get social post',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * SNS投稿を更新
 */
export async function updateSocialPost(
  id: string,
  input: UpdateSocialPostInput
): Promise<ApiResponse<SocialPost>> {
  try {
    validateUpdateSocialPostInput(input);
    const post = await storage.updateSocialPost(id, input);
    return {
      success: true,
      data: post,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update social post',
        code: 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * SNS投稿を削除
 */
export async function deleteSocialPost(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteSocialPost(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete social post',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * SNS投稿を検索
 */
export async function findSocialPosts(
  filter?: SocialPostFilter
): Promise<ApiResponse<SocialPost[]>> {
  try {
    const posts = await storage.findSocialPosts(filter);
    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find social posts',
        code: 'FIND_FAILED',
      },
    };
  }
}

/**
 * スケジュール済み投稿を取得
 */
export async function getScheduledPosts(
  beforeDate: Date
): Promise<ApiResponse<SocialPost[]>> {
  try {
    const posts = await storage.getScheduledPosts(beforeDate);
    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to get scheduled posts',
        code: 'GET_SCHEDULED_FAILED',
      },
    };
  }
}
