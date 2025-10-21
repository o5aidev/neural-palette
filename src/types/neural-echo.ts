/**
 * Neural Echo 型定義
 *
 * Phase 4: ファン交流AIシステム
 */

/**
 * 会話チャネル
 */
export type ConversationChannel =
  | 'direct_message'   // DM
  | 'comment'          // コメント
  | 'live_chat'        // ライブチャット
  | 'email'            // メール
  | 'chatbot'          // Webチャットボット
  | 'other';           // その他

/**
 * 感情タイプ
 */
export type SentimentType =
  | 'positive'         // ポジティブ
  | 'neutral'          // 中立
  | 'negative'         // ネガティブ
  | 'excited'          // 興奮
  | 'curious'          // 好奇心
  | 'supportive'       // 応援
  | 'critical';        // 批判的

/**
 * 応答ステータス
 */
export type ResponseStatus =
  | 'pending'          // 保留中
  | 'generated'        // 生成済み
  | 'reviewed'         // レビュー済み
  | 'approved'         // 承認済み
  | 'sent'             // 送信済み
  | 'rejected';        // 却下

/**
 * 会話優先度
 */
export type ConversationPriority =
  | 'urgent'           // 緊急
  | 'high'             // 高
  | 'normal'           // 通常
  | 'low';             // 低

/**
 * ファンプロファイル
 */
export interface FanProfile {
  id: string;
  artistId: string;

  // ファン情報
  displayName: string;
  externalId?: string;         // 外部プラットフォームのID
  platform?: string;
  email?: string;

  // 交流履歴
  firstInteractionAt: Date;
  lastInteractionAt: Date;
  totalInteractions: number;

  // 分析データ
  sentimentHistory: SentimentType[];
  avgSentiment: SentimentType;
  topics: string[];            // 興味のあるトピック
  preferredChannel?: ConversationChannel;

  // エンゲージメント
  isVIP: boolean;              // VIPフラグ
  engagementScore: number;     // 0-100

  // メタ
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 会話スレッド
 */
export interface ConversationThread {
  id: string;
  artistId: string;
  fanId: string;

  // スレッド情報
  channel: ConversationChannel;
  subject?: string;
  status: ResponseStatus;
  priority: ConversationPriority;

  // メッセージ
  messages: Message[];
  messageCount: number;

  // 分析
  sentiment: SentimentType;
  topics: string[];
  requiresHumanReview: boolean;

  // タイムスタンプ
  startedAt: Date;
  lastMessageAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * メッセージ
 */
export interface Message {
  id: string;
  threadId: string;
  role: 'fan' | 'ai' | 'artist'; // 送信者

  // メッセージ内容
  content: string;
  sentiment?: SentimentType;
  confidence?: number;         // 0-100: AI信頼度

  // AI生成情報（AIメッセージの場合）
  generatedPrompt?: string;
  model?: string;
  tokensUsed?: number;

  // フィードバック
  rating?: number;             // 1-5
  wasEdited: boolean;
  editedContent?: string;
  rejectionReason?: string;

  // メタ
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * 応答テンプレート
 */
export interface ResponseTemplate {
  id: string;
  artistId?: string;           // nullの場合は共有テンプレート

  // テンプレート情報
  name: string;
  description?: string;
  category: string;
  template: string;
  variables: string[];

  // 使用条件
  triggerKeywords?: string[];  // トリガーとなるキーワード
  sentiment?: SentimentType;   // 適用する感情
  channel?: ConversationChannel;

  // 使用統計
  usageCount: number;
  avgRating?: number;

  // メタ
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI応答設定
 */
export interface ResponseConfig {
  id: string;
  artistId: string;

  // 基本設定
  isEnabled: boolean;
  autoApprove: boolean;        // 自動承認
  autoSend: boolean;           // 自動送信

  // フィルター
  minConfidence: number;       // 最小信頼度（0-100）
  channelSettings: Record<ConversationChannel, {
    enabled: boolean;
    autoApprove: boolean;
    requireReview: boolean;
  }>;

  // 応答スタイル
  tone: string;                // 'friendly', 'professional', 'casual', etc.
  maxResponseLength: number;
  useEmojis: boolean;

  // レート制限
  maxResponsesPerDay?: number;
  maxResponsesPerFan?: number;

  // 通知
  notifyOnNewMessage: boolean;
  notifyEmail?: string;

  // メタ
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * ファンプロファイル作成入力
 */
export interface CreateFanProfileInput {
  artistId: string;
  displayName: string;
  externalId?: string;
  platform?: string;
  email?: string;
  tags?: string[];
}

/**
 * 会話スレッド作成入力
 */
export interface CreateConversationThreadInput {
  artistId: string;
  fanId: string;
  channel: ConversationChannel;
  subject?: string;
  priority?: ConversationPriority;
  initialMessage: string;
}

/**
 * メッセージ追加入力
 */
export interface AddMessageInput {
  threadId: string;
  role: 'fan' | 'ai' | 'artist';
  content: string;
  sentiment?: SentimentType;
  metadata?: Record<string, any>;
}

/**
 * AI応答生成リクエスト
 */
export interface GenerateResponseRequest {
  threadId: string;
  fanMessage: string;
  context?: {
    previousMessages?: Message[];
    fanProfile?: FanProfile;
    artistDNA?: any;           // Artist DNA情報
  };
  overrideConfig?: Partial<ResponseConfig>;
}

/**
 * 応答テンプレート作成入力
 */
export interface CreateResponseTemplateInput {
  artistId?: string;
  name: string;
  description?: string;
  category: string;
  template: string;
  variables: string[];
  triggerKeywords?: string[];
  sentiment?: SentimentType;
  channel?: ConversationChannel;
  tags?: string[];
}

/**
 * スレッドフィルター
 */
export interface ConversationThreadFilter {
  artistId?: string;
  fanId?: string;
  channel?: ConversationChannel;
  status?: ResponseStatus;
  priority?: ConversationPriority;
  sentiment?: SentimentType;
  requiresReview?: boolean;
}

/**
 * ファンフィルター
 */
export interface FanProfileFilter {
  artistId?: string;
  platform?: string;
  isVIP?: boolean;
  minEngagementScore?: number;
  tags?: string[];
}

/**
 * 交流統計
 */
export interface EchoStats {
  totalFans: number;
  vipFans: number;
  totalThreads: number;
  activeThreads: number;
  totalMessages: number;
  aiResponsesGenerated: number;
  aiResponsesApproved: number;
  avgResponseTime: number;      // 秒
  avgConfidence: number;         // 0-100
  sentimentBreakdown: Record<SentimentType, number>;
  channelBreakdown: Record<ConversationChannel, number>;
  topFans: FanProfile[];
  recentThreads: ConversationThread[];
}
