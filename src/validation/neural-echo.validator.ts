/**
 * Neural Echo バリデーター
 *
 * ファン交流AIデータの検証を行う
 */

import type {
  CreateFanProfileInput,
  CreateConversationThreadInput,
  AddMessageInput,
  GenerateResponseRequest,
  CreateResponseTemplateInput,
  ConversationChannel,
  SentimentType,
  ConversationPriority,
} from '../types/neural-echo.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * 会話チャネルの検証
 */
function isValidConversationChannel(channel: string): channel is ConversationChannel {
  const validChannels: ConversationChannel[] = [
    'direct_message',
    'comment',
    'live_chat',
    'email',
    'chatbot',
    'other',
  ];
  return validChannels.includes(channel as ConversationChannel);
}

/**
 * 感情タイプの検証
 */
function isValidSentimentType(sentiment: string): sentiment is SentimentType {
  const validSentiments: SentimentType[] = [
    'positive',
    'neutral',
    'negative',
    'excited',
    'curious',
    'supportive',
    'critical',
  ];
  return validSentiments.includes(sentiment as SentimentType);
}

/**
 * 会話優先度の検証
 */
function isValidConversationPriority(priority: string): priority is ConversationPriority {
  const validPriorities: ConversationPriority[] = ['urgent', 'high', 'normal', 'low'];
  return validPriorities.includes(priority as ConversationPriority);
}

/**
 * メッセージロールの検証
 */
function isValidMessageRole(role: string): boolean {
  return ['fan', 'ai', 'artist'].includes(role);
}

/**
 * エンゲージメントスコアの検証 (0-100)
 */
function isValidEngagementScore(score: number): boolean {
  return Number.isInteger(score) && score >= 0 && score <= 100;
}

/**
 * 信頼度スコアの検証 (0-100)
 */
function isValidConfidence(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 100;
}

/**
 * 評価の検証 (1-5)
 */
function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * ファンプロファイル作成入力の検証
 */
export function validateCreateFanProfileInput(input: CreateFanProfileInput): void {
  const errors: string[] = [];

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.displayName || input.displayName.trim() === '') {
    errors.push('displayName is required');
  }

  if (input.tags && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  if (errors.length > 0) {
    throw new ValidationError('FanProfile validation failed', undefined, errors);
  }
}

/**
 * 会話スレッド作成入力の検証
 */
export function validateCreateConversationThreadInput(input: CreateConversationThreadInput): void {
  const errors: string[] = [];

  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (!input.fanId || input.fanId.trim() === '') {
    errors.push('fanId is required');
  }

  if (!isValidConversationChannel(input.channel)) {
    errors.push('Invalid channel. Must be one of: direct_message, comment, live_chat, email, chatbot, other');
  }

  if (!input.initialMessage || input.initialMessage.trim() === '') {
    errors.push('initialMessage is required');
  }

  if (input.priority !== undefined && !isValidConversationPriority(input.priority)) {
    errors.push('Invalid priority. Must be one of: urgent, high, normal, low');
  }

  if (errors.length > 0) {
    throw new ValidationError('ConversationThread validation failed', undefined, errors);
  }
}

/**
 * メッセージ追加入力の検証
 */
export function validateAddMessageInput(input: AddMessageInput): void {
  const errors: string[] = [];

  if (!input.threadId || input.threadId.trim() === '') {
    errors.push('threadId is required');
  }

  if (!isValidMessageRole(input.role)) {
    errors.push('Invalid role. Must be one of: fan, ai, artist');
  }

  if (!input.content || input.content.trim() === '') {
    errors.push('content is required');
  }

  if (input.sentiment !== undefined && !isValidSentimentType(input.sentiment)) {
    errors.push('Invalid sentiment. Must be one of: positive, neutral, negative, excited, curious, supportive, critical');
  }

  if (errors.length > 0) {
    throw new ValidationError('Message validation failed', undefined, errors);
  }
}

/**
 * AI応答生成リクエストの検証
 */
export function validateGenerateResponseRequest(input: GenerateResponseRequest): void {
  const errors: string[] = [];

  if (!input.threadId || input.threadId.trim() === '') {
    errors.push('threadId is required');
  }

  if (!input.fanMessage || input.fanMessage.trim() === '') {
    errors.push('fanMessage is required');
  }

  // オプションのコンテキスト検証
  if (input.context) {
    if (input.context.previousMessages && !Array.isArray(input.context.previousMessages)) {
      errors.push('context.previousMessages must be an array');
    }
  }

  // オーバーライド設定の検証
  if (input.overrideConfig) {
    if (input.overrideConfig.minConfidence !== undefined && !isValidConfidence(input.overrideConfig.minConfidence)) {
      errors.push('overrideConfig.minConfidence must be an integer between 0 and 100');
    }

    if (input.overrideConfig.maxResponseLength !== undefined) {
      if (!Number.isInteger(input.overrideConfig.maxResponseLength) || input.overrideConfig.maxResponseLength <= 0) {
        errors.push('overrideConfig.maxResponseLength must be a positive integer');
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('GenerateResponseRequest validation failed', undefined, errors);
  }
}

/**
 * 応答テンプレート作成入力の検証
 */
export function validateCreateResponseTemplateInput(input: CreateResponseTemplateInput): void {
  const errors: string[] = [];

  if (!input.name || input.name.trim() === '') {
    errors.push('name is required');
  }

  if (!input.category || input.category.trim() === '') {
    errors.push('category is required');
  }

  if (!input.template || input.template.trim() === '') {
    errors.push('template is required');
  }

  if (!Array.isArray(input.variables)) {
    errors.push('variables must be an array');
  }

  if (input.triggerKeywords !== undefined && !Array.isArray(input.triggerKeywords)) {
    errors.push('triggerKeywords must be an array');
  }

  if (input.sentiment !== undefined && !isValidSentimentType(input.sentiment)) {
    errors.push('Invalid sentiment. Must be one of: positive, neutral, negative, excited, curious, supportive, critical');
  }

  if (input.channel !== undefined && !isValidConversationChannel(input.channel)) {
    errors.push('Invalid channel. Must be one of: direct_message, comment, live_chat, email, chatbot, other');
  }

  if (input.tags !== undefined && !Array.isArray(input.tags)) {
    errors.push('tags must be an array');
  }

  if (errors.length > 0) {
    throw new ValidationError('ResponseTemplate validation failed', undefined, errors);
  }
}

/**
 * 応答設定の検証
 */
export function validateResponseConfig(config: any): void {
  const errors: string[] = [];

  if (!config.artistId || config.artistId.trim() === '') {
    errors.push('artistId is required');
  }

  if (config.minConfidence !== undefined && !isValidConfidence(config.minConfidence)) {
    errors.push('minConfidence must be an integer between 0 and 100');
  }

  if (config.maxResponseLength !== undefined) {
    if (!Number.isInteger(config.maxResponseLength) || config.maxResponseLength <= 0) {
      errors.push('maxResponseLength must be a positive integer');
    }
  }

  if (config.maxResponsesPerDay !== undefined) {
    if (!Number.isInteger(config.maxResponsesPerDay) || config.maxResponsesPerDay <= 0) {
      errors.push('maxResponsesPerDay must be a positive integer');
    }
  }

  if (config.maxResponsesPerFan !== undefined) {
    if (!Number.isInteger(config.maxResponsesPerFan) || config.maxResponsesPerFan <= 0) {
      errors.push('maxResponsesPerFan must be a positive integer');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('ResponseConfig validation failed', undefined, errors);
  }
}
