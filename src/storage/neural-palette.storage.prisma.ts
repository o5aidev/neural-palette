/**
 * Neural Palette ストレージ（Prisma実装）
 *
 * Phase 2: データベース統合版
 */

import type {
  Content,
  CreateContentInput,
  UpdateContentInput,
  ContentFilter,
} from '../types/neural-palette.js';
import {
  validateCreateContentInput,
  validateUpdateContentInput,
} from '../validation/neural-palette.validator.js';
import { StorageError } from './neural-identity.storage.js';
import { prisma } from '../lib/prisma.js';

/**
 * Neural Palette ストレージ（Prisma版）
 */
export class NeuralPaletteStoragePrisma {
  /**
   * Prisma→TypeScript型変換
   */
  private toDomain(dbContent: any): Content {
    return {
      id: dbContent.id,
      artistId: dbContent.artistId,
      title: dbContent.title,
      description: dbContent.description,
      type: dbContent.type as any,
      status: dbContent.status as any,
      tags: dbContent.tags?.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
      })) || [],
      mediaFiles: dbContent.mediaFiles?.map((m: any) => ({
        id: m.id,
        filename: m.filename,
        mimeType: m.mimeType,
        size: m.size,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        uploadedAt: m.uploadedAt,
      })) || [],
      collaborators: dbContent.collaborators?.map((c: any) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        email: c.email,
      })) || [],
      metadata: JSON.parse(dbContent.metadata),
      publishedAt: dbContent.publishedAt,
      createdAt: dbContent.createdAt,
      updatedAt: dbContent.updatedAt,
      version: dbContent.version,
    };
  }

  /**
   * Contentを作成
   */
  async create(input: CreateContentInput): Promise<Content> {
    // バリデーション
    validateCreateContentInput(input);

    const result = await prisma.content.create({
      data: {
        artistId: input.artistId,
        title: input.title,
        description: input.description,
        type: input.type,
        status: input.status,
        publishedAt: input.publishedAt,
        metadata: JSON.stringify(input.metadata),
        // Tags
        tags: {
          create: input.tags.map((t) => ({
            id: t.id,
            name: t.name,
            category: t.category,
          })),
        },
        // Media Files
        mediaFiles: {
          create: input.mediaFiles.map((m) => ({
            id: m.id,
            filename: m.filename,
            mimeType: m.mimeType,
            size: m.size,
            url: m.url,
            thumbnailUrl: m.thumbnailUrl,
            uploadedAt: m.uploadedAt,
          })),
        },
        // Collaborators
        collaborators: {
          create: input.collaborators.map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role,
            email: c.email,
          })),
        },
      },
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
    });

    return this.toDomain(result);
  }

  /**
   * IDでContentを取得
   */
  async findById(id: string): Promise<Content | null> {
    const result = await prisma.content.findUnique({
      where: { id },
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
    });

    return result ? this.toDomain(result) : null;
  }

  /**
   * 全てのContentを取得
   */
  async findAll(): Promise<Content[]> {
    const results = await prisma.content.findMany({
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results.map((r) => this.toDomain(r));
  }

  /**
   * ArtistIDでContentを検索
   */
  async findByArtistId(artistId: string): Promise<Content[]> {
    const results = await prisma.content.findMany({
      where: {
        artistId,
      },
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results.map((r) => this.toDomain(r));
  }

  /**
   * フィルター検索
   */
  async search(filter: ContentFilter): Promise<Content[]> {
    const where: any = {};

    // Artist ID
    if (filter.artistId) {
      where.artistId = filter.artistId;
    }

    // Type
    if (filter.type) {
      where.type = filter.type;
    }

    // Status
    if (filter.status) {
      where.status = filter.status;
    }

    // Tags（タグ名に一致するコンテンツを検索）
    if (filter.tags && filter.tags.length > 0) {
      where.tags = {
        some: {
          name: {
            in: filter.tags,
          },
        },
      };
    }

    // Search Text（タイトルまたは説明文に含まれる）
    if (filter.searchText) {
      where.OR = [
        {
          title: {
            contains: filter.searchText,
          },
        },
        {
          description: {
            contains: filter.searchText,
          },
        },
      ];
    }

    const results = await prisma.content.findMany({
      where,
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results.map((r) => this.toDomain(r));
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

    // 更新データを準備
    const updateData: any = {
      version: { increment: 1 },
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.publishedAt !== undefined) updateData.publishedAt = input.publishedAt;
    if (input.metadata !== undefined) updateData.metadata = JSON.stringify(input.metadata);

    // Tags（全置換）
    if (input.tags) {
      await prisma.tag.deleteMany({
        where: { contentId: id },
      });

      updateData.tags = {
        create: input.tags.map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category,
        })),
      };
    }

    // Media Files（全置換）
    if (input.mediaFiles) {
      await prisma.mediaFile.deleteMany({
        where: { contentId: id },
      });

      updateData.mediaFiles = {
        create: input.mediaFiles.map((m) => ({
          id: m.id,
          filename: m.filename,
          mimeType: m.mimeType,
          size: m.size,
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
          uploadedAt: m.uploadedAt,
        })),
      };
    }

    // Collaborators（全置換）
    if (input.collaborators) {
      await prisma.collaborator.deleteMany({
        where: { contentId: id },
      });

      updateData.collaborators = {
        create: input.collaborators.map((c) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          email: c.email,
        })),
      };
    }

    const result = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        tags: true,
        mediaFiles: true,
        collaborators: true,
      },
    });

    return this.toDomain(result);
  }

  /**
   * Contentを削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.content.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * ArtistIDに紐づく全Contentを削除
   */
  async deleteByArtistId(artistId: string): Promise<number> {
    const result = await prisma.content.deleteMany({
      where: { artistId },
    });

    return result.count;
  }

  /**
   * 全てのデータをクリア（テスト用）
   */
  async clear(): Promise<void> {
    await prisma.collaborator.deleteMany();
    await prisma.mediaFile.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.content.deleteMany();
  }

  /**
   * ストレージのサイズを取得
   */
  async count(): Promise<number> {
    return await prisma.content.count();
  }
}

/**
 * シングルトンインスタンス（Prisma版）
 */
export const neuralPaletteStoragePrisma = new NeuralPaletteStoragePrisma();
