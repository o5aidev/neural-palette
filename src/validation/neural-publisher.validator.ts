/**
 * Neural Publisher バリデーター
 *
 * 配信管理データの検証を行う
 */

import type {
  Distribution,
  CreateDistributionInput,
  UpdateDistributionInput,
  PlatformConfig,
  DistributionStatus,
  DistributionPlatform,
} from '../types/neural-publisher.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * プラットフォーム設定の検証
 */
export function validatePlatformConfig(config: PlatformConfig): void {
  const errors: string[] = [];

  const validPlatforms: DistributionPlatform[] = [
    'spotify',
    'apple_music',
    'youtube_music',
    'amazon_music',
    'soundcloud',
    'bandcamp',
    'tidal',
    'other',
  ];

  if (!validPlatforms.includes(config.platform)) {
    errors.push(`Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
  }

  if (typeof config.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }

  if (config.releaseDate && !(config.releaseDate instanceof Date)) {
    errors.push('releaseDate must be a Date object');
  }

  if (errors.length > 0) {
    throw new ValidationError('PlatformConfig validation failed', 'platformConfig', errors);
  }
}

/**
 * 配信作成入力の検証
 */
export function validateCreateDistributionInput(input: CreateDistributionInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.contentId || input.contentId.trim() === '') {
    errors.push('contentId is required');
  }

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.title || input.title.trim() === '') {
    errors.push('title is required');
  }

  // プラットフォーム
  if (!Array.isArray(input.platforms)) {
    errors.push('platforms must be an array');
  } else if (input.platforms.length === 0) {
    errors.push('At least one platform is required');
  } else {
    input.platforms.forEach((platform, index) => {
      try {
        validatePlatformConfig(platform);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Platform[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  // スケジュール日時
  if (input.scheduledDate && !(input.scheduledDate instanceof Date)) {
    errors.push('scheduledDate must be a Date object');
  }

  // タグ
  if (input.tags && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  // isExplicit
  if (input.isExplicit !== undefined && typeof input.isExplicit !== 'boolean') {
    errors.push('isExplicit must be a boolean');
  }

  if (errors.length > 0) {
    throw new ValidationError('Distribution validation failed', undefined, errors);
  }
}

/**
 * 配信更新入力の検証
 */
export function validateUpdateDistributionInput(input: UpdateDistributionInput): void {
  const errors: string[] = [];

  // タイトル
  if (input.title !== undefined && input.title.trim() === '') {
    errors.push('title cannot be empty');
  }

  // ステータス
  if (input.status !== undefined) {
    const validStatuses: DistributionStatus[] = [
      'draft',
      'scheduled',
      'in_review',
      'approved',
      'publishing',
      'published',
      'failed',
      'cancelled',
    ];
    if (!validStatuses.includes(input.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // プラットフォーム
  if (input.platforms !== undefined) {
    if (!Array.isArray(input.platforms)) {
      errors.push('platforms must be an array');
    } else {
      input.platforms.forEach((platform, index) => {
        try {
          validatePlatformConfig(platform);
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.push(`Platform[${index}]: ${error.errors.join(', ')}`);
          }
        }
      });
    }
  }

  // 日時
  if (input.scheduledDate !== undefined && !(input.scheduledDate instanceof Date)) {
    errors.push('scheduledDate must be a Date object');
  }

  if (input.publishedDate !== undefined && !(input.publishedDate instanceof Date)) {
    errors.push('publishedDate must be a Date object');
  }

  // タグ
  if (input.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  // isExplicit
  if (input.isExplicit !== undefined && typeof input.isExplicit !== 'boolean') {
    errors.push('isExplicit must be a boolean');
  }

  if (errors.length > 0) {
    throw new ValidationError('Distribution update validation failed', undefined, errors);
  }
}
