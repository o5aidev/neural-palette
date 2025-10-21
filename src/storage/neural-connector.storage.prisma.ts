/**
 * Neural Connector Prisma ストレージ実装
 *
 * SNS連携のデータベース操作
 */

import { PrismaClient } from '../generated/prisma/index.js';
import type {
  SocialConnection,
  CreateSocialConnectionInput,
  SocialPost,
  CreateSocialPostInput,
  UpdateSocialPostInput,
  SocialConnectionFilter,
  SocialPostFilter,
  PostStatus,
  SocialPlatform,
  PlatformPost,
  EngagementStats,
} from '../types/neural-connector.js';

export class NeuralConnectorStoragePrisma {
  constructor(private prisma: PrismaClient) {}

  // ============================================================================
  // Social Connection
  // ============================================================================

  /**
   * SNSアカウント接続を作成
   */
  async createSocialConnection(
    input: CreateSocialConnectionInput
  ): Promise<SocialConnection> {
    const data = await this.prisma.socialConnection.create({
      data: {
        artistId: input.artistId,
        platform: input.platform,
        accountId: input.accountId,
        accountName: input.accountName,
        isActive: true,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        tokenExpiresAt: input.tokenExpiresAt,
      },
    });

    return this.mapToSocialConnection(data);
  }

  /**
   * SNSアカウント接続を取得
   */
  async getSocialConnection(id: string): Promise<SocialConnection | null> {
    const data = await this.prisma.socialConnection.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToSocialConnection(data);
  }

  /**
   * SNSアカウント接続を更新
   */
  async updateSocialConnection(
    id: string,
    updates: Partial<SocialConnection>
  ): Promise<SocialConnection> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.accountName !== undefined)
      updateData.accountName = updates.accountName;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.accessToken !== undefined)
      updateData.accessToken = updates.accessToken;
    if (updates.refreshToken !== undefined)
      updateData.refreshToken = updates.refreshToken;
    if (updates.tokenExpiresAt !== undefined)
      updateData.tokenExpiresAt = updates.tokenExpiresAt;
    if (updates.followerCount !== undefined)
      updateData.followerCount = updates.followerCount;
    if (updates.lastSyncedAt !== undefined)
      updateData.lastSyncedAt = updates.lastSyncedAt;

    const updated = await this.prisma.socialConnection.update({
      where: { id },
      data: updateData,
    });

    return this.mapToSocialConnection(updated);
  }

  /**
   * SNSアカウント接続を削除
   */
  async deleteSocialConnection(id: string): Promise<void> {
    await this.prisma.socialConnection.delete({
      where: { id },
    });
  }

  /**
   * SNSアカウント接続を検索
   */
  async findSocialConnections(
    filter?: SocialConnectionFilter
  ): Promise<SocialConnection[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.platform) where.platform = filter.platform;
    if (filter?.status) {
      // Map ConnectionStatus to isActive boolean
      where.isActive = filter.status === 'active';
    }

    const results = await this.prisma.socialConnection.findMany({
      where,
      orderBy: { connectedAt: 'desc' },
    });

    return results.map(data => this.mapToSocialConnection(data));
  }

  // ============================================================================
  // Social Post
  // ============================================================================

  /**
   * SNS投稿を作成
   */
  async createSocialPost(input: CreateSocialPostInput): Promise<SocialPost> {
    const data = await this.prisma.socialPost.create({
      data: {
        artistId: input.artistId,
        contentId: input.contentId,
        type: input.type,
        content: input.content,
        mediaUrls: JSON.stringify(input.mediaUrls || []),
        platforms: JSON.stringify(input.platforms),
        status: 'draft',
        scheduledAt: input.scheduledAt,
        platformPosts: JSON.stringify([]),
        engagementStats: JSON.stringify({
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalViews: 0,
          byPlatform: {},
        }),
        version: 1,
      },
    });

    return this.mapToSocialPost(data);
  }

  /**
   * SNS投稿を取得
   */
  async getSocialPost(id: string): Promise<SocialPost | null> {
    const data = await this.prisma.socialPost.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToSocialPost(data);
  }

  /**
   * SNS投稿を更新
   */
  async updateSocialPost(
    id: string,
    input: UpdateSocialPostInput
  ): Promise<SocialPost> {
    const current = await this.prisma.socialPost.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error(`SocialPost not found: ${id}`);
    }

    const updateData: any = {
      updatedAt: new Date(),
      version: current.version + 1,
    };

    if (input.content !== undefined) updateData.content = input.content;
    if (input.mediaUrls !== undefined)
      updateData.mediaUrls = JSON.stringify(input.mediaUrls);
    if (input.platforms !== undefined)
      updateData.platforms = JSON.stringify(input.platforms);
    if (input.status !== undefined) updateData.status = input.status;
    if (input.scheduledAt !== undefined) updateData.scheduledAt = input.scheduledAt;

    const updated = await this.prisma.socialPost.update({
      where: { id },
      data: updateData,
    });

    return this.mapToSocialPost(updated);
  }

  /**
   * SNS投稿を削除
   */
  async deleteSocialPost(id: string): Promise<void> {
    await this.prisma.socialPost.delete({
      where: { id },
    });
  }

  /**
   * SNS投稿を検索
   */
  async findSocialPosts(filter?: SocialPostFilter): Promise<SocialPost[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.contentId) where.contentId = filter.contentId;
    if (filter?.status) where.status = filter.status;

    const results = await this.prisma.socialPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return results.map(data => this.mapToSocialPost(data));
  }

  /**
   * スケジュール済み投稿を取得
   */
  async getScheduledPosts(beforeDate: Date): Promise<SocialPost[]> {
    const results = await this.prisma.socialPost.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: beforeDate,
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return results.map(data => this.mapToSocialPost(data));
  }

  // ============================================================================
  // マッピング関数
  // ============================================================================

  private mapToSocialConnection(data: any): SocialConnection {
    return {
      id: data.id,
      artistId: data.artistId,
      platform: data.platform as SocialPlatform,
      accountId: data.accountId,
      accountName: data.accountName,
      isActive: data.isActive,
      accessToken: data.accessToken ?? undefined,
      refreshToken: data.refreshToken ?? undefined,
      tokenExpiresAt: data.tokenExpiresAt ?? undefined,
      followerCount: data.followerCount ?? undefined,
      lastSyncedAt: data.lastSyncedAt ?? undefined,
      connectedAt: data.connectedAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToSocialPost(data: any): SocialPost {
    const mediaUrls: string[] = JSON.parse(data.mediaUrls);
    const platforms: SocialPlatform[] = JSON.parse(data.platforms);
    const platformPosts: PlatformPost[] = JSON.parse(data.platformPosts);
    const engagementStats: EngagementStats = JSON.parse(data.engagementStats);

    return {
      id: data.id,
      artistId: data.artistId,
      contentId: data.contentId ?? undefined,
      type: data.type as any,
      content: data.content,
      mediaUrls,
      platforms,
      status: data.status as PostStatus,
      scheduledAt: data.scheduledAt ?? undefined,
      postedAt: data.postedAt ?? undefined,
      platformPosts,
      engagementStats,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }
}
