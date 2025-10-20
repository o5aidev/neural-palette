/**
 * Neural Muse バリデーター
 *
 * AI創作支援データの検証を行う
 */

import type {
  CreateCreativeSessionInput,
  UpdateCreativeSessionInput,
  GenerateRequest,
  CreateInspirationInput,
  CreatePromptTemplateInput,
  CreativeType,
  SessionStatus,
  GenerationParams,
} from '../types/neural-muse.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * 創作タイプの検証
 */
function isValidCreativeType(type: string): type is CreativeType {
  const validTypes: CreativeType[] = [
    'lyrics',
    'melody',
    'artwork',
    'concept',
    'story',
    'video_concept',
    'social_post',
    'other',
  ];
  return validTypes.includes(type as CreativeType);
}

/**
 * セッションステータスの検証
 */
function isValidSessionStatus(status: string): status is SessionStatus {
  const validStatuses: SessionStatus[] = ['active', 'paused', 'completed', 'archived'];
  return validStatuses.includes(status as SessionStatus);
}

/**
 * 生成パラメータの検証
 */
function validateGenerationParams(params: GenerationParams): string[] {
  const errors: string[] = [];

  if (params.temperature !== undefined) {
    if (typeof params.temperature !== 'number' || params.temperature < 0 || params.temperature > 1) {
      errors.push('temperature must be a number between 0 and 1');
    }
  }

  if (params.maxTokens !== undefined) {
    if (!Number.isInteger(params.maxTokens) || params.maxTokens <= 0) {
      errors.push('maxTokens must be a positive integer');
    }
  }

  if (params.topP !== undefined) {
    if (typeof params.topP !== 'number' || params.topP < 0 || params.topP > 1) {
      errors.push('topP must be a number between 0 and 1');
    }
  }

  if (params.frequencyPenalty !== undefined) {
    if (typeof params.frequencyPenalty !== 'number' || params.frequencyPenalty < -2 || params.frequencyPenalty > 2) {
      errors.push('frequencyPenalty must be a number between -2 and 2');
    }
  }

  if (params.presencePenalty !== undefined) {
    if (typeof params.presencePenalty !== 'number' || params.presencePenalty < -2 || params.presencePenalty > 2) {
      errors.push('presencePenalty must be a number between -2 and 2');
    }
  }

  return errors;
}

/**
 * 創作セッション作成入力の検証
 */
export function validateCreateCreativeSessionInput(input: CreateCreativeSessionInput): void {
  const errors: string[] = [];

  // 必須フィールド
  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.title || input.title.trim() === '') {
    errors.push('title is required');
  }

  if (!isValidCreativeType(input.type)) {
    errors.push('Invalid type. Must be one of: lyrics, melody, artwork, concept, story, video_concept, social_post, other');
  }

  // defaultParams
  if (input.defaultParams) {
    const paramErrors = validateGenerationParams(input.defaultParams);
    errors.push(...paramErrors);
  }

  if (errors.length > 0) {
    throw new ValidationError('CreativeSession validation failed', undefined, errors);
  }
}

/**
 * 創作セッション更新入力の検証
 */
export function validateUpdateCreativeSessionInput(input: UpdateCreativeSessionInput): void {
  const errors: string[] = [];

  if (input.title !== undefined && input.title.trim() === '') {
    errors.push('title cannot be empty');
  }

  if (input.status !== undefined && !isValidSessionStatus(input.status)) {
    errors.push('Invalid status. Must be one of: active, paused, completed, archived');
  }

  if (input.defaultParams !== undefined) {
    const paramErrors = validateGenerationParams(input.defaultParams);
    errors.push(...paramErrors);
  }

  if (errors.length > 0) {
    throw new ValidationError('CreativeSession update validation failed', undefined, errors);
  }
}

/**
 * AI生成リクエストの検証
 */
export function validateGenerateRequest(input: GenerateRequest): void {
  const errors: string[] = [];

  if (!input.sessionId || input.sessionId.trim() === '') {
    errors.push('sessionId is required');
  }

  if (!isValidCreativeType(input.type)) {
    errors.push('Invalid type. Must be one of: lyrics, melody, artwork, concept, story, video_concept, social_post, other');
  }

  if (!input.prompt || input.prompt.trim() === '') {
    errors.push('prompt is required');
  }

  if (input.params) {
    const paramErrors = validateGenerationParams(input.params);
    errors.push(...paramErrors);
  }

  if (input.contextIds && !Array.isArray(input.contextIds)) {
    errors.push('contextIds must be an array');
  }

  if (errors.length > 0) {
    throw new ValidationError('GenerateRequest validation failed', undefined, errors);
  }
}

/**
 * インスピレーション作成入力の検証
 */
export function validateCreateInspirationInput(input: CreateInspirationInput): void {
  const errors: string[] = [];

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.title || input.title.trim() === '') {
    errors.push('title is required');
  }

  if (!input.content || input.content.trim() === '') {
    errors.push('content is required');
  }

  if (!isValidCreativeType(input.type)) {
    errors.push('Invalid type. Must be one of: lyrics, melody, artwork, concept, story, video_concept, social_post, other');
  }

  if (input.tags && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  if (errors.length > 0) {
    throw new ValidationError('Inspiration validation failed', undefined, errors);
  }
}

/**
 * プロンプトテンプレート作成入力の検証
 */
export function validateCreatePromptTemplateInput(input: CreatePromptTemplateInput): void {
  const errors: string[] = [];

  if (!input.name || input.name.trim() === '') {
    errors.push('name is required');
  }

  if (!isValidCreativeType(input.type)) {
    errors.push('Invalid type. Must be one of: lyrics, melody, artwork, concept, story, video_concept, social_post, other');
  }

  if (!input.template || input.template.trim() === '') {
    errors.push('template is required');
  }

  if (!Array.isArray(input.variables)) {
    errors.push('variables must be an array');
  }

  if (input.exampleValues && typeof input.exampleValues !== 'object') {
    errors.push('exampleValues must be an object');
  }

  if (input.defaultParams) {
    const paramErrors = validateGenerationParams(input.defaultParams);
    errors.push(...paramErrors);
  }

  if (input.tags && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  if (errors.length > 0) {
    throw new ValidationError('PromptTemplate validation failed', undefined, errors);
  }
}
