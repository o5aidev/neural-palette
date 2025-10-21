import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distributionId = params.id
    const body = await request.json()

    const distribution = await prisma.distribution.findUnique({
      where: { id: distributionId }
    })

    if (!distribution) {
      return NextResponse.json(
        { success: false, error: 'Distribution not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: {
      status?: string
      scheduledAt?: Date | null
      publishedAt?: Date | null
      platforms?: string
      metadata?: string
      updatedAt: Date
    } = {
      updatedAt: new Date()
    }

    if (body.status) updateData.status = body.status
    if (body.scheduledAt !== undefined) {
      updateData.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null
    }
    if (body.publishedAt !== undefined) {
      updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null
    }
    if (body.platforms) updateData.platforms = JSON.stringify(body.platforms)
    if (body.metadata) updateData.metadata = JSON.stringify(body.metadata)

    const updated = await prisma.distribution.update({
      where: { id: distributionId },
      data: updateData,
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
        id: updated.id,
        artistId: updated.artistId,
        contentId: updated.contentId,
        contentTitle: updated.content.title,
        platforms: JSON.parse(updated.platforms),
        status: updated.status,
        scheduledAt: updated.scheduledAt,
        publishedAt: updated.publishedAt,
        metadata: updated.metadata ? JSON.parse(updated.metadata) : {},
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    })
  } catch (error) {
    console.error('PATCH /api/publisher/distributions/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distributionId = params.id

    await prisma.distribution.delete({
      where: { id: distributionId }
    })

    return NextResponse.json({
      success: true,
      data: { deleted: true }
    })
  } catch (error) {
    console.error('DELETE /api/publisher/distributions/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
