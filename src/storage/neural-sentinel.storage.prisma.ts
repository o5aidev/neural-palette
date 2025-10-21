/**
 * Neural Sentinel Prisma ストレージ実装
 *
 * 権利保護のデータベース操作
 */

import { PrismaClient } from '../generated/prisma/index.js';
import type {
  Right,
  CreateRightInput,
  UpdateRightInput,
  RightFilter,
  Infringement,
  CreateInfringementInput,
  UpdateInfringementInput,
  InfringementFilter,
  MonitoringRule,
  CreateMonitoringRuleInput,
  ProtectionStats,
  InfringementStatus,
  ActionType,
} from '../types/neural-sentinel.js';

export class NeuralSentinelStoragePrisma {
  constructor(private prisma: PrismaClient) {}

  // ============================================================================
  // Right
  // ============================================================================

  /**
   * 権利を作成
   */
  async createRight(input: CreateRightInput): Promise<Right> {
    const data = await this.prisma.right.create({
      data: {
        contentId: input.contentId,
        artistId: input.artistId,
        rightType: input.rightType,
        rightHolder: input.rightHolder,
        rightHolderContact: input.rightHolderContact,
        licenseType: input.licenseType,
        licenseTerms: input.licenseTerms,
        startDate: input.startDate,
        endDate: input.endDate,
        territories: JSON.stringify(input.territories || []),
        registrationNumber: input.registrationNumber,
        isrcCode: input.isrcCode,
        iswcCode: input.iswcCode,
        version: 1,
      },
    });

    return this.mapToRight(data);
  }

  /**
   * 権利を取得
   */
  async getRight(id: string): Promise<Right | null> {
    const data = await this.prisma.right.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToRight(data);
  }

  /**
   * 権利を更新
   */
  async updateRight(id: string, input: UpdateRightInput): Promise<Right> {
    const current = await this.prisma.right.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`Right not found: ${id}`);
    }

    const updateData: any = {
      updatedAt: new Date(),
      version: current.version + 1,
    };

    if (input.rightHolder !== undefined) updateData.rightHolder = input.rightHolder;
    if (input.rightHolderContact !== undefined)
      updateData.rightHolderContact = input.rightHolderContact;
    if (input.licenseType !== undefined) updateData.licenseType = input.licenseType;
    if (input.licenseTerms !== undefined) updateData.licenseTerms = input.licenseTerms;
    if (input.startDate !== undefined) updateData.startDate = input.startDate;
    if (input.endDate !== undefined) updateData.endDate = input.endDate;
    if (input.territories !== undefined)
      updateData.territories = JSON.stringify(input.territories);
    if (input.registrationNumber !== undefined)
      updateData.registrationNumber = input.registrationNumber;
    if (input.isrcCode !== undefined) updateData.isrcCode = input.isrcCode;
    if (input.iswcCode !== undefined) updateData.iswcCode = input.iswcCode;

    const updated = await this.prisma.right.update({
      where: { id },
      data: updateData,
    });

    return this.mapToRight(updated);
  }

  /**
   * 権利を削除
   */
  async deleteRight(id: string): Promise<void> {
    await this.prisma.right.delete({
      where: { id },
    });
  }

  /**
   * 権利を検索
   */
  async findRights(filter?: RightFilter): Promise<Right[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.contentId) where.contentId = filter.contentId;
    if (filter?.rightType) where.rightType = filter.rightType;
    if (filter?.licenseType) where.licenseType = filter.licenseType;

    const results = await this.prisma.right.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return results.map(data => this.mapToRight(data));
  }

  // ============================================================================
  // Infringement
  // ============================================================================

  /**
   * 侵害を作成
   */
  async createInfringement(input: CreateInfringementInput): Promise<Infringement> {
    const data = await this.prisma.infringement.create({
      data: {
        rightId: input.rightId,
        contentId: input.contentId,
        artistId: input.artistId,
        status: 'detected',
        detectedUrl: input.detectedUrl,
        detectedPlatform: input.detectedPlatform,
        description: input.description,
        detectionMethod: input.detectionMethod,
        confidence: input.confidence,
        recommendedAction: input.recommendedAction,
        version: 1,
      },
    });

    return this.mapToInfringement(data);
  }

  /**
   * 侵害を取得
   */
  async getInfringement(id: string): Promise<Infringement | null> {
    const data = await this.prisma.infringement.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToInfringement(data);
  }

  /**
   * 侵害を更新
   */
  async updateInfringement(
    id: string,
    input: UpdateInfringementInput
  ): Promise<Infringement> {
    const current = await this.prisma.infringement.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`Infringement not found: ${id}`);
    }

    const updateData: any = {
      updatedAt: new Date(),
      version: current.version + 1,
    };

    if (input.status !== undefined) updateData.status = input.status;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.actionTaken !== undefined) updateData.actionTaken = input.actionTaken;
    if (input.actionDate !== undefined) updateData.actionDate = input.actionDate;
    if (input.actionNotes !== undefined) updateData.actionNotes = input.actionNotes;
    if (input.resolvedAt !== undefined) updateData.resolvedAt = input.resolvedAt;
    if (input.resolution !== undefined) updateData.resolution = input.resolution;

    const updated = await this.prisma.infringement.update({
      where: { id },
      data: updateData,
    });

    return this.mapToInfringement(updated);
  }

  /**
   * 侵害を削除
   */
  async deleteInfringement(id: string): Promise<void> {
    await this.prisma.infringement.delete({
      where: { id },
    });
  }

  /**
   * 侵害を検索
   */
  async findInfringements(filter?: InfringementFilter): Promise<Infringement[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.contentId) where.contentId = filter.contentId;
    if (filter?.rightId) where.rightId = filter.rightId;
    if (filter?.status) where.status = filter.status;

    if (filter?.dateFrom || filter?.dateTo) {
      where.detectedAt = {};
      if (filter.dateFrom) where.detectedAt.gte = filter.dateFrom;
      if (filter.dateTo) where.detectedAt.lte = filter.dateTo;
    }

    const results = await this.prisma.infringement.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
    });

    return results.map(data => this.mapToInfringement(data));
  }

  // ============================================================================
  // Monitoring Rule
  // ============================================================================

  /**
   * 監視ルールを作成
   */
  async createMonitoringRule(
    input: CreateMonitoringRuleInput
  ): Promise<MonitoringRule> {
    const data = await this.prisma.monitoringRule.create({
      data: {
        artistId: input.artistId,
        name: input.name,
        isActive: true,
        contentIds: JSON.stringify(input.contentIds),
        platforms: JSON.stringify(input.platforms),
        keywords: JSON.stringify(input.keywords),
        autoAction: input.autoAction,
        notifyEmail: input.notifyEmail,
        totalDetections: 0,
      },
    });

    return this.mapToMonitoringRule(data);
  }

  /**
   * 監視ルールを取得
   */
  async getMonitoringRule(id: string): Promise<MonitoringRule | null> {
    const data = await this.prisma.monitoringRule.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToMonitoringRule(data);
  }

  /**
   * 監視ルールを更新
   */
  async updateMonitoringRule(
    id: string,
    updates: Partial<MonitoringRule>
  ): Promise<MonitoringRule> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.contentIds !== undefined)
      updateData.contentIds = JSON.stringify(updates.contentIds);
    if (updates.platforms !== undefined)
      updateData.platforms = JSON.stringify(updates.platforms);
    if (updates.keywords !== undefined)
      updateData.keywords = JSON.stringify(updates.keywords);
    if (updates.autoAction !== undefined) updateData.autoAction = updates.autoAction;
    if (updates.notifyEmail !== undefined) updateData.notifyEmail = updates.notifyEmail;
    if (updates.lastRunAt !== undefined) updateData.lastRunAt = updates.lastRunAt;
    if (updates.totalDetections !== undefined)
      updateData.totalDetections = updates.totalDetections;

    const updated = await this.prisma.monitoringRule.update({
      where: { id },
      data: updateData,
    });

    return this.mapToMonitoringRule(updated);
  }

  /**
   * 監視ルールを削除
   */
  async deleteMonitoringRule(id: string): Promise<void> {
    await this.prisma.monitoringRule.delete({
      where: { id },
    });
  }

  /**
   * アクティブな監視ルールを取得
   */
  async getActiveMonitoringRules(artistId?: string): Promise<MonitoringRule[]> {
    const where: any = { isActive: true };
    if (artistId) where.artistId = artistId;

    const results = await this.prisma.monitoringRule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return results.map(data => this.mapToMonitoringRule(data));
  }

  // ============================================================================
  // 統計
  // ============================================================================

  /**
   * 権利保護統計を取得
   */
  async getProtectionStats(artistId: string): Promise<ProtectionStats> {
    const rights = await this.prisma.right.findMany({
      where: { artistId },
    });

    const infringements = await this.prisma.infringement.findMany({
      where: { artistId },
    });

    const activeInfringements = infringements.filter(
      i => i.status !== 'resolved' && i.status !== 'dismissed'
    );

    const resolvedInfringements = infringements.filter(
      i => i.status === 'resolved'
    );

    const byStatus = infringements.reduce(
      (acc, i) => {
        const status = i.status as InfringementStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<InfringementStatus, number>
    );

    const byAction = infringements.reduce(
      (acc, i) => {
        if (i.actionTaken) {
          const action = i.actionTaken as ActionType;
          acc[action] = (acc[action] || 0) + 1;
        }
        return acc;
      },
      {} as Record<ActionType, number>
    );

    // 平均解決時間を計算（日数）
    const resolvedWithDates = resolvedInfringements.filter(
      i => i.resolvedAt && i.detectedAt
    );
    const totalDays = resolvedWithDates.reduce((sum, i) => {
      const days =
        (i.resolvedAt!.getTime() - i.detectedAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    const averageResolutionTime =
      resolvedWithDates.length > 0 ? totalDays / resolvedWithDates.length : 0;

    return {
      totalRights: rights.length,
      totalInfringements: infringements.length,
      activeInfringements: activeInfringements.length,
      resolvedInfringements: resolvedInfringements.length,
      byStatus,
      byAction,
      averageResolutionTime: Math.round(averageResolutionTime * 10) / 10,
    };
  }

  // ============================================================================
  // マッピング関数
  // ============================================================================

  private mapToRight(data: any): Right {
    const territories: string[] = JSON.parse(data.territories);

    return {
      id: data.id,
      contentId: data.contentId,
      artistId: data.artistId,
      rightType: data.rightType as any,
      rightHolder: data.rightHolder,
      rightHolderContact: data.rightHolderContact ?? undefined,
      licenseType: data.licenseType as any,
      licenseTerms: data.licenseTerms ?? undefined,
      startDate: data.startDate,
      endDate: data.endDate ?? undefined,
      territories,
      registrationNumber: data.registrationNumber ?? undefined,
      isrcCode: data.isrcCode ?? undefined,
      iswcCode: data.iswcCode ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }

  private mapToInfringement(data: any): Infringement {
    return {
      id: data.id,
      rightId: data.rightId,
      contentId: data.contentId,
      artistId: data.artistId,
      status: data.status as InfringementStatus,
      detectedUrl: data.detectedUrl,
      detectedPlatform: data.detectedPlatform,
      description: data.description,
      detectedAt: data.detectedAt,
      detectionMethod: data.detectionMethod,
      confidence: data.confidence,
      recommendedAction: data.recommendedAction as ActionType,
      actionTaken: (data.actionTaken as ActionType) ?? undefined,
      actionDate: data.actionDate ?? undefined,
      actionNotes: data.actionNotes ?? undefined,
      resolvedAt: data.resolvedAt ?? undefined,
      resolution: data.resolution ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }

  private mapToMonitoringRule(data: any): MonitoringRule {
    const contentIds: string[] = JSON.parse(data.contentIds);
    const platforms: string[] = JSON.parse(data.platforms);
    const keywords: string[] = JSON.parse(data.keywords);

    return {
      id: data.id,
      artistId: data.artistId,
      name: data.name,
      isActive: data.isActive,
      contentIds,
      platforms,
      keywords,
      autoAction: (data.autoAction as ActionType) ?? undefined,
      notifyEmail: data.notifyEmail ?? undefined,
      lastRunAt: data.lastRunAt ?? undefined,
      totalDetections: data.totalDetections,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
