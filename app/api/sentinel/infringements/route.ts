import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateInfringementRequest {
  rightId: string
  url: string
  platform: string
  description?: string
  severity?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const rightId = searchParams.get('rightId')

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
      severity?: string
      rightId?: string
    } = {
      artistId: artist.id
    }

    if (status) where.status = status
    if (severity) where.severity = severity
    if (rightId) where.rightId = rightId

    const infringements = await prisma.infringement.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      take: limit,
      include: {
        right: {
          select: {
            rightType: true,
            contentId: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: infringements.map(i => ({
        id: i.id,
        artistId: i.artistId,
        rightId: i.rightId,
        rightType: i.right.rightType,
        contentId: i.right.contentId,
        detectedUrl: i.detectedUrl,
        detectedPlatform: i.detectedPlatform,
        description: i.description,
        status: i.status,
        detectedAt: i.detectedAt,
        resolvedAt: i.resolvedAt,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/sentinel/infringements error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateInfringementRequest = await request.json()

    if (!body.rightId || !body.url || !body.platform) {
      return NextResponse.json(
        { success: false, error: 'Right ID, URL, and platform are required' },
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

    // Verify right exists
    const right = await prisma.right.findUnique({
      where: { id: body.rightId }
    })

    if (!right) {
      return NextResponse.json(
        { success: false, error: 'Right not found' },
        { status: 404 }
      )
    }

    // Create infringement
    const infringement = await prisma.infringement.create({
      data: {
        artistId: artist.id,
        rightId: body.rightId,
        contentId: body.contentId,
        detectedUrl: body.url,
        detectedPlatform: body.platform,
        description: body.description,
        detectionMethod: 'manual',
        confidence: 50,
        recommendedAction: 'review',
        status: 'detected'
      },
      include: {
        right: {
          select: {
            rightType: true,
            contentId: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: infringement.id,
        artistId: infringement.artistId,
        rightId: infringement.rightId,
        rightType: infringement.right.rightType,
        contentId: infringement.contentId,
        detectedUrl: infringement.detectedUrl,
        detectedPlatform: infringement.detectedPlatform,
        description: infringement.description,
        status: infringement.status,
        detectedAt: infringement.detectedAt,
        createdAt: infringement.createdAt,
        updatedAt: infringement.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/sentinel/infringements error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
