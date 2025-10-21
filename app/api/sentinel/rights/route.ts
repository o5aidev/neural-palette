import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CreateRightRequest {
  type: string
  title: string
  description?: string
  registrationNumber?: string
  registrationDate?: string
  expiryDate?: string
  protectedContent?: string[]
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
        type: r.type,
        title: r.title,
        description: r.description,
        registrationNumber: r.registrationNumber,
        registrationDate: r.registrationDate,
        expiryDate: r.expiryDate,
        status: r.status,
        protectedContent: r.protectedContent ? JSON.parse(r.protectedContent) : [],
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

    if (!body.type || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Type and title are required' },
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
        type: body.type,
        title: body.title,
        description: body.description,
        registrationNumber: body.registrationNumber,
        registrationDate: body.registrationDate ? new Date(body.registrationDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        status: 'active',
        protectedContent: body.protectedContent ? JSON.stringify(body.protectedContent) : '[]'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: right.id,
        artistId: right.artistId,
        type: right.type,
        title: right.title,
        description: right.description,
        registrationNumber: right.registrationNumber,
        registrationDate: right.registrationDate,
        expiryDate: right.expiryDate,
        status: right.status,
        protectedContent: right.protectedContent ? JSON.parse(right.protectedContent) : [],
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
