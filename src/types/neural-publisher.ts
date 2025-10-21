/**
 * Neural Publisher 型定義
 *
 * Phase 3: 配信管理システム
 */

/**
 * 配信プラットフォーム
 */
export type DistributionPlatform =
  | 'spotify'
  | 'apple_music'
  | 'youtube_music'
  | 'amazon_music'
  | 'soundcloud'
  | 'bandcamp'
  | 'tidal'
  | 'other';

/**
 * 配信ステータス
 */
export type DistributionStatus =
  | 'draft'           // 下書き
  | 'scheduled'       // スケジュール済み
  | 'in_review'       // レビュー中
  | 'approved'        // 承認済み
  | 'publishing'      // 配信中
  | 'published'       // 配信完了
  | 'failed'          // 配信失敗
  | 'cancelled';      // キャンセル

/**
 * プラットフォーム設定
 */
export interface PlatformConfig {
  platform: DistributionPlatform;
  enabled: boolean;
  metadata?: Record<string, any>;  // プラットフォーム固有のメタデータ
  releaseDate?: Date;               // プラットフォーム別リリース日
}

/**
 * 配信設定
 */
export interface Distribution {
  id: string;
  contentId: string;              // 配信するコンテンツID
  artistId: string;                // アーティストID
  title: string;
  status: DistributionStatus;
  platforms: PlatformConfig[];

  // スケジューリング
  scheduledDate?: Date;            // 配信予定日
  publishedDate?: Date;            // 実際の配信日

  // メタデータ
  description?: string;
  tags: string[];
  isExplicit: boolean;             // 露骨な表現を含むか

  // 配信履歴
  distributionHistory: DistributionEvent[];

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * 配信イベント
 */
export interface DistributionEvent {
  id: string;
  distributionId: string;
  platform?: DistributionPlatform;
  eventType: DistributionEventType;
  status: DistributionStatus;
  message?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * 配信イベントタイプ
 */
export type DistributionEventType =
  | 'created'
  | 'scheduled'
  | 'submitted'
  | 'approved'
  | 'published'
  | 'failed'
  | 'cancelled'
  | 'updated';

/**
 * 配信作成入力
 */
export interface CreateDistributionInput {
  contentId: string;
  artistId: string;
  title: string;
  platforms: PlatformConfig[];
  scheduledDate?: Date;
  description?: string;
  tags?: string[];
  isExplicit?: boolean;
}

/**
 * 配信更新入力
 */
export interface UpdateDistributionInput {
  title?: string;
  status?: DistributionStatus;
  platforms?: PlatformConfig[];
  scheduledDate?: Date;
  publishedDate?: Date;
  description?: string;
  tags?: string[];
  isExplicit?: boolean;
}

/**
 * 配信フィルター
 */
export interface DistributionFilter {
  artistId?: string;
  contentId?: string;
  status?: DistributionStatus;
  platform?: DistributionPlatform;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * 配信統計
 */
export interface DistributionStats {
  totalDistributions: number;
  byStatus: Record<DistributionStatus, number>;
  byPlatform: Record<DistributionPlatform, number>;
  scheduledCount: number;
  publishedCount: number;
  failedCount: number;
}
