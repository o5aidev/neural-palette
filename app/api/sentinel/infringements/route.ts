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
            title: true,
            type: true
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
        rightTitle: i.right.title,
        rightType: i.right.type,
        url: i.url,
        platform: i.platform,
        description: i.description,
        severity: i.severity,
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
        url: body.url,
        platform: body.platform,
        description: body.description,
        severity: body.severity || 'medium',
        status: 'detected',
        detectedAt: new Date()
      },
      include: {
        right: {
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
        id: infringement.id,
        artistId: infringement.artistId,
        rightId: infringement.rightId,
        rightTitle: infringement.right.title,
        url: infringement.url,
        platform: infringement.platform,
        description: infringement.description,
        severity: infringement.severity,
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
