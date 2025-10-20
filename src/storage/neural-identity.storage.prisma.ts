/**
 * Neural Identity ストレージ（Prisma実装）
 *
 * Phase 2: データベース統合版
 */

import type { ArtistDNA, CreateArtistDNAInput, UpdateArtistDNAInput } from '../types/neural-identity.js';
import {
  validateCreateArtistDNAInput,
  validateUpdateArtistDNAInput,
} from '../validation/neural-identity.validator.js';
import { StorageError } from './neural-identity.storage.js';
import { prisma } from '../lib/prisma.js';

/**
 * Neural Identity ストレージ（Prisma版）
 */
export class NeuralIdentityStoragePrisma {
  /**
   * Prisma→TypeScript型変換
   */
  private toDomain(dbArtist: any): ArtistDNA {
    return {
      id: dbArtist.id,
      name: dbArtist.name,
      bio: dbArtist.bio,
      creativeStyle: {
        visualThemes: JSON.parse(dbArtist.visualThemes),
        musicGenres: JSON.parse(dbArtist.musicGenres),
        writingStyle: dbArtist.writingStyle,
        colorPalette: JSON.parse(dbArtist.colorPalette),
      },
      communicationStyle: {
        tone: dbArtist.tone as any,
        emojiUsage: dbArtist.emojiUsage as any,
        responseLength: dbArtist.responseLength as any,
        languagePreferences: JSON.parse(dbArtist.languagePreferences),
      },
      values: {
        coreValues: JSON.parse(dbArtist.coreValues),
        artisticVision: dbArtist.artisticVision,
        fanRelationshipPhilosophy: dbArtist.fanRelationshipPhilosophy,
      },
      milestones: dbArtist.milestones?.map((m: any) => ({
        id: m.id,
        date: m.date,
        title: m.title,
        description: m.description,
        type: m.type as any,
        significance: m.significance,
      })) || [],
      createdAt: dbArtist.createdAt,
      updatedAt: dbArtist.updatedAt,
      version: dbArtist.version,
    };
  }

  /**
   * ArtistDNAを作成
   */
  async create(input: CreateArtistDNAInput): Promise<ArtistDNA> {
    // バリデーション
    validateCreateArtistDNAInput(input);

    const result = await prisma.artistDNA.create({
      data: {
        name: input.name,
        bio: input.bio,
        // Creative Style
        visualThemes: JSON.stringify(input.creativeStyle.visualThemes),
        musicGenres: JSON.stringify(input.creativeStyle.musicGenres),
        writingStyle: input.creativeStyle.writingStyle,
        colorPalette: JSON.stringify(input.creativeStyle.colorPalette),
        // Communication Style
        tone: input.communicationStyle.tone,
        emojiUsage: input.communicationStyle.emojiUsage,
        responseLength: input.communicationStyle.responseLength,
        languagePreferences: JSON.stringify(input.communicationStyle.languagePreferences),
        // Values
        coreValues: JSON.stringify(input.values.coreValues),
        artisticVision: input.values.artisticVision,
        fanRelationshipPhilosophy: input.values.fanRelationshipPhilosophy,
        // Milestones
        milestones: {
          create: input.milestones.map((m) => ({
            id: m.id,
            date: m.date,
            title: m.title,
            description: m.description,
            type: m.type,
            significance: m.significance,
          })),
        },
      },
      include: {
        milestones: true,
      },
    });

    return this.toDomain(result);
  }

  /**
   * IDでArtistDNAを取得
   */
  async findById(id: string): Promise<ArtistDNA | null> {
    const result = await prisma.artistDNA.findUnique({
      where: { id },
      include: {
        milestones: true,
      },
    });

    return result ? this.toDomain(result) : null;
  }

  /**
   * 全てのArtistDNAを取得
   */
  async findAll(): Promise<ArtistDNA[]> {
    const results = await prisma.artistDNA.findMany({
      include: {
        milestones: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return results.map((r) => this.toDomain(r));
  }

  /**
   * 名前でArtistDNAを検索
   */
  async findByName(name: string): Promise<ArtistDNA[]> {
    const results = await prisma.artistDNA.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        milestones: true,
      },
    });

    return results.map((r) => this.toDomain(r));
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

    // 更新データを準備
    const updateData: any = {
      version: { increment: 1 },
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.bio !== undefined) updateData.bio = input.bio;

    if (input.creativeStyle) {
      if (input.creativeStyle.visualThemes)
        updateData.visualThemes = JSON.stringify(input.creativeStyle.visualThemes);
      if (input.creativeStyle.musicGenres)
        updateData.musicGenres = JSON.stringify(input.creativeStyle.musicGenres);
      if (input.creativeStyle.writingStyle) updateData.writingStyle = input.creativeStyle.writingStyle;
      if (input.creativeStyle.colorPalette)
        updateData.colorPalette = JSON.stringify(input.creativeStyle.colorPalette);
    }

    if (input.communicationStyle) {
      if (input.communicationStyle.tone) updateData.tone = input.communicationStyle.tone;
      if (input.communicationStyle.emojiUsage) updateData.emojiUsage = input.communicationStyle.emojiUsage;
      if (input.communicationStyle.responseLength)
        updateData.responseLength = input.communicationStyle.responseLength;
      if (input.communicationStyle.languagePreferences)
        updateData.languagePreferences = JSON.stringify(input.communicationStyle.languagePreferences);
    }

    if (input.values) {
      if (input.values.coreValues) updateData.coreValues = JSON.stringify(input.values.coreValues);
      if (input.values.artisticVision) updateData.artisticVision = input.values.artisticVision;
      if (input.values.fanRelationshipPhilosophy)
        updateData.fanRelationshipPhilosophy = input.values.fanRelationshipPhilosophy;
    }

    // マイルストーン更新（全置換）
    if (input.milestones) {
      await prisma.milestone.deleteMany({
        where: { artistId: id },
      });

      updateData.milestones = {
        create: input.milestones.map((m) => ({
          id: m.id,
          date: m.date,
          title: m.title,
          description: m.description,
          type: m.type,
          significance: m.significance,
        })),
      };
    }

    const result = await prisma.artistDNA.update({
      where: { id },
      data: updateData,
      include: {
        milestones: true,
      },
    });

    return this.toDomain(result);
  }

  /**
   * ArtistDNAを削除
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.artistDNA.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 全てのデータをクリア（テスト用）
   */
  async clear(): Promise<void> {
    await prisma.milestone.deleteMany();
    await prisma.artistDNA.deleteMany();
  }

  /**
   * ストレージのサイズを取得
   */
  async count(): Promise<number> {
    return await prisma.artistDNA.count();
  }
}

/**
 * シングルトンインスタンス（Prisma版）
 */
export const neuralIdentityStoragePrisma = new NeuralIdentityStoragePrisma();
