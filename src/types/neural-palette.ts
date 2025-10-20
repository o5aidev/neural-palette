/**
 * Neural Palette - 制作支援システム
 *
 * アーティストの創作活動を支援するコンテンツ管理システム
 */

/**
 * コンテンツの種類
 */
export type ContentType = 'song' | 'album' | 'video' | 'artwork' | 'post' | 'other';

/**
 * コンテンツのステータス
 */
export type ContentStatus = 'draft' | 'in_progress' | 'review' | 'published' | 'archived';

/**
 * タグ
 */
export interface Tag {
  /** タグ名 */
  name: string;
  /** カテゴリ（オプション） */
  category?: string;
}

/**
 * メディアファイル
 */
export interface MediaFile {
  /** 一意識別子 */
  id: string;
  /** ファイル名 */
  filename: string;
  /** MIMEタイプ */
  mimeType: string;
  /** ファイルサイズ（バイト） */
  size: number;
  /** URL（Phase 1: ローカルパス、Phase 2: クラウドストレージURL） */
  url: string;
  /** サムネイルURL（オプション） */
  thumbnailUrl?: string;
  /** アップロード日時 */
  uploadedAt: Date;
}

/**
 * コラボレーター
 */
export interface Collaborator {
  /** 一意識別子 */
  id: string;
  /** 名前 */
  name: string;
  /** 役割 */
  role: string;
  /** メールアドレス（オプション） */
  email?: string;
}

/**
 * コンテンツメタデータ
 */
export interface ContentMetadata {
  /** ジャンル */
  genres?: string[];
  /** ムード */
  moods?: string[];
  /** テンポ（BPM） - 音楽用 */
  bpm?: number;
  /** キー - 音楽用 */
  key?: string;
  /** 尺（秒） - 動画/音楽用 */
  duration?: number;
  /** 解像度 - 画像/動画用 */
  resolution?: string;
  /** カスタムフィールド */
  custom?: Record<string, any>;
}

/**
 * コンテンツ
 *
 * アーティストが作成する全ての制作物
 */
export interface Content {
  /** 一意識別子 */
  id: string;
  /** アーティストID（Neural Identityへの参照） */
  artistId: string;
  /** タイトル */
  title: string;
  /** 説明 */
  description: string;
  /** コンテンツの種類 */
  type: ContentType;
  /** ステータス */
  status: ContentStatus;

  /** タグ */
  tags: Tag[];
  /** メディアファイル */
  mediaFiles: MediaFile[];
  /** コラボレーター */
  collaborators: Collaborator[];
  /** メタデータ */
  metadata: ContentMetadata;

  /** 公開日時（オプション） */
  publishedAt?: Date;
  /** 作成日時 */
  createdAt: Date;
  /** 最終更新日時 */
  updatedAt: Date;
  /** バージョン番号 */
  version: number;
}

/**
 * Content作成時の入力データ
 */
export type CreateContentInput = Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'version'>;

/**
 * Content更新時の入力データ（部分更新可能）
 */
export type UpdateContentInput = Partial<
  Omit<Content, 'id' | 'artistId' | 'createdAt' | 'updatedAt' | 'version'>
>;

/**
 * コンテンツ検索フィルター
 */
export interface ContentFilter {
  /** アーティストID */
  artistId?: string;
  /** コンテンツの種類 */
  type?: ContentType;
  /** ステータス */
  status?: ContentStatus;
  /** タグ名 */
  tags?: string[];
  /** タイトル/説明での検索 */
  search?: string;
}
