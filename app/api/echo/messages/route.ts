import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { personalizedAI } from '@/src/services/personalized-ai.service'

interface CreateMessageRequest {
  content: string
  platform?: string
  metadata?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const sentiment = searchParams.get('sentiment')

    // Get first artist
    const artist = await prisma.artistDNA.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!artist) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Build query
    const where: {
      artistId: string
      sentiment?: string
    } = {
      artistId: artist.id
    }

    if (sentiment) {
      where.sentiment = sentiment
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: messages.map(m => ({
        id: m.id,
        artistId: m.artistId,
        content: m.content,
        platform: m.platform,
        sentiment: m.sentiment,
        confidence: m.confidence,
        aiResponse: m.aiResponse,
        responseGeneratedAt: m.responseGeneratedAt,
        metadata: m.metadata ? JSON.parse(m.metadata) : {},
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/echo/messages error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMessageRequest = await request.json()

    if (!body.content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Get first artist
    const artist = await prisma.artistDNA.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!artist) {
      return NextResponse.json(
        { success: false, error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Analyze sentiment (with fallback for testing environment)
    let sentimentResult
    try {
      sentimentResult = await personalizedAI.analyzeSentiment(body.content)
    } catch (error) {
      console.warn('AI sentiment analysis failed, using fallback:', error)
      sentimentResult = {
        sentiment: 'neutral' as const,
        confidence: 50
      }
    }

    // Create fan message
    const message = await prisma.message.create({
      data: {
        artistId: artist.id,
        content: body.content,
        platform: body.platform || 'web',
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        metadata: body.metadata ? JSON.stringify(body.metadata) : '{}'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        artistId: message.artistId,
        content: message.content,
        platform: message.platform,
        sentiment: message.sentiment,
        confidence: message.confidence,
        metadata: message.metadata ? JSON.parse(message.metadata) : {},
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/echo/messages error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
