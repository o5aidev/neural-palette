/**
 * Neural Identity ストレージ
 *
 * ArtistDNAデータの永続化を管理（Phase 1: インメモリ実装）
 */

import type { ArtistDNA, CreateArtistDNAInput, UpdateArtistDNAInput } from '../types/neural-identity.js';
import { validateCreateArtistDNAInput, validateUpdateArtistDNAInput } from '../validation/neural-identity.validator.js';

/**
 * ストレージエラー
 */
export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Neural Identity ストレージ
 *
 * Phase 1: インメモリ実装
 * Phase 2以降: データベース（Prisma + PostgreSQL）に移行予定
 */
export class NeuralIdentityStorage {
  private storage: Map<string, ArtistDNA> = new Map();
  private idCounter = 1;

  /**
   * IDを生成
   */
  private generateId(): string {
    return `artist_${Date.now()}_${this.idCounter++}`;
  }

  /**
   * ArtistDNAを作成
   */
  async create(input: CreateArtistDNAInput): Promise<ArtistDNA> {
    // バリデーション
    validateCreateArtistDNAInput(input);

    const now = new Date();
    const artistDNA: ArtistDNA = {
      ...input,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.storage.set(artistDNA.id, artistDNA);
    return artistDNA;
  }

  /**
   * IDでArtistDNAを取得
   */
  async findById(id: string): Promise<ArtistDNA | null> {
    return this.storage.get(id) ?? null;
  }

  /**
   * 全てのArtistDNAを取得
   */
  async findAll(): Promise<ArtistDNA[]> {
    return Array.from(this.storage.values());
  }

  /**
   * 名前でArtistDNAを検索
   */
  async findByName(name: string): Promise<ArtistDNA[]> {
    return Array.from(this.storage.values()).filter(
      (artist) => artist.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * ArtistDNAを更新
   */
  async update(id: string, input: UpdateArtistDNAInput): Promise<ArtistDNA> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new StorageError(`ArtistDNA with id ${id} not found`, 'NOT_FOUND');
    }

    // バリデーション
    validateUpdateArtistDNAInput(input);

    const updated: ArtistDNA = {
      ...existing,
      ...input,
      id: existing.id, // IDは変更不可
      createdAt: existing.createdAt, // 作成日時は変更不可
      updatedAt: new Date(),
      version: existing.version + 1,
    };

    this.storage.set(id, updated);
    return updated;
  }

  /**
   * ArtistDNAを削除
   */
  async delete(id: string): Promise<boolean> {
    const existed = this.storage.has(id);
    this.storage.delete(id);
    return existed;
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
export const neuralIdentityStorage = new NeuralIdentityStorage();
