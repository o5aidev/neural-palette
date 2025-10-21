import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateConnectionRequest {
  platform: string
  accountId: string
  accountName: string
  accessToken?: string
  refreshToken?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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
      platform?: string
    } = {
      artistId: artist.id
    }

    if (platform) where.platform = platform

    const connections = await prisma.socialConnection.findMany({
      where,
      orderBy: { connectedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: connections.map(c => ({
        id: c.id,
        artistId: c.artistId,
        platform: c.platform,
        accountId: c.accountId,
        accountName: c.accountName,
        isActive: c.isActive,
        followerCount: c.followerCount,
        lastSyncedAt: c.lastSyncedAt,
        connectedAt: c.connectedAt,
        updatedAt: c.updatedAt
        // Note: Do not expose tokens
      }))
    })
  } catch (error) {
    console.error('GET /api/connector/connections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateConnectionRequest = await request.json()

    if (!body.platform || !body.accountId || !body.accountName) {
      return NextResponse.json(
        { success: false, error: 'Platform, account ID, and account name are required' },
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

    // Create social connection
    const connection = await prisma.socialConnection.create({
      data: {
        artistId: artist.id,
        platform: body.platform,
        accountId: body.accountId,
        accountName: body.accountName,
        isActive: true,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: connection.id,
        artistId: connection.artistId,
        platform: connection.platform,
        accountId: connection.accountId,
        accountName: connection.accountName,
        isActive: connection.isActive,
        connectedAt: connection.connectedAt,
        updatedAt: connection.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/connector/connections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
