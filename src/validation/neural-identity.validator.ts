/**
 * Neural Identity バリデーター
 *
 * ArtistDNAデータの検証を行う
 */

import type {
  ArtistDNA,
  CreateArtistDNAInput,
  UpdateArtistDNAInput,
  Milestone,
  CommunicationTone,
  EmojiUsage,
  ResponseLength,
  MilestoneType
} from '../types/neural-identity.js';

/**
 * バリデーションエラー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public errors: string[] = []
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * HEXカラーコードの検証
 */
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * 重要度（1-10）の検証
 */
function isValidSignificance(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 10;
}

/**
 * Milestoneの検証
 */
export function validateMilestone(milestone: Milestone): void {
  const errors: string[] = [];

  if (!milestone.id || milestone.id.trim() === '') {
    errors.push('Milestone ID is required');
  }

  if (!(milestone.date instanceof Date) || isNaN(milestone.date.getTime())) {
    errors.push('Valid date is required');
  }

  if (!milestone.title || milestone.title.trim() === '') {
    errors.push('Milestone title is required');
  }

  if (!milestone.description || milestone.description.trim() === '') {
    errors.push('Milestone description is required');
  }

  const validTypes: MilestoneType[] = ['release', 'concert', 'collaboration', 'award', 'other'];
  if (!validTypes.includes(milestone.type)) {
    errors.push(`Invalid milestone type. Must be one of: ${validTypes.join(', ')}`);
  }

  if (!isValidSignificance(milestone.significance)) {
    errors.push('Significance must be an integer between 1 and 10');
  }

  if (errors.length > 0) {
    throw new ValidationError('Milestone validation failed', 'milestone', errors);
  }
}

/**
 * CreateArtistDNAInputの検証
 */
export function validateCreateArtistDNAInput(input: CreateArtistDNAInput): void {
  const errors: string[] = [];

  // 基本情報の検証
  if (!input.name || input.name.trim() === '') {
    errors.push('Artist name is required');
  }

  if (!input.bio || input.bio.trim() === '') {
    errors.push('Bio is required');
  }

  // 創作スタイルの検証
  if (!Array.isArray(input.creativeStyle.visualThemes)) {
    errors.push('visualThemes must be an array');
  }

  if (!Array.isArray(input.creativeStyle.musicGenres)) {
    errors.push('musicGenres must be an array');
  }

  if (!input.creativeStyle.writingStyle || input.creativeStyle.writingStyle.trim() === '') {
    errors.push('writingStyle is required');
  }

  if (!Array.isArray(input.creativeStyle.colorPalette)) {
    errors.push('colorPalette must be an array');
  } else {
    const invalidColors = input.creativeStyle.colorPalette.filter(color => !isValidHexColor(color));
    if (invalidColors.length > 0) {
      errors.push(`Invalid HEX colors: ${invalidColors.join(', ')}. Format: #RRGGBB`);
    }
  }

  // コミュニケーションスタイルの検証
  const validTones: CommunicationTone[] = ['friendly', 'professional', 'casual', 'inspiring'];
  if (!validTones.includes(input.communicationStyle.tone)) {
    errors.push(`Invalid tone. Must be one of: ${validTones.join(', ')}`);
  }

  const validEmojiUsages: EmojiUsage[] = ['high', 'medium', 'low'];
  if (!validEmojiUsages.includes(input.communicationStyle.emojiUsage)) {
    errors.push(`Invalid emojiUsage. Must be one of: ${validEmojiUsages.join(', ')}`);
  }

  const validResponseLengths: ResponseLength[] = ['brief', 'moderate', 'detailed'];
  if (!validResponseLengths.includes(input.communicationStyle.responseLength)) {
    errors.push(`Invalid responseLength. Must be one of: ${validResponseLengths.join(', ')}`);
  }

  if (!Array.isArray(input.communicationStyle.languagePreferences)) {
    errors.push('languagePreferences must be an array');
  }

  // 価値観の検証
  if (!Array.isArray(input.values.coreValues)) {
    errors.push('coreValues must be an array');
  } else if (input.values.coreValues.length === 0) {
    errors.push('At least one core value is required');
  }

  if (!input.values.artisticVision || input.values.artisticVision.trim() === '') {
    errors.push('artisticVision is required');
  }

  if (!input.values.fanRelationshipPhilosophy || input.values.fanRelationshipPhilosophy.trim() === '') {
    errors.push('fanRelationshipPhilosophy is required');
  }

  // マイルストーンの検証
  if (!Array.isArray(input.milestones)) {
    errors.push('milestones must be an array');
  } else {
    input.milestones.forEach((milestone, index) => {
      try {
        validateMilestone(milestone);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Milestone[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('ArtistDNA validation failed', undefined, errors);
  }
}

/**
 * UpdateArtistDNAInputの検証（部分更新）
 */
export function validateUpdateArtistDNAInput(input: UpdateArtistDNAInput): void {
  const errors: string[] = [];

  // 提供されたフィールドのみ検証
  if (input.name !== undefined && input.name.trim() === '') {
    errors.push('Artist name cannot be empty');
  }

  if (input.bio !== undefined && input.bio.trim() === '') {
    errors.push('Bio cannot be empty');
  }

  if (input.creativeStyle) {
    if (input.creativeStyle.colorPalette) {
      const invalidColors = input.creativeStyle.colorPalette.filter(color => !isValidHexColor(color));
      if (invalidColors.length > 0) {
        errors.push(`Invalid HEX colors: ${invalidColors.join(', ')}`);
      }
    }
  }

  if (input.communicationStyle) {
    if (input.communicationStyle.tone) {
      const validTones: CommunicationTone[] = ['friendly', 'professional', 'casual', 'inspiring'];
      if (!validTones.includes(input.communicationStyle.tone)) {
        errors.push(`Invalid tone. Must be one of: ${validTones.join(', ')}`);
      }
    }
  }

  if (input.values) {
    if (input.values.coreValues && input.values.coreValues.length === 0) {
      errors.push('coreValues cannot be empty array');
    }
  }

  if (input.milestones) {
    input.milestones.forEach((milestone, index) => {
      try {
        validateMilestone(milestone);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Milestone[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Update validation failed', undefined, errors);
  }
}
