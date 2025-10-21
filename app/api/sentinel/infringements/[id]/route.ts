import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const infringementId = params.id
    const body = await request.json()

    const infringement = await prisma.infringement.findUnique({
      where: { id: infringementId }
    })

    if (!infringement) {
      return NextResponse.json(
        { success: false, error: 'Infringement not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: {
      status?: string
      severity?: string
      description?: string
      resolvedAt?: Date | null
      updatedAt: Date
    } = {
      updatedAt: new Date()
    }

    if (body.status) {
      updateData.status = body.status
      if (body.status === 'resolved' && !infringement.resolvedAt) {
        updateData.resolvedAt = new Date()
      }
    }
    if (body.severity) updateData.severity = body.severity
    if (body.description !== undefined) updateData.description = body.description

    const updated = await prisma.infringement.update({
      where: { id: infringementId },
      data: updateData,
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
        id: updated.id,
        artistId: updated.artistId,
        rightId: updated.rightId,
        rightType: updated.right.rightType,
        contentId: updated.right.contentId,
        detectedUrl: updated.detectedUrl,
        detectedPlatform: updated.detectedPlatform,
        description: updated.description,
        status: updated.status,
        detectedAt: updated.detectedAt,
        resolvedAt: updated.resolvedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    })
  } catch (error) {
    console.error('PATCH /api/sentinel/infringements/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
