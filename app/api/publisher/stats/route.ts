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
            totalDistributions: 0,
            publishedCount: 0,
            scheduledCount: 0,
            failedCount: 0,
            byStatus: {},
            byPlatform: {},
            recentDistributions: []
          }
        })
      }
      targetArtistId = artist.id
    }

    // Get total distributions
    const totalDistributions = await prisma.distribution.count({
      where: { artistId: targetArtistId }
    })

    // Get status counts
    const publishedCount = await prisma.distribution.count({
      where: { artistId: targetArtistId, status: 'published' }
    })

    const scheduledCount = await prisma.distribution.count({
      where: { artistId: targetArtistId, status: 'scheduled' }
    })

    const failedCount = await prisma.distribution.count({
      where: { artistId: targetArtistId, status: 'failed' }
    })

    // Get status distribution
    const statusGroups = await prisma.distribution.groupBy({
      by: ['status'],
      where: { artistId: targetArtistId },
      _count: true
    })

    const byStatus: Record<string, number> = {}
    statusGroups.forEach(group => {
      byStatus[group.status] = group._count
    })

    // Get platform distribution (need to parse JSON)
    const distributions = await prisma.distribution.findMany({
      where: { artistId: targetArtistId },
      select: { platforms: true }
    })

    const byPlatform: Record<string, number> = {}
    distributions.forEach(d => {
      const platforms = JSON.parse(d.platforms) as string[]
      platforms.forEach(platform => {
        byPlatform[platform] = (byPlatform[platform] || 0) + 1
      })
    })

    // Get recent distributions
    const recentDistributions = await prisma.distribution.findMany({
      where: { artistId: targetArtistId },
      orderBy: { createdAt: 'desc' },
      take: 5,
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
        totalDistributions,
        publishedCount,
        scheduledCount,
        failedCount,
        byStatus,
        byPlatform,
        recentDistributions: recentDistributions.map(d => ({
          id: d.id,
          contentTitle: d.content.title,
          contentType: d.content.type,
          platforms: JSON.parse(d.platforms),
          status: d.status,
          createdAt: d.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('GET /api/publisher/stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
