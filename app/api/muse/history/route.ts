import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sessionId = searchParams.get('sessionId')

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
    const where: any = {}
    if (sessionId) {
      where.sessionId = sessionId
    } else {
      // Get all sessions for this artist and fetch their results
      const sessions = await prisma.creativeSession.findMany({
        where: { artistId: artist.id },
        select: { id: true }
      })
      where.sessionId = { in: sessions.map(s => s.id) }
    }

    // Fetch generation results
    const results = await prisma.generationResult.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      take: limit,
      include: {
        session: {
          select: {
            title: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: results.map(r => ({
        id: r.id,
        sessionId: r.sessionId,
        sessionTitle: r.session.title,
        type: r.type,
        prompt: r.prompt,
        result: r.result,
        params: JSON.parse(r.params),
        tokensUsed: r.tokensUsed,
        model: r.model,
        confidence: r.confidence,
        rating: r.rating,
        isSelected: r.isSelected,
        generatedAt: r.generatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/muse/history error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
