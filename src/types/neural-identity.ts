/**
 * Neural Identity - アーティストDNA定義システム
 *
 * アーティストの全人格的情報を定義し、システムの「魂」として機能する
 */

/**
 * マイルストーンの種類
 */
export type MilestoneType = 'release' | 'concert' | 'collaboration' | 'award' | 'other';

/**
 * コミュニケーショントーン
 */
export type CommunicationTone = 'friendly' | 'professional' | 'casual' | 'inspiring';

/**
 * 絵文字使用頻度
 */
export type EmojiUsage = 'high' | 'medium' | 'low';

/**
 * 返信の長さ
 */
export type ResponseLength = 'brief' | 'moderate' | 'detailed';

/**
 * マイルストーン（活動履歴）
 */
export interface Milestone {
  /** 一意識別子 */
  id: string;
  /** 日付 */
  date: Date;
  /** タイトル */
  title: string;
  /** 詳細説明 */
  description: string;
  /** マイルストーンの種類 */
  type: MilestoneType;
  /** 重要度 (1-10) */
  significance: number;
}

/**
 * 創作スタイル
 */
export interface CreativeStyle {
  /** 視覚的テーマ */
  visualThemes: string[];
  /** 音楽ジャンル */
  musicGenres: string[];
  /** 文章スタイル */
  writingStyle: string;
  /** カラーパレット（HEX形式） */
  colorPalette: string[];
}

/**
 * コミュニケーションスタイル
 */
export interface CommunicationStyle {
  /** トーン */
  tone: CommunicationTone;
  /** 絵文字使用頻度 */
  emojiUsage: EmojiUsage;
  /** 返信の長さ */
  responseLength: ResponseLength;
  /** 使用言語の優先順位 */
  languagePreferences: string[];
}

/**
 * 価値観・哲学
 */
export interface Values {
  /** 核となる価値観 */
  coreValues: string[];
  /** アーティスティックビジョン */
  artisticVision: string;
  /** ファンとの関係性に対する哲学 */
  fanRelationshipPhilosophy: string;
}

/**
 * アーティストDNA
 *
 * Neural Paletteシステムの核となるデータ構造
 */
export interface ArtistDNA {
  /** 一意識別子 */
  id: string;
  /** アーティスト名 */
  name: string;
  /** 自己紹介・プロフィール */
  bio: string;

  /** 創作スタイル */
  creativeStyle: CreativeStyle;

  /** コミュニケーションスタイル */
  communicationStyle: CommunicationStyle;

  /** 価値観・哲学 */
  values: Values;

  /** 活動履歴（マイルストーン） */
  milestones: Milestone[];

  /** 作成日時 */
  createdAt: Date;
  /** 最終更新日時 */
  updatedAt: Date;
  /** バージョン番号 */
  version: number;
}

/**
 * ArtistDNA作成時の入力データ
 */
export type CreateArtistDNAInput = Omit<ArtistDNA, 'id' | 'createdAt' | 'updatedAt' | 'version'>;

/**
 * ArtistDNA更新時の入力データ（部分更新可能）
 */
export type UpdateArtistDNAInput = Partial<Omit<ArtistDNA, 'id' | 'createdAt' | 'updatedAt' | 'version'>>;
