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

    // Get total messages (count all messages in conversations)
    const totalMessages = await prisma.message.count({
      where: {
        thread: {
          artistId: targetArtistId
        }
      }
    })

    // Get messages with AI response (count messages with role 'ai')
    const withResponse = await prisma.message.count({
      where: {
        thread: {
          artistId: targetArtistId
        },
        role: 'ai'
      }
    })

    // Get sentiment distribution (only for messages with sentiment)
    const sentimentGroups = await prisma.message.groupBy({
      by: ['sentiment'],
      where: {
        thread: {
          artistId: targetArtistId
        },
        sentiment: { not: null }
      },
      _count: true
    })

    const bySentiment: Record<string, number> = {}
    sentimentGroups.forEach(group => {
      if (group.sentiment) {
        bySentiment[group.sentiment] = group._count._all || 0
      }
    })

    // Calculate average confidence (only for messages with confidence)
    const messages = await prisma.message.findMany({
      where: {
        thread: {
          artistId: targetArtistId
        },
        confidence: { not: null }
      },
      select: { confidence: true }
    })

    const averageConfidence = messages.length > 0
      ? messages.reduce((sum, m) => sum + (m.confidence || 0), 0) / messages.length
      : 0

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      where: {
        thread: {
          artistId: targetArtistId
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 5,
      select: {
        id: true,
        content: true,
        sentiment: true,
        timestamp: true
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
