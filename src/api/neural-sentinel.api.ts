/**
 * Neural Sentinel API
 *
 * 権利保護の API エンドポイント
 */

import type {
  Right,
  CreateRightInput,
  UpdateRightInput,
  RightFilter,
  Infringement,
  CreateInfringementInput,
  UpdateInfringementInput,
  InfringementFilter,
  MonitoringRule,
  CreateMonitoringRuleInput,
  ProtectionStats,
} from '../types/neural-sentinel.js';
import { NeuralSentinelStoragePrisma } from '../storage/neural-sentinel.storage.prisma.js';
import { PrismaClient } from '../generated/prisma/index.js';
import {
  validateCreateRightInput,
  validateUpdateRightInput,
  validateCreateInfringementInput,
  validateUpdateInfringementInput,
  validateCreateMonitoringRuleInput,
} from '../validation/neural-sentinel.validator.js';
import type { ApiResponse } from './neural-identity.api.js';

const prisma = new PrismaClient();
const storage = new NeuralSentinelStoragePrisma(prisma);

// ============================================================================
// Right API
// ============================================================================

/**
 * 権利を作成
 */
export async function createRight(input: CreateRightInput): Promise<ApiResponse<Right>> {
  try {
    validateCreateRightInput(input);
    const right = await storage.createRight(input);
    return {
      success: true,
      data: right,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create right',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 権利を取得
 */
export async function getRight(id: string): Promise<ApiResponse<Right | null>> {
  try {
    const right = await storage.getRight(id);
    return {
      success: true,
      data: right,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get right',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 権利を更新
 */
export async function updateRight(
  id: string,
  input: UpdateRightInput
): Promise<ApiResponse<Right>> {
  try {
    validateUpdateRightInput(input);
    const right = await storage.updateRight(id, input);
    return {
      success: true,
      data: right,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update right',
        code: 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 権利を削除
 */
export async function deleteRight(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteRight(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete right',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * 権利を検索
 */
export async function findRights(filter?: RightFilter): Promise<ApiResponse<Right[]>> {
  try {
    const rights = await storage.findRights(filter);
    return {
      success: true,
      data: rights,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find rights',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Infringement API
// ============================================================================

/**
 * 侵害を作成
 */
export async function createInfringement(
  input: CreateInfringementInput
): Promise<ApiResponse<Infringement>> {
  try {
    validateCreateInfringementInput(input);
    const infringement = await storage.createInfringement(input);
    return {
      success: true,
      data: infringement,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create infringement',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 侵害を取得
 */
export async function getInfringement(
  id: string
): Promise<ApiResponse<Infringement | null>> {
  try {
    const infringement = await storage.getInfringement(id);
    return {
      success: true,
      data: infringement,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get infringement',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 侵害を更新
 */
export async function updateInfringement(
  id: string,
  input: UpdateInfringementInput
): Promise<ApiResponse<Infringement>> {
  try {
    validateUpdateInfringementInput(input);
    const infringement = await storage.updateInfringement(id, input);
    return {
      success: true,
      data: infringement,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update infringement',
        code: 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 侵害を削除
 */
export async function deleteInfringement(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteInfringement(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete infringement',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * 侵害を検索
 */
export async function findInfringements(
  filter?: InfringementFilter
): Promise<ApiResponse<Infringement[]>> {
  try {
    const infringements = await storage.findInfringements(filter);
    return {
      success: true,
      data: infringements,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to find infringements',
        code: 'FIND_FAILED',
      },
    };
  }
}

// ============================================================================
// Monitoring Rule API
// ============================================================================

/**
 * 監視ルールを作成
 */
export async function createMonitoringRule(
  input: CreateMonitoringRuleInput
): Promise<ApiResponse<MonitoringRule>> {
  try {
    validateCreateMonitoringRuleInput(input);
    const rule = await storage.createMonitoringRule(input);
    return {
      success: true,
      data: rule,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to create monitoring rule',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * 監視ルールを取得
 */
export async function getMonitoringRule(
  id: string
): Promise<ApiResponse<MonitoringRule | null>> {
  try {
    const rule = await storage.getMonitoringRule(id);
    return {
      success: true,
      data: rule,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get monitoring rule',
        code: 'GET_FAILED',
      },
    };
  }
}

/**
 * 監視ルールを更新
 */
export async function updateMonitoringRule(
  id: string,
  updates: Partial<MonitoringRule>
): Promise<ApiResponse<MonitoringRule>> {
  try {
    const rule = await storage.updateMonitoringRule(id, updates);
    return {
      success: true,
      data: rule,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to update monitoring rule',
        code: 'UPDATE_FAILED',
      },
    };
  }
}

/**
 * 監視ルールを削除
 */
export async function deleteMonitoringRule(id: string): Promise<ApiResponse<void>> {
  try {
    await storage.deleteMonitoringRule(id);
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to delete monitoring rule',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * アクティブな監視ルールを取得
 */
export async function getActiveMonitoringRules(
  artistId?: string
): Promise<ApiResponse<MonitoringRule[]>> {
  try {
    const rules = await storage.getActiveMonitoringRules(artistId);
    return {
      success: true,
      data: rules,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to get active monitoring rules',
        code: 'GET_ACTIVE_FAILED',
      },
    };
  }
}

// ============================================================================
// Stats API
// ============================================================================

/**
 * 権利保護統計を取得
 */
export async function getProtectionStats(
  artistId: string
): Promise<ApiResponse<ProtectionStats>> {
  try {
    const stats = await storage.getProtectionStats(artistId);
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Failed to get protection stats',
        code: 'GET_STATS_FAILED',
      },
    };
  }
}
