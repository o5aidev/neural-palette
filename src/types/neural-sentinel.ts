/**
 * Neural Sentinel 型定義
 *
 * Phase 3: 権利保護システム
 */

/**
 * 権利タイプ
 */
export type RightType =
  | 'copyright'      // 著作権
  | 'trademark'      // 商標権
  | 'performance'    // 実演権
  | 'mechanical'     // 機械的複製権
  | 'synchronization' // 同期権
  | 'master'         // 原盤権
  | 'publishing';    // 出版権

/**
 * ライセンスタイプ
 */
export type LicenseType =
  | 'exclusive'      // 独占的
  | 'non_exclusive'  // 非独占的
  | 'creative_commons' // クリエイティブ・コモンズ
  | 'royalty_free'   // ロイヤリティフリー
  | 'custom';        // カスタム

/**
 * 侵害ステータス
 */
export type InfringementStatus =
  | 'detected'       // 検出
  | 'investigating'  // 調査中
  | 'confirmed'      // 確認済み
  | 'disputed'       // 異議申し立て中
  | 'resolved'       // 解決済み
  | 'dismissed';     // 却下

/**
 * アクションタイプ
 */
export type ActionType =
  | 'takedown'       // 削除要請
  | 'monetize'       // 収益化
  | 'track'          // 追跡のみ
  | 'legal';         // 法的措置

/**
 * 権利情報
 */
export interface Right {
  id: string;
  contentId: string;
  artistId: string;

  // 権利詳細
  rightType: RightType;
  rightHolder: string;          // 権利者名
  rightHolderContact?: string;  // 連絡先

  // ライセンス情報
  licenseType: LicenseType;
  licenseTerms?: string;

  // 有効期間
  startDate: Date;
  endDate?: Date;               // 期限がない場合はundefined

  // 地域制限
  territories: string[];        // ISO国コード ['JP', 'US', 'GB']

  // メタデータ
  registrationNumber?: string;  // 登録番号
  isrcCode?: string;            // ISRC（音源コード）
  iswcCode?: string;            // ISWC（楽曲コード）

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * 侵害検知
 */
export interface Infringement {
  id: string;
  rightId: string;
  contentId: string;
  artistId: string;

  // 侵害詳細
  status: InfringementStatus;
  detectedUrl: string;
  detectedPlatform: string;
  description: string;

  // 検出情報
  detectedAt: Date;
  detectionMethod: string;      // 'manual' | 'automated' | 'user_report'
  confidence: number;           // 0-100の信頼度

  // アクション
  recommendedAction: ActionType;
  actionTaken?: ActionType;
  actionDate?: Date;
  actionNotes?: string;

  // 解決情報
  resolvedAt?: Date;
  resolution?: string;

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

/**
 * 監視ルール
 */
export interface MonitoringRule {
  id: string;
  artistId: string;
  name: string;
  isActive: boolean;

  // 監視対象
  contentIds: string[];
  platforms: string[];
  keywords: string[];

  // アクション設定
  autoAction?: ActionType;
  notifyEmail?: string;

  // 統計
  lastRunAt?: Date;
  totalDetections: number;

  // タイムスタンプ
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 権利作成入力
 */
export interface CreateRightInput {
  contentId: string;
  artistId: string;
  rightType: RightType;
  rightHolder: string;
  rightHolderContact?: string;
  licenseType: LicenseType;
  licenseTerms?: string;
  startDate: Date;
  endDate?: Date;
  territories?: string[];
  registrationNumber?: string;
  isrcCode?: string;
  iswcCode?: string;
}

/**
 * 権利更新入力
 */
export interface UpdateRightInput {
  rightHolder?: string;
  rightHolderContact?: string;
  licenseType?: LicenseType;
  licenseTerms?: string;
  startDate?: Date;
  endDate?: Date;
  territories?: string[];
  registrationNumber?: string;
  isrcCode?: string;
  iswcCode?: string;
}

/**
 * 侵害作成入力
 */
export interface CreateInfringementInput {
  rightId: string;
  contentId: string;
  artistId: string;
  detectedUrl: string;
  detectedPlatform: string;
  description: string;
  detectionMethod: string;
  confidence: number;
  recommendedAction: ActionType;
}

/**
 * 侵害更新入力
 */
export interface UpdateInfringementInput {
  status?: InfringementStatus;
  description?: string;
  actionTaken?: ActionType;
  actionDate?: Date;
  actionNotes?: string;
  resolvedAt?: Date;
  resolution?: string;
}

/**
 * 監視ルール作成入力
 */
export interface CreateMonitoringRuleInput {
  artistId: string;
  name: string;
  contentIds: string[];
  platforms: string[];
  keywords: string[];
  autoAction?: ActionType;
  notifyEmail?: string;
}

/**
 * 権利フィルター
 */
export interface RightFilter {
  artistId?: string;
  contentId?: string;
  rightType?: RightType;
  licenseType?: LicenseType;
}

/**
 * 侵害フィルター
 */
export interface InfringementFilter {
  artistId?: string;
  contentId?: string;
  rightId?: string;
  status?: InfringementStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * 権利保護統計
 */
export interface ProtectionStats {
  totalRights: number;
  totalInfringements: number;
  activeInfringements: number;
  resolvedInfringements: number;
  byStatus: Record<InfringementStatus, number>;
  byAction: Record<ActionType, number>;
  averageResolutionTime: number; // 日数
}
