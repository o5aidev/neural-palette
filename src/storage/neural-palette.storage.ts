/**
 * Neural Palette ストレージ
 *
 * Contentデータの永続化を管理（Phase 1: インメモリ実装）
 */

import type { Content, CreateContentInput, UpdateContentInput, ContentFilter } from '../types/neural-palette.js';
import {
  validateCreateContentInput,
  validateUpdateContentInput,
} from '../validation/neural-palette.validator.js';
import { StorageError } from './neural-identity.storage.js';

/**
 * Neural Palette ストレージ
 *
 * Phase 1: インメモリ実装
 * Phase 2以降: データベース（Prisma + PostgreSQL）に移行予定
 */
export class NeuralPaletteStorage {
  private storage: Map<string, Content> = new Map();
  private idCounter = 1;

  /**
   * IDを生成
   */
  private generateId(): string {
    return `content_${Date.now()}_${this.idCounter++}`;
  }

  /**
   * Contentを作成
   */
  async create(input: CreateContentInput): Promise<Content> {
    // バリデーション
    validateCreateContentInput(input);

    const now = new Date();
    const content: Content = {
      ...input,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.storage.set(content.id, content);
    return content;
  }

  /**
   * IDでContentを取得
   */
  async findById(id: string): Promise<Content | null> {
    return this.storage.get(id) ?? null;
  }

  /**
   * 全てのContentを取得
   */
  async findAll(): Promise<Content[]> {
    return Array.from(this.storage.values());
  }

  /**
   * アーティストIDでContentを取得
   */
  async findByArtistId(artistId: string): Promise<Content[]> {
    return Array.from(this.storage.values()).filter((content) => content.artistId === artistId);
  }

  /**
   * フィルター条件でContentを検索
   */
  async findByFilter(filter: ContentFilter): Promise<Content[]> {
    let results = Array.from(this.storage.values());

    // アーティストIDでフィルター
    if (filter.artistId) {
      results = results.filter((content) => content.artistId === filter.artistId);
    }

    // コンテンツタイプでフィルター
    if (filter.type) {
      results = results.filter((content) => content.type === filter.type);
    }

    // ステータスでフィルター
    if (filter.status) {
      results = results.filter((content) => content.status === filter.status);
    }

    // タグでフィルター
    if (filter.tags && filter.tags.length > 0) {
      results = results.filter((content) =>
        filter.tags!.some((filterTag) =>
          content.tags.some((contentTag) => contentTag.name.toLowerCase() === filterTag.toLowerCase())
        )
      );
    }

    // タイトル/説明で検索
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(
        (content) =>
          content.title.toLowerCase().includes(searchLower) ||
          content.description.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  /**
   * Contentを更新
   */
  async update(id: string, input: UpdateContentInput): Promise<Content> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new StorageError(`Content with id ${id} not found`, 'NOT_FOUND');
    }

    // バリデーション
    validateUpdateContentInput(input);

    const updated: Content = {
      ...existing,
      ...input,
      id: existing.id, // IDは変更不可
      artistId: existing.artistId, // アーティストIDは変更不可
      createdAt: existing.createdAt, // 作成日時は変更不可
      updatedAt: new Date(),
      version: existing.version + 1,
    };

    this.storage.set(id, updated);
    return updated;
  }

  /**
   * Contentを削除
   */
  async delete(id: string): Promise<boolean> {
    const existed = this.storage.has(id);
    this.storage.delete(id);
    return existed;
  }

  /**
   * アーティストの全Contentを削除
   */
  async deleteByArtistId(artistId: string): Promise<number> {
    const contents = await this.findByArtistId(artistId);
    let deletedCount = 0;

    for (const content of contents) {
      if (await this.delete(content.id)) {
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * 全てのデータをクリア（テスト用）
   */
  async clear(): Promise<void> {
    this.storage.clear();
    this.idCounter = 1;
  }

  /**
   * ストレージのサイズを取得
   */
  async count(): Promise<number> {
    return this.storage.size;
  }
}

/**
 * シングルトンインスタンス
 */
export const neuralPaletteStorage = new NeuralPaletteStorage();
