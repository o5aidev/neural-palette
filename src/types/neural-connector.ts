/**
 * Neural Connector 型定義
 *
 * Phase 3: SNS連携システム
 */

/**
 * SNSプラットフォーム
 */
export type SocialPlatform =
  | 'twitter'      // Twitter/X
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'discord'
  | 'threads'
  | 'other';

/**
 * 投稿ステータス
 */
export type PostStatus =
  | 'draft'        // 下書き
  | 'scheduled'    // スケジュール済み
  | 'posting'      // 投稿中
  | 'posted'       // 投稿完了
  | 'failed';      // 投稿失敗

/**
 * 投稿タイプ
 */
export type PostType =
  | 'text'
  | 'image'
  | 'video'
  | 'link'
  | 'poll'
  | 'story';

/**
 * SNSアカウント連携
 */
export interface SocialConnection {
  id: string;
  artistId: string;
  platform: SocialPlatform;
  accountId: string;            // プラットフォームのアカウントID
  accountName: string;          // アカウント表示名
  isActive: boolean;

  // 認証情報（暗号化して保存）
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;

  // 統計
  followerCount?: number;
  lastSyncedAt?: Date;

  // タイムスタンプ
  connectedAt: Date;
  updatedAt: Date;
}

/**
 * SNS投稿
 */
export interface SocialPost {
  id: string;
  artistId: string;
  contentId?: string;           // 関連コンテンツID（オプション）

  // 投稿内容
  type: PostType;
  content: string;
  mediaUrls: string[];
  platforms: SocialPlatform[];  // クロスポスト対象プラットフォーム

  // スケジューリング
  status: PostStatus;
  scheduledAt?: Date;
  postedAt?: Date;

  // プラットフォーム別投稿結果
  platformPosts: PlatformPost[];

  // エンゲージメント
  engagementStats: EngagementStats;

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * プラットフォーム別投稿
 */
export interface PlatformPost {
  platform: SocialPlatform;
  postId?: string;              // プラットフォーム上の投稿ID
  url?: string;                 // 投稿URL
  status: PostStatus;
  postedAt?: Date;
  error?: string;
}

/**
 * エンゲージメント統計
 */
export interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clickThroughs: number;
  lastUpdatedAt: Date;
}

/**
 * SNSアカウント作成入力
 */
export interface CreateSocialConnectionInput {
  artistId: string;
  platform: SocialPlatform;
  accountId: string;
  accountName: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}

/**
 * SNS投稿作成入力
 */
export interface CreateSocialPostInput {
  artistId: string;
  contentId?: string;
  type: PostType;
  content: string;
  mediaUrls?: string[];
  platforms: SocialPlatform[];
  scheduledAt?: Date;
}

/**
 * SNS投稿更新入力
 */
export interface UpdateSocialPostInput {
  content?: string;
  mediaUrls?: string[];
  platforms?: SocialPlatform[];
  status?: PostStatus;
  scheduledAt?: Date;
}

/**
 * SNS接続フィルター
 */
export interface SocialConnectionFilter {
  artistId?: string;
  platform?: SocialPlatform;
  status?: ConnectionStatus;
}

/**
 * 投稿フィルター
 */
export interface SocialPostFilter {
  artistId?: string;
  contentId?: string;
  platform?: SocialPlatform;
  status?: PostStatus;
  type?: PostType;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * SNS統計
 */
export interface SocialStats {
  totalPosts: number;
  byPlatform: Record<SocialPlatform, number>;
  byStatus: Record<PostStatus, number>;
  totalEngagement: EngagementStats;
  topPerformingPosts: SocialPost[];
}
