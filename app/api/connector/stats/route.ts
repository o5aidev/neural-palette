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
            totalConnections: 0,
            activeConnections: 0,
            totalPosts: 0,
            postedCount: 0,
            scheduledCount: 0,
            byPlatform: {},
            totalEngagement: {
              likes: 0,
              comments: 0,
              shares: 0,
              views: 0
            }
          }
        })
      }
      targetArtistId = artist.id
    }

    // Get connection stats
    const totalConnections = await prisma.socialConnection.count({
      where: { artistId: targetArtistId }
    })

    const activeConnections = await prisma.socialConnection.count({
      where: { artistId: targetArtistId, isActive: true }
    })

    // Get post stats
    const totalPosts = await prisma.socialPost.count({
      where: { artistId: targetArtistId }
    })

    const postedCount = await prisma.socialPost.count({
      where: { artistId: targetArtistId, status: 'posted' }
    })

    const scheduledCount = await prisma.socialPost.count({
      where: { artistId: targetArtistId, status: 'scheduled' }
    })

    // Get platform distribution
    const posts = await prisma.socialPost.findMany({
      where: { artistId: targetArtistId },
      select: { platforms: true }
    })

    const byPlatform: Record<string, number> = {}
    posts.forEach(p => {
      const platforms = JSON.parse(p.platforms) as string[]
      platforms.forEach(platform => {
        byPlatform[platform] = (byPlatform[platform] || 0) + 1
      })
    })

    // Calculate total engagement
    const postsWithEngagement = await prisma.socialPost.findMany({
      where: { artistId: targetArtistId, status: 'posted' },
      select: { engagementStats: true }
    })

    const totalEngagement = {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }

    postsWithEngagement.forEach(p => {
      const stats = JSON.parse(p.engagementStats)
      totalEngagement.likes += stats.likes || 0
      totalEngagement.comments += stats.comments || 0
      totalEngagement.shares += stats.shares || 0
      totalEngagement.views += stats.views || 0
    })

    return NextResponse.json({
      success: true,
      data: {
        totalConnections,
        activeConnections,
        totalPosts,
        postedCount,
        scheduledCount,
        byPlatform,
        totalEngagement
      }
    })
  } catch (error) {
    console.error('GET /api/connector/stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
