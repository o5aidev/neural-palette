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
            totalRights: 0,
            activeRights: 0,
            totalInfringements: 0,
            detectedCount: 0,
            resolvedCount: 0,
            inProgressCount: 0,
            byRightType: {},
            bySeverity: {},
            recentInfringements: []
          }
        })
      }
      targetArtistId = artist.id
    }

    // Get rights stats
    const totalRights = await prisma.right.count({
      where: { artistId: targetArtistId }
    })

    const activeRights = await prisma.right.count({
      where: { artistId: targetArtistId, status: 'active' }
    })

    // Get infringement stats
    const totalInfringements = await prisma.infringement.count({
      where: { artistId: targetArtistId }
    })

    const detectedCount = await prisma.infringement.count({
      where: { artistId: targetArtistId, status: 'detected' }
    })

    const resolvedCount = await prisma.infringement.count({
      where: { artistId: targetArtistId, status: 'resolved' }
    })

    const inProgressCount = await prisma.infringement.count({
      where: { artistId: targetArtistId, status: 'in_progress' }
    })

    // Get right type distribution
    const rightTypes = await prisma.right.groupBy({
      by: ['type'],
      where: { artistId: targetArtistId },
      _count: true
    })

    const byRightType: Record<string, number> = {}
    rightTypes.forEach(rt => {
      byRightType[rt.type] = rt._count
    })

    // Get severity distribution
    const severityGroups = await prisma.infringement.groupBy({
      by: ['severity'],
      where: { artistId: targetArtistId },
      _count: true
    })

    const bySeverity: Record<string, number> = {}
    severityGroups.forEach(sg => {
      bySeverity[sg.severity] = sg._count
    })

    // Get recent infringements
    const recentInfringements = await prisma.infringement.findMany({
      where: { artistId: targetArtistId },
      orderBy: { detectedAt: 'desc' },
      take: 5,
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
        totalRights,
        activeRights,
        totalInfringements,
        detectedCount,
        resolvedCount,
        inProgressCount,
        byRightType,
        bySeverity,
        recentInfringements: recentInfringements.map(i => ({
          id: i.id,
          rightTitle: i.right.title,
          url: i.url,
          platform: i.platform,
          severity: i.severity,
          status: i.status,
          detectedAt: i.detectedAt
        }))
      }
    })
  } catch (error) {
    console.error('GET /api/sentinel/stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
