/**
 * Neural Sentinel バリデーター
 *
 * 権利保護データの検証を行う
 */

import type {
  CreateRightInput,
  UpdateRightInput,
  CreateInfringementInput,
  UpdateInfringementInput,
  CreateMonitoringRuleInput,
  RightType,
  LicenseType,
  InfringementStatus,
  ActionType,
} from '../types/neural-sentinel.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * ISO国コードの簡易検証
 */
function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code);
}

/**
 * 信頼度スコアの検証 (0-100)
 */
function isValidConfidence(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

/**
 * 権利作成入力の検証
 */
export function validateCreateRightInput(input: CreateRightInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.contentId || input.contentId.trim() === '') {
    errors.push('contentId is required');
  }

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  // 権利タイプ
  const validRightTypes: RightType[] = [
    'copyright',
    'trademark',
    'performance',
    'mechanical',
    'synchronization',
    'master',
    'publishing',
  ];
  if (!validRightTypes.includes(input.rightType)) {
    errors.push(`Invalid rightType. Must be one of: ${validRightTypes.join(', ')}`);
  }

  if (!input.rightHolder || input.rightHolder.trim() === '') {
    errors.push('rightHolder is required');
  }

  // ライセンスタイプ
  const validLicenseTypes: LicenseType[] = [
    'exclusive',
    'non_exclusive',
    'creative_commons',
    'royalty_free',
    'custom',
  ];
  if (!validLicenseTypes.includes(input.licenseType)) {
    errors.push(`Invalid licenseType. Must be one of: ${validLicenseTypes.join(', ')}`);
  }

  // 日付
  if (!(input.startDate instanceof Date)) {
    errors.push('startDate must be a Date object');
  }

  if (input.endDate && !(input.endDate instanceof Date)) {
    errors.push('endDate must be a Date object');
  }

  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    errors.push('endDate must be after startDate');
  }

  // 地域
  if (input.territories) {
    if (!Array.isArray(input.territories)) {
      errors.push('territories must be an array');
    } else {
      const invalidCodes = input.territories.filter(code => !isValidCountryCode(code));
      if (invalidCodes.length > 0) {
        errors.push(`Invalid country codes: ${invalidCodes.join(', ')}. Must be ISO 3166-1 alpha-2 codes (e.g., JP, US, GB)`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Right validation failed', undefined, errors);
  }
}

/**
 * 権利更新入力の検証
 */
export function validateUpdateRightInput(input: UpdateRightInput): void {
  const errors: string[] = [];

  if (input.rightHolder !== undefined && input.rightHolder.trim() === '') {
    errors.push('rightHolder cannot be empty');
  }

  if (input.licenseType !== undefined) {
    const validLicenseTypes: LicenseType[] = [
      'exclusive',
      'non_exclusive',
      'creative_commons',
      'royalty_free',
      'custom',
    ];
    if (!validLicenseTypes.includes(input.licenseType)) {
      errors.push(`Invalid licenseType. Must be one of: ${validLicenseTypes.join(', ')}`);
    }
  }

  if (input.startDate !== undefined && !(input.startDate instanceof Date)) {
    errors.push('startDate must be a Date object');
  }

  if (input.endDate !== undefined && !(input.endDate instanceof Date)) {
    errors.push('endDate must be a Date object');
  }

  if (input.territories !== undefined) {
    if (!Array.isArray(input.territories)) {
      errors.push('territories must be an array');
    } else {
      const invalidCodes = input.territories.filter(code => !isValidCountryCode(code));
      if (invalidCodes.length > 0) {
        errors.push(`Invalid country codes: ${invalidCodes.join(', ')}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Right update validation failed', undefined, errors);
  }
}

/**
 * 侵害作成入力の検証
 */
export function validateCreateInfringementInput(input: CreateInfringementInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.rightId || input.rightId.trim() === '') {
    errors.push('rightId is required');
  }

  if (!input.contentId || input.contentId.trim() === '') {
    errors.push('contentId is required');
  }

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.detectedUrl || input.detectedUrl.trim() === '') {
    errors.push('detectedUrl is required');
  }

  if (!input.detectedPlatform || input.detectedPlatform.trim() === '') {
    errors.push('detectedPlatform is required');
  }

  if (!input.description || input.description.trim() === '') {
    errors.push('description is required');
  }

  if (!input.detectionMethod || input.detectionMethod.trim() === '') {
    errors.push('detectionMethod is required');
  }

  // 信頼度
  if (!isValidConfidence(input.confidence)) {
    errors.push('confidence must be an integer between 0 and 100');
  }

  // 推奨アクション
  const validActions: ActionType[] = ['takedown', 'monetize', 'track', 'legal'];
  if (!validActions.includes(input.recommendedAction)) {
    errors.push(`Invalid recommendedAction. Must be one of: ${validActions.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Infringement validation failed', undefined, errors);
  }
}

/**
 * 侵害更新入力の検証
 */
export function validateUpdateInfringementInput(input: UpdateInfringementInput): void {
  const errors: string[] = [];

  if (input.status !== undefined) {
    const validStatuses: InfringementStatus[] = [
      'detected',
      'investigating',
      'confirmed',
      'disputed',
      'resolved',
      'dismissed',
    ];
    if (!validStatuses.includes(input.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  if (input.actionTaken !== undefined) {
    const validActions: ActionType[] = ['takedown', 'monetize', 'track', 'legal'];
    if (!validActions.includes(input.actionTaken)) {
      errors.push(`Invalid actionTaken. Must be one of: ${validActions.join(', ')}`);
    }
  }

  if (input.actionDate !== undefined && !(input.actionDate instanceof Date)) {
    errors.push('actionDate must be a Date object');
  }

  if (input.resolvedAt !== undefined && !(input.resolvedAt instanceof Date)) {
    errors.push('resolvedAt must be a Date object');
  }

  if (errors.length > 0) {
    throw new ValidationError('Infringement update validation failed', undefined, errors);
  }
}

/**
 * 監視ルール作成入力の検証
 */
export function validateCreateMonitoringRuleInput(input: CreateMonitoringRuleInput): void {
  const errors: string[] = [];

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.name || input.name.trim() === '') {
    errors.push('name is required');
  }

  if (!Array.isArray(input.contentIds)) {
    errors.push('contentIds must be an array');
  } else if (input.contentIds.length === 0) {
    errors.push('At least one contentId is required');
  }

  if (!Array.isArray(input.platforms)) {
    errors.push('platforms must be an array');
  } else if (input.platforms.length === 0) {
    errors.push('At least one platform is required');
  }

  if (!Array.isArray(input.keywords)) {
    errors.push('keywords must be an array');
  } else if (input.keywords.length === 0) {
    errors.push('At least one keyword is required');
  }

  if (input.autoAction !== undefined) {
    const validActions: ActionType[] = ['takedown', 'monetize', 'track', 'legal'];
    if (!validActions.includes(input.autoAction)) {
      errors.push(`Invalid autoAction. Must be one of: ${validActions.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('MonitoringRule validation failed', undefined, errors);
  }
}
