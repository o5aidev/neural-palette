/**
 * Neural Connector バリデーター
 *
 * SNS連携データの検証を行う
 */

import type {
  CreateSocialConnectionInput,
  CreateSocialPostInput,
  UpdateSocialPostInput,
  SocialPlatform,
  PostStatus,
  PostType,
} from '../types/neural-connector.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * SNSアカウント作成入力の検証
 */
export function validateCreateSocialConnectionInput(input: CreateSocialConnectionInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  const validPlatforms: SocialPlatform[] = [
    'twitter',
    'instagram',
    'tiktok',
    'facebook',
    'youtube',
    'discord',
    'threads',
    'other',
  ];

  if (!validPlatforms.includes(input.platform)) {
    errors.push(`Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
  }

  if (!input.accountId || input.accountId.trim() === '') {
    errors.push('accountId is required');
  }

  if (!input.accountName || input.accountName.trim() === '') {
    errors.push('accountName is required');
  }

  // トークンの有効期限
  if (input.tokenExpiresAt && !(input.tokenExpiresAt instanceof Date)) {
    errors.push('tokenExpiresAt must be a Date object');
  }

  if (errors.length > 0) {
    throw new ValidationError('SocialConnection validation failed', undefined, errors);
  }
}

/**
 * SNS投稿作成入力の検証
 */
export function validateCreateSocialPostInput(input: CreateSocialPostInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  const validTypes: PostType[] = ['text', 'image', 'video', 'link', 'poll', 'story'];
  if (!validTypes.includes(input.type)) {
    errors.push(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
  }

  if (!input.content || input.content.trim() === '') {
    errors.push('content is required');
  }

  // プラットフォーム
  if (!Array.isArray(input.platforms)) {
    errors.push('platforms must be an array');
  } else if (input.platforms.length === 0) {
    errors.push('At least one platform is required');
  } else {
    const validPlatforms: SocialPlatform[] = [
      'twitter',
      'instagram',
      'tiktok',
      'facebook',
      'youtube',
      'discord',
      'threads',
      'other',
    ];
    const invalidPlatforms = input.platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
    }
  }

  // メディアURL
  if (input.mediaUrls && !Array.isArray(input.mediaUrls)) {
    errors.push('mediaUrls must be an array');
  }

  // スケジュール日時
  if (input.scheduledAt && !(input.scheduledAt instanceof Date)) {
    errors.push('scheduledAt must be a Date object');
  }

  if (errors.length > 0) {
    throw new ValidationError('SocialPost validation failed', undefined, errors);
  }
}

/**
 * SNS投稿更新入力の検証
 */
export function validateUpdateSocialPostInput(input: UpdateSocialPostInput): void {
  const errors: string[] = [];

  // コンテンツ
  if (input.content !== undefined && input.content.trim() === '') {
    errors.push('content cannot be empty');
  }

  // メディアURL
  if (input.mediaUrls !== undefined && !Array.isArray(input.mediaUrls)) {
    errors.push('mediaUrls must be an array');
  }

  // プラットフォーム
  if (input.platforms !== undefined) {
    if (!Array.isArray(input.platforms)) {
      errors.push('platforms must be an array');
    } else {
      const validPlatforms: SocialPlatform[] = [
        'twitter',
        'instagram',
        'tiktok',
        'facebook',
        'youtube',
        'discord',
        'threads',
        'other',
      ];
      const invalidPlatforms = input.platforms.filter(p => !validPlatforms.includes(p));
      if (invalidPlatforms.length > 0) {
        errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
      }
    }
  }

  // ステータス
  if (input.status !== undefined) {
    const validStatuses: PostStatus[] = ['draft', 'scheduled', 'posting', 'posted', 'failed'];
    if (!validStatuses.includes(input.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // スケジュール日時
  if (input.scheduledAt !== undefined && !(input.scheduledAt instanceof Date)) {
    errors.push('scheduledAt must be a Date object');
  }

  if (errors.length > 0) {
    throw new ValidationError('SocialPost update validation failed', undefined, errors);
  }
}
