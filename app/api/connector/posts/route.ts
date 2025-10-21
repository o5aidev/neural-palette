import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreatePostRequest {
  contentId?: string
  type: string
  content: string
  mediaUrls?: string[]
  platforms: string[]
  scheduledAt?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')

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

    const where: {
      artistId: string
      status?: string
    } = {
      artistId: artist.id
    }

    if (status) where.status = status

    const posts = await prisma.socialPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Filter by platform if specified
    let filteredPosts = posts
    if (platform) {
      filteredPosts = posts.filter(p => {
        const platforms = JSON.parse(p.platforms) as string[]
        return platforms.includes(platform)
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredPosts.map(p => ({
        id: p.id,
        artistId: p.artistId,
        contentId: p.contentId,
        type: p.type,
        content: p.content,
        mediaUrls: JSON.parse(p.mediaUrls),
        platforms: JSON.parse(p.platforms),
        status: p.status,
        scheduledAt: p.scheduledAt,
        postedAt: p.postedAt,
        platformPosts: JSON.parse(p.platformPosts),
        engagementStats: JSON.parse(p.engagementStats),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/connector/posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostRequest = await request.json()

    if (!body.content?.trim() || !body.platforms || body.platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content and platforms are required' },
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

    // Create social post
    const post = await prisma.socialPost.create({
      data: {
        artistId: artist.id,
        contentId: body.contentId,
        type: body.type || 'text',
        content: body.content,
        mediaUrls: JSON.stringify(body.mediaUrls || []),
        platforms: JSON.stringify(body.platforms),
        status: body.scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        platformPosts: JSON.stringify([]),
        engagementStats: JSON.stringify({
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
          clickThroughs: 0,
          lastUpdatedAt: new Date()
        }),
        version: 1
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: post.id,
        artistId: post.artistId,
        contentId: post.contentId,
        type: post.type,
        content: post.content,
        mediaUrls: JSON.parse(post.mediaUrls),
        platforms: JSON.parse(post.platforms),
        status: post.status,
        scheduledAt: post.scheduledAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/connector/posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
