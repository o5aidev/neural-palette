/**
 * Neural Publisher Prisma ストレージ実装
 *
 * 配信管理のデータベース操作
 */

import { PrismaClient } from '../generated/prisma/index.js';
import type {
  Distribution,
  CreateDistributionInput,
  UpdateDistributionInput,
  DistributionFilter,
  DistributionEvent,
  PlatformConfig,
  DistributionStats,
  DistributionStatus,
  DistributionPlatform,
} from '../types/neural-publisher.js';

export class NeuralPublisherStoragePrisma {
  constructor(private prisma: PrismaClient) {}

  /**
   * 配信を作成
   */
  async createDistribution(input: CreateDistributionInput): Promise<Distribution> {
    const data = await this.prisma.distribution.create({
      data: {
        contentId: input.contentId,
        artistId: input.artistId,
        title: input.title,
        status: 'draft',
        scheduledDate: input.scheduledDate,
        description: input.description,
        tags: JSON.stringify(input.tags || []),
        isExplicit: input.isExplicit ?? false,
        platforms: JSON.stringify(input.platforms),
        version: 1,
      },
    });

    return this.mapToDistribution(data);
  }

  /**
   * 配信を取得
   */
  async getDistribution(id: string): Promise<Distribution | null> {
    const data = await this.prisma.distribution.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!data) return null;
    return this.mapToDistribution(data);
  }

  /**
   * 配信を更新
   */
  async updateDistribution(
    id: string,
    input: UpdateDistributionInput
  ): Promise<Distribution> {
    const current = await this.prisma.distribution.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`Distribution not found: ${id}`);
    }

    const updateData: any = {
      updatedAt: new Date(),
      version: current.version + 1,
    };

    if (input.title !== undefined) updateData.title = input.title;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.scheduledDate !== undefined)
      updateData.scheduledDate = input.scheduledDate;
    if (input.publishedDate !== undefined)
      updateData.publishedDate = input.publishedDate;
    if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);
    if (input.isExplicit !== undefined) updateData.isExplicit = input.isExplicit;
    if (input.platforms !== undefined)
      updateData.platforms = JSON.stringify(input.platforms);

    const updated = await this.prisma.distribution.update({
      where: { id },
      data: updateData,
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return this.mapToDistribution(updated);
  }

  /**
   * 配信を削除
   */
  async deleteDistribution(id: string): Promise<void> {
    await this.prisma.distribution.delete({
      where: { id },
    });
  }

  /**
   * 配信を検索
   */
  async findDistributions(filter?: DistributionFilter): Promise<Distribution[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.contentId) where.contentId = filter.contentId;
    if (filter?.status) where.status = filter.status;

    const results = await this.prisma.distribution.findMany({
      where,
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return results.map(data => this.mapToDistribution(data));
  }

  /**
   * イベントを追加
   */
  async addDistributionEvent(
    distributionId: string,
    event: Omit<DistributionEvent, 'id' | 'timestamp'>
  ): Promise<DistributionEvent> {
    const data = await this.prisma.distributionEvent.create({
      data: {
        distributionId,
        platform: event.platform,
        eventType: event.eventType,
        status: event.status,
        message: event.message,
        metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
      },
    });

    return {
      id: data.id,
      distributionId: data.distributionId,
      platform: (data.platform as DistributionPlatform) ?? undefined,
      eventType: data.eventType as any,
      status: data.status as DistributionStatus,
      message: data.message ?? undefined,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      timestamp: data.timestamp,
    };
  }

  /**
   * 統計を取得
   */
  async getDistributionStats(artistId: string): Promise<DistributionStats> {
    const distributions = await this.prisma.distribution.findMany({
      where: { artistId },
    });

    const total = distributions.length;
    const byStatus = distributions.reduce(
      (acc, d) => {
        const status = d.status as DistributionStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<DistributionStatus, number>
    );

    const published = distributions.filter(d => d.status === 'published').length;
    const scheduled = distributions.filter(d => d.status === 'scheduled').length;
    const failed = distributions.filter(d => d.status === 'failed').length;

    // Count by platform (simplified - would need proper platform tracking)
    const byPlatform: Record<DistributionPlatform, number> = {} as any;

    return {
      totalDistributions: total,
      publishedCount: published,
      scheduledCount: scheduled,
      failedCount: failed,
      byStatus,
      byPlatform,
    };
  }

  /**
   * Prismaデータを型に変換
   */
  private mapToDistribution(data: any): Distribution {
    const platforms: PlatformConfig[] = JSON.parse(data.platforms);
    const tags: string[] = JSON.parse(data.tags);

    const events: DistributionEvent[] = data.events
      ? data.events.map((e: any) => ({
          id: e.id,
          platform: e.platform ?? undefined,
          eventType: e.eventType,
          status: e.status,
          message: e.message ?? undefined,
          metadata: e.metadata ? JSON.parse(e.metadata) : undefined,
          timestamp: e.timestamp,
        }))
      : [];

    return {
      id: data.id,
      contentId: data.contentId,
      artistId: data.artistId,
      title: data.title,
      status: data.status as DistributionStatus,
      platforms,
      scheduledDate: data.scheduledDate ?? undefined,
      publishedDate: data.publishedDate ?? undefined,
      description: data.description ?? undefined,
      tags,
      isExplicit: data.isExplicit,
      distributionHistory: events,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }
}
