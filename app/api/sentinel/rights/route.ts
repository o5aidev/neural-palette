import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateRightRequest {
  contentId: string
  type: string
  rightHolder?: string
  licenseType?: string
  registrationNumber?: string
  territories?: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

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
      type?: string
      status?: string
    } = {
      artistId: artist.id
    }

    if (type) where.type = type
    if (status) where.status = status

    const rights = await prisma.right.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: rights.map(r => ({
        id: r.id,
        artistId: r.artistId,
        contentId: r.contentId,
        rightType: r.rightType,
        rightHolder: r.rightHolder,
        licenseType: r.licenseType,
        registrationNumber: r.registrationNumber,
        startDate: r.startDate,
        endDate: r.endDate,
        territories: JSON.parse(r.territories),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      }))
    })
  } catch (error) {
    console.error('GET /api/sentinel/rights error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRightRequest = await request.json()

    if (!body.type || !body.contentId) {
      return NextResponse.json(
        { success: false, error: 'Type and contentId are required' },
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

    // Create right
    const right = await prisma.right.create({
      data: {
        artistId: artist.id,
        contentId: body.contentId,
        rightType: body.type,
        rightHolder: body.rightHolder || artist.name,
        licenseType: body.licenseType || 'exclusive',
        registrationNumber: body.registrationNumber,
        startDate: new Date(),
        territories: JSON.stringify(body.territories || ['JP'])
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: right.id,
        artistId: right.artistId,
        contentId: right.contentId,
        rightType: right.rightType,
        rightHolder: right.rightHolder,
        licenseType: right.licenseType,
        registrationNumber: right.registrationNumber,
        startDate: right.startDate,
        endDate: right.endDate,
        territories: JSON.parse(right.territories),
        createdAt: right.createdAt,
        updatedAt: right.updatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/sentinel/rights error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
