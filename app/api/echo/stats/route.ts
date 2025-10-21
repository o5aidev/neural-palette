import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get('artistId')

    // Get first artist if not specified
    let targetArtistId = artistId
    if (!targetArtistId) {
      const artist = await prisma.artistDNA.findFirst({
        orderBy: { createdAt: 'desc' }
      })
      if (!artist) {
        return NextResponse.json({
          success: true,
          data: {
            totalMessages: 0,
            withResponse: 0,
            averageConfidence: 0,
            bySentiment: {},
            recentMessages: []
          }
        })
      }
      targetArtistId = artist.id
    }

    // Get total messages
    const totalMessages = await prisma.fanMessage.count({
      where: { artistId: targetArtistId }
    })

    // Get messages with response
    const withResponse = await prisma.fanMessage.count({
      where: {
        artistId: targetArtistId,
        aiResponse: { not: null }
      }
    })

    // Get sentiment distribution
    const sentimentGroups = await prisma.fanMessage.groupBy({
      by: ['sentiment'],
      where: { artistId: targetArtistId },
      _count: true
    })

    const bySentiment: Record<string, number> = {}
    sentimentGroups.forEach(group => {
      bySentiment[group.sentiment] = group._count
    })

    // Calculate average confidence
    const messages = await prisma.fanMessage.findMany({
      where: { artistId: targetArtistId },
      select: { confidence: true }
    })

    const averageConfidence = messages.length > 0
      ? messages.reduce((sum, m) => sum + m.confidence, 0) / messages.length
      : 0

    // Get recent messages
    const recentMessages = await prisma.fanMessage.findMany({
      where: { artistId: targetArtistId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        content: true,
        sentiment: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalMessages,
        withResponse,
        averageConfidence: Math.round(averageConfidence * 10) / 10,
        bySentiment,
        recentMessages
      }
    })
  } catch (error) {
    console.error('GET /api/echo/stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
