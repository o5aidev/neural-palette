/**
 * Neural Echo Prisma ストレージ実装
 *
 * ファン交流AIのデータベース操作
 */

import { PrismaClient } from '../generated/prisma/index.js';
import type {
  FanProfile,
  CreateFanProfileInput,
  FanProfileFilter,
  ConversationThread,
  CreateConversationThreadInput,
  ConversationThreadFilter,
  Message,
  AddMessageInput,
  ResponseTemplate,
  CreateResponseTemplateInput,
  ResponseConfig,
  EchoStats,
  SentimentType,
  ConversationChannel,
  ResponseStatus,
  ConversationPriority,
} from '../types/neural-echo.js';

export class NeuralEchoStoragePrisma {
  constructor(private prisma: PrismaClient) {}

  // ============================================================================
  // Fan Profile
  // ============================================================================

  /**
   * ファンプロファイルを作成
   */
  async createFanProfile(input: CreateFanProfileInput): Promise<FanProfile> {
    const data = await this.prisma.fanProfile.create({
      data: {
        artistId: input.artistId,
        displayName: input.displayName,
        externalId: input.externalId,
        platform: input.platform,
        email: input.email,
        sentimentHistory: JSON.stringify([]),
        avgSentiment: 'neutral',
        topics: JSON.stringify([]),
        isVIP: false,
        engagementScore: 0,
        tags: JSON.stringify(input.tags || []),
      },
    });

    return this.mapToFanProfile(data);
  }

  /**
   * ファンプロファイルを取得
   */
  async getFanProfile(id: string): Promise<FanProfile | null> {
    const data = await this.prisma.fanProfile.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToFanProfile(data);
  }

  /**
   * ファンプロファイルを更新
   */
  async updateFanProfile(
    id: string,
    updates: Partial<FanProfile>
  ): Promise<FanProfile> {
    const updateData: any = { updatedAt: new Date() };

    if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.sentimentHistory !== undefined)
      updateData.sentimentHistory = JSON.stringify(updates.sentimentHistory);
    if (updates.avgSentiment !== undefined) updateData.avgSentiment = updates.avgSentiment;
    if (updates.topics !== undefined) updateData.topics = JSON.stringify(updates.topics);
    if (updates.preferredChannel !== undefined)
      updateData.preferredChannel = updates.preferredChannel;
    if (updates.isVIP !== undefined) updateData.isVIP = updates.isVIP;
    if (updates.engagementScore !== undefined)
      updateData.engagementScore = updates.engagementScore;
    if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const updated = await this.prisma.fanProfile.update({
      where: { id },
      data: updateData,
    });

    return this.mapToFanProfile(updated);
  }

  /**
   * ファンプロファイルを検索
   */
  async findFanProfiles(filter?: FanProfileFilter): Promise<FanProfile[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.platform) where.platform = filter.platform;
    if (filter?.isVIP !== undefined) where.isVIP = filter.isVIP;
    if (filter?.minEngagementScore !== undefined) {
      where.engagementScore = { gte: filter.minEngagementScore };
    }

    const results = await this.prisma.fanProfile.findMany({
      where,
      orderBy: { engagementScore: 'desc' },
    });

    return results.map(data => this.mapToFanProfile(data));
  }

  // ============================================================================
  // Conversation Thread
  // ============================================================================

  /**
   * 会話スレッドを作成
   */
  async createConversationThread(
    input: CreateConversationThreadInput
  ): Promise<ConversationThread> {
    const data = await this.prisma.conversationThread.create({
      data: {
        artistId: input.artistId,
        fanId: input.fanId,
        channel: input.channel,
        subject: input.subject,
        status: 'pending',
        priority: input.priority || 'normal',
        messageCount: 0,
        sentiment: 'neutral',
        topics: JSON.stringify([]),
        requiresHumanReview: false,
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    // 初期メッセージを追加
    await this.addMessage({
      threadId: data.id,
      role: 'fan',
      content: input.initialMessage,
    });

    // ファンプロファイルを更新
    await this.prisma.fanProfile.update({
      where: { id: input.fanId },
      data: {
        lastInteractionAt: new Date(),
        totalInteractions: { increment: 1 },
      },
    });

    return this.getConversationThread(data.id) as Promise<ConversationThread>;
  }

  /**
   * 会話スレッドを取得
   */
  async getConversationThread(id: string): Promise<ConversationThread | null> {
    const data = await this.prisma.conversationThread.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!data) return null;
    return this.mapToConversationThread(data);
  }

  /**
   * 会話スレッドを更新
   */
  async updateConversationThread(
    id: string,
    updates: Partial<ConversationThread>
  ): Promise<ConversationThread> {
    const updateData: any = { updatedAt: new Date() };

    if (updates.status !== undefined) {
      updateData.status = updates.status;
      if (updates.status === 'sent') {
        updateData.resolvedAt = new Date();
      }
    }
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.sentiment !== undefined) updateData.sentiment = updates.sentiment;
    if (updates.topics !== undefined) updateData.topics = JSON.stringify(updates.topics);
    if (updates.requiresHumanReview !== undefined)
      updateData.requiresHumanReview = updates.requiresHumanReview;

    const updated = await this.prisma.conversationThread.update({
      where: { id },
      data: updateData,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return this.mapToConversationThread(updated);
  }

  /**
   * 会話スレッドを検索
   */
  async findConversationThreads(
    filter?: ConversationThreadFilter
  ): Promise<ConversationThread[]> {
    const where: any = {};

    if (filter?.artistId) where.artistId = filter.artistId;
    if (filter?.fanId) where.fanId = filter.fanId;
    if (filter?.channel) where.channel = filter.channel;
    if (filter?.status) where.status = filter.status;
    if (filter?.priority) where.priority = filter.priority;
    if (filter?.sentiment) where.sentiment = filter.sentiment;
    if (filter?.requiresReview !== undefined)
      where.requiresHumanReview = filter.requiresReview;

    const results = await this.prisma.conversationThread.findMany({
      where,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return results.map(data => this.mapToConversationThread(data));
  }

  // ============================================================================
  // Message
  // ============================================================================

  /**
   * メッセージを追加
   */
  async addMessage(input: AddMessageInput): Promise<Message> {
    const data = await this.prisma.message.create({
      data: {
        threadId: input.threadId,
        role: input.role,
        content: input.content,
        sentiment: input.sentiment,
        metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
      },
    });

    // スレッドを更新
    await this.prisma.conversationThread.update({
      where: { id: input.threadId },
      data: {
        messageCount: { increment: 1 },
        lastMessageAt: new Date(),
      },
    });

    return this.mapToMessage(data);
  }

  /**
   * メッセージを更新（フィードバック用）
   */
  async updateMessage(
    id: string,
    updates: {
      rating?: number;
      wasEdited?: boolean;
      editedContent?: string;
      rejectionReason?: string;
    }
  ): Promise<Message> {
    const updateData: any = {};

    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.wasEdited !== undefined) updateData.wasEdited = updates.wasEdited;
    if (updates.editedContent !== undefined) updateData.editedContent = updates.editedContent;
    if (updates.rejectionReason !== undefined)
      updateData.rejectionReason = updates.rejectionReason;

    const updated = await this.prisma.message.update({
      where: { id },
      data: updateData,
    });

    return this.mapToMessage(updated);
  }

  // ============================================================================
  // Response Template
  // ============================================================================

  /**
   * 応答テンプレートを作成
   */
  async createResponseTemplate(
    input: CreateResponseTemplateInput
  ): Promise<ResponseTemplate> {
    const data = await this.prisma.responseTemplate.create({
      data: {
        artistId: input.artistId,
        name: input.name,
        description: input.description,
        category: input.category,
        template: input.template,
        variables: JSON.stringify(input.variables),
        triggerKeywords: input.triggerKeywords
          ? JSON.stringify(input.triggerKeywords)
          : undefined,
        sentiment: input.sentiment,
        channel: input.channel,
        usageCount: 0,
        isActive: true,
        tags: JSON.stringify(input.tags || []),
      },
    });

    return this.mapToResponseTemplate(data);
  }

  /**
   * 応答テンプレートを取得
   */
  async getResponseTemplate(id: string): Promise<ResponseTemplate | null> {
    const data = await this.prisma.responseTemplate.findUnique({
      where: { id },
    });

    if (!data) return null;
    return this.mapToResponseTemplate(data);
  }

  /**
   * 応答テンプレートを検索
   */
  async findResponseTemplates(filter?: any): Promise<ResponseTemplate[]> {
    const where: any = { isActive: true };

    if (filter?.artistId !== undefined) {
      where.OR = [{ artistId: filter.artistId }, { artistId: null }];
    }
    if (filter?.category) where.category = filter.category;
    if (filter?.sentiment) where.sentiment = filter.sentiment;
    if (filter?.channel) where.channel = filter.channel;

    const results = await this.prisma.responseTemplate.findMany({
      where,
      orderBy: { usageCount: 'desc' },
    });

    return results.map(data => this.mapToResponseTemplate(data));
  }

  /**
   * テンプレート使用数を増やす
   */
  async incrementTemplateUsage(id: string): Promise<void> {
    await this.prisma.responseTemplate.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
      },
    });
  }

  // ============================================================================
  // Response Config
  // ============================================================================

  /**
   * 応答設定を作成または更新
   */
  async upsertResponseConfig(config: Partial<ResponseConfig> & { artistId: string }): Promise<ResponseConfig> {
    const data = await this.prisma.responseConfig.upsert({
      where: { artistId: config.artistId },
      create: {
        artistId: config.artistId,
        isEnabled: config.isEnabled ?? true,
        autoApprove: config.autoApprove ?? false,
        autoSend: config.autoSend ?? false,
        minConfidence: config.minConfidence ?? 70,
        channelSettings: JSON.stringify(config.channelSettings || {}),
        tone: config.tone || 'friendly',
        maxResponseLength: config.maxResponseLength ?? 500,
        useEmojis: config.useEmojis ?? true,
        notifyOnNewMessage: config.notifyOnNewMessage ?? true,
        version: 1,
      },
      update: {
        isEnabled: config.isEnabled,
        autoApprove: config.autoApprove,
        autoSend: config.autoSend,
        minConfidence: config.minConfidence,
        channelSettings: config.channelSettings
          ? JSON.stringify(config.channelSettings)
          : undefined,
        tone: config.tone,
        maxResponseLength: config.maxResponseLength,
        useEmojis: config.useEmojis,
        maxResponsesPerDay: config.maxResponsesPerDay,
        maxResponsesPerFan: config.maxResponsesPerFan,
        notifyOnNewMessage: config.notifyOnNewMessage,
        notifyEmail: config.notifyEmail,
        updatedAt: new Date(),
        version: { increment: 1 },
      },
    });

    return this.mapToResponseConfig(data);
  }

  /**
   * 応答設定を取得
   */
  async getResponseConfig(artistId: string): Promise<ResponseConfig | null> {
    const data = await this.prisma.responseConfig.findUnique({
      where: { artistId },
    });

    if (!data) return null;
    return this.mapToResponseConfig(data);
  }

  // ============================================================================
  // 統計
  // ============================================================================

  /**
   * 交流統計を取得
   */
  async getEchoStats(artistId: string): Promise<EchoStats> {
    const fans = await this.prisma.fanProfile.findMany({
      where: { artistId },
    });

    const threads = await this.prisma.conversationThread.findMany({
      where: { artistId },
      include: {
        messages: true,
      },
    });

    const totalFans = fans.length;
    const vipFans = fans.filter(f => f.isVIP).length;
    const totalThreads = threads.length;
    const activeThreads = threads.filter(
      t => t.status !== 'sent' && t.status !== 'rejected'
    ).length;

    const allMessages = threads.flatMap(t => t.messages);
    const totalMessages = allMessages.length;
    const aiResponses = allMessages.filter(m => m.role === 'ai');
    const aiResponsesGenerated = aiResponses.length;
    const aiResponsesApproved = aiResponses.filter(m => m.rating && m.rating >= 3).length;

    // 平均応答時間（簡易版）
    const avgResponseTime = 300; // 仮の値（秒）

    // 平均信頼度
    const confidences = aiResponses.map(m => m.confidence).filter(c => c !== null);
    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((sum, c) => sum + (c || 0), 0) / confidences.length
        : 0;

    // 感情別集計
    const sentimentBreakdown = threads.reduce(
      (acc, t) => {
        const sentiment = t.sentiment as SentimentType;
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<SentimentType, number>
    );

    // チャネル別集計
    const channelBreakdown = threads.reduce(
      (acc, t) => {
        const channel = t.channel as ConversationChannel;
        acc[channel] = (acc[channel] || 0) + 1;
        return acc;
      },
      {} as Record<ConversationChannel, number>
    );

    // トップファン
    const topFans = fans
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10)
      .map(f => this.mapToFanProfile(f));

    // 最近のスレッド
    const recentThreads = threads
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
      .slice(0, 10)
      .map(t => this.mapToConversationThread(t));

    return {
      totalFans,
      vipFans,
      totalThreads,
      activeThreads,
      totalMessages,
      aiResponsesGenerated,
      aiResponsesApproved,
      avgResponseTime,
      avgConfidence: Math.round(avgConfidence),
      sentimentBreakdown,
      channelBreakdown,
      topFans,
      recentThreads,
    };
  }

  // ============================================================================
  // マッピング関数
  // ============================================================================

  private mapToFanProfile(data: any): FanProfile {
    const sentimentHistory: SentimentType[] = JSON.parse(data.sentimentHistory);
    const topics: string[] = JSON.parse(data.topics);
    const tags: string[] = JSON.parse(data.tags);

    return {
      id: data.id,
      artistId: data.artistId,
      displayName: data.displayName,
      externalId: data.externalId ?? undefined,
      platform: data.platform ?? undefined,
      email: data.email ?? undefined,
      firstInteractionAt: data.firstInteractionAt,
      lastInteractionAt: data.lastInteractionAt,
      totalInteractions: data.totalInteractions,
      sentimentHistory,
      avgSentiment: data.avgSentiment as SentimentType,
      topics,
      preferredChannel: (data.preferredChannel as ConversationChannel) ?? undefined,
      isVIP: data.isVIP,
      engagementScore: data.engagementScore,
      tags,
      notes: data.notes ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToConversationThread(data: any): ConversationThread {
    const topics: string[] = JSON.parse(data.topics);
    const messages = data.messages
      ? data.messages.map((m: any) => this.mapToMessage(m))
      : [];

    return {
      id: data.id,
      artistId: data.artistId,
      fanId: data.fanId,
      channel: data.channel as ConversationChannel,
      subject: data.subject ?? undefined,
      status: data.status as ResponseStatus,
      priority: data.priority as ConversationPriority,
      messages,
      messageCount: data.messageCount,
      sentiment: data.sentiment as SentimentType,
      topics,
      requiresHumanReview: data.requiresHumanReview,
      startedAt: data.startedAt,
      lastMessageAt: data.lastMessageAt,
      resolvedAt: data.resolvedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToMessage(data: any): Message {
    const metadata = data.metadata ? JSON.parse(data.metadata) : undefined;

    return {
      id: data.id,
      threadId: data.threadId,
      role: data.role as 'fan' | 'ai' | 'artist',
      content: data.content,
      sentiment: (data.sentiment as SentimentType) ?? undefined,
      confidence: data.confidence ?? undefined,
      generatedPrompt: data.generatedPrompt ?? undefined,
      model: data.model ?? undefined,
      tokensUsed: data.tokensUsed ?? undefined,
      rating: data.rating ?? undefined,
      wasEdited: data.wasEdited,
      editedContent: data.editedContent ?? undefined,
      rejectionReason: data.rejectionReason ?? undefined,
      metadata,
      timestamp: data.timestamp,
    };
  }

  private mapToResponseTemplate(data: any): ResponseTemplate {
    const variables: string[] = JSON.parse(data.variables);
    const triggerKeywords = data.triggerKeywords ? JSON.parse(data.triggerKeywords) : undefined;
    const tags: string[] = JSON.parse(data.tags);

    return {
      id: data.id,
      artistId: data.artistId ?? undefined,
      name: data.name,
      description: data.description ?? undefined,
      category: data.category,
      template: data.template,
      variables,
      triggerKeywords,
      sentiment: (data.sentiment as SentimentType) ?? undefined,
      channel: (data.channel as ConversationChannel) ?? undefined,
      usageCount: data.usageCount,
      avgRating: data.avgRating ?? undefined,
      isActive: data.isActive,
      tags,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToResponseConfig(data: any): ResponseConfig {
    const channelSettings = JSON.parse(data.channelSettings);

    return {
      id: data.id,
      artistId: data.artistId,
      isEnabled: data.isEnabled,
      autoApprove: data.autoApprove,
      autoSend: data.autoSend,
      minConfidence: data.minConfidence,
      channelSettings,
      tone: data.tone,
      maxResponseLength: data.maxResponseLength,
      useEmojis: data.useEmojis,
      maxResponsesPerDay: data.maxResponsesPerDay ?? undefined,
      maxResponsesPerFan: data.maxResponsesPerFan ?? undefined,
      notifyOnNewMessage: data.notifyOnNewMessage,
      notifyEmail: data.notifyEmail ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      version: data.version,
    };
  }
}
