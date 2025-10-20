/**
 * Neural Muse Prisma ストレージ実装
 *
 * AI創作支援のデータベース操作
 */

import { PrismaClient } from '../generated/prisma/index.js';
import type {
  CreativeSession,
  CreateCreativeSessionInput,
  UpdateCreativeSessionInput,
  CreativeSessionFilter,
  GenerationResult,
  GenerationParams,
  Inspiration,
  CreateInspirationInput,
  PromptTemplate,
  CreatePromptTemplateInput,
  CreativeStats,
  CreativeType,
  SessionStatus,
} from '../types/neural-muse.js';

export class NeuralMuseStoragePrisma {
  constructor(private prisma: PrismaClient) {}

  // ============================================================================
  // Creative Session
  // ============================================================================

  /**
   * 創作セッションを作成
   */
  async createCreativeSession(input: CreateCreativeSessionInput): Promise<CreativeSession> {
    const data = await this.prisma.creativeSession.create({
      data: {
        artistId: input.artistId,
        contentId: input.contentId,
        title: input.title,
        type: input.type,
        status: 'active',
        description: input.description,
        defaultParams: JSON.stringify(input.defaultParams || {}),
        totalGenerations: 0,
        selectedCount: 0,
        version: 1,
      },
      include: {
        generations: {
          orderBy: { generatedAt: 'desc' },
        },
      },
    });

    return this.mapToCreativeSession(data);
  }

  /**
   * 創作セッションを取得
   */
  async getCreativeSession(id: string): Promise<CreativeSession | null> {
    const data = await this.prisma.creativeSession.findUnique({
      where: { id },
      include: {
        generations: {
          orderBy: { generatedAt: 'desc' },
        },
      },
    });

    if (!data) return null;
    return this.mapToCreativeSession(data);
  }

  /**
   * 創作セッションを更新
   */
  async updateCreativeSession(
    id: string,
    input: UpdateCreativeSessionInput
  ): Promise<CreativeSession> {
    const current = await this.prisma.creativeSession.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`CreativeSession not found: ${id}`);
    }

    const updateData: any = {
      updatedAt: new Date(),
      lastActiveAt: new Date(),
      version: current.version + 1,
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.status !== undefined) {
      updateData.status = input.status;
      if (input.status === 'completed') {
        updateData.completedAt = new Date();
      }
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.defaultParams !== undefined)
      updateData.defaultParams = JSON.stringify(input.defaultParams);

    const updated = await this.prisma.creativeSession.update({
      where: { id },
      data: updateData,
      include: {
        generations: {
          orderBy: { generatedAt: 'desc' },
        },
      },
    });

    return this.mapToCreativeSession(updated);
  }

  /**
   * 創作セッションを削除
   */
  async deleteCreativeSession(id: string): Promise<void> {
    await this.prisma.creativeSession.delete({
      where: { id },
    });
  }

  /**
   * 創作セッションを検索
   */
  async findCreativeSessions(filter?: CreativeSessionFilter): Promise<CreativeSession[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.contentId) where.contentId = filter.contentId;
    if (filter?.type) where.type = filter.type;
    if (filter?.status) where.status = filter.status;

    const results = await this.prisma.creativeSession.findMany({
      where,
      include: {
        generations: {
          orderBy: { generatedAt: 'desc' },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    });

    return results.map(data => this.mapToCreativeSession(data));
  }

  // ============================================================================
  // Generation Result
  // ============================================================================

  /**
   * 生成結果を追加
   */
  async addGenerationResult(
    sessionId: string,
    result: Omit<GenerationResult, 'id' | 'generatedAt' | 'createdAt' | 'updatedAt'>
  ): Promise<GenerationResult> {
    const data = await this.prisma.generationResult.create({
      data: {
        sessionId,
        type: result.type,
        prompt: result.prompt,
        result: result.result,
        params: JSON.stringify(result.params),
        tokensUsed: result.tokensUsed,
        model: result.model,
        confidence: result.confidence,
        rating: result.rating,
        feedback: result.feedback,
        isSelected: result.isSelected,
      },
    });

    // セッションの生成数を更新
    await this.prisma.creativeSession.update({
      where: { id: sessionId },
      data: {
        totalGenerations: { increment: 1 },
        selectedCount: result.isSelected ? { increment: 1 } : undefined,
        lastActiveAt: new Date(),
      },
    });

    return this.mapToGenerationResult(data);
  }

  /**
   * 生成結果を更新（フィードバック用）
   */
  async updateGenerationResult(
    id: string,
    updates: { rating?: number; feedback?: string; isSelected?: boolean }
  ): Promise<GenerationResult> {
    const current = await this.prisma.generationResult.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`GenerationResult not found: ${id}`);
    }

    const updateData: any = { updatedAt: new Date() };

    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.feedback !== undefined) updateData.feedback = updates.feedback;
    if (updates.isSelected !== undefined) {
      updateData.isSelected = updates.isSelected;

      // セッションの選択数を更新
      const delta = updates.isSelected ? 1 : -1;
      await this.prisma.creativeSession.update({
        where: { id: current.sessionId },
        data: {
          selectedCount: { increment: delta },
        },
      });
    }

    const updated = await this.prisma.generationResult.update({
      where: { id },
      data: updateData,
    });

    return this.mapToGenerationResult(updated);
  }

  // ============================================================================
  // Inspiration
  // ============================================================================

  /**
   * インスピレーションを作成
   */
  async createInspiration(input: CreateInspirationInput): Promise<Inspiration> {
    const data = await this.prisma.inspiration.create({
      data: {
        artistId: input.artistId,
        sessionId: input.sessionId,
        title: input.title,
        content: input.content,
        type: input.type,
        source: input.source,
        tags: JSON.stringify(input.tags || []),
      },
    });

    return this.mapToInspiration(data);
  }

  /**
   * インスピレーションを取得
   */
  async getInspiration(id: string): Promise<Inspiration | null> {
    const data = await this.prisma.inspiration.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToInspiration(data);
  }

  /**
   * インスピレーションを検索
   */
  async findInspirations(filter?: any): Promise<Inspiration[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.sessionId) where.sessionId = filter.sessionId;
    if (filter?.type) where.type = filter.type;

    const results = await this.prisma.inspiration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return results.map(data => this.mapToInspiration(data));
  }

  /**
   * インスピレーションを削除
   */
  async deleteInspiration(id: string): Promise<void> {
    await this.prisma.inspiration.delete({
      where: { id },
    });
  }

  // ============================================================================
  // Prompt Template
  // ============================================================================

  /**
   * プロンプトテンプレートを作成
   */
  async createPromptTemplate(input: CreatePromptTemplateInput): Promise<PromptTemplate> {
    const data = await this.prisma.promptTemplate.create({
      data: {
        artistId: input.artistId,
        name: input.name,
        description: input.description,
        type: input.type,
        template: input.template,
        variables: JSON.stringify(input.variables),
        exampleValues: input.exampleValues ? JSON.stringify(input.exampleValues) : undefined,
        defaultParams: JSON.stringify(input.defaultParams || {}),
        usageCount: 0,
        isPublic: input.isPublic ?? false,
        tags: JSON.stringify(input.tags || []),
      },
    });

    return this.mapToPromptTemplate(data);
  }

  /**
   * プロンプトテンプレートを取得
   */
  async getPromptTemplate(id: string): Promise<PromptTemplate | null> {
    const data = await this.prisma.promptTemplate.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToPromptTemplate(data);
  }

  /**
   * プロンプトテンプレートを検索
   */
  async findPromptTemplates(filter?: any): Promise<PromptTemplate[]> {
    const where: any = {};

    if (filter?.artistId !== undefined) {
      // artistId が null の場合は公開テンプレート
      where.OR = [
        { artistId: filter.artistId },
        { artistId: null, isPublic: true },
      ];
    }
    if (filter?.type) where.type = filter.type;
    if (filter?.isPublic !== undefined) where.isPublic = filter.isPublic;

    const results = await this.prisma.promptTemplate.findMany({
      where,
      orderBy: { usageCount: 'desc' },
    });

    return results.map(data => this.mapToPromptTemplate(data));
  }

  /**
   * テンプレート使用数を増やす
   */
  async incrementTemplateUsage(id: string): Promise<void> {
    await this.prisma.promptTemplate.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }

  // ============================================================================
  // 統計
  // ============================================================================

  /**
   * 創作統計を取得
   */
  async getCreativeStats(artistId: string): Promise<CreativeStats> {
    const sessions = await this.prisma.creativeSession.findMany({
      where: { artistId },
      include: {
        generations: {
          orderBy: { rating: 'desc' },
          take: 10,
        },
      },
    });

    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;

    const totalGenerations = sessions.reduce((sum, s) => sum + s.totalGenerations, 0);
    const avgGenerationsPerSession =
      totalSessions > 0 ? totalGenerations / totalSessions : 0;

    const byType = sessions.reduce(
      (acc, s) => {
        const type = s.type as CreativeType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<CreativeType, number>
    );

    // トップ評価の生成結果
    const allGenerations = sessions.flatMap(s =>
      s.generations.map(g => this.mapToGenerationResult(g))
    );
    const topRatedGenerations = allGenerations
      .filter(g => g.rating !== undefined)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    return {
      totalSessions,
      activeSessions,
      completedSessions,
      totalGenerations,
      avgGenerationsPerSession: Math.round(avgGenerationsPerSession * 10) / 10,
      byType,
      topRatedGenerations,
      recentSessions: sessions.slice(0, 5).map(s => this.mapToCreativeSession(s)),
    };
  }

  // ============================================================================
  // マッピング関数
  // ============================================================================

  private mapToCreativeSession(data: any): CreativeSession {
    const defaultParams: GenerationParams = JSON.parse(data.defaultParams);
    const generations = data.generations
      ? data.generations.map((g: any) => this.mapToGenerationResult(g))
      : [];

    return {
      id: data.id,
      artistId: data.artistId,
      contentId: data.contentId ?? undefined,
      title: data.title,
      type: data.type as CreativeType,
      status: data.status as SessionStatus,
      description: data.description ?? undefined,
      defaultParams,
      generations,
      totalGenerations: data.totalGenerations,
      selectedCount: data.selectedCount,
      startedAt: data.startedAt,
      lastActiveAt: data.lastActiveAt,
      completedAt: data.completedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }

  private mapToGenerationResult(data: any): GenerationResult {
    const params: GenerationParams = JSON.parse(data.params);

    return {
      id: data.id,
      sessionId: data.sessionId,
      type: data.type as CreativeType,
      prompt: data.prompt,
      result: data.result,
      params,
      tokensUsed: data.tokensUsed,
      model: data.model,
      confidence: data.confidence ?? undefined,
      rating: data.rating ?? undefined,
      feedback: data.feedback ?? undefined,
      isSelected: data.isSelected,
      generatedAt: data.generatedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToInspiration(data: any): Inspiration {
    const tags: string[] = JSON.parse(data.tags);
    const usedInContent = data.usedInContent ? JSON.parse(data.usedInContent) : undefined;

    return {
      id: data.id,
      artistId: data.artistId,
      sessionId: data.sessionId ?? undefined,
      title: data.title,
      content: data.content,
      type: data.type as CreativeType,
      source: data.source ?? undefined,
      tags,
      usedInContent,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToPromptTemplate(data: any): PromptTemplate {
    const variables: string[] = JSON.parse(data.variables);
    const exampleValues = data.exampleValues ? JSON.parse(data.exampleValues) : undefined;
    const defaultParams: GenerationParams = JSON.parse(data.defaultParams);
    const tags: string[] = JSON.parse(data.tags);

    return {
      id: data.id,
      artistId: data.artistId ?? undefined,
      name: data.name,
      description: data.description ?? undefined,
      type: data.type as CreativeType,
      template: data.template,
      variables,
      exampleValues,
      defaultParams,
      usageCount: data.usageCount,
      avgRating: data.avgRating ?? undefined,
      isPublic: data.isPublic,
      tags,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
