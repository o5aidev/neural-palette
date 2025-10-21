import { NextRequest, NextResponse } from 'next/server'
import { ArtistIdentity, CreateIdentityInput } from '@/lib/api/types'

// In-memory storage for demo (replace with Prisma in production)
let identityStore: ArtistIdentity | null = null

export async function GET(request: NextRequest) {
  try {
    // Simulate database fetch
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!identityStore) {
      return NextResponse.json(
        { success: false, error: 'Identity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: identityStore
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIdentityInput = await request.json()

    // Validate input
    if (!body.artistName || !body.genre) {
      return NextResponse.json(
        { success: false, error: 'Artist name and genre are required' },
        { status: 400 }
      )
    }

    // Simulate database insert
    await new Promise(resolve => setTimeout(resolve, 800))

    const newIdentity: ArtistIdentity = {
      id: Math.random().toString(36).substring(2, 9),
      artistName: body.artistName,
      genre: body.genre,
      biography: body.biography || '',
      influences: body.influences || [],
      musicalFeatures: body.musicalFeatures || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    identityStore = newIdentity

    return NextResponse.json({
      success: true,
      data: newIdentity
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<ArtistIdentity> = await request.json()

    if (!identityStore) {
      return NextResponse.json(
        { success: false, error: 'Identity not found' },
        { status: 404 }
      )
    }

    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 800))

    identityStore = {
      ...identityStore,
      ...body,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: identityStore
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
