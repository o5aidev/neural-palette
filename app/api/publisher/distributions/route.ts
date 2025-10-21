import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateDistributionRequest {
  contentId: string
  platforms: string[]
  scheduledDate?: string
  description?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const contentId = searchParams.get('contentId')

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
      status?: string
      contentId?: string
    } = {
      artistId: artist.id
    }

    if (status) where.status = status
    if (contentId) where.contentId = contentId

    const distributions = await prisma.distribution.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        content: {
          select: {
            title: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: distributions.map(d => ({
        id: d.id,
        artistId: d.artistId,
        contentId: d.contentId,
        contentTitle: d.content.title,
        contentType: d.content.type,
        platforms: JSON.parse(d.platforms),
        status: d.status,
        scheduledDate: d.scheduledDate,
        publishedDate: d.publishedDate,
        description: d.description,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/publisher/distributions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDistributionRequest = await request.json()

    if (!body.contentId || !body.platforms || body.platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content ID and platforms are required' },
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

    // Verify content exists
    const content = await prisma.content.findUnique({
      where: { id: body.contentId }
    })

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      )
    }

    // Create distribution
    const distribution = await prisma.distribution.create({
      data: {
        artistId: artist.id,
        contentId: body.contentId,
        title: content.title,
        platforms: JSON.stringify(body.platforms),
        status: body.scheduledDate ? 'scheduled' : 'draft',
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        description: body.description || null,
        tags: JSON.stringify([])
      },
      include: {
        content: {
          select: {
            title: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: distribution.id,
        artistId: distribution.artistId,
        contentId: distribution.contentId,
        contentTitle: distribution.content.title,
        platforms: JSON.parse(distribution.platforms),
        status: distribution.status,
        scheduledDate: distribution.scheduledDate,
        publishedDate: distribution.publishedDate,
        description: distribution.description,
        createdAt: distribution.createdAt,
        updatedAt: distribution.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/publisher/distributions error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
