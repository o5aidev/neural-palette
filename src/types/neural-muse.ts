/**
 * Neural Muse 型定義
 *
 * Phase 4: AI創作支援システム
 */

/**
 * 創作タイプ
 */
export type CreativeType =
  | 'lyrics'           // 歌詞
  | 'melody'           // メロディ
  | 'artwork'          // アートワーク
  | 'concept'          // コンセプト
  | 'story'            // ストーリー
  | 'video_concept'    // ビデオコンセプト
  | 'social_post'      // SNS投稿
  | 'other';           // その他

/**
 * セッションステータス
 */
export type SessionStatus =
  | 'active'           // アクティブ
  | 'paused'           // 一時停止
  | 'completed'        // 完了
  | 'archived';        // アーカイブ済み

/**
 * 生成パラメータ
 */
export interface GenerationParams {
  temperature?: number;        // 0-1: 創造性レベル
  maxTokens?: number;          // 最大トークン数
  topP?: number;               // 0-1: サンプリング確率
  frequencyPenalty?: number;   // -2 to 2: 繰り返しペナルティ
  presencePenalty?: number;    // -2 to 2: 新規トピックペナルティ
  style?: string;              // スタイル指定
  mood?: string;               // ムード指定
  theme?: string;              // テーマ指定
}

/**
 * AI生成結果
 */
export interface GenerationResult {
  id: string;
  sessionId: string;
  type: CreativeType;
  prompt: string;
  result: string;
  params: GenerationParams;

  // メタデータ
  tokensUsed: number;
  model: string;
  confidence?: number;         // 0-100: AI信頼度

  // ユーザーフィードバック
  rating?: number;             // 1-5
  feedback?: string;
  isSelected: boolean;         // 採用フラグ

  // タイムスタンプ
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 創作セッション
 */
export interface CreativeSession {
  id: string;
  artistId: string;
  contentId?: string;          // 関連コンテンツ

  // セッション情報
  title: string;
  type: CreativeType;
  status: SessionStatus;
  description?: string;

  // AI設定
  defaultParams: GenerationParams;

  // 進捗
  generations: GenerationResult[];
  totalGenerations: number;
  selectedCount: number;

  // タイムスタンプ
  startedAt: Date;
  lastActiveAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * インスピレーション
 */
export interface Inspiration {
  id: string;
  artistId: string;
  sessionId?: string;

  // インスピレーション内容
  title: string;
  content: string;
  type: CreativeType;
  source?: string;             // 参照元
  tags: string[];

  // 活用状況
  usedInContent?: string[];    // 使用されたコンテンツID

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
}

/**
 * テンプレート
 */
export interface PromptTemplate {
  id: string;
  artistId?: string;           // nullの場合は共有テンプレート
  name: string;
  description?: string;
  type: CreativeType;

  // テンプレート内容
  template: string;            // プレースホルダー付きプロンプト
  variables: string[];         // 必要な変数リスト
  exampleValues?: Record<string, string>; // 変数の例

  // デフォルト設定
  defaultParams: GenerationParams;

  // 使用統計
  usageCount: number;
  avgRating?: number;

  // メタ
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 創作セッション作成入力
 */
export interface CreateCreativeSessionInput {
  artistId: string;
  contentId?: string;
  title: string;
  type: CreativeType;
  description?: string;
  defaultParams?: GenerationParams;
}

/**
 * 創作セッション更新入力
 */
export interface UpdateCreativeSessionInput {
  title?: string;
  status?: SessionStatus;
  description?: string;
  defaultParams?: GenerationParams;
}

/**
 * AI生成リクエスト
 */
export interface GenerateRequest {
  sessionId: string;
  type: CreativeType;
  prompt: string;
  params?: GenerationParams;
  contextIds?: string[];       // 参照する過去の生成結果ID
}

/**
 * インスピレーション作成入力
 */
export interface CreateInspirationInput {
  artistId: string;
  sessionId?: string;
  title: string;
  content: string;
  type: CreativeType;
  source?: string;
  tags?: string[];
}

/**
 * テンプレート作成入力
 */
export interface CreatePromptTemplateInput {
  artistId?: string;
  name: string;
  description?: string;
  type: CreativeType;
  template: string;
  variables: string[];
  exampleValues?: Record<string, string>;
  defaultParams?: GenerationParams;
  isPublic?: boolean;
  tags?: string[];
}

/**
 * セッションフィルター
 */
export interface CreativeSessionFilter {
  artistId?: string;
  contentId?: string;
  type?: CreativeType;
  status?: SessionStatus;
}

/**
 * インスピレーションフィルター
 */
export interface InspirationFilter {
  artistId?: string;
  sessionId?: string;
  type?: CreativeType;
  tags?: string[];
}

/**
 * 創作統計
 */
export interface CreativeStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalGenerations: number;
  avgGenerationsPerSession: number;
  byType: Record<CreativeType, number>;
  topRatedGenerations: GenerationResult[];
  recentSessions: CreativeSession[];
}
