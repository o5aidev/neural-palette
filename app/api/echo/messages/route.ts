import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { personalizedAI } from '@/src/services/personalized-ai.service'
import { SentimentType } from '@/src/types/neural-echo'

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

    // Get conversation threads for this artist
    const threads = await prisma.conversationThread.findMany({
      where: {
        artistId: artist.id,
        ...(sentiment && { sentiment })
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit
    })

    // Get messages from these threads
    const messages = await prisma.message.findMany({
      where: {
        threadId: { in: threads.map(t => t.id) },
        role: 'fan'
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: messages.map(m => ({
        id: m.id,
        content: m.content,
        sentiment: m.sentiment,
        confidence: m.confidence,
        metadata: m.metadata ? JSON.parse(m.metadata) : {},
        createdAt: m.timestamp,
        updatedAt: m.timestamp
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
    let sentimentResult: { sentiment: SentimentType; confidence: number }
    try {
      sentimentResult = await personalizedAI.analyzeSentiment(body.content)
    } catch (error: any) {
      console.warn('AI sentiment analysis failed, using fallback:', error?.message || error)
      sentimentResult = {
        sentiment: 'neutral' as const,
        confidence: 50
      }
    }

    // Create or get conversation thread
    const thread = await prisma.conversationThread.create({
      data: {
        artistId: artist.id,
        fanId: 'anonymous', // For web submissions
        channel: body.platform || 'web',
        status: 'pending',
        priority: 'normal',
        sentiment: sentimentResult.sentiment,
        topics: '[]',
        requiresHumanReview: false,
        lastMessageAt: new Date()
      }
    })

    // Create fan message
    const message = await prisma.message.create({
      data: {
        threadId: thread.id,
        role: 'fan',
        content: body.content,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        content: message.content,
        sentiment: message.sentiment,
        confidence: message.confidence,
        metadata: message.metadata ? JSON.parse(message.metadata) : {},
        createdAt: message.timestamp,
        updatedAt: message.timestamp
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
