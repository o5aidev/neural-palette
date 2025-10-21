/**
 * Neural Publisher API
 *
 * 配信管理の API エンドポイント
 */

import type {
  Distribution,
  CreateDistributionInput,
  UpdateDistributionInput,
  DistributionFilter,
  DistributionEvent,
  DistributionStats,
} from '../types/neural-publisher.js';
import { NeuralPublisherStoragePrisma } from '../storage/neural-publisher.storage.prisma.js';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateCreateDistributionInput,
  validateUpdateDistributionInput,
} from '../validation/neural-publisher.validator.js';
import type { ApiResponse } from './neural-identity.api.js';

const prisma = new PrismaClient();
const storage = new NeuralPublisherStoragePrisma(prisma);

/**
 * 配信を作成
 */
export async function createDistribution(
  input: CreateDistributionInput
): Promise<ApiResponse<Distribution>> {
  try {
    validateCreateDistributionInput(input);
    const distribution = await storage.createDistribution(input);
    return {
      success: true,
      data: distribution,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create distribution',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 配信を取得
 */
export async function getDistribution(
  id: string
): Promise<ApiResponse<Distribution | null>> {
  try {
    const distribution = await storage.getDistribution(id);
    return {
      success: true,
      data: distribution,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get distribution',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 配信を更新
 */
export async function updateDistribution(
  id: string,
  input: UpdateDistributionInput
): Promise<ApiResponse<Distribution>> {
  try {
    validateUpdateDistributionInput(input);
    const distribution = await storage.updateDistribution(id, input);
    return {
      success: true,
      data: distribution,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update distribution',
        code: 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 配信を削除
 */
export async function deleteDistribution(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteDistribution(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete distribution',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * 配信を検索
 */
export async function findDistributions(
  filter?: DistributionFilter
): Promise<ApiResponse<Distribution[]>> {
  try {
    const distributions = await storage.findDistributions(filter);
    return {
      success: true,
      data: distributions,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find distributions',
        code: 'FIND_FAILED',
      },
    };
  }
}

/**
 * イベントを追加
 */
export async function addDistributionEvent(
  distributionId: string,
  event: Omit<DistributionEvent, 'id' | 'timestamp'>
): Promise<ApiResponse<DistributionEvent>> {
  try {
    const distributionEvent = await storage.addDistributionEvent(distributionId, event);
    return {
      success: true,
      data: distributionEvent,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to add distribution event',
        code: 'ADD_EVENT_FAILED',
      },
    };
  }
}

/**
 * 統計を取得
 */
export async function getDistributionStats(
  artistId: string
): Promise<ApiResponse<DistributionStats>> {
  try {
    const stats = await storage.getDistributionStats(artistId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get stats',
        code: 'GET_STATS_FAILED',
      },
    };
  }
}
